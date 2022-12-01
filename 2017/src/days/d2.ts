import * as fs from 'fs';
import assert from 'assert';

type numberMatrix = number[][]

const parseInput = (path: string): numberMatrix => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(row => row
            .split('\t')
            .map(val => parseInt(val)))
}

const part1 = (spreadsheet: numberMatrix): number => {
    return spreadsheet.reduce((sum, row) => {
        return sum + (Math.max(...row) - Math.min(...row))
    }, 0)
}

const findDividers = (row: number[]): number => {
    for (let i = 0; i < row.length; i++) {
        for (let j = 1; j < row.length; j++) {
            if (row[i] === row[j]) continue
            if (row[i] % row[j] === 0) return row[i] / row[j]
            if (row[j] % row[i] === 0) return row[j] / row[i]
        }
    }

    return 0
}

const part2 = (spreadsheet: numberMatrix): number => {
    return spreadsheet.reduce((sum, row) => {
        return sum + findDividers(row)
    }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d2.txt'
const testInputPath1 = './src/inputs/d2-t1.txt'
const testInputPath2 = './src/inputs/d2-t2.txt'

export const runPart1 = () => {
    assert(part1(parseInput(testInputPath1)) === 18)

    console.log('Part 1: ', part1(parseInput(inputPath)))
}

export const runPart2 = () => {
    assert(part2(parseInput(testInputPath2)) === 9)

    console.log('Part 2: ', part2(parseInput(inputPath)))
}
