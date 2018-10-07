import { TLRUCache } from '../src/index';
//@ts-ignore
import { advanceBy, advanceTo, clear } from 'jest-date-mock';

let tlruCache: TLRUCache;

describe('TLRUCache', () => {
  beforeEach(() => {
    tlruCache =  new TLRUCache({
      maxStoreSize: 2,
      timeToUseMs: 1000,
    });
  
    advanceTo();
  });
  
  afterEach(() => {
    clear();
  });

  it('should store value', () => {
    const key = 'key';
    const value = 'value';
    const calculate = jest.fn(() => value);
  
    const returnedValue = tlruCache.get(key, calculate);
  
    expect(returnedValue).toBe(value);
    expect(calculate).toBeCalledTimes(1);
  });
  
  it('should call function only once', () => {
    const key = 'key';
    const calculate = jest.fn(() => 42);
  
    const value1 = tlruCache.get(key, calculate);
    const value2 = tlruCache.get(key, calculate);
  
    expect(value1).toBe(value2);
    expect(calculate).toBeCalledTimes(1);
  });
  
  
  it('should refresh data after expire', () => {
    const key = 'key';
    const calculate = jest.fn(() => 42);
  
    const value1 = tlruCache.get(key, calculate);
  
    expect(calculate).toBeCalledTimes(1);
  
    advanceBy(2000);
  
    const value2 = tlruCache.get(key, calculate);
  
    expect(calculate).toBeCalledTimes(2);
    expect(value1).toBe(value2);
  });
  
  
  it('should not store more than maxStoreSize and recalculate cleared value', () => {
    const key1 = 'key1';
    const key2 = 'key2';
    const key3 = 'key3';
  
    const calculate1 = jest.fn(() => 42);
    const calculate2 = jest.fn(() => 'value2');
    const calculate3 = jest.fn(() => 'value3');
  
    const value1 = tlruCache.get(key1, calculate1);
    advanceBy(10);
    const value2 = tlruCache.get(key2, calculate2);
    advanceBy(10);
    const value3 = tlruCache.get(key3, calculate3);
    advanceBy(10);
    const value1Second = tlruCache.get(key1, calculate1);
  
    expect(value1).toBe(value1Second);
    expect(calculate1).toBeCalledTimes(2);
    expect(calculate2).toBeCalledTimes(1);
    expect(calculate3).toBeCalledTimes(1);
  });

});
