import * as fs from 'fs';
import assert from 'assert';

const parseInput = (path: string): number[] => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(line => parseInt(line))
}

const parseInstructions = (instructions: number[], condition: Function): number => {
    let i = 0, steps = 0, temp = 0
    while (i > -1 && i < instructions.length) {
        temp = i
        i += instructions[temp]
        condition(instructions[temp]) ? instructions[temp]-- : instructions[temp]++
        steps++
    }

    return steps
}

const part1 = (instructions: number[]): number => {
    return parseInstructions(instructions, (_: number) => false)
}

const part2 = (instructions: number[]): number => {
    return parseInstructions(instructions, (offset: number) => offset > 2)
}


// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d5.txt'
const inputTestPath = './src/inputs/d5-t1.txt'

export const runPart1 = () => {
    assert(part1(parseInput(inputTestPath)) === 5)

    console.log('Part 1: ', part1(parseInput(inputPath)))
}

export const runPart2 = () => {
    assert(part2(parseInput(inputTestPath)) === 10)

    console.log('Part 2: ', part2(parseInput(inputPath)))
}
