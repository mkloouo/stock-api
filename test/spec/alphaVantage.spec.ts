import nock from 'nock';

import AlphaVantageService from '../../src/services/alphaVantage.service';

const
  capitalLettersRx = /^[A-Z]+$/,
  config = {
    url: 'http://com-com.com',
    path: '/path',
    apikey: 'some-key',
  };

let
  alphaVantageService: AlphaVantageService,
  interceptor: nock.Interceptor,
  scope: nock.Scope;

describe('AlphaVantageService', () => {

  beforeAll(() => {
    alphaVantageService = new AlphaVantageService(config);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getCurrentStockValue', () => {

    beforeEach(() => {
      interceptor = nock(config.url).get(config.path).query({
        function: 'GLOBAL_QUOTE',
        symbol: capitalLettersRx,
        apikey: config.apikey,
      });
    });

    it(
      'should request global quote function with specified company and api key',
      async () => {
        scope = interceptor.reply(200, {});

        await alphaVantageService.getCurrentStockValue('WIX');

        expect(scope.isDone()).toBeTruthy();
      });

    it('should return price from reply as number', async () => {
      const testPrice = '100.00';
      scope = interceptor.reply(200, {
        'Global Quote': {
          '05. price': testPrice,
        },
      });

      const result = await alphaVantageService.getCurrentStockValue('WIX');

      expect(result).toEqual(Number(testPrice));
    });

    it('should return undefined when no global quote field in reply',
      async () => {
        scope = interceptor.reply(200, {});

        const result = await alphaVantageService.getCurrentStockValue('WIX');

        expect(result).toBeUndefined();
      });

    it('should return undefined when no price in global quote in reply',
      async () => {
        scope = interceptor.reply(200, {
          'Global Quote': {},
        });

        const result = await alphaVantageService.getCurrentStockValue('WIX');

        expect(result).toBeUndefined();
      });

  });

  describe('getFullCompanyName', () => {

    beforeEach(() => {
      interceptor = nock(config.url).get(config.path).query({
        function: 'SYMBOL_SEARCH',
        keywords: capitalLettersRx,
        apikey: config.apikey,
      });
    });

    it('should request symbol search function ' +
      'with specified company and api key', async () => {
      scope = interceptor.reply(200, {});

      await alphaVantageService.getFullCompanyName('WIX');

      expect(scope.isDone()).toBeTruthy();
    });

    it('should return name from first best match from reply', async () => {
      const testName = 'Wix Ltd';
      scope = interceptor.reply(200, {
        bestMatches: [
          {
            '2. name': testName,
          }],
      });

      const result = await alphaVantageService.getFullCompanyName('WIX');

      expect(result).toEqual(testName);
    });

    it('should return undefined when no best matches field', async () => {
      scope = interceptor.reply(200, {});

      const result = await alphaVantageService.getFullCompanyName('WIX');

      expect(result).toBeUndefined();
    });

    it('should return undefined when best matches does not have first element',
      async () => {
        scope = interceptor.reply(200, {
          bestMatches: [],
        });

        const result = await alphaVantageService.getFullCompanyName('WIX');

        expect(result).toBeUndefined();
      });

    it(
      'should return undefined when best matches\'s first element does not have name field',
      async () => {
        scope = interceptor.reply(200, {
          bestMatches: [{}],
        });

        const result = await alphaVantageService.getFullCompanyName('WIX');

        expect(result).toBeUndefined();
      });

  });

});
