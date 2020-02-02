import express, {Express, Request, Response} from 'express';

import {Stock} from './interfaces/stock.interface';
import {StockService} from './interfaces/stockService.interface';
import {ApiProvider} from './interfaces/apiProvider.interface';

import AlphaVantageService, {AlphaVantageConfig} from './services/alphaVantage.service';
import SimpleStockService from './services/simpleStock.service';
import LRUCache from 'lru-cache';
import CachedStockService from './services/cachedStock.service';
import PricesApiProvider from './providers/pricesApi.provider';

type ApplicationConfig = {
  alphaVantage?: AlphaVantageConfig,
  app?: {
    hostname: string;
    port: number;
  }
};

export default class Application {
  private app: Express;
  private stockService: StockService;
  private pricesApiProvider: ApiProvider;

  constructor(
    config: ApplicationConfig, test = false,
    testStockService: StockService = undefined) {
    this.app = express();

    if (!test) {
      const stockApi = new AlphaVantageService(config.alphaVantage);
      const stockService = new SimpleStockService(stockApi);

      this.stockService = new CachedStockService(
        new LRUCache<string, Stock>(),
        stockService);
    } else {
      this.stockService = testStockService;
    }

    this.pricesApiProvider = new PricesApiProvider(this.stockService);

    this.app.use(express.json());
    this.app.use('/api/v1', this.pricesApiProvider.getRouter());
  }

  get express() {
    return this.app;
  }

}
