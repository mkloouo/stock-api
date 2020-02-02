import express, {Request, Response} from 'express';

const app = express();

app.use(express.json());
app.use((err: Error & { status: number }, req: Request, res: Response,
         next: Function) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message);
});

export default app;
