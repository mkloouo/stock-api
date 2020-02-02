interface StockApi {
  getCurrentStockValue(company: string): Promise<number | undefined>;

  getFullCompanyName(company: string): Promise<string | undefined>
}
