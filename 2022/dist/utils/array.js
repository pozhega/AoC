"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
Array.prototype._zip = function () {
    return lodash_1.default.zip(...this);
};
Array.prototype._intersection = function () {
    return lodash_1.default.intersection(...this);
};
Array.prototype._chunk = function (size) {
    return lodash_1.default.chunk(this, size);
};
