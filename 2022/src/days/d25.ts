import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { reverse } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = any

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
}

function snafuToNum(snafu: string): number {
    return Array.from(snafu).reverse().reduce((sum, char, idx) => {
        let base = 5 ** idx, factor: number

        if (char === '=') factor = -2
        else if (char === '-') factor = -1
        else factor = parseInt(char)

        return sum += base * factor
    }, 0)
}

function numToSnafu(num: number): string {
    let snafu = []
    let mod = 0
    while (num > 0) {
        console.log(num)

        mod = num % 5
        num = Math.floor(num / 5)

        if (mod === 3) { snafu.push('='); num++ }
        else if (mod === 4) { snafu.push('-'); num++ }
        else snafu.push(mod.toString())
    }

    return reverse(snafu).join('')
}

function part1(data: Data): string {
    let num = data.reduce((sum: number, snafu: string) => sum += snafuToNum(snafu), 0)
    return numToSnafu(num)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d25.txt'
const inputTestPath1 = './src/inputs/d25-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === '2=-1=0')

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}
