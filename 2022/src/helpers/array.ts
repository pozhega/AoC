import _ from 'lodash'

export { }
declare global {
    interface Array<T> {
        chunk(size: number): T[][]
        dropWhile(predicate: (value: T) => boolean): T[]
        head(): T | undefined
        tail(): T[]
        zip(): T[]
        tap(interceptor: (value: T[]) => void): T[]
        intersections(): any[]
        thru(interceptor: (value: T[]) => any): any
    }
}

if (!Array.prototype.chunk) {
    Array.prototype.chunk = function chunk<T>(this: T[], size: number): T[][] {
        return _.chunk(this, size)
    };
}

if (!Array.prototype.dropWhile) {
    Array.prototype.dropWhile = function dropWhile<T>(this: T[], predicate: (value: T) => boolean): T[] {
        return _.dropWhile(this, predicate)
    };
}

if (!Array.prototype.head) {
    Array.prototype.head = function head<T>(this: T[]): T | undefined {
        return _.head(this)
    };
}

if (!Array.prototype.tail) {
    Array.prototype.tail = function tail<T>(this: T[]): T[] {
        return _.tail(this)
    };
}

if (!Array.prototype.tap) {
    Array.prototype.tap = function tap<T>(this: T[], interceptor: (value: T[]) => void): T[] {
        return _.tap(this, interceptor)
    };
}

if (!Array.prototype.intersections) {
    Array.prototype.intersections = function tap<T>(this: T[][]): T[] {
        return _.intersection(...this) || []
    };
}

if (!Array.prototype.zip) {
    Array.prototype.zip = function tap<T>(this: T[][]): T[] {
        return _.zip(...this) as T[]
    };
}

if (!Array.prototype.thru) {
    Array.prototype.thru = function tap<T>(this: T[], interceptor: (value: T[]) => any): T[] {
        return _.thru(this, interceptor)
    };
}
