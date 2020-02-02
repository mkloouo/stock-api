import nock from 'nock';
import request from 'supertest';

import StockApplication from '../../src/app';
import config from '../../src/config';

const stockApplication = new StockApplication(),
    app = stockApplication.expressApp,
    globalQuote = 'Global Quote',
    priceField = '05. price',
    bestMatches = 'bestMatches',
    nameField = '2. name',
    errorMessage = 'Error Message',
    testPrice = '100.00',
    testPriceNumber = Number(testPrice),
    testName = 'testName';

let globalQuoteInterceptor: nock.Interceptor,
    symbolSearchInterceptor: nock.Interceptor,
    globalQuoteScope: nock.Scope,
    symbolSearchScope: nock.Scope;

describe('prices', () => {

    beforeEach(() => {
        globalQuoteInterceptor = nock(config.stockApi.url)
            .log(console.log)
            .get(config.stockApi.path)
            .query({
                function: 'GLOBAL_QUOTE',
                symbol: /^[A-Z]+$/,
                apikey: config.stockApi.key
            });

        symbolSearchInterceptor = nock(config.stockApi.url)
            .log(console.log)
            .get(config.stockApi.path)
            .query({
                function: 'SYMBOL_SEARCH',
                keywords: /^[A-Z]+$/,
                apikey: config.stockApi.key
            });
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should return WIX stock details with GET /prices?company=WIX', async () => {
        globalQuoteScope = globalQuoteInterceptor.reply(200, {
            [globalQuote]: {
                [priceField]: testPrice
            }
        });
        symbolSearchScope = symbolSearchInterceptor.reply(200, {
            [bestMatches]: [{
                [nameField]: testName
            }]
        });

        const res = await request(app)
            .get('/api/v1/prices?company=WIX')
            .set('Content-Type', 'application/json')
            .expect(200);

        expect(res.body).toEqual({
            name: testName,
            price: testPriceNumber
        });

        expect(globalQuoteScope.isDone()).toBeTruthy();
        expect(symbolSearchScope.isDone()).toBeTruthy();
    });

    it('should return 400 status code when invalid company with GET /prices?company=WiX', async () => {
        globalQuoteScope = globalQuoteInterceptor.reply(200, {
            [globalQuote]: {
                [priceField]: testPrice
            }
        });
        symbolSearchScope = symbolSearchInterceptor.reply(200, {
            [bestMatches]: [{
                [nameField]: testName
            }]
        });

        const res = await request(app)
            .get('/api/v1/prices?company=WiX')
            .set('Content-Type', 'application/json')
            .expect(400);

        expect(res.body).toEqual({});

        expect(globalQuoteScope.isDone()).toBeFalsy();
        expect(symbolSearchScope.isDone()).toBeFalsy();
    });

    it('should return 404 when querying not existent company ' +
        'with GET /prices?company=NOTEXISTENT', async () => {
        globalQuoteScope = globalQuoteInterceptor.reply(200, {
            [errorMessage]: errorMessage
        });
        symbolSearchScope = symbolSearchInterceptor.reply(200, {
            [errorMessage]: errorMessage
        });

        const res = await request(app)
            .get('/api/v1/prices?company=NOTEXISTENT')
            .set('Content-Type', 'application/json')
            .expect(404);

        expect(res.body).toEqual({});
    });

    it('should return 404 when company full name not found ' +
        'with GET /prices?company=NOINFO', async () => {
        globalQuoteScope = globalQuoteInterceptor.reply(200, {
            [globalQuote]: {
                [priceField]: testPrice
            }
        });
        symbolSearchScope = symbolSearchInterceptor.reply(200, {
            [errorMessage]: errorMessage
        });


        const res = await request(app)
            .get('/api/v1/prices?company=NOINFO')
            .set('Content-Type', 'application/json')
            .expect(404);

        expect(res.body).toEqual({});

        expect(globalQuoteScope.isDone()).toBeTruthy();
        expect(symbolSearchScope.isDone()).toBeTruthy();
    });

    it('should not perform additional requests when cache is still having company stored ' +
        'with GET /prices?company=CACHEDCOMPANY', async () => {
        globalQuoteScope = globalQuoteInterceptor.reply(200, {
            [globalQuote]: {
                [priceField]: testPrice
            }
        });
        symbolSearchScope = symbolSearchInterceptor.reply(200, {
            [bestMatches]: [{
                [nameField]: testName
            }]
        });

        const res = await request(app)
            .get('/api/v1/prices?company=CACHEDCOMPANY')
            .set('Content-Type', 'application/json')
            .expect(404);

        expect(res.body).toEqual({});

        expect(globalQuoteScope.isDone()).toBeFalsy();
        expect(symbolSearchScope.isDone()).toBeFalsy();
    });

});
