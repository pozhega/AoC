import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { isEqual, range, uniqWith } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Range = [string, number, number]
type Point = [number, number]
type Tunnels = Map<number, Range[]>

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function manhattanDist([x1, y1]: Point, [x2, y2]: Point): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function evalRange(range: Range, val: number): boolean {
    if (val >= range[1] && val <= range[2]) return true
    if (val === range[1] - 1 && range[0] === '#') { range[1] -= 1; return true }
    if (val === range[2] + 1 && range[0] === '#') { range[2] += 1; return true }
    return false
}

function parseInput(path: string): Tunnels {
    let tunnels: Tunnels = new Map()

    fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .forEach(line => {
            let [sensorRaw, beaconRaw] = line.split(': closest beacon is at ')
            let sensor = sensorRaw.split('Sensor at ')[1].split(', ').map(point => parseInt(point.split('=')[1]))
            let beacon = beaconRaw.split(', ').map(point => parseInt(point.split('=')[1]))
            let distance = manhattanDist(sensor as Point, beacon as Point)
            tunnels.get(sensor[1]) ? tunnels.get(sensor[1])?.push(['S', sensor[0], sensor[0]]) : tunnels.set(sensor[1], [['S', sensor[0], sensor[0]]])
            tunnels.get(beacon[1]) ? tunnels.get(beacon[1])?.push(['B', beacon[0], beacon[0]]) : tunnels.set(beacon[1], [['B', beacon[0], beacon[0]]])

            console.log(sensor)

            range(distance).forEach(offsetY => {
                let offsetX = distance - offsetY
                range(sensor[0] - offsetX, sensor[0] + offsetX + 1).forEach(x => {
                    let inRange;

                    inRange = false
                    if (!tunnels.get(sensor[1] + offsetY)) tunnels.set(sensor[1] + offsetY, [])
                    for (const range of tunnels.get(sensor[1] + offsetY) as Range[]) {
                        if (evalRange(range, x)) {
                            inRange = true
                            break
                        }
                    }
                    if (!inRange) tunnels.get(sensor[1] + offsetY)?.push(['#', x, x])
                    //tunnels.get(sensor[1] + offsetY)?.sort((a, b) => b[1] - a[1])

                    if (offsetY > 0) {
                        inRange = false
                        if (!tunnels.get(sensor[1] - offsetY)) tunnels.set(sensor[1] - offsetY, [])
                        for (const range of tunnels.get(sensor[1] - offsetY) as Range[]) {
                            if (evalRange(range, x)) {
                                inRange = true
                                break
                            }
                        }
                        if (!inRange) tunnels.get(sensor[1] - offsetY)?.push(['#', x, x])
                        //tunnels.get(sensor[1] - offsetY)?.sort((a, b) => b[1] - a[1])
                    }
                })
            })
        })

    return tunnels
}

function part1(tunnels: Tunnels, row: number): number {
    console.log(tunnels.get(row)?.uniqWith(isEqual))
    return tunnels.get(row)?.uniqWith(isEqual)
        .reduce((sum, range) => {
            return sum += Math.abs(range[2] - range[1] + 1)
        }, 0) as number
}

function part2(tunnels: Tunnels): number {
    return 0
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d15.txt'
const inputTestPath1 = './src/inputs/d15-t1.txt'

export function runPart1() {
    // console.log(part1(parseInput(inputTestPath1), 10))
    // assert(part1(parseInput(inputTestPath1), 10) === 26)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath), 2000000))
    console.timeEnd('Time');
}

export function runPart2() {
    console.log(part2(parseInput(inputTestPath1)))
    assert(part2(parseInput(inputTestPath1)) === 0)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
