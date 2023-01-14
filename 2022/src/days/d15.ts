import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { isEqual, range, sum, uniqWith } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Range = [number, number]
type Point = [number, number]
type Data = [Point, Point][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function manhattanDist([x1, y1]: Point, [x2, y2]: Point): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function parseInput(path: string): any {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => {
            let [sensorRaw, beaconRaw] = line.split(': closest beacon is at ')
            let sensor = sensorRaw.split('Sensor at ')[1].split(', ').map(point => parseInt(point.split('=')[1]))
            let beacon = beaconRaw.split(', ').map(point => parseInt(point.split('=')[1]))
            return [sensor, beacon]
        })
}

function getRowRange(sensor: Point, beacon: Point, row: number): Range {
    let rangeDist = manhattanDist(sensor, beacon)
    let rowDist = Math.abs(sensor[1] - row)
    return [sensor[0] - rangeDist + rowDist, sensor[0] + rangeDist - rowDist]
}

function getRowRanges(data: Data, row: number): Range[] {
    return data
        .map(([sensor, beacon]) => getRowRange(sensor, beacon, row))
        .reduce(joinRanges, [])
}

function joinRanges(oldRanges: Range[], range: Range): Range[] {
    let joinedRanges = [] as Range[]

    for (const oldRange of oldRanges) {
        if (range[0] <= range[1]) {
            if (range[0] < oldRange[0] && range[1] > oldRange[1]) continue
            else if (range[1] === oldRange[0]) {
                range[1] = oldRange[1]
                continue
            }
            else if (range[0] === oldRange[1]) {
                range[0] = oldRange[0]
                continue
            }
            else if (range[0] >= oldRange[0] && range[1] <= oldRange[1]) range[0] = Infinity
            else if (range[0] >= oldRange[0] && range[0] < oldRange[1] && range[1] > oldRange[1]) range[0] = oldRange[1] + 1
            else if (range[0] < oldRange[0] && range[1] > oldRange[0] && range[1] <= oldRange[1]) range[1] = oldRange[0] - 1
        }

        if (joinedRanges.length > 0 &&
            joinedRanges[joinedRanges.length - 1][1] === oldRange[0] - 1) {
            joinedRanges[joinedRanges.length - 1][1] = oldRange[1]
        }
        else joinedRanges.push(oldRange)
    }

    if (range[0] <= range[1]) joinedRanges.push(range)

    return joinedRanges.sort((a, b) => a[0] - b[0])
}

function doSumRanges(sum: number, range: Range): number {
    sum += Math.abs(range[1] - range[0]) + 1
    return sum - Number(range[0] < 0 && range[1] > 0)
}

function part1(data: Data, row: number): number {
    return getRowRanges(data, row).reduce(doSumRanges, 0)
}

function part2(data: Data, scope: number): number {
    for (let row = 0; row <= scope; row++) {
        let rowRanges = getRowRanges(data, row)
        let col = 0
        let rowRangeIdx = 0

        if (rowRanges.length === 1 ||
            rowRanges.length === 2 && rowRanges[0][1] === rowRanges[1][0] - 1) continue

        while (col < scope && rowRangeIdx < rowRanges.length) {
            if (col >= rowRanges[rowRangeIdx][0] && col <= rowRanges[rowRangeIdx][1]) col++
            else rowRangeIdx++
        }

        if (col < scope) return col * 4000000 + row
    }

    return -1
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d15.txt'
const inputTestPath1 = './src/inputs/d15-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1), 10) === 26)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath), 2000000))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1), 20) === 56000011)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath), 4000000))
    console.timeEnd('Time');
}
