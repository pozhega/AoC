import * as fs from 'fs'
import assert from 'assert'
import { match } from 'ts-pattern'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Pos = [number, number]
type Keypad = (string | null)[][]
type Move = 'U' | 'R' | 'D' | 'L'
type Instruction = Move[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(''))
}

function posToCode(keypad: Keypad, [row, col]: Pos): string | null {
    if (row < 0 || col < 0) return null
    let code = keypad.at(row)?.at(col)
    return code ? code : null
}

function codeToPos(keypad: Keypad, code: string): Pos {
    for (let row = 0; row < keypad.length; row++) {
        for (let col = 0; col < keypad[row].length; col++) {
            if (keypad[row][col] === code) return [row, col]
        }
    }

    return [0, 0]
}

function changePos(keypad: Keypad, oldPos: Pos, move: Move): Pos {
    const newPos = match(move)
        .with('U', () => [oldPos[0] - 1, oldPos[1]])
        .with('R', () => [oldPos[0], oldPos[1] + 1])
        .with('D', () => [oldPos[0] + 1, oldPos[1]])
        .with('L', () => [oldPos[0], oldPos[1] - 1])
        .exhaustive() as Pos

    return posToCode(keypad, newPos) ? newPos : oldPos
}

function solve(instructions: Instruction[], keypad: Keypad): string {
    let code: string[] = [],
        pos: Pos = codeToPos(keypad, '5')

    instructions.forEach(instruction => {
        instruction.forEach(move => pos = changePos(keypad, pos, move))
        code.push(posToCode(keypad, pos) as string)
    })

    return code.join('')
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d2.txt'
const INPUT_TEST_PATH = './src/inputs/d2-t1.txt'

const SIMPLE_KEYPAD: Keypad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
]

const COMPLEX_KEYPAD: Keypad = [
    [null, null, '1', null, null],
    [null, '2', '3', '4', null],
    ['5', '6', '7', '8', '9'],
    [null, 'A', 'B', 'C', null],
    [null, null, 'D', null, null]
]

export function runPart1() {
    assert(solve(parseInput(INPUT_TEST_PATH), SIMPLE_KEYPAD) === '1985')

    console.time('Time');
    console.log('Part 1: ', solve(parseInput(INPUT_PATH), SIMPLE_KEYPAD))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(solve(parseInput(INPUT_TEST_PATH), COMPLEX_KEYPAD) === '5DB3')

    console.time('Time');
    console.log('Part 2: ', solve(parseInput(INPUT_PATH), COMPLEX_KEYPAD))
    console.timeEnd('Time');
}
