import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Value = number | Operation
type Operation = [string, Function, string]
type Jobs = Map<string, number | Operation>

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Jobs {
    let jobs = new Map()

    fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => {
            let [monkey, value] = line.split(': ')
            if (!isNaN(parseInt(value))) {
                jobs.set(monkey, parseInt(value))
            } else {
                let [a, operator, b] = value.split(' ')
                let operatorFn: Function

                if (operator === '+') operatorFn = (a: number, b: number) => a + b
                else if (operator === '-') operatorFn = (a: number, b: number) => a - b
                else if (operator === '*') operatorFn = (a: number, b: number) => a * b
                else operatorFn = (a: number, b: number) => a / b

                jobs.set(monkey, [a, operatorFn, b])
            }
        })

    return jobs
}

function getYellNumber(jobs: Jobs, monkey: string): number {
    let value = jobs.get(monkey) as Value
    if (Number.isInteger(value)) return value as number

    let [monkey1, operator, monkey2] = value as Operation
    return operator(getYellNumber(jobs, monkey1), getYellNumber(jobs, monkey2))
}

function part1(jobs: Jobs): number {
    return getYellNumber(jobs, 'root')
}

function part2(jobs: Jobs): number {
    let root = jobs.get('root') as Operation
    let monkeyYell = getYellNumber(jobs, root[2])
    let lo = 0, hi = 100_000_000_000_000, mid = Math.floor((hi + lo) / 2)

    while (lo < hi) {
        mid = Math.floor((lo + hi) / 2)
        jobs.set('humn', mid)
        let humanYell = getYellNumber(jobs, root[0])
        if (humanYell > monkeyYell) lo = mid - 1
        else if (humanYell < monkeyYell) hi = mid + 1
        else return lo
    }

    return -1
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d21.txt'
const inputTestPath1 = './src/inputs/d21-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 152)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    // assert(part2(parseInput(inputTestPath1)) === 301)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
