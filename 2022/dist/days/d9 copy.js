"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
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
// -----------------------------------------------------------------------------
function parseInput(path) {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(' '))
        .map(([dir, num]) => [dir, parseInt(num)]);
}
function updateHead(head, dir) {
    if (dir === 'R')
        head[0]++;
    else if (dir === 'U')
        head[1]++;
    else if (dir === 'L')
        head[0]--;
    else
        head[1]--;
}
function updateTail(head, tail) {
    if (head[0] - tail[0] === 2) {
        tail[0]++;
        if (head[1] > tail[1])
            tail[1]++;
        if (head[1] < tail[1])
            tail[1]--;
    }
    else if (head[0] - tail[0] === -2) {
        tail[0]--;
        if (head[1] > tail[1])
            tail[1]++;
        if (head[1] < tail[1])
            tail[1]--;
    }
    else if (head[1] - tail[1] === 2) {
        tail[1]++;
        if (head[0] > tail[0])
            tail[0]++;
        if (head[0] < tail[0])
            tail[0]--;
    }
    else if (head[1] - tail[1] === -2) {
        tail[1]--;
        if (head[0] > tail[0])
            tail[0]++;
        if (head[0] < tail[0])
            tail[0]--;
    }
}
function part1(moves) {
    let head = [0, 0];
    let tail = [0, 0];
    let tailLog = new Set([[0, 0].toString()]);
    moves.forEach(([dir, num]) => {
        for (let i = 0; i < num; i++) {
            updateHead(head, dir);
            updateTail(head, tail);
            tailLog.add(tail.toString());
        }
    });
    return tailLog.size;
}
function part2(moves, knotNum) {
    let knots = Array.from({ length: knotNum }, e => Array(2).fill(0));
    let tailLog = new Set([[0, 0].toString()]);
    moves.forEach(([dir, num]) => {
        for (let _ = 0; _ < num; _++) {
            updateHead(knots[0], dir);
            for (let i = 1; i < knotNum; i++)
                updateTail(knots[i - 1], knots[i]);
            tailLog.add(knots[knotNum - 1].toString());
        }
    });
    return tailLog.size;
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
const inputPath = './src/inputs/d9.txt';
const inputTestPath1 = './src/inputs/d9-t1.txt';
const inputTestPath2 = './src/inputs/d9-t2.txt';
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 13);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parseInput(inputTestPath1), 10) === 1);
    (0, assert_1.default)(part2(parseInput(inputTestPath2), 10) === 36);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath), 10));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
