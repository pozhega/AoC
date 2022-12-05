import * as fs from 'fs';
import assert from 'assert';

// -----------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------

type Data = any

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

const parseInput = (path: string): any[] => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
}

const part1 = (data: Data): number => {
    return 0
}

const part2 = (data: Data): number => {
    return 0
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d6.txt'
const inputTestPath1 = './src/inputs/d6-t1.txt'

export const runPart1 = () => {
    assert(part1(parseInput(inputTestPath1)) === 0)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export const runPart2 = () => {
    assert(part2(parseInput(inputTestPath1)) === 0)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
