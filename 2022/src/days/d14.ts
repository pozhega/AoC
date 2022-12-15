import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { range } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Obstacle = '#' | 'o'
type Cave = Map<number, Map<number, Obstacle>>

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Cave {
    let cave: Cave = new Map()

    fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line
            .split(' -> ')
            .map(point => point
                .split(',')
                .map(val => parseInt(val))))
        .forEach(polygon => {
            for (let idx = 1; idx < polygon.length; idx++) {
                let [xFrom, yFrom] = polygon[idx - 1], [xTo, yTo] = polygon[idx]

                if (xFrom === xTo) {
                    range(Math.min(yFrom, yTo), Math.max(yFrom, yTo) + 1).forEach(y => {
                        cave.get(xFrom) ? cave.get(xFrom)?.set(y, '#') : cave.set(xFrom, new Map([[y, '#']]))
                    })
                }
                else {
                    range(Math.min(xFrom, xTo), Math.max(xFrom, xTo) + 1).forEach(x => {
                        cave.get(x) ? cave.get(x)?.set(yFrom, '#') : cave.set(x, new Map([[yFrom, '#']]))
                    })
                }
            }
        })

    return cave
}

function findMaxY(cave: Cave): number {
    let yVals = Array.from(cave.entries())
        .map(entry => Array.from(entry[1].keys()))
        .flat()

    return Math.max(...yVals)
}

function part1(cave: Cave): number {
    let yMax = findMaxY(cave)
    let sandUnits = 0, x = 500, y = 0

    while (y <= yMax) {
        if (!cave.get(x)?.get(y)) y++
        else if (cave.get(x)?.get(y) &&
            cave.get(x - 1)?.get(y) &&
            cave.get(x + 1)?.get(y)) {
            cave.get(x)?.set(y - 1, 'o')
            sandUnits++, x = 500, y = 0
        }
        else if (!cave.get(x - 1)?.get(y)) x--, y++
        else if (!cave.get(x + 1)?.get(y)) x++, y++
        else {
            cave.get(x - 1)?.set(y - 1, 'o')
            sandUnits++, x = 500, y = 0
        }
    }

    return sandUnits
}

function part2(cave: Cave): number {
    let yMax = findMaxY(cave) + 2
    let sandUnits = 0, x = 500, y = 0

    while (!cave.get(500)?.get(0)) {
        if (y === yMax) {
            cave.get(x) ? cave.get(x)?.set(y - 1, 'o') : cave.set(x, new Map([[y - 1, 'o']]))
            sandUnits++, x = 500, y = 0
        }
        else if (!cave.get(x)?.get(y)) y++
        else if (cave.get(x)?.get(y) &&
            cave.get(x - 1)?.get(y) &&
            cave.get(x + 1)?.get(y)) {
            cave.get(x) ? cave.get(x)?.set(y - 1, 'o') : cave.set(x, new Map([[y - 1, 'o']]))
            sandUnits++, x = 500, y = 0
        }
        else if (!cave.get(x - 1)?.get(y)) x--, y++
        else if (!cave.get(x + 1)?.get(y)) x++, y++
        else {
            cave.get(x) ? cave.get(x)?.set(y - 1, 'o') : cave.set(x, new Map([[y - 1, 'o']]))
            sandUnits++, x = 500, y = 0
        }
    }

    return sandUnits
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d14.txt'
const inputTestPath1 = './src/inputs/d14-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 24)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 93)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
