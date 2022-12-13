import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { divide } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Pair = [any[], any[]]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n\n')
        .map(pair => pair.split('\n').map(packet => JSON.parse(packet)))
}

function comparePair([left, right]: Pair): number {
    if (Array.isArray(left) && Array.isArray(right)) {
        return [left, right]
            .zip()
            .map(pair => comparePair(pair as Pair))
            .dropWhile(result => result === -1)
            .thru(results => results[0] === undefined ? -1 : results[0])
    }

    if (Number.isInteger(left) && Number.isInteger(right)) {
        if (left === right) return -1
        if (left < right) return 1
        return 0
    }

    if (Number.isInteger(left) && Array.isArray(right)) return comparePair([[left], right])
    if (Array.isArray(left) && Number.isInteger(right)) return comparePair([left, [right]])
    if (Array.isArray(left) && right === undefined) return 0
    if (Number.isInteger(left) && right === undefined) return 0
    if (left === undefined && Array.isArray(right)) return 1
    if (left === undefined && Number.isInteger(right)) return 1

    return -1
}

function part1(pairs: Pair[]): number {
    return pairs
        .map(pair => comparePair(pair))
        .reduce((sum, result, idx) => sum += result === 1 ? idx + 1 : 0, 0)
}

function part2(pairs: Pair[]): number {
    let dividerPackets = [[[2]], [[6]]]
    let packets = pairs.flat()
    packets.push(...dividerPackets)
    return packets
        .sort((left, right) => [0, -1].includes(comparePair([right, left])) ? -1 : 1)
        .reduce((sum, packet, idx) => sum *= dividerPackets.includes(packet) ? idx + 1 : 1, 1)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d13.txt'
const inputTestPath1 = './src/inputs/d13-t1.txt'

export function runPart1() {
    console.log(part1(parseInput(inputTestPath1)))
    assert(part1(parseInput(inputTestPath1)) === 13)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    console.log(part2(parseInput(inputTestPath1)))
    assert(part2(parseInput(inputTestPath1)) === 140)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
