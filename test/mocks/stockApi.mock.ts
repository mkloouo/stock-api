import {StockApi} from '../../src/interfaces/stockApi.interface';

export default class StockApiMock implements StockApi {

  getCurrentStockValue(company: string): Promise<number | undefined> {
    return undefined;
  }

  getFullCompanyName(company: string): Promise<string | undefined> {
    return undefined;
  }

}
