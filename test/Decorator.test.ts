import { CallOnce, CallOnceBy, CreateOnce, CreateOnceBy } from '../src/Decorator'
import { getCache } from '../src/Memoize'

@CreateOnce
class Greeter {
    constructor(private greeting: string) {
    }

    @CallOnce
    greet(name: string): { greet: string } {
        return { greet: `${this.greeting}, ${name}!` }
    }

    sayHello = (name: string) => ({ greet: `${this.greeting}, ${name}!` })
}

@CreateOnceBy('string')
class CustomGreeter {
    greeting: string
    constructor(greeting: string) {
        this.greeting = greeting
    }

    @CallOnceBy('string')
    greet(name: string): { greet: string } {
        return { greet: `${this.greeting}, ${name}!` }
    }
}

@CreateOnce
class EmptyConstructor {
}

class Empty extends EmptyConstructor {
}

class EmptyOverride extends EmptyConstructor {
    constructor(private test: string) {
        super()
    }
    log() {
        console.log(this.test)

    }
}

class Parent { }

@CreateOnce
class Child extends Parent {
    constructor(private text: string) {
        super()
    }
    greet(): void {
        console.log(this.text)
    }
}

class GrandChild extends Child {
    constructor(text: string) {
        super(text)
    }
}

describe('Memoize decorators', () => {
    it('should decorate class with default memoize strategy', () => {
        const a = new Greeter('Hello')
        const b = new Greeter('Hello')
        expect(a).toBe(b)
    })
    it('should access class cache', () => {
        const a = new Greeter('Hello')
        getCache(Greeter)!.clear()
        const b = new Greeter('Hello')
        expect(a).not.toBe(b)
    })
    it('should access method cache', () => {
        const greeter = new Greeter('Hello')
        const a = greeter.greet('Hi')
        getCache(greeter.greet)!.clear()
        const b = greeter.greet('Hi')
        expect(a).not.toBe(b)
    })
    it('should decorate class', () => {
        const a = new CustomGreeter('Hello')
        const b = new CustomGreeter('Hello')
        expect(a).toBe(b)
    })
    it('should decorate class method with default memoize strategy', () => {
        const greeter = new Greeter('Hi')
        expect(greeter.greet('Pavel')).toBe(greeter.greet('Pavel'))
    })
    it('should decorate class method', () => {
        const greeter = new CustomGreeter('Hi')
        expect(greeter.greet('Pavel')).toBe(greeter.greet('Pavel'))
    })
    it('should decorate class with empty constructor to be singleton', () => {
        expect(new EmptyConstructor()).toBe(new EmptyConstructor())
    })
    it('should create singleton if parent class is decorated', () => {
        expect(new Empty()).toBe(new Empty())
    })
    it('should create singleton if parent class is decorated, event constructor called with different parameters', () => {
        expect(new EmptyOverride('a')).toBe(new EmptyOverride('b'))
    })
    it('should decorate child class', () => {
        expect(new Parent()).not.toBe(new Parent())
        expect(new Child('a')).toBe(new Child('a'))
    })
    it('should cache grandchild class, when parent class is not decorated', () => {
        expect(new GrandChild('a')).toBe(new GrandChild('a'))
    })
})
