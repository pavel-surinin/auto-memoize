# auto-memoize
Fast javascript memoize function, with optimized memoize strategies provided.

[![Build Status](https://travis-ci.com/pavel-surinin/auto-memoize.svg?branch=master)](https://travis-ci.com/pavel-surinin/auto-memoize)
[![Coverage Status](https://coveralls.io/repos/github/pavel-surinin/auto-memoize/badge.svg?branch=master)](https://coveralls.io/github/pavel-surinin/auto-memoize?branch=master)
[![npm version](https://badge.fury.io/js/auto-memoize.svg)](https://badge.fury.io/js/auto-memoize)
## Install
```bash
npm i -S auto-memoize
```
## Docs
  - [Default implementation](#default-implementation)
  - [WeakMap implementation](#weakmap-implementation)
  - [Deep comparison implementation](#deep-comparison-implementation)
  - [String key implementation](#string-key-implementation)
  - [Custom key implementation](#custom-key-implementation)
  - [Browser support](#browser-support)
  - [Typescript support](#typescript-support)

## Default implementation

Caches by all parameters as a key and comparing them with `Object.is` [algorithm](https://www.ecma-international.org/ecma-262/6.0/#sec-object.is)
```javascript
const calc = require('expensive-calculation')
const memoize = require('memoize.js')

const memoCalc = memoize(calc)

const param = {a: 'one'}
memoCalc(param, 1)
memoCalc(param, 2)
memoCalc(param, 1) // cache hit
memoCalc({a: 'one'}, 1) // no cache hit, because reference is different
```

## WeakMap implementation
Caches by first parameter as a key and using ES6 [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) as a cache. Garbage collector automatically removes entries from cache when no references for keys are not present.
```javascript
const calc = require('expensive-calculation')
const memoize = require('memoize.js')

const memoCalc = memoize(calc, 'weak')

const param = {a: 'one'}
memoCalc(param, 1)
memoCalc(param, 2) // cache hit
memoCalc({a: 'one'}, 1) // no cache hit, because reference is different
```

## Deep comparison implementation
Caches by all parameters as a key and compares them with by content if references are different.
[fast-deep-equal](https://www.npmjs.com/package/fast-deep-equal)
npm package does the comparison.
It is performing better on big objects, that `JSON.stringify`.
```javascript
const calc = require('expensive-calculation')
const memoize = require('memoize.js')

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
const memoize = require('memoize.js')

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
const memoize = require('memoize.js')

const memoCalc = memoize(calc, (p) => p.a)

const param = {a: 'one'}
memoCalc(param)
memoCalc(param) // cache hit
memoCalc({a: 'one'}) // cache hit
```

## Browser support
Used browserlist 'best practices' [configuration](https://github.com/browserslist/browserslist#best-practices).

| Mobile	| Desktop   	|
|---	|---	|
| Chrome for Android71 | Chrome49 |
| Firefox for Android64 | Edge 17 |
| Samsung Internet4 | IE11 |
| Opera Mobile46  	| Opera 56 |
| Opera Miniall | Safari 11.1 |
| iOS Safari11.3	| Firefox 60 |
| IE Mobile11  |   	|
| Android Browser4.4.3 |   	|

## Typescript support
Typings includes types for: 
 - resolve key callback,
 - memoized function parameters
 - memoized function return type
  
![alt text](./docs/memoize.gif "Typescript typings")
