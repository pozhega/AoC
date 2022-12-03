import * as fs from 'fs';
import assert from 'assert';
import { chunk, intersection } from 'lodash';

// -----------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------

type Rucksack = [string[], string[]]
type Group = [string[], string[], string[]]

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

const parsePart1Input = (path: string): any[] => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(val => [
            val.substring(0, val.length / 2).split(''),
            val.substring(val.length / 2).split('')])
}

const parsePart2Input = (path: string): any[] => {
    return chunk(fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(val => val.split('')), 3)
}

const isLowerCase = (string: string): boolean => {
    return string == string.toLowerCase() && string != string.toUpperCase();
}

const getItemPriority = (item: string): number => {
    let charCode = item.charCodeAt(0)
    return isLowerCase(item) ? charCode - 96 : charCode - 38
}

const part1 = (rucksacks: Rucksack[]): number => {
    return rucksacks.reduce((sum, rucksack) =>
        sum += getItemPriority(intersection(...rucksack)[0]), 0)
}

const part2 = (groups: Group[]): number => {
    return groups.reduce((sum, group) =>
        sum += getItemPriority(intersection(...group)[0]), 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d3.txt'
const inputTestPath1 = './src/inputs/d3-t1.txt'

export const runPart1 = () => {
    assert(part1(parsePart1Input(inputTestPath1)) === 157)

    console.time('Time');
    console.log('Part 1: ', part1(parsePart1Input(inputPath)))
    console.timeEnd('Time');
}

export const runPart2 = () => {
    assert(part2(parsePart2Input(inputTestPath1)) === 70)

    console.time('Time');
    console.log('Part 2: ', part2(parsePart2Input(inputPath)))
    console.timeEnd('Time');
}
