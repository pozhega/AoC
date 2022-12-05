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
function parseStacks(stacksInput) {
    return (0, lodash_1.zip)(...stacksInput
        .split('\n')
        .reverse()
        .splice(1)
        .map(line => line
        .replace(/\[|\]/g, '')
        .replace(/     /g, ' # ')
        .replace(/    /g, '#')
        .replace(/ /g, '')
        .split('')))
        .map(stack => stack
        .filter(crate => crate != '#'));
}
function parseSteps(stepsInput) {
    return stepsInput
        .split('\n')
        .filter(line => line != '')
        .map(line => line
        .split(' ')
        .map(val => parseInt(val))
        .filter(val => !isNaN(val)));
}
function parseInput(path) {
    let [stacksInput, stepsInput] = fs.readFileSync(path, 'utf-8').split('\n\n');
    return [parseStacks(stacksInput), parseSteps(stepsInput)];
}
function part1([stacks, steps]) {
    steps.forEach(([count, from, to]) => {
        stacks[to - 1].push(...stacks[from - 1]
            .splice(-count, count)
            .reverse());
    });
    return stacks.map(stack => stack.pop()).join('');
}
function part2([stacks, steps]) {
    steps.forEach(([count, from, to]) => {
        stacks[to - 1].push(...stacks[from - 1].splice(-count, count));
    });
    return stacks.map(stack => stack.pop()).join('');
}
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const inputPath = './src/inputs/d5.txt';
const inputTestPath1 = './src/inputs/d5-t1.txt';
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 'CMZ');
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 'MCD');
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
