import { memoize } from './Memoize'
import { MemoizeOptions } from './types'

/**
 * Class Decorator used to created same instance of class when same parameters are passed.
 * It follows functional design pattern memoize, also Flyweight design pattern,
 * when one instance of Class is created once with exact state.
 * It defines how objects with state can be shared.
 * If class constructor has no parameters, decorated with 'CreateOnce' it becomes singleton.
 * It this class is extended, effect of decorator will be applied on child classes,
 * parent constructor will always be constructor that creates class instance. Even if child
 * constructor accepts different parameters.
 * If child class is decorated, child class will have cache effect.
 * It will cache instances by 'default' 'auto-memoize' strategy.
 * https://github.com/pavel-surinin/auto-memoize#default-implementation
 * Decorator {@link CreateOnceBy} can be configured with other cache hit strategy
 * @param ClassConstructor Class to memoize
 * @since 1.0.12
 */
export function CreateOnce<T extends { new(...args: any[]): {} }>(ClassConstructor: T): T {
    return memoize((...args: any[]) => new ClassConstructor(...args)) as unknown as T & { a: string }
}

/**
 * Class Decorator used to created same instance of class when same parameters are passed.
 * It follows functional design pattern memoize, also Flyweight design pattern,
 * when one instance of Class is created once with exact state.
 * It defines how objects with state can be shared.
 * It will cache instances by strategy from decorator parameter.
 * Decorator {@link CreateOnce} is preconfigured with default cache hit strategy.
 * It this class is extended, effect of decorator will be applied on child classes,
 * parent constructor will always be constructor that creates class instance. Even if child
 * constructor accepts different parameters.
 * If child class is decorated, child class will have cache effect.
 *
 * @param strategy  cache hit strategy, same as passed option to {@link memoize} function
 *                  strategy can be custom function that accepts constructor parameters
 *                  as a parameters and returns string, to be used as a cache key or
 *                  predifined strategies: 'weak', 'deep', 'string', 'default.
 *                  {@link CreateOnce} decorator uses 'default' strategy.
 * @since 1.0.12
 */
export function CreateOnceBy(strategy: MemoizeOptions) {
    return function create<T extends { new(...args: any[]): {} }>(ClassConstructor: T): T {
        return memoize((...args: any[]) => new ClassConstructor(...args), strategy) as unknown as T
    }
}

/**
 * Class method decorator used to create 'memoized' class method. Method that will return
 * same output with same parameters passed. It follows memoize functional design pattern.
 * It will cache by 'default' 'auto-memoize' strategy.
 * https://github.com/pavel-surinin/auto-memoize#default-implementation
 * Decorator {@link CallOnceBy} can be configured with other cache hit strategy
 *
 * @param target        class that contains method
 * @param propertyKey   method key in class
 * @param descriptor    method property descriptor
 * @since 1.0.12
 */
// @ts-ignore
export function CallOnce(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = memoize(descriptor.value)
}

/**
 * Class method decorator used to create 'memoized' class method. Method that will return
 * same output with same parameters passed. It follows memoize functional design pattern.
 * It must be configured with cache hit strategy.
 * Decorator {@link CallOnce} is already preconfgured with 'default' strategy.
 *
 * @param strategy  cache hit strategy, same as passed option to {@link memoize} function
 *                  strategy can be custom function that accepts constructor parameters
 *                  as a parameters and returns string, to be used as a cache key or
 *                  predifined strategies: 'weak', 'deep', 'string', 'default.
 *                  {@link CallOnce} decorator uses 'default' strategy.
 * @since 1.0.12
 */
export function CallOnceBy(strategy: MemoizeOptions) {
    // @ts-ignore
    return function _CallOnceBy(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value = memoize(descriptor.value, strategy)
    }
}
