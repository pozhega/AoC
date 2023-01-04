import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { range } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Scan = Set<string>
type Pos = string

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Scan {
    let scan: Scan = new Set()

    fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(''))
        .forEach((line, row) => {
            line.forEach((val, col) => {
                if (val === '#') scan.add([row, col].toString())
            })
        })

    return scan
}

function arrayRotate(arr: any[], n: number) {
    range(n).forEach(_ => arr.push(arr.shift()))
    return arr;
}

function makeProposal(scan: Scan, pos: Pos, round: number): Pos | null {
    let [row, col] = pos.split(',').map(val => parseInt(val)),
        noNeighbours: string[] = []

    if (!scan.has([row + 1, col].toString())) noNeighbours.push('S')
    if (!scan.has([row - 1, col].toString())) noNeighbours.push('N')
    if (!scan.has([row, col + 1].toString())) noNeighbours.push('E')
    if (!scan.has([row, col - 1].toString())) noNeighbours.push('W')
    if (!scan.has([row + 1, col + 1].toString())) noNeighbours.push('SE')
    if (!scan.has([row + 1, col - 1].toString())) noNeighbours.push('SW')
    if (!scan.has([row - 1, col + 1].toString())) noNeighbours.push('NE')
    if (!scan.has([row - 1, col - 1].toString())) noNeighbours.push('NW')

    let directions = arrayRotate([
        [['N', 'NE', 'NW'], (row: number, col: number) => [row - 1, col].toString()],
        [['S', 'SE', 'SW'], (row: number, col: number) => [row + 1, col].toString()],
        [['W', 'NW', 'SW'], (row: number, col: number) => [row, col - 1].toString()],
        [['E', 'NE', 'SE'], (row: number, col: number) => [row, col + 1].toString()]], round % 4)

    if (noNeighbours.length === 8) return null
    else if (directions[0][0].every((dir: string) => noNeighbours.includes(dir))) return directions[0][1](row, col)
    else if (directions[1][0].every((dir: string) => noNeighbours.includes(dir))) return directions[1][1](row, col)
    else if (directions[2][0].every((dir: string) => noNeighbours.includes(dir))) return directions[2][1](row, col)
    else if (directions[3][0].every((dir: string) => noNeighbours.includes(dir))) return directions[3][1](row, col)
    return null
}

function countEmpty(scan: Scan): number {
    let minCol, maxCol, minRow, maxRow, count = 0

    for (let pos of scan.values()) {
        let [row, col] = pos.split(',').map(val => parseInt(val))
        if (minCol === undefined || col < minCol) minCol = col
        if (maxCol === undefined || col > maxCol) maxCol = col
        if (minRow === undefined || row < minRow) minRow = row
        if (maxRow === undefined || row > maxRow) maxRow = row
    }

    for (let row = minRow as number; row <= (maxRow as number); row++) {
        for (let col = minCol as number; col <= (maxCol as number); col++) {
            if (!scan.has([row, col].toString())) count++
        }
    }

    return count
}

function part1(scan: Scan): number {
    range(10).forEach(round => {
        let proposals = new Map()

        for (let pos of scan.values()) {
            let proposal = makeProposal(scan, pos, round)
            if (!proposal) continue
            let existingProposal = proposals.get(proposal)
            if (existingProposal) existingProposal.push(pos)
            else proposals.set(proposal, [pos])
        }

        for (let [pos, vals] of proposals) {
            if (vals.length > 1) continue
            scan.delete(vals[0])
            scan.add(pos)
        }
    })

    return countEmpty(scan)
}

function part2(scan: Scan): number {
    let round = 0
    while (true) {
        let proposals = new Map()

        for (let pos of scan.values()) {
            let proposal = makeProposal(scan, pos, round)
            if (!proposal) continue
            let existingProposal = proposals.get(proposal)
            if (existingProposal) existingProposal.push(pos)
            else proposals.set(proposal, [pos])
        }

        if (!proposals.size) return round + 1

        for (let [pos, vals] of proposals) {
            if (vals.length > 1) continue
            scan.delete(vals[0])
            scan.add(pos)
        }

        round += 1
    }
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d23.txt'
const inputTestPath1 = './src/inputs/d23-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 110)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 20)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
