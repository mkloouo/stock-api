import {Request, Response, Router} from 'express';
import StockService from "../service/stock";

const router = Router();
const stockService = new StockService();

router.get('/prices', async (req: Request, res: Response, next: Function) => {
    try {
        const stock = await stockService.get(req.query);
        res.status(200).json(stock);
    } catch (e) {
        next(e);
    }
});

export default router;
