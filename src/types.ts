export type MemoFunctionArg5<P1, P2, P3, P4, P5, R> = (p1: P1, p2: P2, p3: P3, p4: P4, p5: P5) => R
export type MemoFunctionArg4<P1, P2, P3, P4, R> = (p1: P1, p2: P2, p3: P3, p4: P4) => R
export type MemoFunctionArg3<P1, P2, P3, R> = (p1: P1, p2: P2, p3: P3) => R
export type MemoFunctionArg2<P1, P2, R> = (p1: P1, p2: P2) => R
export type MemoFunctionArg1<P1, R> = (p1: P1) => R
export type MemoFunctionNoArg<R> = () => R

export interface CacheRecord<R> {
    key: unknown[],
    result: R
}

export type MemoCache<R> = CacheRecord<R>[]

/**
 * Inner cache that is used in Memoize function.
 * This interface structure satisfies WeakMap class also, that is used for
 * caching functions with one parameter as object.
 */
export interface CacheMap<K, V> {
    get(key: K): V | undefined
    has(key: K): boolean
    set(key: K, result: V): this
}

export interface MemoStrategy<R> {
    cache: CacheMap<any, R>,
    unwrap: Function
}
