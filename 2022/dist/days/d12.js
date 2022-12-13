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
        .map(line => line.split('').map(square => {
        if (square === 'S')
            return 96;
        if (square === 'E')
            return 123;
        return square.charCodeAt(0);
    }));
}
function findSquarePoints(heightMap, targetSquare) {
    let points = [];
    for (let [rowIdx, row] of heightMap.entries()) {
        for (let [colIdx, square] of row.entries()) {
            if (square === targetSquare)
                points.push([rowIdx, colIdx]);
        }
    }
    return points;
}
function findValidNeigbours(heightMap, [row, col]) {
    let square = heightMap[row][col], points = [];
    if (row - 1 >= 0 && square - heightMap[row - 1][col] < 2)
        points.push([row - 1, col]);
    if (col - 1 >= 0 && square - heightMap[row][col - 1] < 2)
        points.push([row, col - 1]);
    if (row + 1 < heightMap.length && square - heightMap[row + 1][col] < 2)
        points.push([row + 1, col]);
    if (col + 1 < heightMap[0].length && square - heightMap[row][col + 1] < 2)
        points.push([row, col + 1]);
    return points;
}
function calcSquareSteps(heightMap, stepMap, [row, col], steps = -1) {
    if (!stepMap[row][col] || steps + 1 < stepMap[row][col]) {
        steps++;
        stepMap[row][col] = steps;
        findValidNeigbours(heightMap, [row, col]).forEach(point => calcSquareSteps(heightMap, stepMap, point, steps));
    }
}
function part1(heightMap) {
    let startSquare = 96, endSquare = 123;
    let [[startRow, startCol]] = findSquarePoints(heightMap, startSquare);
    let [endPoint] = findSquarePoints(heightMap, endSquare);
    let stepMap = Array.from({ length: heightMap.length }, _ => Array(heightMap[0].length));
    calcSquareSteps(heightMap, stepMap, endPoint);
    return stepMap[startRow][startCol];
}
function part2(heightMap) {
    let aSquare = 97, endSquare = 123;
    let [endPoint] = findSquarePoints(heightMap, endSquare);
    let stepMap = Array.from({ length: heightMap.length }, _ => Array(heightMap[0].length));
    calcSquareSteps(heightMap, stepMap, endPoint);
    return Math.min(...findSquarePoints(heightMap, aSquare)
        .map(([row, col]) => stepMap[row][col])
        .filter(step => step));
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
const inputPath = './src/inputs/d12.txt';
const inputTestPath1 = './src/inputs/d12-t1.txt';
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 31);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 29);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
