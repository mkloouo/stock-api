interface StockService {
  getCurrentStock(company: string): Promise<Stock | undefined>;
}
