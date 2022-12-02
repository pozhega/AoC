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
        .split('\n\n')
        .map(line => line
        .split('\n')
        .filter(val => val !== '')
        .map(val => parseInt(val)));
};
const part1 = (elfCalories) => {
    return Math.max(...elfCalories
        .map(calories => calories
        .reduce((total, calorie) => total + calorie, 0)));
};
const part2 = (elfCalories) => {
    return elfCalories
        .map(calories => calories.reduce((total, calorie) => total + calorie, 0))
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((total, calories) => total + calories, 0);
};
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const inputPath = './src/inputs/d1.txt';
const inputTestPath1 = './src/inputs/d1-t1.txt';
const runPart1 = () => {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 24000);
    console.log('Part 1: ', part1(parseInput(inputPath)));
};
exports.runPart1 = runPart1;
const runPart2 = () => {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 45000);
    console.log('Part 2: ', part2(parseInput(inputPath)));
};
exports.runPart2 = runPart2;
