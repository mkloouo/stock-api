export interface CacheService<K, V> {
  has(key: K): boolean;
  get(key: K): V;
  set(key: K, value: V): void;
}
