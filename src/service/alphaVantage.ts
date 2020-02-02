import axios from 'axios';

type AlphaVantageConfig = {
  url: string;
  path: string;
  apikey: string;
};

type CurrentStockValueParams = {
  company: string;
};

type FullCompanyNameParams = CurrentStockValueParams;

/**
 * Alpha Vantage API service
 */
export default class AlphaVantageService {

  /**
   * Constructs AlphaVantageService instance
   * @param config config
   */
  constructor(private config: AlphaVantageConfig) {
  }

  /**
   * Retrieves current stock value for a company specified in params
   * @param params params
   * @returns to be resolved with current stock value or undefined
   */
  async getCurrentStockValue(params: CurrentStockValueParams):
    Promise<number | undefined> {
    const res = await axios.get(this.config.url + this.config.path, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: params.company,
        apikey: this.config.apikey,
      },
    });

    const price = res?.data?.['Global Quote']?.['05. price'];
    return price ? Number(price) : price;
  }

  /**
   * Retrieves full company name by the name specified in params
   * @param params params
   * @returns to be resolved with full name or undefined
   */
  async getFullCompanyName(params: FullCompanyNameParams):
    Promise<string | undefined> {
    const res = await axios.get(this.config.url + this.config.path, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: params.company,
        apikey: this.config.apikey,
      },
    });

    return res?.data?.bestMatches?.[0]?.['2. name'];
  }

}
