import express from 'express';
import pricesRoutes from './routes/prices';

const app = express();

app.use(express.json());
app.use('/api/v1', pricesRoutes);

export default app;
