import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Cube = [number, number, number]
type Grid = Set<string>

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Grid {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(',').map(val => parseInt(val)))
        .reduce((grid, vals) => grid.add(JSON.stringify(vals)), new Set() as Grid)
}

function calcAllSurface(grid: Grid, [x, y, z]: Cube): number {
    let surfaceArea = 0
    if (!grid.has(JSON.stringify([x + 1, y, z]))) surfaceArea++
    if (!grid.has(JSON.stringify([x, y + 1, z]))) surfaceArea++
    if (!grid.has(JSON.stringify([x, y, z + 1]))) surfaceArea++
    if (!grid.has(JSON.stringify([x - 1, y, z]))) surfaceArea++
    if (!grid.has(JSON.stringify([x, y - 1, z]))) surfaceArea++
    if (!grid.has(JSON.stringify([x, y, z - 1]))) surfaceArea++
    return surfaceArea
}

function isExterior(grid: Grid, [x, y, z]: Cube): boolean {
    let hasNeighbour = false
    for (let i = 1; i < 100; i++) if (grid.has(JSON.stringify([x + i, y, z]))) hasNeighbour = true
    if (!hasNeighbour) return true

    hasNeighbour = false
    for (let i = 1; i < 100; i++) if (grid.has(JSON.stringify([x - i, y, z]))) hasNeighbour = true
    if (!hasNeighbour) return true

    hasNeighbour = false
    for (let i = 1; i < 100; i++) if (grid.has(JSON.stringify([x, y + i, z]))) hasNeighbour = true
    if (!hasNeighbour) return true

    hasNeighbour = false
    for (let i = 1; i < 100; i++) if (grid.has(JSON.stringify([x, y - i, z]))) hasNeighbour = true
    if (!hasNeighbour) return true

    hasNeighbour = false
    for (let i = 1; i < 100; i++) if (grid.has(JSON.stringify([x, y, z + i]))) hasNeighbour = true
    if (!hasNeighbour) return true

    hasNeighbour = false
    for (let i = 1; i < 100; i++) if (grid.has(JSON.stringify([x, y, z - i]))) hasNeighbour = true
    if (!hasNeighbour) return true

    return false
}

function calcExternalSurface(grid: Grid, [x, y, z]: Cube): number {
    let surfaceArea = 0
    if (!grid.has(JSON.stringify([x + 1, y, z])) && isExterior(grid, [x + 1, y, z])) surfaceArea++
    if (!grid.has(JSON.stringify([x, y + 1, z])) && isExterior(grid, [x, y + 1, z])) surfaceArea++
    if (!grid.has(JSON.stringify([x, y, z + 1])) && isExterior(grid, [x, y, z + 1])) surfaceArea++
    if (!grid.has(JSON.stringify([x - 1, y, z])) && isExterior(grid, [x - 1, y, z])) surfaceArea++
    if (!grid.has(JSON.stringify([x, y - 1, z])) && isExterior(grid, [x, y - 1, z])) surfaceArea++
    if (!grid.has(JSON.stringify([x, y, z - 1])) && isExterior(grid, [x, y, z - 1])) surfaceArea++
    return surfaceArea
}

function part1(grid: Grid): number {
    return Array
        .from(grid)
        .reduce((surfaceArea, cube) =>
            surfaceArea += calcAllSurface(grid, JSON.parse(cube)), 0)
}

function part2(grid: Grid): number {
    return Array
        .from(grid)
        .reduce((surfaceArea, cube) =>
            surfaceArea += calcExternalSurface(grid, JSON.parse(cube)), 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d18.txt'
const inputTestPath1 = './src/inputs/d18-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 64)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 58)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
