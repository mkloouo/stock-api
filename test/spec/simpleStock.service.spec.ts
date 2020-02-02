import sinon, {SinonSandbox} from 'sinon';

import SimpleStockService from '../../src/services/simpleStock.service';
import StockApiMock from '../mocks/stockApi.mock';

let
  stockApiMock: StockApi,
  simpleStockService: SimpleStockService,
  sandbox: SinonSandbox;

describe('SimpleStockService', () => {

  beforeAll(() => {
    stockApiMock = new StockApiMock();
    simpleStockService = new SimpleStockService(stockApiMock);

    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getCurrentStock', function() {

    let expectedStock: Stock;

    it('should make one call to get full company name with company parameter',
      async () => {
        const stub = sandbox.stub(stockApiMock, 'getFullCompanyName');

        await simpleStockService.getCurrentStock('WIX');

        expect(() => sinon.assert.calledOnce(stub)).toBeTruthy();
        expect(() => sinon.assert.calledWith(stub, 'WIX')).toBeTruthy();
      });

    it('should make one call to get current stock value with company parameter',
      async () => {
        const stub = sandbox.stub(stockApiMock, 'getCurrentStockValue');

        await simpleStockService.getCurrentStock('WIX');

        expect(() => sinon.assert.calledOnce(stub)).toBeTruthy();
        expect(() => sinon.assert.calledWith(stub, 'WIX')).toBeTruthy();
      });

    it('should return stock for a valid company', async () => {
      expectedStock = {
        value: 5.34,
        name: 'Wix Ltd.',
      };

      sandbox.stub(stockApiMock, 'getCurrentStockValue').
        returns(Promise.resolve(expectedStock.value));
      sandbox.stub(stockApiMock, 'getFullCompanyName').
        returns(Promise.resolve(expectedStock.name));

      const result = await simpleStockService.getCurrentStock('WIX');

      expect(result).toEqual(expectedStock);
    });

    it('should return undefined when value undefined', async () => {
      expectedStock = {
        value: undefined,
        name: 'Wix Ltd.',
      };

      sandbox.stub(stockApiMock, 'getCurrentStockValue').
        returns(Promise.resolve(expectedStock.value));
      sandbox.stub(stockApiMock, 'getFullCompanyName').
        returns(Promise.resolve(expectedStock.name));

      const result = await simpleStockService.getCurrentStock('WIX');

      expect(result).toBeUndefined();
    });

    it('should return undefined when name undefined', async () => {
      expectedStock = {
        value: 5.34,
        name: undefined,
      };

      sandbox.stub(stockApiMock, 'getCurrentStockValue').
        returns(Promise.resolve(expectedStock.value));
      sandbox.stub(stockApiMock, 'getFullCompanyName').
        returns(Promise.resolve(expectedStock.name));

      const result = await simpleStockService.getCurrentStock('WIX');

      expect(result).toBeUndefined();
    });

    it('should return undefined when both params undefined', async () => {
      expectedStock = {
        value: undefined,
        name: undefined,
      };

      sandbox.stub(stockApiMock, 'getCurrentStockValue').
        returns(Promise.resolve(expectedStock.value));
      sandbox.stub(stockApiMock, 'getFullCompanyName').
        returns(Promise.resolve(expectedStock.name));

      const result = await simpleStockService.getCurrentStock('WIX');

      expect(result).toBeUndefined();
    });

    it('should return undefined for a invalid company', async () => {
      const result = await simpleStockService.getCurrentStock('iNvAl1D');

      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined company', async () => {
      const result = await simpleStockService.getCurrentStock(undefined);

      expect(result).toBeUndefined();
    });

  });

});
