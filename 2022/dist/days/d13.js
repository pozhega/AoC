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
require("../helpers/array");
// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------
function parseInput(path) {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n\n')
        .map(pair => pair.split('\n').map(packet => JSON.parse(packet)));
}
function comparePair([left, right]) {
    if (Array.isArray(left) && Array.isArray(right)) {
        return [left, right]
            .zip()
            .map(pair => comparePair(pair))
            .dropWhile(result => result === -1)
            .thru(results => results[0] === undefined ? -1 : results[0]);
    }
    if (Number.isInteger(left) && Number.isInteger(right)) {
        if (left === right)
            return -1;
        if (left < right)
            return 1;
        return 0;
    }
    if (Number.isInteger(left) && Array.isArray(right))
        return comparePair([[left], right]);
    if (Array.isArray(left) && Number.isInteger(right))
        return comparePair([left, [right]]);
    if (Array.isArray(left) && right === undefined)
        return 0;
    if (Number.isInteger(left) && right === undefined)
        return 0;
    if (left === undefined && Array.isArray(right))
        return 1;
    if (left === undefined && Number.isInteger(right))
        return 1;
    return -1;
}
function part1(pairs) {
    return pairs
        .map(pair => comparePair(pair))
        .reduce((sum, result, idx) => sum += result === 1 ? idx + 1 : 0, 0);
}
function part2(pairs) {
    let dividerPackets = [[[2]], [[6]]];
    let packets = pairs.flat();
    packets.push(...dividerPackets);
    return packets
        .sort((left, right) => [0, -1].includes(comparePair([right, left])) ? -1 : 1)
        .reduce((sum, packet, idx) => sum *= dividerPackets.includes(packet) ? idx + 1 : 1, 1);
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
const inputPath = './src/inputs/d13.txt';
const inputTestPath1 = './src/inputs/d13-t1.txt';
function runPart1() {
    console.log(part1(parseInput(inputTestPath1)));
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 13);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    console.log(part2(parseInput(inputTestPath1)));
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 140);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
