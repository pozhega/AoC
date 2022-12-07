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
class Dir {
    constructor(parent = null) {
        this.childDirs = new Map();
        this.childFiles = new Map();
        this.parent = parent;
        this.size = 0;
    }
    calculateDirSize() {
        let filesSize = Array
            .from(this.childFiles.values())
            .map(file => file.size)
            .reduce(lodash_1.add, 0);
        let dirsSize = Array
            .from(this.childDirs.values())
            .map(dir => dir.calculateDirSize())
            .reduce(lodash_1.add, 0);
        this.size = filesSize + dirsSize;
        return this.size;
    }
    calculateDirSum() {
        return (this.size <= 100000 ? this.size : 0) + Array
            .from(this.childDirs.values())
            .map(dir => dir.calculateDirSum())
            .reduce(lodash_1.add, 0);
    }
    findDeleteCandidates(missingSpace) {
        return (this.size >= missingSpace ? [this] : [])
            .concat(Array
            .from(this.childDirs.values())
            .map(dir => dir.findDeleteCandidates(missingSpace))
            .flat());
    }
}
class File {
    constructor(parent, size) {
        this.parent = parent;
        this.size = size;
    }
}
function parseInput(path) {
    let commands = fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .slice(1)
        .map(line => line.split(' '));
    let root = new Dir(), currentDir = root;
    for (let [c1, c2, c3] of commands) {
        if ((0, lodash_1.isEqual)([c1, c2], ['$', 'ls']))
            continue;
        if ((0, lodash_1.isEqual)([c1, c2], ['$', 'cd'])) {
            if (c3 === '/')
                currentDir = root;
            else if (c3 === '..')
                currentDir = currentDir.parent;
            else
                currentDir = currentDir.childDirs.get(c3);
            continue;
        }
        if (c1 === 'dir')
            currentDir.childDirs.set(c2, new Dir(currentDir));
        else
            currentDir.childFiles.set(c2, new File(currentDir, parseInt(c1)));
    }
    root.calculateDirSize();
    return root;
}
function part1(root) {
    return root.calculateDirSum();
}
function part2(root) {
    return Math.min(...root
        .findDeleteCandidates(UPDATE_SPACE - (TOTAL_SPACE - root.size))
        .map(dir => dir.size));
}
// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------
const inputPath = './src/inputs/d7.txt';
const inputTestPath1 = './src/inputs/d7-t1.txt';
const TOTAL_SPACE = 70000000;
const UPDATE_SPACE = 30000000;
function runPart1() {
    (0, assert_1.default)(part1(parseInput(inputTestPath1)) === 95437);
    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart1 = runPart1;
function runPart2() {
    (0, assert_1.default)(part2(parseInput(inputTestPath1)) === 24933642);
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)));
    console.timeEnd('Time');
}
exports.runPart2 = runPart2;
