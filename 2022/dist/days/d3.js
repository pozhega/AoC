"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPart2 = exports.runPart1 = void 0;
const fs = __importStar(require("fs"));
const assert_1 = __importDefault(require("assert"));
const lodash_1 = require("lodash");
// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------
function parsePart1Input(path) {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(val => [
        val.substring(0, val.length / 2).split(''),
        val.substring(val.length / 2).split('')
    ]);
}
function parsePart2Input(path) {
    return (0, lodash_1.chunk)(fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(val => val.split('')), 3);
}
function isLowerCase(string) {
    return string == string.toLowerCase() && string != string.toUpperCase();
}
function getItemPriority(item) {
    let charCode = item.charCodeAt(0);
    return isLowerCase(item) ? charCode - 96 : charCode - 38;
}
function part1(rucksacks) {
    return rucksacks.reduce((sum, rucksack) => sum += getItemPriority((0, lodash_1.intersection)(...rucksack)[0]), 0);
}
function part2(groups) {
    return groups.reduce((sum, group) => sum += getItemPriority((0, lodash_1.intersection)(...group)[0]), 0);
}
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const inputPath = './src/inputs/d3.txt';
const inputTestPath1 = './src/inputs/d3-t1.txt';
function runPart1() {
    (0, assert_1.default)(part1(parsePart1Input(inputTestPath1)) === 157);
    console.time('Time');
    console.log('Part 1: ', part1(parsePart1Input(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parsePart2Input(inputTestPath1)) === 70);
    console.time('Time');
    console.log('Part 2: ', part2(parsePart2Input(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
