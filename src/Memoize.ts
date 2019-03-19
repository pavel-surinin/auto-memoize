import equals from 'fast-deep-equal'
import { ArrayKeyMap } from './ArrayKeyMap'
import {
    CacheMap,
    MemoFunctionArg1,
    MemoFunctionArg2,
    MemoFunctionArg3,
    MemoFunctionArg4,
    MemoFunctionArg5,
    MemoFunctionNoArg,
    MemoizedProperties,
    MemoizeOptions,
    MemoStrategy,
    OriginalName,
    StrategyName
} from './types'

/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 kMap
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
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
export function memoize<R>(
    func: MemoFunctionNoArg<R>, resolveKey?: MemoizeOptions<MemoFunctionNoArg<string>>
): MemoFunctionNoArg<R> & MemoizedProperties
/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 kMap
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
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
export function memoize<P1, R>(
    func: MemoFunctionArg1<P1, R>, resolveKey?: MemoizeOptions<MemoFunctionArg1<P1, string>>
): MemoFunctionArg1<P1, R> & MemoizedProperties
/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 kMap
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
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
export function memoize<P1, P2, R>(
    func: MemoFunctionArg2<P1, P2, R>, resolveKey?: MemoizeOptions<MemoFunctionArg2<P1, P2, string>>
): MemoFunctionArg2<P1, P2, R> & MemoizedProperties
/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 kMap
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
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
export function memoize<P1, P2, P3, R>(
    func: MemoFunctionArg3<P1, P2, P3, R>, resolveKey?: MemoizeOptions<MemoFunctionArg3<P1, P2, P3, string>>
): MemoFunctionArg3<P1, P2, P3, R> & MemoizedProperties
/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 kMap
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
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
export function memoize<P1, P2, P3, P4, R>(
    func: MemoFunctionArg4<P1, P2, P3, P4, R>, resolveKey?: MemoizeOptions<MemoFunctionArg4<P1, P2, P3, P4, string>>
): MemoFunctionArg4<P1, P2, P3, P4, R> & MemoizedProperties
/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 kMap
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
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
export function memoize<P1, P2, P3, P4, P5, R>(
    func: MemoFunctionArg5<P1, P2, P3, P4, P5, R>,
    resolveKey?: MemoizeOptions<MemoFunctionArg5<P1, P2, P3, P4, P5, string>>
): MemoFunctionArg5<P1, P2, P3, P4, P5, R> & MemoizedProperties

/**
 * Memoize function accepts function as a paramter and returns function with
 * cache. If same parameters were passed to function, this function will return
 * result from cache.
 *
 * @param {Function} func function to memoize
 * @param {Function | string} options option can be callback to resolve key or
 * predefined strategies for caching name. This parameter is optional.
 * 'default' parameter is default
 *  - (parameters) => string - callback to resolve key, inner cache is ES6 kMap
 *  - 'deep' - compares parameters to be deep equal,
 *  with npm package 'fast-dee-equal'
 *  - 'string' - turns parameters in to string with JSON.stringify, inner cache
 *  is ES6 Map
 *  - 'weak' - uses first paramter, that must be typeof object as a key, inner
 * cache is ES6 WeakMap
 *  - 'default' - compares parameters with Object.is algorithm
 * @returns function returning cached results with same contract as function
 *          in first paramter
 * @example
 *  const memoCalculate = memoize(calculate)
 *  const param = {a: 'one'}
 *  memo(param)
 *  memo(param) // cache hit
 *  memo({a: 'one'}) // no cache hit, because reference is different
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
export function memoize<R>(
    func: (...p: unknown[]) => R,
    options: MemoizeOptions<(...p: unknown[]) => string> = 'default'
): (...p: unknown[]) => R & MemoizedProperties {
    const strategy = resolveStrategy<R>(options)
    const memoizedFunction = function memoized(this: Function, ...parameters: unknown[]): R {
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
    return memoizedFunction as (...p: unknown[]) => R & MemoizedProperties
}

const strategies: Record<StrategyName, {getCache: () => CacheMap<any, any>, key: Function}> = {
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
        getCache: () => new WeakMap(),
        key: getFirstParam
    },
}

function resolveStrategy<R>(opts: MemoizeOptions<(...p: unknown[]) => string>): MemoStrategy<R> {
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
