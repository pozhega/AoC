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
        .split('\n')
        .map(line => line.split('').map(num => parseInt(num)));
}
function part1(horizontalMap) {
    let mapHeight = horizontalMap.length, mapWidth = horizontalMap[0].length, verticalMap = horizontalMap.zip(), visibleCnt = 0;
    horizontalMap.forEach((horizontalLine, row) => {
        horizontalLine.forEach((tree, col) => {
            visibleCnt += Number(horizontalLine.slice(0, col).every(lineTree => lineTree < tree) ||
                verticalMap[col].slice(0, row).every(lineTree => lineTree < tree) ||
                horizontalLine.slice(col + 1, mapWidth).every(lineTree => lineTree < tree) ||
                verticalMap[col].slice(row + 1, mapHeight).every(lineTree => lineTree < tree));
        });
    });
    return visibleCnt;
}
function part2(horizontalMap) {
    let mapHeight = horizontalMap.length, mapWidth = horizontalMap[0].length, verticalMap = horizontalMap.zip(), maxScenicScore = 0;
    horizontalMap.forEach((horizontalLine, row) => {
        horizontalLine.forEach((tree, col) => {
            let scenicScore = 1;
            scenicScore *= horizontalLine.slice(0, col).reverse().findIndex(lineTree => lineTree >= tree) + 1 || col;
            scenicScore *= verticalMap[col].slice(0, row).reverse().findIndex(lineTree => lineTree >= tree) + 1 || row;
            scenicScore *= horizontalLine.slice(col + 1, mapWidth).findIndex(lineTree => lineTree >= tree) + 1 || mapWidth - col - 1;
            scenicScore *= verticalMap[col].slice(row + 1, mapHeight).findIndex(lineTree => lineTree >= tree) + 1 || mapWidth - row - 1;
            maxScenicScore = Math.max(maxScenicScore, scenicScore);
        });
    });
    return maxScenicScore;
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
const inputPath = './src/inputs/d8.txt';
const inputTestPath1 = './src/inputs/d8-t1.txt';
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 21);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 8);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
