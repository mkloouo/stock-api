import LRUCache from 'lru-cache';
import * as yup from 'yup';
import axios from 'axios';

import config from '../config';
import {NotFoundError, ValidationError} from '../typings/errors';
import {GlobalQuoteResponse, Stock, StockGetParams, SymbolSearchResponse} from 'typings/stock';
import {Cache} from "typings/cache";

interface B {
    aquireStock(company: string): Promise<Stock>;
}

class ConcreteB implements B {

    async aquireStock(company: string): Promise<Stock> {
        return {name: '123', value: 123};
    }
}

class CacheConcreteB implements B {
    constructor(props) {
        super(props);

    }


}

export default class StockService {
    private static cacheOptions = {
        max: 500,
        maxAge: 1000 * 60 * 10,
    };

    private cache: Cache<string, Stock>;

    constructor(cache?: Cache<string, Stock>) {
        if (cache) {
            this.cache = cache;
        } else {
            this.cache = new LRUCache<string, Stock>(StockService.cacheOptions);
        }
    }

    async get(params: StockGetParams): Promise<Stock> | never {
        const validator = yup.object().shape({
            company: yup.string().required().matches(/^[A-Z]+$/)
        });

        try {
            validator.validateSync(params, {strict: true});
        } catch (e) {
            throw new ValidationError(e.message);
        }

        if (!this.cache.has(params.company)) {
            const stockUrl = config.stockApi.url + config.stockApi.path;
            const priceValidator = yup.object().shape({
                'Global Quote': yup.object().shape({
                    '05. price': yup.string().required().matches(/^[0-9]*\.[0-9]+$/)
                }).required()
            });
            const nameValidator = yup.object().shape({
                bestMatches: yup.array().of(yup.object().shape({
                    '2. name': yup.string().required()
                })).required()
            });

            try {
                const price = await this._getPrice(stockUrl, params.company, priceValidator);
                const name = await this._getName(stockUrl, params.company, nameValidator);
                this.cache.set(params.company, {
                    price, name
                });
            } catch (e) {
                throw new NotFoundError(`${params.company} not found`);
            }
        }

        return this.cache.get(params.company);
    }

    async _getPrice(stockUrl: string, company: string, validator: yup.ObjectSchema): Promise<number> | never {
        const globalQuoteRes: GlobalQuoteResponse = (await axios.get(stockUrl, {
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: company,
                apikey: config.stockApi.key
            }
        })).data;

        validator.validateSync(globalQuoteRes, {strict: true});

        return Number(globalQuoteRes['Global Quote']['05. price']);
    }

    async _getName(stockUrl: string, company: string, validator: yup.ObjectSchema): Promise<string> | never {
        const symbolSearchRes: SymbolSearchResponse = (await axios.get(stockUrl, {
            params: {
                function: 'SYMBOL_SEARCH',
                keywords: company,
                apikey: config.stockApi.key
            }
        })).data;

        validator.validateSync(symbolSearchRes, {strict: true});

        return symbolSearchRes.bestMatches[0]['2. name'];
    }

}
