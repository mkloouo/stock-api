import express, {Express, Request, Response} from 'express';

import config from './config';
import PricesRouter from './routes/prices';
import StockService from "./service/stock";

/**
 * Stock Application entity
 */
export default class StockApplication {
    public readonly hostname: string;
    public readonly port: number;

    private readonly app: Express;
    private readonly stockService: StockService;

    /**
     * Constructs Application instance
     */
    constructor() {
        this.hostname = config.app.hostname;
        this.port = config.app.port;

        this.app = express();
        this.stockService = new StockService();

        this.app.use(express.json());
        this.app.use('/api/v1', PricesRouter.pricesApi(this.stockService));
        this.app.use((err: Error & { status: number }, req: Request, res: Response, next: Function) => {
            console.error(err.stack);
            res.status(err.status || 500).send(err.message);
        });
    }

    /**
     * Returns express app
     * @returns {Express} app
     */
    get expressApp(): Express {
        return this.app;
    }

    /**
     * Starts express application
     * @param {(string, number) => void} handler express start handler
     */
    start(handler: (hostname: string, port: number) => void): void {
        this.app.listen(this.port, this.hostname, handler.bind(null, this.hostname, this.port));
    }
}
