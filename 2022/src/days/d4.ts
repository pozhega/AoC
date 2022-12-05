import * as fs from 'fs';
import assert from 'assert';

// -----------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------

type ElfSection = [number, number]
type ElfPair = [ElfSection, ElfSection]

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(line => line
            .split(',')
            .map(section => section
                .split('-')
                .map(val => parseInt(val))))
}

function part1(pairs: ElfPair[]): number {
    return pairs.reduce((count, [section1, section2]) => {
        let [s1From, s1To] = section1
        let [s2From, s2To] = section2

        if ((s1From >= s2From && s1To <= s2To) || (s2From >= s1From && s2To <= s1To))
            return count += 1
        return count
    }, 0)
}

function part2(pairs: ElfPair[]): number {
    return pairs.reduce((count, [section1, section2]) => {
        let [s1From, s1To] = section1
        let [s2From, s2To] = section2

        if (!(s1To < s2From || s2To < s1From)) return count += 1
        return count
    }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d4.txt'
const inputTestPath1 = './src/inputs/d4-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 2)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 4)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
