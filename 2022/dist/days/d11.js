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
require("../helpers/array");
// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------
class Monkey {
    constructor(id, items, [operator, operand], [testCase, toTrueMonkeyId, toFalseMonkeyId]) {
        this.id = id;
        this.items = items;
        this.operator = operator;
        this.operand = operand;
        this.testCase = testCase;
        this.toTrueMonkeyId = toTrueMonkeyId;
        this.toFalseMonkeyId = toFalseMonkeyId;
        this.inspectCnt = 0;
    }
    inspectItems(monkeys, reduceWorry) {
        this.items.forEach(item => {
            let toTrueMonkey = monkeys[this.toTrueMonkeyId];
            let toFalseMonkey = monkeys[this.toFalseMonkeyId];
            this.inspectCnt++;
            item = this.runOperation(item);
            item = reduceWorry(item);
            this.runTest(item, toTrueMonkey, toFalseMonkey);
        });
        this.items = [];
    }
    runOperation(item) {
        if (this.operator === '+' && isNaN(this.operand))
            item *= 2;
        else if (this.operator === '*' && isNaN(this.operand))
            item *= item;
        else if (this.operator === '+')
            item += this.operand;
        else
            item *= this.operand;
        return item;
    }
    runTest(item, toTrueMonkey, toFalseMonkey) {
        if (item % this.testCase === 0)
            toTrueMonkey.addItem(item);
        else
            toFalseMonkey.addItem(item);
    }
    addItem(item) {
        this.items.push(item);
    }
}
function parseInput(path) {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n\n')
        .map((monkeyData, monkeyIdx) => {
        let lines = monkeyData.split('\n');
        let items = lines[1].split(': ')[1].split(', ').map(item => parseInt(item));
        let operationData = lines[2].split('= ')[1].split(' ').slice(1);
        let operator = operationData[0];
        let operand = parseInt(operationData[1]);
        let operationParams = [operator, operand];
        let testCase = parseInt(lines[3].split('by ')[1]);
        let toTrueMonkeyId = parseInt(lines[4].split('monkey ')[1]);
        let toFalseMonkeyId = parseInt(lines[5].split('monkey ')[1]);
        let testParams = [testCase, toTrueMonkeyId, toFalseMonkeyId];
        return new Monkey(monkeyIdx.toString(), items, operationParams, testParams);
    });
}
function calcMonkeyBusinessLevel(monkeys) {
    return monkeys
        .map(monkey => monkey.inspectCnt)
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce(lodash_1.multiply, 1);
}
function part1(monkeys) {
    let reduceWorry = (item) => Math.floor(item / 3);
    (0, lodash_1.range)(20).forEach(_ => {
        monkeys.forEach(monkey => {
            monkey.inspectItems(monkeys, reduceWorry);
        });
    });
    return calcMonkeyBusinessLevel(monkeys);
}
function part2(monkeys) {
    let masterModulo = monkeys.map(monkey => monkey.testCase).reduce(lodash_1.multiply, 1);
    let reduceWorry = (item) => item % masterModulo;
    (0, lodash_1.range)(10000).forEach(_ => {
        monkeys.forEach(monkey => {
            monkey.inspectItems(monkeys, reduceWorry);
        });
    });
    return calcMonkeyBusinessLevel(monkeys);
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
const inputPath = './src/inputs/d11.txt';
const inputTestPath1 = './src/inputs/d11-t1.txt';
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 10605);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 2713310158);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
