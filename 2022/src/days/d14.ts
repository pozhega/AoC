import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = any

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
}

function part1(data: Data): number {
    return 0
}

function part2(data: Data): number {
    return 0
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d14.txt'
const inputTestPath1 = './src/inputs/d14-t1.txt'

export function runPart1() {
    console.log(part1(parseInput(inputTestPath1)))
    assert(part1(parseInput(inputTestPath1)) === 0)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    console.log(part2(parseInput(inputTestPath1)))
    assert(part2(parseInput(inputTestPath1)) === 0)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
