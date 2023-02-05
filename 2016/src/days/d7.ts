import * as fs from 'fs'
import assert from 'assert'
import _ from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type ABA = [string, string, string]
type Data = any

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => {
            return line.split(']').reduce(([normal, bracket], part) => {
                const split = part.split('[')
                if (split.length === 1) {
                    normal.push(split[0])
                    return [normal, bracket]
                } else {
                    normal.push(split[0])
                    bracket.push(split[1])
                    return [normal, bracket]
                }
            }, [[] as string[], [] as string[]])
        })
}

function checkABBA(chars: string): boolean {
    for (let i = 0; i < chars.length; i++) {
        if (!chars[i + 3]) return false
        const pair1 = [chars[i], chars[i + 1]]
        if (pair1[0] === pair1[1]) continue
        const pair2 = [chars[i + 3], chars[i + 2]]
        if (_.isEqual(pair1, pair2)) return true
    }

    return false
}

function getABACandidates(chars: string): ABA[] {
    let candidates: ABA[] = []
    for (let i = 0; i < chars.length; i++) {
        if (!chars[i + 2]) break
        if (chars[i] === chars[i + 2] && chars[i + 1] !== chars[i]) {
            candidates.push([chars[i], chars[i + 1], chars[i + 2]])
        }
    }

    return candidates
}

function isMatchingABA(normalCandidates: ABA[], bracketCandidates: ABA[]): boolean {
    for (const normalCandidate of normalCandidates) {
        for (const bracketCandidate of bracketCandidates) {
            if (normalCandidate[0] === bracketCandidate[1] &&
                normalCandidate[1] === bracketCandidate[0]) return true
        }
    }

    return false
}

function part1(data: Data): number {
    return data.reduce((count, [normal, bracket]) => {
        if (normal.some(checkABBA) && !bracket.some(checkABBA)) return count + 1
        else return count
    }, 0)
}

function part2(data: Data): number {
    return data.reduce((count, [normal, bracket]) => {
        const normalCandidates = normal.map(chars => getABACandidates(chars)).flat()
        const bracketCandidates = bracket.map(chars => getABACandidates(chars)).flat()
        if (isMatchingABA(normalCandidates, bracketCandidates)) return count + 1
        else return count
    }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d7.txt'
const INPUT_TEST_PATH = './src/inputs/d7-t1.txt'
const INPUT_TEST_PATH_2 = './src/inputs/d7-t2.txt'

export function runPart1() {
    assert(part1(parseInput(INPUT_TEST_PATH)) === 2)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(INPUT_TEST_PATH_2)) === 3)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(INPUT_PATH)))
    console.timeEnd('Time');
}
