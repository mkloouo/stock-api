import {Stock} from './stock.interface';

export interface StockService {
  getCurrentStock(company: string): Promise<Stock | undefined>;
}
