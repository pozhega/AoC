"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPart2 = exports.runPart1 = void 0;
const assert_1 = __importDefault(require("assert"));
const getMatrixNeighbours = (matrix, [xPos, yPos]) => {
    let neighbours = [];
    for (let i = xPos - 1; i < xPos + 2; i++) {
        for (let j = yPos - 1; j < yPos + 2; j++) {
            if (xPos === i && yPos === j)
                continue;
            neighbours.push([i, j]);
        }
    }
    return neighbours;
};
const calcPointVal = (matrix, point) => {
    return getMatrixNeighbours(matrix, point)
        .reduce((sum, point) => {
        let pointVal = matrix.get(JSON.stringify(point));
        if (pointVal === undefined)
            return sum;
        return sum + pointVal;
    }, 0);
};
const getSpiralDistance = (limit) => {
    let matrix = new Map;
    matrix.set(JSON.stringify([0, 0]), 1);
    let xRange = 1;
    let yRange = 1;
    let xPos = 0;
    let yPos = 0;
    let counter = 1;
    while (true) {
        for (let i = 0; i < xRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            xPos++;
            counter++;
            let pointVal = calcPointVal(matrix, [xPos, yPos]);
            if (pointVal > limit)
                return pointVal;
            matrix.set(JSON.stringify([xPos, yPos]), pointVal);
        }
        xRange++;
        for (let i = 0; i < yRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            yPos++;
            counter++;
            let pointVal = calcPointVal(matrix, [xPos, yPos]);
            if (pointVal > limit)
                return pointVal;
            matrix.set(JSON.stringify([xPos, yPos]), pointVal);
        }
        yRange++;
        for (let i = 0; i < xRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            xPos--;
            counter++;
            let pointVal = calcPointVal(matrix, [xPos, yPos]);
            if (pointVal > limit)
                return pointVal;
            matrix.set(JSON.stringify([xPos, yPos]), pointVal);
        }
        xRange++;
        for (let i = 0; i < yRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            yPos--;
            counter++;
            let pointVal = calcPointVal(matrix, [xPos, yPos]);
            if (pointVal > limit)
                return pointVal;
            matrix.set(JSON.stringify([xPos, yPos]), pointVal);
        }
        yRange++;
    }
};
const part1 = (data) => {
    return getSpiralDistance(data);
};
const part2 = (data) => {
    return getSpiralDistance(data);
};
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const runPart1 = () => {
    (0, assert_1.default)(part1(1) === 0);
    (0, assert_1.default)(part1(12) === 3);
    (0, assert_1.default)(part1(23) === 2);
    (0, assert_1.default)(part1(1024) === 31);
    console.log('Part 1: ', part1(312051));
};
exports.runPart1 = runPart1;
const runPart2 = () => {
    // assert(part2(1) === 1)
    // assert(part2(2) === 1)
    // assert(part2(3) === 2)
    // assert(part2(4) === 4)
    // assert(part2(4) === 4)
    console.log('Part 2: ', part2(312051));
};
exports.runPart2 = runPart2;
