import * as fs from 'fs'
import assert from 'assert'
import { match } from 'ts-pattern'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Dir = 'N' | 'E' | 'S' | 'W'
type Pos = [number, number]
type Rotation = 'R' | 'L'
type Coordinate = [Rotation, number]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')[0]
        .split(', ')
        .map(val => [val[0], parseInt(val.slice(1))])
}

function manhattanDistance([x1, y1]: Pos, [x2, y2]: Pos): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}

function changeDir(dir: Dir, rotation: Rotation): Dir {
    const RIGHT_DIRS = { 'N': 'E', 'E': 'S', 'S': 'W', 'W': 'N' }
    const LEFT_DIRS = { 'N': 'W', 'W': 'S', 'S': 'E', 'E': 'N' }

    return match(rotation)
        .with('R', () => RIGHT_DIRS[dir])
        .with('L', () => LEFT_DIRS[dir])
        .exhaustive() as Dir
}

function makeMove(pos: Pos, dir: Dir, step: number = 1): Pos {
    return match(dir)
        .with('N', () => [pos[0], pos[1] + step])
        .with('E', () => [pos[0] + step, pos[1]])
        .with('S', () => [pos[0], pos[1] - step])
        .with('W', () => [pos[0] - step, pos[1]])
        .exhaustive() as Pos
}

function part1(coordinates: Coordinate[]): number {
    let dir: Dir = 'N',
        pos: Pos = [0, 0]

    coordinates.forEach(([rotation, walk]) => {
        dir = changeDir(dir, rotation)
        pos = makeMove(pos, dir, walk)
    })

    return manhattanDistance([0, 0], pos)
}

function part2(coordinates: Coordinate[]): number {
    let dir: Dir = 'N',
        pos: Pos = [0, 0],
        visited: Set<string> = new Set([pos.toString()])

    for (const [rotation, walk] of coordinates) {
        dir = changeDir(dir, rotation)

        for (let i = 1; i <= walk; i++) {
            pos = makeMove(pos, dir)

            if (visited.has(pos.toString())) {
                return manhattanDistance([0, 0], pos)
            }

            visited.add(pos.toString())
        }
    }

    return -1
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d1.txt'

export function runPart1() {
    assert(part1([['R', 2], ['L', 3]]) === 5)
    assert(part1([['R', 2], ['R', 2], ['R', 2]]) === 2)
    assert(part1([['R', 5], ['L', 5], ['R', 5], ['R', 3]]) === 12)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2([['R', 8], ['R', 4], ['R', 4], ['R', 8]]) === 4)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}
