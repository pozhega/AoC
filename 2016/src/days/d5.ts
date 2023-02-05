import * as fs from 'fs'
import assert from 'assert'
import md5 from 'crypto-js/md5'
// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = any

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): string {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')[0]
}

function part1(id: string): string {
    let password: string[] = []

    let i = 2000000
    while (password.length < 8) {
        const hash = md5(`${id}${i}`).toString()
        const trailing = hash.slice(0, 5)
        if (trailing === '00000') {
            password.push(hash[5])
        }
        i++
    }

    return password.join('')
}

function part2(id: string): string {
    let passwordCnt = 0,
        password: string[] = ['', '', '', '', '', '', '', '']

    let i = 2000000
    while (passwordCnt < 8) {
        const hash = md5(`${id}${i}`).toString()
        const trailing = hash.slice(0, 5)
        if (trailing === '00000') {
            const position = Number(hash[5])
            if (position > -1 && position < 8 && password[position] === '') {
                password[position] = hash[6]
                passwordCnt++
            }
        }
        i++
    }

    return password.join('')
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d5.txt'
const INPUT_TEST_PATH = './src/inputs/d5-t1.txt'

export function runPart1() {
    assert(part1(parseInput(INPUT_TEST_PATH)) === '18f47a30')

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(INPUT_TEST_PATH)) === '05ace8e3')

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}
