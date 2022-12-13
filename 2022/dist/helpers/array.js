"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
if (!Array.prototype.chunk) {
    Array.prototype.chunk = function chunk(size) {
        return lodash_1.default.chunk(this, size);
    };
}
if (!Array.prototype.dropWhile) {
    Array.prototype.dropWhile = function dropWhile(predicate) {
        return lodash_1.default.dropWhile(this, predicate);
    };
}
if (!Array.prototype.head) {
    Array.prototype.head = function head() {
        return lodash_1.default.head(this);
    };
}
if (!Array.prototype.tail) {
    Array.prototype.tail = function tail() {
        return lodash_1.default.tail(this);
    };
}
if (!Array.prototype.tap) {
    Array.prototype.tap = function tap(interceptor) {
        return lodash_1.default.tap(this, interceptor);
    };
}
if (!Array.prototype.intersections) {
    Array.prototype.intersections = function tap() {
        return lodash_1.default.intersection(...this) || [];
    };
}
if (!Array.prototype.zip) {
    Array.prototype.zip = function tap() {
        return lodash_1.default.zip(...this);
    };
}
if (!Array.prototype.thru) {
    Array.prototype.thru = function tap(interceptor) {
        return lodash_1.default.thru(this, interceptor);
    };
}
