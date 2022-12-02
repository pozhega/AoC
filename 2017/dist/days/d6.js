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
const parseInput = (path) => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')[0]
        .split('\t')
        .map(val => parseInt(val));
};
const findMaxBlockIdx = (memory) => {
    let maxIndex = 0;
    memory.forEach((val, index) => { if (val > memory[maxIndex])
        maxIndex = index; });
    return maxIndex;
};
const runCycles = (memory) => {
    let history = new Map(), currentIdx, reallocationCnt, cycleCnt = 0;
    while (!history.has(memory.toString())) {
        history.set(memory.toString(), cycleCnt);
        currentIdx = findMaxBlockIdx(memory);
        reallocationCnt = memory[currentIdx];
        memory[currentIdx] = 0;
        for (let i = 0; i < reallocationCnt; i++) {
            currentIdx = (currentIdx + 1) % memory.length;
            memory[currentIdx]++;
        }
        cycleCnt++;
    }
    return [memory, history, cycleCnt];
};
const part1 = (memory) => {
    return runCycles(memory).at(-1);
};
const part2 = (memory) => {
    let history, cycleCnt;
    [memory, history, cycleCnt] = runCycles(memory);
    return cycleCnt - history.get(memory.toString());
};
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const inputPath = './src/inputs/d6.txt';
const inputTestPath = './src/inputs/d6-t1.txt';
const runPart1 = () => {
    (0, assert_1.default)(part1(parseInput(inputTestPath)) === 5);
    console.log('Part 1: ', part1(parseInput(inputPath)));
};
exports.runPart1 = runPart1;
const runPart2 = () => {
    (0, assert_1.default)(part2(parseInput(inputTestPath)) === 4);
    console.log('Part 2: ', part2(parseInput(inputPath)));
};
exports.runPart2 = runPart2;
