import * as fs from 'fs'
import assert from 'assert'
import { range } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Dir = 'R' | 'U' | 'L' | 'D'
type Knot = [number, number]
type Move = [Dir, number]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(' '))
        .map(([dir, num]) => [dir, parseInt(num)])
}

function moveHead([headX, headY]: Knot, dir: Dir): Knot {
    headX += Number(dir === 'R') - Number(dir === 'L')
    headY += Number(dir === 'U') - Number(dir === 'D')
    return [headX, headY]
}

function followHead([headX, headY]: Knot, [tailX, tailY]: Knot): Knot {
    if (Math.abs(headX - tailX) > 1 || Math.abs(headY - tailY) > 1) {
        tailY += Number(headY > tailY) - Number(headY < tailY)
        tailX += Number(headX > tailX) - Number(headX < tailX)
    }

    return [tailX, tailY]
}

function part1(moves: Move[]): number {
    let head: Knot = [0, 0]
    let tail: Knot = [0, 0]
    let tailLog = new Set([[0, 0].toString()])

    moves.forEach(([dir, num]) => {
        range(num).forEach(_ => {
            head = moveHead(head, dir)
            tail = followHead(head, tail)
            tailLog.add(tail.toString())
        })
    })

    return tailLog.size
}

function part2(moves: Move[], knotNum: number): number {
    let knots: Knot[] = Array.from({ length: knotNum }, e => Array(2).fill(0) as Knot)
    let tailLog = new Set([[0, 0].toString()])

    moves.forEach(([dir, num]) => {
        range(num).forEach(_ => {
            knots[0] = moveHead(knots[0], dir)
            range(knotNum).slice(1).forEach(i => knots[i] = followHead(knots[i - 1], knots[i]))
            tailLog.add(knots[knotNum - 1].toString())
        })
    })

    return tailLog.size
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

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
