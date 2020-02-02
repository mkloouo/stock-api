export default {
    app: {
        hostname: process.env.HOSTNAME || 'localhost',
        port: Number(process.env.PORT) || 3030
    },
    alphaVantage: {
        url: 'https://www.alphavantage.co',
        path: '/query',
        apikey: 'YGFDT2GZI12IJHRV'
    }
};
