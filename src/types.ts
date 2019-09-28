export const OriginalName = Symbol('original-name')
export const MemoizeCache = Symbol('memoize-cache')

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
export interface CacheMap<K = any, V = any> {
    get(key: K): V | undefined
    has(key: K): boolean
    set(key: K, result: V): this
    clear(): void
}

export interface MemoStrategy<R> {
    cache: CacheMap<any, R>,
    unwrap: Function
}

export type StrategyName = 'deep' | 'string' | 'weak' | 'default'

export type MemoizeOptions = ((...p: any[]) => string) | StrategyName

export interface MemoizedProperties {
    [OriginalName]: string
    [MemoizeCache]: CacheMap
}
