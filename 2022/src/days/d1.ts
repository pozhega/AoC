import * as fs from 'fs';
import assert from 'assert';

type Calories = number[]

const parseInput = (path: string): Calories[] => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n\n')
        .map(line => line
            .split('\n')
            .filter(val => val !== '')
            .map(val => parseInt(val)))
}

const part1 = (elfCalories: Calories[]): number => {
    return Math.max(...elfCalories
        .map(calories => calories
            .reduce((total, calorie) => total + calorie, 0)))
}

const part2 = (elfCalories: Calories[]): number => {
    return elfCalories
        .map(calories => calories.reduce((total, calorie) => total + calorie, 0))
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((total, calories) => total + calories, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d1.txt'
const inputTestPath1 = './src/inputs/d1-t1.txt'

export const runPart1 = () => {
    assert(part1(parseInput(inputTestPath1)) === 24000)

    console.log('Part 1: ', part1(parseInput(inputPath)))
}

export const runPart2 = () => {
    assert(part2(parseInput(inputTestPath1)) === 45000)

    console.log('Part 2: ', part2(parseInput(inputPath)))
}
