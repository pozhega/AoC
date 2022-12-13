import * as fs from 'fs';
import assert from 'assert';
import { add, isEqual } from 'lodash';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface Dir {
    childDirs: Map<string, Dir>
    childFiles: Map<string, File>
    parent: Dir
    size: number
}

interface File {
    parent: Dir
    size: number
}

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

class Dir implements Dir {
    constructor(parent: Dir | null = null) {
        this.childDirs = new Map()
        this.childFiles = new Map()
        this.parent = parent as Dir
        this.size = 0
    }

    calculateDirSize(): number {
        let filesSize = Array
            .from(this.childFiles.values())
            .map(file => file.size)
            .reduce(add, 0)

        let dirsSize = Array
            .from(this.childDirs.values())
            .map(dir => dir.calculateDirSize())
            .reduce(add, 0)

        this.size = filesSize + dirsSize
        return this.size
    }

    calculateDirSum(): number {
        return (this.size <= 100000 ? this.size : 0) + Array
            .from(this.childDirs.values())
            .map(dir => dir.calculateDirSum())
            .reduce(add, 0)
    }

    findDeleteCandidates(missingSpace: number): Dir[] {
        return (this.size >= missingSpace ? [this as Dir] : [])
            .concat(Array
                .from(this.childDirs.values())
                .map(dir => dir.findDeleteCandidates(missingSpace))
                .flat())
    }
}

class File implements File {
    constructor(parent: Dir, size: number) {
        this.parent = parent
        this.size = size
    }
}

function parseInput(path: string): Dir {
    let commands = fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .slice(1)
        .map(line => line.split(' '))

    let root = new Dir(),
        currentDir = root
    for (let [c1, c2, c3] of commands) {
        if (isEqual([c1, c2], ['$', 'ls'])) continue

        if (isEqual([c1, c2], ['$', 'cd'])) {
            if (c3 === '/') currentDir = root
            else if (c3 === '..') currentDir = currentDir.parent as Dir
            else currentDir = currentDir.childDirs.get(c3) as Dir
            continue
        }

        if (c1 === 'dir') currentDir.childDirs.set(c2, new Dir(currentDir))
        else currentDir.childFiles.set(c2, new File(currentDir, parseInt(c1)))
    }

    root.calculateDirSize()
    return root
}

function part1(root: Dir): number {
    return root.calculateDirSum()
}

function part2(root: Dir): number {
    return Math.min(...root
        .findDeleteCandidates(UPDATE_SPACE - (TOTAL_SPACE - root.size))
        .map(dir => dir.size))
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d7.txt'
const inputTestPath1 = './src/inputs/d7-t1.txt'
const TOTAL_SPACE = 70000000
const UPDATE_SPACE = 30000000

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 95437)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 24933642)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
