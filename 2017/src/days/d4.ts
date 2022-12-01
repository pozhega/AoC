import * as fs from 'fs';
import assert from 'assert';

type Passphrase = string[]

const parseInput = (path: string): Passphrase[] => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')
        .filter(line => line !== '')
        .map(row => row.split(' '))
}

const part1 = (passphrases: Passphrase[]): number => {
    return passphrases.reduce((count, passphrase) => {
        let uniquePasswords = new Set(passphrase)
        return count + Number(uniquePasswords.size === passphrase.length)
    }, 0)
}

const part2 = (passphrases: Passphrase[]): number => {
    return passphrases.reduce((count, passphrase) => {
        let uniquePasswords = new Set(passphrase.map(
            password => password
                .split('')
                .sort()
                .join('')))
        return count + Number(uniquePasswords.size === passphrase.length)
    }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d4.txt'

export const runPart1 = () => {
    assert(part1([["aa", "bb", "cc", "dd", "ee"]]) === 1)
    assert(part1([["aa", "bb", "cc", "dd", "aa"]]) === 0)
    assert(part1([["aa", "bb", "cc", "dd", "aaa"]]) === 1)

    console.log('Part 1: ', part1(parseInput(inputPath)))
}

export const runPart2 = () => {
    assert(part2([["abcde", "fghij"]]) === 1)
    assert(part2([["abcde", "xyz", "ecdab"]]) === 0)
    assert(part2([["a", "ab", "abc", "abd", "abf", "abj"]]) === 1)
    assert(part2([["iiii", "oiii", "ooii", "oooi", "oooo"]]) === 1)
    assert(part2([["oiii", "ioii", "iioi", "iiio"]]) === 0)

    console.log('Part 2: ', part2(parseInput(inputPath)))
}
