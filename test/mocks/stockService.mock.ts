import {StockService} from '../../src/interfaces/stockService.interface';
import {Stock} from '../../src/interfaces/stock.interface';

export default class StockServiceMock implements StockService {
  getCurrentStock(company: string): Promise<Stock | undefined> {
    return undefined;
  }
}
