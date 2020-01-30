// @ts-ignore
import * as LRUCache from "lru-cache";
import * as yup from 'yup';

type Stock = {
    name: string;
    price: number;
};

type StockGetParams = {
    company: string;
};

const API_KEY = 'YGFDT2GZI12IJHRV';

export default class StockService {
    private static cacheOptions = {
        max: 500,
        length: (n, key) => n * 2 + key.length,
        dispose: (key, n) => n.close(),
        maxAge: 1000 * 60 * 60
    };
    private cache: LRUCache<string, number>;
    constructor() {
        this.cache = new LRUCache(StockService.cacheOptions);
    }

    get(params: StockGetParams): Promise<Stock> {
        yup.object().shape({
            company: yup.string().required().matches(/^[A-Z]+$/)
        });
    }

}
