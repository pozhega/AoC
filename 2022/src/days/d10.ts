import * as fs from 'fs'
import assert from 'assert'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type CRT = string[][]
type Instruction = ['noop'] | ['addX', number]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(' '))
        .map(instruction => instruction[1] ? [instruction[0], parseInt(instruction[1])] : instruction)
}

function printCRT(crt: CRT): void {
    crt.forEach(row => console.log(row.join('')))
}

function updateCRT(crt: CRT, cycle: number, x: number): void {
    let row = Math.floor(cycle / 40),
        col = cycle % 40

    if ([x - 1, x, x + 1].includes(col)) crt[row].push('#')
    else crt[row].push('.')
}

function part1(instructions: Instruction[]): number {
    let x = 1,
        cycleLog = [x]

    instructions.forEach(instruction => {
        if (instruction[0] === 'noop') {
            cycleLog.push(x)
        } else {
            cycleLog.push(x, x)
            x += instruction[1]
        }
    })

    return [20, 60, 100, 140, 180, 220].reduce((sum, cycleNum) => {
        return sum += cycleNum * cycleLog[cycleNum]
    }, 0)
}

function part2(instructions: Instruction[]): void {
    let crt: CRT = Array.from({ length: 6 }, e => Array(0)),
        cycle = 0,
        x = 1

    instructions.forEach(instruction => {
        if (instruction[0] === 'noop') {
            updateCRT(crt, cycle, x)
            cycle++
        } else {
            updateCRT(crt, cycle, x)
            cycle++
            updateCRT(crt, cycle, x)
            cycle++
            x += instruction[1]
        }
    })

    printCRT(crt)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d10.txt'
const inputTestPath1 = './src/inputs/d10-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 13140)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
