Fast javascript memoize function, with optimized memoize strategies provided. `Class` and methods memoize decorators.

[![Build Status](https://travis-ci.com/pavel-surinin/auto-memoize.svg?branch=master)](https://travis-ci.com/pavel-surinin/auto-memoize)
[![Coverage Status](https://coveralls.io/repos/github/pavel-surinin/auto-memoize/badge.svg?branch=master)](https://coveralls.io/github/pavel-surinin/auto-memoize?branch=master)
[![npm version](https://badge.fury.io/js/auto-memoize.svg)](https://badge.fury.io/js/auto-memoize)

```bash
npm i -S auto-memoize
```

```javascript
import { memoize, CreateOnce } from 'auto-memoize'
import { fibo } from './fibonaci'

// memoize function
let memoizeFibonaci = memoize(fibo)
memoizeFibonaci(5)
memoizeFibonaci(5) //cache hit

// Create one instance with same parameters
@CreateOnce
class Person {
  firstName
  lastName
  constructor(firstName, lastName) {
    console.log(`Creating ${firstName} ${lastName}`)
    this.firstName = firstName,
    this.lastName = lastName
  }
  // call method once with same parameters
  @CallOnce
  getGreeting(greet: string) {
    console.log(greet)
    const name = `${this.firstName} ${this.lastName}`
    return { name, greeting }
  }
}
const person1 = new Person('Boris', 'Johnson') 
// logged 'Creating Boris Johnson'
const person2 = new Person('Boris', 'Johnson')
person1 == person2 // true

const g1 = person1.getGreeting('hi') // logged 'hi'
const g2 = person1.getGreeting('hi')
g1 == g2 // true
```

- [memoize](#memoize)
  - [Default implementation](#default-implementation)
  - [WeakMap implementation](#weakmap-implementation)
  - [Deep comparison implementation](#deep-comparison-implementation)
  - [String key implementation](#string-key-implementation)
  - [Custom key implementation](#custom-key-implementation)
  - [Benchmarking strategies](#benchmarking-strategies)
    - [Small object parameter](#small-object-parameter)
    - [Object parameter](#object-parameter)
    - [Different reference object parameter](#different-reference-object-parameter)
    - [Primitive parameters](#primitive-parameters)
- [getCache](#getcache)
  - [CacheMap](#cachemap)
  - [Examples](#examples)
- [Decorators](#decorators)
  - [Docs](#docs)
    - [@CreateOnce](#createonce)
    - [@CreateOnceBy](#createonceby)
    - [@CallOnce](#callonce)
    - [@CallOnceBy](#callonceby)
  - [Examples](#examples-1)
    - [Caching with default strategy](#caching-with-default-strategy)
    - [Caching with provided strategy](#caching-with-provided-strategy)
    - [Class Singleton](#class-singleton)

# memoize

## Default implementation

Caches by all parameters as a key, comparing them with `Object.is` [algorithm](https://www.ecma-international.org/ecma-262/6.0/#sec-object.is)
```javascript
const calc = require('expensive-calculation')
const { memoize } = require('auto-memoize')

const memoCalc = memoize(calc)

const param = {a: 'one'}
memoCalc(param, 1)
memoCalc(param, 2)
memoCalc(param, 1) // cache hit
memoCalc({a: 'one'}, 1) // no cache hit, because reference is different
```

## WeakMap implementation
Caches by first parameter as a key and using ES6 [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) as a cache. Garbage collector automatically removes entries from cache, when no references for keys are present.
```javascript
const calc = require('expensive-calculation')
const { memoize } = require('auto-memoize')

const memoCalc = memoize(calc, 'weak')

const param = {a: 'one'}
memoCalc(param, 1)
memoCalc(param, 2) // cache hit
memoCalc({a: 'one'}, 1) // no cache hit, because reference is different
```

## Deep comparison implementation
Caches by all parameters as a key and compares them by content, if references are different.
[fast-deep-equal](https://www.npmjs.com/package/fast-deep-equal)
npm package does the comparison.
It is performing better on big objects, than `JSON.stringify`.
```javascript
const calc = require('expensive-calculation')
const { memoize } = require('auto-memoize')

const memoCalc = memoize(calc, 'deep')

const param = {a: 'one'}
memoCalc(param)
memoCalc(param) // cache hit
memoCalc({a: 'one'}) // cache hit
```

## String key implementation

Caches all parameters as a string key. For cache is used 
ES6 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
 is used to turn every parameter to string. It is useful for function with several parameters, but not big objects, that takes time to turn into `string`.

```javascript
const calc = require('expensive-calculation')
const { memoize } = require('auto-memoize')

const memoCalc = memoize(calc, 'string')

const param = {a: 'one'}
memoCalc(param, 1)
memoCalc(param, 1) // cache hit
memoCalc({a: 'one'}, 2) 
memoCalc({a: 'one'}, 1) // cache hit
```

## Custom key implementation
Caches by key from function, that returns `string`. For cache is used ES6 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

```javascript
const calc = require('expensive-calculation')
const { memoize } = require('memoize.js')

const memoCalc = memoize(calc, (p) => p.a)

const param = {a: 'one'}
memoCalc(param)
memoCalc(param) // cache hit
memoCalc({a: 'one'}) // cache hit
```

## Benchmarking strategies

### Small object parameter
```javascript
const simple = {
  data: {
    p1: {
      name: 'auto-memoize'
      }
    }
  }
memoized(simple, 1, 1)
```
|     | Strategy | ops/sec   |
| --- | -------- | --------- |
| 1   | callback | 4,765,946 |
| 2   | weak     | 3,751,169 |
| 3   | deep     | 1,211,864 |
| 4   | default  | 1,004,562 |
| 5   | string   | 341,206   |

### Object parameter
```javascript
const data = { ...3 package.json }
memoized(data, 1, 1)
```
|     | Strategy | ops/sec   |
| --- | -------- | --------- |
| 1   | callback | 5,131,611 |
| 2   | weak     | 2,663,508 |
| 3   | default  | 992,947   |
| 4   | deep     | 832,758   |
| 5   | string   | 33,763    |

### Different reference object parameter
```javascript
const data = { ...3 package.json }
memoized(Object.assign({}, data), 1, 1)
```
|     | Strategy | ops/sec   |     |
| --- | -------- | --------- | --- |
| 1   | callback | 2,195,159 |     |
| 2   | deep     | 708,301   |     |
| 3   | string   | 33,098    |     |
|     | weak     | 833,162   | n/a |
|     | default  | 1,484     | n/a |

### Primitive parameters
```javascript
memoized("argument", 1, true)
```
|     | Strategy | ops/sec   |     |
| --- | -------- | --------- | --- |
| 1   | callback | 3,340,699 |     |
| 2   | deep     | 1,320,397 |     |
| 3   | default  | 1,330,912 |     |
| 4   | string   | 548,254   |     |
|     | weak     |           | n/a |

Typings includes types for: 
 - memoized function parameters
 - memoized function return type
  
# getCache
Utility function to get cache instance from memoized function.
It will return instance of `CacheMap`. It enables you to retrieve cache records and invalidate cache.

## CacheMap
For different cache strategies different keys are applicable. Key types:
 * default - `any[]`
 * weak - `object`
 * string - `string` (parameters joined by `-`)
 * deep - `any[]`
 * custom key - `string`
```typescript
export interface CacheMap<K = any, V = any> {
    get(key: K): V | undefined
    has(key: K): boolean
    set(key: K, result: V): this
    clear(): void
}
```
## Examples
```javascript
import { getCache, CreateOnce, CallOnce, memoize } from 'auto-memoize'
import { fibo } from './fibonaci'

// cache from meoized function
const memo = memoize(fibo)
memo(5)
getCache(memo).has([5]) // true
getCache(memo).clear()
getCache(memo).has([5]) // false

@CreateOnce
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  @CallOnce
  greet(greeting) {
    const { firstName } = this
    return { greeting, firstName }
  }
}
const person = new Person('A', 'B')
person.greet('Hello'
)
// cache from  decorated 'CreateOnce' or 'CreateOnceBy' class
getCache(Person)
// cache from  decorated 'CallOnce' or 'CallOnceBy' class
getCache(person.greet)
```

# Decorators

## Docs

### @CreateOnce
Class Decorator used to created same instance of class when same parameters are passed.
It follows functional design pattern memoize, also Flyweight design pattern, 
when one instance of Class is created once with exact state.
It defines how objects with state can be shared.
If class constructor has no parameters, decorated with 'CreateOnce' it becomes singleton.
It this class is extended, effect of decorator will be applied on child classes, 
parent constructor will always be constructor that creates class instance. Even if child 
constructor accepts different parameters.
If child class is decorated, child class will have cache effect.
It will cache instances by [default](#default-implementation) 'auto-memoize' strategy.
Decorator [@CreateOnceBy](#@createonceby) can be configured with other cache hit strategy

### @CreateOnceBy
Class Decorator used to created same instance of class when same parameters are passed.
It follows functional design pattern memoize, also Flyweight design pattern, 
when one instance of Class is created once with exact state.
It defines how objects with state can be shared.
It will cache instances by strategy from decorator parameter.
Decorator [@CreateOnce](#@createonce) is preconfigured with [default](#default-implementation) cache hit strategy.
It this class is extended, effect of decorator will be applied on child classes, 
parent constructor will always be constructor that creates class instance. Even if child 
constructor accepts different parameters.
If child class is decorated, child class will have cache effect.

### @CallOnce
Class method decorator used to create 'memoized' class method. Method that will return 
same output with same parameters passed. It follows memoize functional design pattern.
It will cache by [default](#default-implementation) 'auto-memoize' strategy.
Decorator [@CallOnceBy](#@callonceby) can be configured with other cache hit strategy.

### @CallOnceBy
Class method decorator used to create 'memoized' class method. Method that will return 
same output with same parameters passed. It follows memoize functional design pattern.
It must be configured with cache hit strategy.
Decorator [@CallOnce](#@callonce) is already preconfgured with [default](#default-implementation) strategy.

## Examples
### Caching with default strategy
```javascript
import { CreateOnce, CallOnce } from 'auto-memoize';

// Creates one class instance per constructor parameter 
@CreateOnce
class Greeter {
  greeting
    constructor(greeting) {
      this.greeting = greeting
    }

    // Calls method once per parameter unique
    // method with cache
    @CallOnce
    greet(name) {
      return { greet: `${this.greeting}, ${name}!` }
    }
}
```

### Caching with provided strategy
```javascript
import { CreateOnceBy, CallOnceBy } from 'auto-memoize';
 
// Creates one class instance per constructor parameter 
@CreateOnceBy('string')
class CustomGreeter {
  greeting
    constructor(greeting) {
      this.greeting = greeting
    }

    // Calls method once per parameter unique
    // method with cache
    @CallOnceBy(person => person.name)
    greet(person) {
        return { greet: `${this.greeting}, ${person.name}!` }
    }
}
```

### Class Singleton
```javascript
import { CreateOnce } from 'auto-memoize';

// Always will return same instance of class
@CreateOnce
class Greeter {
    constructor() {
    }
    greet(name) {
        return { greet: `Hello, ${name}!` }
    }
}
```
