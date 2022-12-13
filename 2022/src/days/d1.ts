import * as fs from 'fs'
import assert from 'assert'
import { add } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Calories = number[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n\n')
        .map(line => line
            .split('\n')
            .map(val => parseInt(val)))
}

function part1(elfCalories: Calories[]): number {
    return Math.max(...elfCalories
        .map(calories => calories
            .reduce(add)))
}

function part2(elfCalories: Calories[]): number {
    return elfCalories
        .map(calories => calories.reduce(add))
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce(add, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d1.txt'
const inputTestPath1 = './src/inputs/d1-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 24000)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 45000)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
