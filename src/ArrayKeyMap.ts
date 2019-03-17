import { CacheMap, MemoCache } from './types'

export class ArrayKeyMap<R> implements CacheMap<unknown[], R> {
    private cache: MemoCache<R> = []
    private equals: (p1: unknown, p2: unknown) => boolean
    constructor(eq?: (p1: unknown, p2: unknown) => boolean) {
        this.equals = eq || Object.is
    }
    get(key: unknown[]): R | undefined {
        const entry = this.cache.find((r) => r.key.every((param, i) => this.equals(key[i], param)))
        return (entry != null) ? entry.result : undefined
    }
    has(key: unknown[]): boolean {
        return this.cache.some((r) => r.key.every((param, i) => this.equals(key[i], param)))
    }
    set(key: unknown[], result: R): this {
        this.cache.push({ key, result })
        return this
    }
}
