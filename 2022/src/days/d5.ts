import * as fs from 'fs'
import assert from 'assert'
import { chain } from 'lodash'


// -----------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------

type Stack = string[]
type Step = [number, number, number]

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

function parseStacks(stacksInput: string): any[] {
    return chain(stacksInput)
        .split('\n')
        .reverse()
        .tail()
        .map(line => line
            .replace(/\[|\]/g, '')
            .replace(/     /g, ' # ')
            .replace(/    /g, '#')
            .replace(/ /g, '')
            .split(''))
        .unzip()
        .map(stack => stack.filter(crate => crate != '#'))
        .value()
}

function parseSteps(stepsInput: string): any[] {
    return stepsInput
        .trimEnd()
        .split('\n')
        .map(line => Array
            .from(line.matchAll(/\d+/g))
            .map(digit => parseInt(digit.toString())))
}

function parseInput(path: string): [any[], any[]] {
    let [stacksInput, stepsInput] = fs.readFileSync(path, 'utf-8').split('\n\n')
    return [parseStacks(stacksInput), parseSteps(stepsInput)]
}

function part1(stacks: Stack[], steps: Step[]): string {
    steps.forEach(([count, from, to]) => {
        stacks[to - 1].push(...
            stacks[from - 1]
                .splice(-count, count)
                .reverse())
    })

    return stacks.map(stack => stack.pop()).join('')
}

function part2(stacks: Stack[], steps: Step[]): string {
    steps.forEach(([count, from, to]) => {
        stacks[to - 1].push(...
            stacks[from - 1].splice(-count, count))
    })

    return stacks.map(stack => stack.pop()).join('')
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d5.txt'
const inputTestPath1 = './src/inputs/d5-t1.txt'

export function runPart1() {
    assert(part1(...parseInput(inputTestPath1)) === 'CMZ')

    console.time('Time');
    console.log('Part 1: ', part1(...parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(...parseInput(inputTestPath1)) === 'MCD')

    console.time('Time');
    console.log('Part 2: ', part2(...parseInput(inputPath)))
    console.timeEnd('Time');
}
