import { CacheMap } from './types'

export class FullWeakMap<K extends object, V> implements CacheMap<K, V> {
    private map: WeakMap<K, V>
    constructor() {
        this.map = new WeakMap()
    }

    get(key: K): V | undefined {
        return this.map.get(key)
    }
    has(key: K): boolean {
        return this.map.has(key)
    }
    set(key: K, result: V): this {
        this.map.set(key, result)
        return this
    }
    clear(this: FullWeakMap<K, V>): void {
        this.map = new WeakMap()
    }
}
