import * as fs from 'fs'
import assert from 'assert'
import { zip } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------

type Dir = 'R' | 'U' | 'L' | 'R'
type Knot = [number, number]
type Move = [Dir, number]

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(' '))
        .map(([dir, num]) => [dir, parseInt(num)])
}

function updateHead(head: Knot, dir: Dir): void {
    if (dir === 'R') head[0]++
    else if (dir === 'U') head[1]++
    else if (dir === 'L') head[0]--
    else head[1]--
}

function updateTail(head: Knot, tail: Knot): void {
    if (head[0] - tail[0] === 2) {
        tail[0]++
        if (head[1] > tail[1]) tail[1]++
        if (head[1] < tail[1]) tail[1]--
    } else if (head[0] - tail[0] === -2) {
        tail[0]--
        if (head[1] > tail[1]) tail[1]++
        if (head[1] < tail[1]) tail[1]--
    } else if (head[1] - tail[1] === 2) {
        tail[1]++
        if (head[0] > tail[0]) tail[0]++
        if (head[0] < tail[0]) tail[0]--
    } else if (head[1] - tail[1] === -2) {
        tail[1]--
        if (head[0] > tail[0]) tail[0]++
        if (head[0] < tail[0]) tail[0]--
    }
}

function part1(moves: Move[]): number {
    let head: Knot = [0, 0]
    let tail: Knot = [0, 0]
    let tailLog = new Set([[0, 0].toString()])

    moves.forEach(([dir, num]) => {
        for (let i = 0; i < num; i++) {
            updateHead(head, dir)
            updateTail(head, tail)
            tailLog.add(tail.toString())
        }
    })

    return tailLog.size
}

function part2(moves: Move[], knotNum: number): number {
    let knots: Knot[] = Array.from({ length: knotNum }, e => Array(2).fill(0) as Knot)
    let tailLog = new Set([[0, 0].toString()])

    moves.forEach(([dir, num]) => {
        for (let _ = 0; _ < num; _++) {
            updateHead(knots[0], dir)
            for (let i = 1; i < knotNum; i++) updateTail(knots[i - 1], knots[i])
            tailLog.add(knots[knotNum - 1].toString())
        }
    })

    return tailLog.size
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d9.txt'
const inputTestPath1 = './src/inputs/d9-t1.txt'
const inputTestPath2 = './src/inputs/d9-t2.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 13)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1), 10) === 1)
    assert(part2(parseInput(inputTestPath2), 10) === 36)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath), 10))
    console.timeEnd('Time');
}
