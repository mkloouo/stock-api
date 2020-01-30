import app from './app';

const hostname = process.env.HOSTNAME || process.argv[2] || 'localhost';
const port = Number(process.env.PORT) || Number(process.argv[3]) || 3030;

app.listen(port, hostname, () => {
    console.log(`express app started listening on ${hostname}:${port}`);
});
