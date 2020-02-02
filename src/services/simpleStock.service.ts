import {StockApi} from '../interfaces/stockApi.interface';
import {StockService} from '../interfaces/stockService.interface';
import {Stock} from '../interfaces/stock.interface';

export default class SimpleStockService implements StockService {

  constructor(private stockApi: StockApi) {}

  async getCurrentStock(company: string): Promise<Stock | undefined> {
    const value = await this.stockApi.getCurrentStockValue(company);
    const name = await this.stockApi.getFullCompanyName(company);

    return value && name ? {value, name} : undefined;
  }

}
