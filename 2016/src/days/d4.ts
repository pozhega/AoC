import * as fs from 'fs'
import assert from 'assert'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type LetterGroups = string[]
type Room = [LetterGroups, number, string]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => {
            const [left, right] = line.split('[')
            const letters = left.split('-').slice(0, -1).flat()
            const sectorId = parseInt(left.split('-').at(-1) as string)
            const checksum = right.slice(0, -1)
            return [letters, sectorId, checksum]
        })
}

function calcFreqDist(letters: string): Map<string, number> {
    return [...letters].reduce((freqDist, letter) => {
        if (freqDist.has(letter)) {
            freqDist.set(letter, freqDist.get(letter) as number + 1)
        } else {
            freqDist.set(letter, 1)
        }

        return freqDist
    }, new Map() as Map<string, number>)
}

function calcChecksum(letterGroups: string[]): string {
    const letters = letterGroups.join('')
    const freqDist = calcFreqDist(letters)

    return Array
        .from(freqDist)
        .sort((a, b) => b[1] - a[1] || a[0].charCodeAt(0) - b[0].charCodeAt(0))
        .slice(0, 5)
        .map(([letter, _]) => letter)
        .join('')
}

function isRealRoom([letterGroups, _, checksum]: Room): boolean {
    return calcChecksum(letterGroups) === checksum
}

function cesarShift(letter: String, shift: number): string {
    let shiftedCode = Number(letter.charCodeAt(0)) + (shift % 26)

    if (shiftedCode > 'z'.charCodeAt(0)) {
        shiftedCode -= 26
    }

    return String.fromCharCode(shiftedCode)
}

function decypherLetters([letterGroups, id, checksum]: Room): Room {
    letterGroups = letterGroups
        .map(letterGroup => [...letterGroup]
            .map(letter => cesarShift(letter, id))
            .join(''))

    return [letterGroups, id, checksum]
}

function part1(rooms: Room[]): number {
    return rooms
        .filter(room => isRealRoom(room))
        .reduce((sum, [, id,]) => sum + id, 0)
}

function part2(rooms: Room[]): number {
    return rooms
        .filter(room => isRealRoom(room))
        .map(room => decypherLetters(room))
        .filter(([letters,]) => letters.join(' ') === 'northpole object storage')
        .map(([, id,]) => id)
        .at(0) as number
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d4.txt'
const INPUT_TEST_PATH = './src/inputs/d4-t1.txt'

export function runPart1() {
    assert(part1(parseInput(INPUT_TEST_PATH)) === 1514)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}

export function runPart2() {
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}
