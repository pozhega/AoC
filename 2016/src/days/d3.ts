import * as fs from 'fs'
import assert from 'assert'
import _ from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Triangle = [number, number, number]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line
            .trimStart()
            .split('  ')
            .map(val => parseInt(val)))
}

function isValidTriangle([a, b, c]: Triangle): boolean {
    return (a + b) > c && (a + c) > b && (b + c) > a
}

function countValidTriangles(triangles: Triangle[]): number {
    return triangles.reduce((count, triangle) =>
        isValidTriangle(triangle) ? count + 1 : count, 0)
}

function invertTriangles(triangles: Triangle[]): Triangle[] {
    return _.chain(
        _.zip(...triangles))
        .flatten()
        .chunk(3)
        .value() as Triangle[]
}

function part1(triangles: Triangle[]): number {
    return countValidTriangles(triangles)
}

function part2(triangles: Triangle[]): number {
    return countValidTriangles(invertTriangles(triangles))
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d3.txt'

export function runPart1() {
    assert(part1([[5, 10, 25]]) === 0)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}

export function runPart2() {
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}
