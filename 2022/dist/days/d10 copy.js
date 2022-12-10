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
// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------
function parseInput(path) {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(' '))
        .map(instruction => instruction[1] ? [instruction[0], parseInt(instruction[1])] : instruction);
}
function printCRT(crt) {
    crt.forEach(row => console.log(row.join('')));
}
function updateCRT(crt, cycle, x) {
    let row = Math.floor(cycle / 40), col = cycle % 40;
    if ([x - 1, x, x + 1].includes(col))
        crt[row].push('#');
    else
        crt[row].push('.');
}
function part1(instructions) {
    let x = 1, cycleLog = [x];
    instructions.forEach(instruction => {
        if (instruction[0] === 'noop') {
            cycleLog.push(x);
        }
        else {
            cycleLog.push(x);
            cycleLog.push(x);
            x += instruction[1];
        }
    });
    return [20, 60, 100, 140, 180, 220].reduce((sum, cycleNum) => {
        return sum += cycleNum * cycleLog[cycleNum];
    }, 0);
}
function part2(instructions) {
    let crt = Array.from({ length: 6 }, e => Array(0)), cycle = 0, x = 1;
    instructions.forEach(instruction => {
        if (instruction[0] === 'noop') {
            updateCRT(crt, cycle, x);
            cycle++;
        }
        else {
            updateCRT(crt, cycle, x);
            cycle++;
            updateCRT(crt, cycle, x);
            cycle++;
            x += instruction[1];
        }
    });
    printCRT(crt);
}
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const inputPath = './src/inputs/d10.txt';
const inputTestPath1 = './src/inputs/d10-t1.txt';
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 13140);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
