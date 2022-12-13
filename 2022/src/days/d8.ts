import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Map = number[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split('').map(num => parseInt(num)))
}

function part1(horizontalMap: Map): number {
    let mapHeight = horizontalMap.length,
        mapWidth = horizontalMap[0].length,
        verticalMap = horizontalMap.zip(),
        visibleCnt = 0

    horizontalMap.forEach((horizontalLine, row) => {
        horizontalLine.forEach((tree, col) => {
            visibleCnt += Number(
                horizontalLine.slice(0, col).every(lineTree => lineTree < tree) ||
                verticalMap[col].slice(0, row).every(lineTree => lineTree as number < tree) ||
                horizontalLine.slice(col + 1, mapWidth).every(lineTree => lineTree < tree) ||
                verticalMap[col].slice(row + 1, mapHeight).every(lineTree => lineTree as number < tree))
        })
    })

    return visibleCnt
}

function part2(horizontalMap: Map): number {
    let mapHeight = horizontalMap.length,
        mapWidth = horizontalMap[0].length,
        verticalMap = horizontalMap.zip(),
        maxScenicScore = 0

    horizontalMap.forEach((horizontalLine, row) => {
        horizontalLine.forEach((tree, col) => {
            let scenicScore = 1
            scenicScore *= horizontalLine.slice(0, col).reverse().findIndex(lineTree => lineTree >= tree) + 1 || col
            scenicScore *= verticalMap[col].slice(0, row).reverse().findIndex(lineTree => lineTree as number >= tree) + 1 || row
            scenicScore *= horizontalLine.slice(col + 1, mapWidth).findIndex(lineTree => lineTree >= tree) + 1 || mapWidth - col - 1
            scenicScore *= verticalMap[col].slice(row + 1, mapHeight).findIndex(lineTree => lineTree as number >= tree) + 1 || mapWidth - row - 1
            maxScenicScore = Math.max(maxScenicScore, scenicScore)
        })
    })

    return maxScenicScore
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d8.txt'
const inputTestPath1 = './src/inputs/d8-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 21)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 8)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
