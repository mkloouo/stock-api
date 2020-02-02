import sinon, {SinonSandbox, SinonStub} from 'sinon';
import StockServiceMock from '../mocks/stockService.mock';

import CachedStockService from '../../src/services/cachedStock.service';
import {Stock} from '../../src/interfaces/stock.interface';
import CacheServiceMock from '../mocks/cacheService.mock';

let
  cacheServiceMock: CacheServiceMock<string, Stock>,
  stockServiceMock: StockServiceMock,
  cachedStockService: CachedStockService,
  sandbox: SinonSandbox;

describe('CachedStockService', () => {

  beforeAll(() => {
    cacheServiceMock = new CacheServiceMock<string, Stock>();
    stockServiceMock = new StockServiceMock();
    cachedStockService = new CachedStockService(cacheServiceMock,
      stockServiceMock);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getCurrentStock', () => {

    let
      stub: SinonStub,
      expectedStock: Stock;

    beforeEach(() => {
      expectedStock = {value: 5.005, name: 'Wix Ltd.'};
    });

    it('should check if cache service already stored stock entry', async () => {
      stub = sandbox.stub(cacheServiceMock, 'has');

      await cachedStockService.getCurrentStock('WIX');

      sinon.assert.calledOnce(stub);
      sinon.assert.calledWith(stub, 'WIX');
    });

    it('should return previously stored stock entry', async () => {
      sandbox.stub(cacheServiceMock, 'has').withArgs('WIX').returns(true);
      stub = sandbox.stub(cacheServiceMock, 'get').
        withArgs('WIX').
        returns(expectedStock);

      const result = await cachedStockService.getCurrentStock('WIX');

      sinon.assert.calledOnce(stub);
      expect(result).toEqual(expectedStock);
    });

    it('should get new stock when no previously stored present', async () => {
      sandbox.stub(cacheServiceMock, 'has').withArgs('WIX').returns(false);
      stub = sandbox.stub(stockServiceMock, 'getCurrentStock').
        withArgs('WIX').
        returns(Promise.resolve(expectedStock));

      await cachedStockService.getCurrentStock('WIX');

      sinon.assert.calledOnce(stub);
      sinon.assert.calledWith(stub, 'WIX');
    });

    it('should set new stock entry when no previously stored present',
      async () => {
        sandbox.stub(cacheServiceMock, 'has').withArgs('WIX').returns(false);
        sandbox.stub(stockServiceMock, 'getCurrentStock').
          withArgs('WIX').
          returns(Promise.resolve(expectedStock));
        stub = sandbox.stub(cacheServiceMock, 'set');

        await cachedStockService.getCurrentStock('WIX');

        sinon.assert.calledOnce(stub);
        sinon.assert.calledWith(stub, 'WIX', expectedStock);
      });

    it('should return newly stored stock entry', async () => {
      sandbox.stub(cacheServiceMock, 'has').withArgs('WIX').returns(false);
      sandbox.stub(stockServiceMock, 'getCurrentStock').
        withArgs('WIX').
        returns(Promise.resolve(expectedStock));

      const result = await cachedStockService.getCurrentStock('WIX');

      expect(result).toEqual(expectedStock);
    });

    it('should not store undefined stock when no previously stored present',
      async () => {
        sandbox.stub(cacheServiceMock, 'has').withArgs('WIX').returns(false);
        sandbox.stub(stockServiceMock, 'getCurrentStock').
          withArgs('WIX').
          returns(Promise.resolve(undefined));
        stub = sandbox.stub(cacheServiceMock, 'set');

        await cachedStockService.getCurrentStock('WIX');

        sinon.assert.notCalled(stub);
      });

    it('should return undefined when got undefined stock when ' +
      'no previously stored present', async () => {
      sandbox.stub(cacheServiceMock, 'has').withArgs('WIX').returns(false);
      sandbox.stub(stockServiceMock, 'getCurrentStock').
        withArgs('WIX').
        returns(Promise.resolve(undefined));

      const result = await cachedStockService.getCurrentStock('WIX');

      expect(result).toBeUndefined();
    });

  });

});
