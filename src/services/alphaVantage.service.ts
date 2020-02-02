import axios from 'axios';
import {StockApi} from '../interfaces/stockApi.interface';

type AlphaVantageConfig = {
  url: string;
  path: string;
  apikey: string;
};

/**
 * Alpha Vantage API services
 */
export default class AlphaVantageService implements StockApi {

  /**
   * Constructs AlphaVantageService instance
   * @param config config
   */
  constructor(private config: AlphaVantageConfig) {
  }

  /**
   * Retrieves current stock value for a company specified in params
   * @param company string
   * @returns to be resolved with current stock value or undefined
   */
  async getCurrentStockValue(company: string):
    Promise<number | undefined> {
    const res = await axios.get(this.config.url + this.config.path, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: company,
        apikey: this.config.apikey,
      },
    });

    const price = res?.data?.['Global Quote']?.['05. price'];
    return price ? Number(price) : price;
  }

  /**
   * Retrieves full company name by the name specified in params
   * @param company string
   * @returns to be resolved with full name or undefined
   */
  async getFullCompanyName(company: string):
    Promise<string | undefined> {
    const res = await axios.get(this.config.url + this.config.path, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: company,
        apikey: this.config.apikey,
      },
    });

    return res?.data?.bestMatches?.[0]?.['2. name'];
  }

}
