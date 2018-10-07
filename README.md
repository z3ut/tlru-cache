TLRU-Cache
=

Time aware least recently used cache store

## Installation

```
npm i tlru-cache
```

## Usage

```typescript
import { TLRUCache } from 'tlru-cache';

const tlruCache =  new TLRUCache({
  // optional values
  maxStoreSize: 5,
  timeToUseMs: 60 * 1000,
});

const value = tlruCache.get('value', () => 42);
// won't calculate again
const sameValue = tlruCache.get('value', () => 42);
```

## Documentation

### Constructor object properties:

Name | Type | Default value | Description
---|---|---|---
maxStoreSize | number | 1000 | Store capacity
maxAgeMs | number | 60 * 60 * 1000 (1 hour) | Record time to use in milliseconds. Put <= 0 for non-expiring records.

### Methods:

```typescript
get<TKey, TValue>(key: TKey, calculate: (key: TKey) => TValue, maxAgeMs: number = null): TValue
```

#### Arguments:

* **key**: record key

* **calculate**: function to get record. receive key as argument

* **maxAgeMs**: record time to use. if presented, override constructor option
