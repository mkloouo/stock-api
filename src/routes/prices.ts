import {Request, Response, Router} from 'express';
import StockService from "../service/stock";

/**
 * Prices routers entity
 */
export default class PricesRouter {

    /**
     * Creates prices API router and returns it.
     * @param {StockService} stockService stock service
     * @returns {Router} prices API router
     */
    static pricesApi(stockService: StockService): Router {
        const router = Router();

        router.get('/prices', async (req: Request, res: Response, next: Function) => {
            try {
                const stock = await stockService.get(req.query);
                res.status(200).json(stock);
            } catch (e) {
                next(e);
            }
        });

        return router;
    }
}
