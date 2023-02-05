import * as fs from 'fs'
import assert from 'assert'
import { calcFreqDist } from '../helpers'
import _ from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Message = string[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return _.zip(...fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split('')))
}

function part1(messages: Message[]): string {
    return messages
        .map(token => calcFreqDist(token))
        .map(freqDist => Array.from(freqDist).sort((a, b) => b[1] - a[1])[0][0])
        .join('')
}

function part2(messages: Message[]): string {
    return messages
        .map(token => calcFreqDist(token))
        .map(freqDist => Array.from(freqDist).sort((a, b) => a[1] - b[1])[0][0])
        .join('')
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d6.txt'
const INPUT_TEST_PATH = './src/inputs/d6-t1.txt'

export function runPart1() {
    assert(part1(parseInput(INPUT_TEST_PATH)) === 'easter')

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(INPUT_TEST_PATH)) === 'advent')

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}
