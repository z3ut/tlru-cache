export interface CacheRecord<TKey, TValue> {
  key: TKey;
  value: TValue;
  lastUsed: Date;
  isExpirable: boolean;
  validUntil: Date;
}
