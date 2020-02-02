import {Request, Response, Router} from 'express';
import {ApiProvider} from '../interfaces/apiProvider.interface';
import {StockService} from '../interfaces/stockService.interface';

export default class PricesApiProvider implements ApiProvider {

  constructor(private stockService: StockService) {
  }

  getRouter() {
    const router = Router();
    router.get('/prices',
      async (req: Request, res: Response, next: Function) => {
        const company = req.query.company;

        if (!company || !company.match(/^[A-Z]+$/)) {
          return res.sendStatus(404);
        }

        const stock = await this.stockService.getCurrentStock(company);
        res.status(stock ? 200 : 404).json(stock);
      });

    return router;
  }

}
