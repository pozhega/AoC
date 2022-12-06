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
const parseInput = (path) => {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(' '));
};
const rules = {
    'win': { 'A': 'Z', 'B': 'X', 'C': 'Y' },
    'draw': { 'A': 'X', 'B': 'Y', 'C': 'Z' },
    'loss': { 'A': 'Y', 'B': 'Z', 'C': 'X' }
};
const outcomeScores = { 'win': 0, 'draw': 3, 'loss': 6 };
const shapeScores = { 'X': 1, 'Y': 2, 'Z': 3 };
const outcomeRules = { 'X': 'win', 'Y': 'draw', 'Z': 'loss' };
const part1 = (strategy) => {
    return strategy.reduce((score, [shape1, shape2]) => {
        score += shapeScores[shape2];
        if (rules['win'][shape1] === shape2)
            return score += outcomeScores['win'];
        if (rules['loss'][shape1] === shape2)
            return score += outcomeScores['loss'];
        return score += outcomeScores['draw'];
    }, 0);
};
const part2 = (strategy) => {
    return strategy.reduce((score, [shape1, rule]) => {
        let outcome = outcomeRules[rule];
        let shape2 = rules[outcome][shape1];
        return score += outcomeScores[outcome] + shapeScores[shape2];
    }, 0);
};
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const inputPath = './src/inputs/d2.txt';
const inputTestPath1 = './src/inputs/d2-t1.txt';
const runPart1 = () => {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 15);
    console.time('Time');
    console.log('Part 1:', part1(parseInput(inputPath)));
    console.timeEnd('Time');
};
exports.runPart1 = runPart1;
const runPart2 = () => {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 12);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
};
exports.runPart2 = runPart2;
