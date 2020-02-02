import {CacheService} from '../../src/interfaces/cacheService.interface';

export default class CacheServiceMock<K, V> implements CacheService<K, V> {
  has(key: K): boolean {
    return true;
  }

  get(key: K): V {
    return undefined;
  }

  set(key: K, value: V): void {
  }
}
