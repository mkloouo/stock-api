import LRUCache from 'lru-cache';
import * as yup from 'yup';
import axios from 'axios';

type Stock = {
    name: string;
    price: number;
};

type StockGetParams = {
    company: string;
};

type GlobalQuoteResponse = {
    'Global Quote': {
        '05. price': string;
    }
}

type SymbolSearchMatchEntry = {
    '2. name': string
}

type SymbolSearchResponse = {
    bestMatches: Array<SymbolSearchMatchEntry>
}

type StockApiDetails = {
    url: string;
    method: 'GET';
    key: string;
};

export default class StockService {
    private static stockApiDetails: StockApiDetails = {
        url: 'https://www.alphavantage.co/query',
        method: 'GET',
        key: 'YGFDT2GZI12IJHRV'
    };

    private static cacheOptions = {
        max: 500,
        maxAge: 1000 * 60 * 10,
    };

    private cache: LRUCache<string, Stock>;

    constructor() {
        this.cache = new LRUCache<string, Stock>(StockService.cacheOptions);
    }

    async get(params: StockGetParams): Promise<Stock> | never {
        const validator = yup.object().shape({
            company: yup.string().required().matches(/^[A-Z]+$/)
        });

        validator.validateSync(params, {strict: true});

        if (!this.cache.has(params.company)) {
            const globalQuoteRes: GlobalQuoteResponse = (await axios(StockService.stockApiDetails.url, {
                method: StockService.stockApiDetails.method,
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: params.company,
                    apikey: StockService.stockApiDetails.key
                }
            })).data;
            const price = Number(globalQuoteRes['Global Quote']['05. price']);

            const symbolSearchRes: SymbolSearchResponse = (await axios(StockService.stockApiDetails.url, {
                method: StockService.stockApiDetails.method,
                params: {
                    function: 'SYMBOL_SEARCH',
                    keywords: params.company,
                    apikey: StockService.stockApiDetails.key
                }
            })).data;
            const name = symbolSearchRes.bestMatches[0]['2. name'];

            this.cache.set(params.company, {
                price, name
            });
        }

        return this.cache.get(params.company);
    }

}
