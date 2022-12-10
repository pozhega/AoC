import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------

type Rucksack = [string[], string[]]
type Group = [string[], string[], string[]]

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

function parsePart1Input(path: string): any[] {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(val => [
            val.substring(0, val.length / 2).split(''),
            val.substring(val.length / 2).split('')])
}

function parsePart2Input(path: string): any[] {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(val => val.split(''))
        .chunk(3)
}

function isLowerCase(string: string): boolean {
    return string == string.toLowerCase() && string != string.toUpperCase();
}

function getItemPriority(item: string): number {
    let charCode = item.charCodeAt(0)
    return isLowerCase(item) ? charCode - 96 : charCode - 38
}

function part1(rucksacks: Rucksack[]): number {
    return rucksacks.reduce((sum, rucksack) => {
        return sum += getItemPriority(rucksack.intersections()[0])
    }, 0)
}

function part2(groups: Group[]): number {
    return groups.reduce((sum, group) => {
        return sum += getItemPriority(group.intersections()[0])
    }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d3.txt'
const inputTestPath1 = './src/inputs/d3-t1.txt'

export function runPart1() {
    assert(part1(parsePart1Input(inputTestPath1)) === 157)

    console.time('Time');
    console.log('Part 1: ', part1(parsePart1Input(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parsePart2Input(inputTestPath1)) === 70)

    console.time('Time');
    console.log('Part 2: ', part2(parsePart2Input(inputPath)))
    console.timeEnd('Time');
}
