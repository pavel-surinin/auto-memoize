import { ArrayKeyMap } from '../src/ArrayKeyMap'
import { memoize } from '../src/Memoize'

function sum(a: number, b: number): number {
    return a + b
}

interface One {
    one: string
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
    it('should compare if references are different with "deep" strategy', () => {
      const calc = jest.fn() as ((param: One) => number)
      const calcMemo = memoize(calc, 'deep')

      const parameter = {one: '1'}
      calcMemo(parameter)
      calcMemo({one: '1'})
      calcMemo(parameter)
      calcMemo({one: '1'})

      expect(calc).toHaveBeenCalledTimes(1)
    })
    it('should compare if references are different with "string" strategy', () => {
        const calc = jest.fn() as ((param: One, n: number, s: string) => number)
        const calcMemo = memoize(calc, 'string')

        const parameter = {one: '1'}
        calcMemo(parameter, 1, '1')
        calcMemo({one: '1'}, 1, '1')

        expect(calc).toHaveBeenCalledTimes(1)
      })
    it('should compare if first param reference is different with "weak" strategy', () => {
        const calc = jest.fn() as ((param: One, n: number, s: string) => number)
        const calcMemo = memoize(calc, 'weak')

        const parameter = {one: '1'}
        calcMemo(parameter, 1, '11')
        calcMemo({one: '1'}, 2, '12')
        calcMemo(parameter, 3, '13')
        calcMemo({one: '1'}, 4, '14')

        expect(calc).toHaveBeenCalledTimes(3)
      })
})
