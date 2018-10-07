import { TLRUCacheSettings } from './tlru-cache-settings';
import { CacheRecord } from './cache-record';

export class TLRUCache {
  data: Array<CacheRecord<any, any>>;
  maxStoreSize: number;
  timeToUseMs: number;

  constructor({
    maxStoreSize = 1000,
    timeToUseMs = 60 * 60 * 1000,
  }: TLRUCacheSettings = {}) {
    this.data = [];
    this.maxStoreSize = maxStoreSize;
    this.timeToUseMs = timeToUseMs;
  }

  get<TKey, TValue>(key: TKey, calculate: (key: TKey) => TValue, timeToUseMs: number = null): TValue {
    const elementInData = this.data.find(d => d.key === key);

    if (!elementInData) {
      const cacheItem = this.addCacheRecord(key, calculate(key), timeToUseMs);
      return cacheItem.value;
    }

    const isValueExpired = elementInData.isExpirable &&
      elementInData.validUntil.getTime() < Date.now();

    if (isValueExpired) {
      elementInData.value = calculate(key);
    }

    elementInData.lastUsed = new Date();
    return elementInData.value;
  }

  private addCacheRecord<TKey, TValue>(key: TKey, value: TValue,
      timeToUse: number = null): CacheRecord<TKey, TValue> {
    const recordTimeToUse = timeToUse || this.timeToUseMs;

    const isExpirable = recordTimeToUse != null && recordTimeToUse > 0;

    const validUntil = isExpirable ?
      new Date(Date.now() + recordTimeToUse) :
      null;

    const cacheRecord = {
      key,
      value,
      lastUsed: new Date(),
      isExpirable,
      validUntil,
    };

    this.data.push(cacheRecord);

    this.truncateDataArray();

    return cacheRecord;
  }

  private truncateDataArray() {
    if (this.data.length > this.maxStoreSize) {
      const currentDate = new Date();
      this.data = this.data
        .filter(d => !d.isExpirable || d.validUntil < currentDate)
        .sort((d1, d2) => d2.lastUsed.getTime() - d1.lastUsed.getTime())
        .slice(0, this.maxStoreSize);
    }
  }
}
