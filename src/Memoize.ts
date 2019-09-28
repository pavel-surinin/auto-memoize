import equals from 'fast-deep-equal'
import { ArrayKeyMap } from './ArrayKeyMap'
import { FullWeakMap } from './FullWeakMap'
import {
    CacheMap,
    MemoizeCache,
    MemoizedProperties,
    MemoizeOptions,
    MemoStrategy,
    OriginalName,
    StrategyName
} from './types'

/**
 * Extracts cache from:
 * memoized function,
 * decorated with 'CreateOnce' or 'CreateOnceBy' class,
 * decorated with 'CallOnce' or 'CallOnceBy' class method.
 * {@link memoize} funtion has cache description.
 *
 * @param memoized that contains cache
 * @returns memoize Cache if it is present, if no {@code undefined} is returned
 *
 * @see memoize
 * @see CreateOnce
 * @see CreateOnceBy
 * @see CallOnce
 * @see CallOnceBy
 * @since 1.0.12
 *
 * @example
 * const memo = memoize(fibo)
 * memo(5)
 *
 * getCache(memo).has([5]) // true
 * getCache(memo).clear()
 * getCache(memo).has([5]) // false
 *
 * // cache from  decorated 'CreateOnce' or 'CreateOnceBy' class
 * getCache(ClassDecorated)
 *
 * // cache from  decorated 'CallOnce' or 'CallOnceBy' class
 * const person = new Person('A', 'B')
 * getCache(person.greet)
 */
// tslint:disable-next-line: ban-types
export function getCache<K, V>(memoized: ((...args: any[]) => V) | Object): CacheMap<K, V> | undefined {
    if (Object.getOwnPropertySymbols(memoized).includes(MemoizeCache)) {
        return (memoized as object & MemoizedProperties)[MemoizeCache]
    }
    return undefined
}

/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 Map
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * Cache can be accessed by {@link MemoizeCache} symbol.
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
 *  const cache = memo[MemoizeCache]
 *
 *  const memoD = memoize(calculate, 'deep')
 *  memoD(param)
 *  memoD(param) // cache hit
 *  memoD({a: 'one'}) // cache hit
 *
 *  const memoC = memoize(calculate, p => p.a)
 *  memoC(param)
 *  memoC(param) // cache hit
 *  memoC({a: 'one'}) // cache hit
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 * @see https://www.ecma-international.org/ecma-262/6.0/#sec-object.is
 * @see https://www.npmjs.com/package/fast-deep-equal
 */
export function memoize<F extends Function>(
    this: any,
    func: F,
    options: MemoizeOptions = 'default'
): F & MemoizedProperties {
    const strategy = resolveStrategy<any>(options)
    const memoizedFunction = function memoized(this: Function, ...parameters: any[]): F {
        const key = strategy.unwrap(...parameters)
        if (strategy.cache.has(key)) {
            return strategy.cache.get(key)!
        }
        const result = func.apply(this, parameters)
        strategy.cache.set(key, result)
        return result
    }
    Object.defineProperty(memoizedFunction, OriginalName, {
        configurable: false,
        enumerable: false,
        value: `memoized[ ${func.name} ]`,
        writable: false
    })
    Object.defineProperty(memoizedFunction, MemoizeCache, {
        configurable: false,
        enumerable: false,
        value: strategy.cache,
        writable: false
    })
    return memoizedFunction as unknown as F & MemoizedProperties
}

const strategies: Record<StrategyName, { getCache: () => CacheMap<any, any>, key: Function }> = {
    deep: {
        getCache: () => new ArrayKeyMap(equals),
        key: passThrough
    },
    default: {
        getCache: () => new ArrayKeyMap(),
        key: passThrough
    },
    string: {
        getCache: () => new Map(),
        key: stringify
    },
    weak: {
        getCache: () => new FullWeakMap(),
        key: getFirstParam
    },
}

function resolveStrategy<R>(opts: MemoizeOptions): MemoStrategy<R> {
    if (typeof opts === 'string') {
        const s = strategies[opts]
        return {
            cache: s.getCache(),
            unwrap: s.key
        }
    }
    return {
        cache: new Map(),
        unwrap: checkOutputType(opts)
    }
}

function checkOutputType(func: Function): (...args: unknown[]) => string {
    return (...args: unknown[]) => {
        const key = func(...args)
        const keyType = typeof key
        if (!(keyType === 'string')) {
            throw new Error('Memoize key can only be a string, but got ' + keyType)
        }
        return key
    }
}

function passThrough(...args: unknown[]): unknown {
    return args
}

function getFirstParam(...args: unknown[]): unknown {
    return args[0]
}

function stringify(...args: unknown[]): string {
    function toString(p: unknown) {
        return JSON.stringify(p)
    }
    return args.map(toString).join('-')
}
