import { ArrayKeyMap } from '../src/ArrayKeyMap'
import { getCache, memoize } from '../src/Memoize'
import { MemoizeCache, OriginalName } from '../src/types'

function sum(a: number, b: number): number {
    return a + b
}

interface One {
    one: string
}

class Prefixer {
    constructor(private prefix: string) {
    }
    fix(text: string): string {
        return this.prefix + ' ' + text
    }
}

function prefix(pre: string): (text: string) => string {
    return function _prefix(text: string): string {
        return pre + ' ' + text
    }
}

function optParam(a?: number): number | undefined {
    return a
}

describe('Memoize', () => {
    describe('ArrayKeyMap', () => {
        it('should set', () => {
            const cache = new ArrayKeyMap()
            expect(() => cache.set([1], 1)).not.toThrowError()
        })
        it('should has', () => {
            const cache = new ArrayKeyMap()
            const params = [1]
            cache.set(params, 1)
            expect(cache.has(params)).toBeTruthy()

        })
        it('should get', () => {
            const cache = new ArrayKeyMap()
            const params = [1]
            cache.set(params, 1)
            expect(cache.get(params)).toBe(1)
        })
        it('should get', () => {
            const cache = new ArrayKeyMap()
            const params = [1]
            cache.set(params, 1)
            expect(cache.get([2])).toBeUndefined()
        })
    })
    describe('Custom key resolver', () => {
        it('should check typings of resolve callback', () => {
            const mock = jest.fn() as typeof func
            const func = (s: string, n: number) => {
                mock(s, n)
                return ({
                    s
                })
            }
            const memoSum = memoize(func, (p1) => p1)
            memoSum('s', 1)
            memoSum('s', 1)
            expect(mock).toHaveBeenCalledWith('s', 1)
            expect(mock).toHaveBeenCalledTimes(1)
        })
        it('should throw an error if key resolves not to string', () => {
            const fn = jest.fn()
            const memo = memoize(fn, (param: One) => param.one)
            memo({ one: 'one' })
            memo({ one: 'one' })
            expect(() => memo({ one: 1 } as any)).toThrowError('Memoize key can only be a string, but got number')
        })
        it('should resolve cache key', () => {
            const fn = jest.fn()
            const memo = memoize(fn, (param: One) => param.one)
            memo({ one: 'one' })
            memo({ one: 'one' })
            memo({ one: '1' })
            expect(fn).toHaveBeenCalledTimes(2)
        })
    })
    describe('Basic cases', () => {
        it('should use weak map cache', () => {
            const param = { one: 'one' }
            const fn = jest.fn() as ((param: One) => number)
            const memo = memoize(fn, 'weak')
            memo(param)
            memo(param)
            memo(param)
            expect(fn).toHaveBeenCalledTimes(1)
            expect(fn).toHaveBeenCalledWith(param)
        })
        it('should use weak map cache with real function', () => {
            let count = 0
            const param = { one: '1' }
            const fn = (one: One) => count += Number(one.one)
            const memo = memoize(fn, 'weak')
            memo(param)
            memo(param)
            memo(param)
            expect(count).toBe(1)
        })
        it('should use array like map cache with second param undefined', () => {
            const param = { one: 'one' }
            const fn = jest.fn() as (p1: any, p2?: any) => any
            const memo = memoize(fn)
            // @ts-ignore
            memo(param, undefined)
            memo('param')
            memo(param)
            memo(param)
            memo(param)
            memo('param')
            expect(fn).toHaveBeenCalledTimes(2)
        })
        it('should use cache for number parameter', () => {
            const param = 1
            const fn = jest.fn() as (p: any) => any
            const memo = memoize(fn)
            memo(param)
            memo(param)
            memo(1)
            memo('1')
            expect(fn).toHaveBeenCalledTimes(2)
        })
        it('should use weak map cache twice', () => {
            const fn = jest.fn() as (p: One) => any
            const memo = memoize(fn)
            memo({ one: 'one' })
            memo({ one: 'one' })
            expect(fn).toHaveBeenCalledTimes(2)
        })
        it('should register each function own cache', () => {
            const mock1 = jest.fn() as (p: number, s: string, o: One[]) => any
            const mock2 = jest.fn() as (p: number, s: string, o: One[]) => any
            const memoMock1 = memoize(mock1)
            const memoMock2 = memoize(mock2)
            const param = [{ one: 'one' }]
            memoMock1(1, 'one', param)
            memoMock1(1, 'one', param)
            memoMock2(1, 'one', param)
            memoMock2(1, 'one', param)
            expect(mock1).toHaveBeenCalledTimes(1)
            expect(mock2).toHaveBeenCalledTimes(1)
        })
        it('should execute function', () => {
            const memoSum = memoize(sum)
            expect(memoSum[OriginalName]).toBe('memoized[ sum ]')
            expect(memoSum(1, 1)).toBe(2)
            expect(memoSum(1, 2)).toBe(3)
        })
        it('should memoize function with primitive params', () => {
            const mock = jest.fn() as (p: number, r: number) => any
            const memoMock = memoize(mock)
            memoMock(1, 1)
            memoMock(1, 1)
            memoMock(1, 2)
            expect(mock).toHaveBeenCalledTimes(2)
        })
        it('should memoize function with params as objects resolved by reference different references', () => {
            const mock = jest.fn() as (p: any) => any
            const memoMock = memoize(mock)
            memoMock({ a: 1 })
            memoMock({ a: 1 })
            expect(mock).toHaveBeenCalledTimes(2)
        })
        it('should memoize function with params as objects resolved by reference same ref', () => {
            const mock = jest.fn() as (p: any) => any
            const memoMock = memoize(mock)
            const param = { a: 1 }
            memoMock(param)
            memoMock(param)
            expect(mock).toHaveBeenCalledTimes(1)
        })
        it('should memoize function with no params', () => {
            const mock = jest.fn()
            const memoMock = memoize(mock)
            memoMock()
            memoMock()
            expect(mock).toHaveBeenCalledTimes(1)
        })
    })
    describe('Predifined strategies', () => {
        it('should compare if references are different with "deep" strategy', () => {
            const calc = jest.fn() as ((param: One) => number)
            const calcMemo = memoize(calc, 'deep')

            const parameter = { one: '1' }
            calcMemo(parameter)
            calcMemo({ one: '1' })
            calcMemo(parameter)
            calcMemo({ one: '1' })

            expect(calc).toHaveBeenCalledTimes(1)
        })
        it('should compare if references are different with "string" strategy', () => {
            const calc = jest.fn() as ((param: One, n: number, s: string) => number)
            const calcMemo = memoize(calc, 'string')

            const parameter = { one: '1' }
            calcMemo(parameter, 1, '1')
            calcMemo({ one: '1' }, 1, '1')

            expect(calc).toHaveBeenCalledTimes(1)
        })
        it('should compare if first param reference is different with "weak" strategy', () => {
            const calc = jest.fn() as ((param: One, n: number, s: string) => number)
            const calcMemo = memoize(calc, 'weak')

            const parameter = { one: '1' }
            calcMemo(parameter, 1, '11')
            calcMemo({ one: '1' }, 2, '12')
            calcMemo(parameter, 3, '13')
            calcMemo({ one: '1' }, 4, '14')

            expect(calc).toHaveBeenCalledTimes(3)
        })
    })
    describe('JS Scope use cases', () => {
        it('should not loose scope of class', () => {
            const prefixer = new Prefixer('Mr.')
            const memo = memoize(prefixer.fix).bind(prefixer)
            expect(memo('Pavel')).toBe('Mr. Pavel')
        })
        it('should not loose scope of closure function', () => {
            const prefixer = prefix('Mr.')
            const memo = memoize(prefixer)
            expect(memo('Pavel')).toBe('Mr. Pavel')
        })
        it('should not loose scope of function', () => {
            const memo = memoize(sum)
            expect(memo(1, 1)).toBe(2)
        })
    })
    describe('usage with no parameters', () => {
        it('should cache with "default" strategy', () => {
            const a = memoize(optParam)
            expect(a()).toBe(a())
            expect(a(1)).toBe(a(1))
        })
        it('should cache with "deep" strategy', () => {
            const a = memoize(optParam, 'deep')
            expect(a()).toBe(a())
            expect(a(1)).toBe(a(1))
        })
        it('should cache with "string" strategy', () => {
            const a = memoize(optParam, 'string')
            expect(a()).toBe(a())
            expect(a(1)).toBe(a(1))
        })
        it('should throw on caching with "custom" strategy on undefined', () => {
            const a = memoize(optParam, (x) => x)
            expect(() => a()).toThrow()
        })
        it('should throw on caching with "weak" strategy on undefined', () => {
            const a = memoize(optParam, 'weak')
            expect(() => a()).toThrow()
        })
    })
    describe('cache', () => {
        it('should return undefined for function with no cache', () => {
            expect(getCache(sum)).toBeUndefined()
        })
        it('should get cache from function by symbol', () => {
            const memo = memoize(sum)
            const cache = memo[MemoizeCache]
            expect(cache).toBeDefined()
        })
        it('should get string cache with get/set/has functions', () => {
            const memo = memoize(sum, 'string')
            memo(1, 1)
            const cache = memo[MemoizeCache]
            cache.set('1-2', 3)
            expect(cache.get('1-1')).toBe(2)
            expect(cache.has('1-1')).toBe(true)
            expect(cache.get('1-2')).toBe(3)
            expect(cache.has('1-2')).toBe(true)
            expect(() => cache.clear()).not.toThrow()
            expect(cache.has('1-2')).toBeFalsy()
        })
        it('should get custom key cache with get/set/has functions', () => {
            const memo = memoize(sum, (p1, p2) => `${p1}${p2}`)
            memo(1, 1)
            const cache = memo[MemoizeCache]
            cache.set('12', 3)
            expect(cache.has('11')).toBe(true)
            expect(cache.get('11')).toBe(2)
            expect(cache.has('12')).toBe(true)
            expect(cache.get('12')).toBe(3)
            expect(() => cache.clear()).not.toThrow()
            expect(cache.has('12')).toBeFalsy()
        })
        it('should get default cache with get/set/has functions', () => {
            const memo = memoize(sum)
            memo(1, 1)
            const cache = memo[MemoizeCache]
            cache.set([1, 2], 3)
            expect(cache.has([1, 1])).toBe(true)
            expect(cache.get([1, 1])).toBe(2)
            expect(cache.has([1, 2])).toBe(true)
            expect(cache.get([1, 2])).toBe(3)
            expect(() => cache.clear()).not.toThrow()
            expect(cache.has([1, 2])).toBeFalsy()
        })
        it('should get weak map cache with get/set/has functions', () => {
            function greet({ first, last }: { first: string, last: string }) {
                return `Hello, ${first} ${last}`
            }
            const memo = memoize(greet, 'weak')
            const initials = { first: 'P', last: 'S' }
            const initials2 = { first: 'G', last: 'S' }
            memo(initials)
            const cache = memo[MemoizeCache]
            cache.set(initials2, 'Hello, G S')
            expect(cache.has(initials)).toBe(true)
            expect(cache.get(initials)).toBe('Hello, P S')
            expect(cache.has(initials2)).toBe(true)
            expect(cache.get(initials2)).toBe('Hello, G S')
            expect(() => cache.clear()).not.toThrow()
            expect(cache.has(initials2)).toBeFalsy()
        })
        it('should get deep cache with get/set/has functions', () => {
            function greet({ first, last }: { first: string, last: string }) {
                return `Hello, ${first} ${last}`
            }
            const memo = memoize(greet, 'deep')
            memo({ first: 'P', last: 'S' })
            const cache = memo[MemoizeCache]
            cache.set([{ first: 'G', last: 'S' }], 'Hello, G S')
            expect(cache.has([{ first: 'P', last: 'S' }])).toBe(true)
            expect(cache.get([{ first: 'P', last: 'S' }])).toBe('Hello, P S')
            expect(cache.has([{ first: 'G', last: 'S' }])).toBe(true)
            expect(cache.get([{ first: 'G', last: 'S' }])).toBe('Hello, G S')
            expect(() => cache.clear()).not.toThrow()
            expect(cache.has([{ first: 'G', last: 'S' }])).toBeFalsy()
        })
        it('should get cache with with getCache util function', () => {
            function greet({ first, last }: { first: string, last: string }) {
                return `Hello, ${first} ${last}`
            }
            const memo = memoize(greet, 'deep')
            memo({ first: 'P', last: 'S' })
            const cache = getCache(memo)!
            cache.set([{ first: 'G', last: 'S' }], 'Hello, G S')
            expect(cache.has([{ first: 'P', last: 'S' }])).toBe(true)
            expect(cache.get([{ first: 'P', last: 'S' }])).toBe('Hello, P S')
            expect(cache.has([{ first: 'G', last: 'S' }])).toBe(true)
            expect(cache.get([{ first: 'G', last: 'S' }])).toBe('Hello, G S')
            expect(() => cache.clear()).not.toThrow()
            expect(cache.has([{ first: 'G', last: 'S' }])).toBeFalsy()
        })
    })
})
