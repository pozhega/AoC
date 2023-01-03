import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { cloneDeep, range } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Map = string[][]
type Pos = [number, number]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(''))
}

function printMap(map: Map): void {
    map.forEach(row => console.log(row.map(val => val.length > 1 ? val.length : val).join(' ')))
    console.log('\n')
}

function createMapTemplate(map: Map): Map {
    return cloneDeep(map).map(row => row.map(val => ['#', '.'].includes(val) ? val : '.'))
}

function transformMap(map: Map, template: Map, minutes: number = 1): Map {
    let colMax = map[0].length,
        rowMax = map.length,
        tMap: Map

    range(minutes).forEach(_ => {
        tMap = cloneDeep(template)

        for (let row = 1; row < rowMax - 1; row++) {
            for (let col = 1; col < colMax - 1; col++) {
                if (map[row][col] === '.') continue

                [...map[row][col]].forEach(val => {
                    let setRow = row, setCol = col

                    if (val === '<') col === 1 ? setCol = colMax - 2 : setCol--
                    else if (val === '>') col === colMax - 2 ? setCol = 1 : setCol++
                    else if (val === '^') row === 1 ? setRow = rowMax - 2 : setRow--
                    else if (val === 'v') row === rowMax - 2 ? setRow = 1 : setRow++

                    if (tMap[setRow][setCol] !== '.') tMap[setRow][setCol] = tMap[setRow][setCol].concat(val)
                    else tMap[setRow][setCol] = val
                })
            }
        }

        map = tMap
    })

    return map
}

function calcTrip(map: Map, template: Map, startPos: Pos, endPos: Pos): number {
    let queue: Pos[] = [startPos],
        minute = 0
    while (queue.length) {
        let enqueSet: Set<string> = new Set()

        for (const [row, col] of queue) {
            if (row === endPos[0] && col === endPos[1]) return minute
            if (map[row][col] !== '.') continue

            if (row < map.length - 2 || (row + 1 === endPos[0] && col === endPos[1])) enqueSet.add([row + 1, col].toString())
            if (row > 1 || (row - 1 === endPos[0] && col === endPos[1])) enqueSet.add([row - 1, col].toString())
            if (col > 1) enqueSet.add([row, col - 1].toString())
            if (col < map[0].length - 2) enqueSet.add([row, col + 1].toString())
            enqueSet.add([row, col].toString())
        }

        queue = Array.from(enqueSet).map(pos => pos.split(',').map(val => parseInt(val)) as Pos)
        map = transformMap(map, template)
        minute++
    }

    return minute
}

function part1(map: Map): number {
    let startPos: Pos = [0, map[0].findIndex(val => val === '.')],
        endPos: Pos = [map.length - 1, map.at(-1)?.findIndex(val => val === '.') as number],
        template = createMapTemplate(map)

    return calcTrip(map, template, startPos, endPos)
}

function part2(map: Map): number {
    let startPos: Pos = [0, map[0].findIndex(val => val === '.')],
        endPos: Pos = [map.length - 1, map.at(-1)?.findIndex(val => val === '.') as number],
        template = createMapTemplate(map)

    let trip1 = calcTrip(map, template, startPos, endPos)
    let trip2 = calcTrip(transformMap(map, template, trip1), template, endPos, startPos)
    let trip3 = calcTrip(transformMap(map, template, trip1 + trip2), template, startPos, endPos)

    return trip1 + trip2 + trip3
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d24.txt'
const inputTestPath1 = './src/inputs/d24-t1.txt'

export function runPart1() {
    console.log(part1(parseInput(inputTestPath1)))
    assert(part1(parseInput(inputTestPath1)) === 18)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    console.log(part2(parseInput(inputTestPath1)))
    assert(part2(parseInput(inputTestPath1)) === 54)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
