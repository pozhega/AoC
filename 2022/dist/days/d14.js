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
const lodash_1 = require("lodash");
// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------
function parseInput(path) {
    let cave = new Map();
    fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line
        .split(' -> ')
        .map(point => point
        .split(',')
        .map(val => parseInt(val))))
        .forEach(polygon => {
        for (let idx = 1; idx < polygon.length; idx++) {
            let [xFrom, yFrom] = polygon[idx - 1], [xTo, yTo] = polygon[idx];
            if (xFrom === xTo) {
                (0, lodash_1.range)(Math.min(yFrom, yTo), Math.max(yFrom, yTo) + 1).forEach(y => {
                    cave.get(xFrom) ? cave.get(xFrom)?.set(y, '#') : cave.set(xFrom, new Map([[y, '#']]));
                });
            }
            else {
                (0, lodash_1.range)(Math.min(xFrom, xTo), Math.max(xFrom, xTo) + 1).forEach(x => {
                    cave.get(x) ? cave.get(x)?.set(yFrom, '#') : cave.set(x, new Map([[yFrom, '#']]));
                });
            }
        }
    });
    return cave;
}
function findMaxY(cave) {
    let yVals = Array.from(cave.entries())
        .map(entry => Array.from(entry[1].keys()))
        .flat();
    return Math.max(...yVals);
}
function part1(cave) {
    let yMax = findMaxY(cave);
    let sandUnits = 0, x = 500, y = 0;
    while (y <= yMax) {
        if (!cave.get(x)?.get(y))
            y++;
        else if (cave.get(x)?.get(y) &&
            cave.get(x - 1)?.get(y) &&
            cave.get(x + 1)?.get(y)) {
            cave.get(x)?.set(y - 1, 'o');
            sandUnits++, x = 500, y = 0;
        }
        else if (!cave.get(x - 1)?.get(y))
            x--, y++;
        else if (!cave.get(x + 1)?.get(y))
            x++, y++;
        else {
            cave.get(x - 1)?.set(y - 1, 'o');
            sandUnits++, x = 500, y = 0;
        }
    }
    return sandUnits;
}
function part2(cave) {
    let yMax = findMaxY(cave) + 2;
    let sandUnits = 0, x = 500, y = 0;
    while (!cave.get(500)?.get(0)) {
        if (y === yMax) {
            cave.get(x) ? cave.get(x)?.set(y - 1, 'o') : cave.set(x, new Map([[y - 1, 'o']]));
            sandUnits++, x = 500, y = 0;
        }
        else if (!cave.get(x)?.get(y))
            y++;
        else if (cave.get(x)?.get(y) &&
            cave.get(x - 1)?.get(y) &&
            cave.get(x + 1)?.get(y)) {
            cave.get(x) ? cave.get(x)?.set(y - 1, 'o') : cave.set(x, new Map([[y - 1, 'o']]));
            sandUnits++, x = 500, y = 0;
        }
        else if (!cave.get(x - 1)?.get(y))
            x--, y++;
        else if (!cave.get(x + 1)?.get(y))
            x++, y++;
        else {
            cave.get(x) ? cave.get(x)?.set(y - 1, 'o') : cave.set(x, new Map([[y - 1, 'o']]));
            sandUnits++, x = 500, y = 0;
        }
    }
    return sandUnits;
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
const inputPath = './src/inputs/d14.txt';
const inputTestPath1 = './src/inputs/d14-t1.txt';
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 24);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 93);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
