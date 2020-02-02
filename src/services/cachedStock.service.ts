import {StockService} from '../interfaces/stockService.interface';
import {Stock} from '../interfaces/stock.interface';
import {CacheService} from '../interfaces/cacheService.interface';

export default class CachedStockService implements StockService {
  constructor(
    private cacheService: CacheService<string, Stock>, private stockService: StockService) {
  }

  async getCurrentStock(company: string): Promise<Stock | undefined> {
    if (this.cacheService.has(company)) {
      return this.cacheService.get(company);
    }

    const updatedStock = await this.stockService.getCurrentStock(company);
    if (updatedStock) {
      this.cacheService.set(company, updatedStock);
    }

    return updatedStock;
  }

}
