import request from 'supertest';
import sinon, {SinonSandbox, SinonStub} from 'sinon';
import StockServiceMock from '../mocks/stockService.mock';

import Application from '../../src/app';
import {Stock} from '../../src/interfaces/stock.interface';

let
  stockServiceMock: StockServiceMock,
  application: Application,
  sandbox: SinonSandbox;

describe('PricesApiProvider', () => {

  beforeAll(() => {
    stockServiceMock = new StockServiceMock();
    application = new Application({}, true, stockServiceMock);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('/api/v1/prices', function() {

    let
      stub: SinonStub,
      expectedStock: Stock;

    beforeEach(() => {
      expectedStock = {value: 3.222, name: 'Wix Ltd.'};
    });

    it('should call get current stock to aquire stock for a company',
      async () => {
        stub = sandbox.stub(stockServiceMock, 'getCurrentStock');

        await request(application.express).
          get('/api/v1/prices?company=WIX').
          set('Content-Type', 'application/json');

        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, 'WIX');
      });

    it('should return 200 status and stock when valid company ' +
      'symbol specified in query params', async () => {
      sandbox.stub(stockServiceMock, 'getCurrentStock').
        withArgs('WIX').
        returns(Promise.resolve(expectedStock));

      const result = await request(application.express).
        get('/api/v1/prices?company=WIX').
        set('Content-Type', 'application/json').
        expect(200);

      expect(result.body).toEqual(expectedStock);
    });

    it('should return 404 status and empty body when got ' +
      'undefined as current stock value', async () => {
      sandbox.stub(stockServiceMock, 'getCurrentStock').
        returns(Promise.resolve(undefined));

      const result = await request(application.express).
        get('/api/v1/prices?company=InvalidParam').
        set('Content-Type', 'application/json').
        expect(404);

      expect(result.body).toEqual({});
    });

  });

});
