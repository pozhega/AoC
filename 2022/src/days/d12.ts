import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = [number, number]
type HeightMap = number[][]
type StepMap = number[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split('').map(square => {
            if (square === 'S') return 96
            if (square === 'E') return 123
            return square.charCodeAt(0)
        }))
}

function findSquarePoints(heightMap: HeightMap, targetSquare: number): Point[] {
    let points: Point[] = []

    for (let [rowIdx, row] of heightMap.entries()) {
        for (let [colIdx, square] of row.entries()) {
            if (square === targetSquare) points.push([rowIdx, colIdx])
        }
    }

    return points
}

function findValidNeigbours(heightMap: HeightMap, [row, col]: Point): Point[] {
    let square = heightMap[row][col], points: Point[] = []

    if (row - 1 >= 0 && square - heightMap[row - 1][col] < 2) points.push([row - 1, col])
    if (col - 1 >= 0 && square - heightMap[row][col - 1] < 2) points.push([row, col - 1])
    if (row + 1 < heightMap.length && square - heightMap[row + 1][col] < 2) points.push([row + 1, col])
    if (col + 1 < heightMap[0].length && square - heightMap[row][col + 1] < 2) points.push([row, col + 1])

    return points
}

function calcSquareSteps(heightMap: HeightMap, stepMap: StepMap, [row, col]: Point, steps: number = -1): void {
    if (!stepMap[row][col] || steps + 1 < stepMap[row][col]) {
        steps++
        stepMap[row][col] = steps
        findValidNeigbours(heightMap, [row, col]).forEach(point => calcSquareSteps(heightMap, stepMap, point, steps))
    }
}

function part1(heightMap: HeightMap): number {
    let startSquare = 96, endSquare = 123
    let [[startRow, startCol]] = findSquarePoints(heightMap, startSquare)
    let [endPoint] = findSquarePoints(heightMap, endSquare)
    let stepMap: StepMap = Array.from({ length: heightMap.length }, _ => Array(heightMap[0].length))

    calcSquareSteps(heightMap, stepMap, endPoint)

    return stepMap[startRow][startCol]
}

function part2(heightMap: HeightMap): number {
    let aSquare = 97, endSquare = 123
    let [endPoint] = findSquarePoints(heightMap, endSquare)
    let stepMap: StepMap = Array.from({ length: heightMap.length }, _ => Array(heightMap[0].length))

    calcSquareSteps(heightMap, stepMap, endPoint)

    return Math.min(...findSquarePoints(heightMap, aSquare)
        .map(([row, col]) => stepMap[row][col])
        .filter(step => step))
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d12.txt'
const inputTestPath1 = './src/inputs/d12-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 31)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 29)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
