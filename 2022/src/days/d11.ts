import * as fs from 'fs'
import assert from 'assert'
import { multiply, range } from 'lodash'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
type Operator = '+' | '*'
type Operand = number
type OperationParams = [Operator, Operand]
type TestParams = [number, number, number]
interface Monkey {
    id: string
    items: number[]
    operator: Operator
    operand: Operand
    testCase: number
    toTrueMonkeyId: number
    toFalseMonkeyId: number
    inspectCnt: number
}

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------
class Monkey implements Monkey {
    constructor(
        id: string,
        items: number[],
        [operator, operand]: OperationParams,
        [testCase, toTrueMonkeyId, toFalseMonkeyId]: TestParams) {
        this.id = id
        this.items = items
        this.operator = operator
        this.operand = operand
        this.testCase = testCase
        this.toTrueMonkeyId = toTrueMonkeyId
        this.toFalseMonkeyId = toFalseMonkeyId
        this.inspectCnt = 0
    }

    inspectItems(monkeys: Monkey[], reduceWorry: Function) {
        this.items.forEach(item => {
            let toTrueMonkey = monkeys[this.toTrueMonkeyId]
            let toFalseMonkey = monkeys[this.toFalseMonkeyId]

            this.inspectCnt++
            item = this.runOperation(item)
            item = reduceWorry(item)
            this.runTest(item, toTrueMonkey, toFalseMonkey)
        })

        this.items = []
    }

    runOperation(item: number): number {
        if (this.operator === '+' && isNaN(this.operand)) item *= 2
        else if (this.operator === '*' && isNaN(this.operand)) item *= item
        else if (this.operator === '+') item += this.operand
        else item *= this.operand

        return item
    }

    runTest(item: number, toTrueMonkey: Monkey, toFalseMonkey: Monkey) {
        if (item % this.testCase === 0) toTrueMonkey.addItem(item)
        else toFalseMonkey.addItem(item)
    }

    addItem(item: number) {
        this.items.push(item)
    }
}

function parseInput(path: string): any[] {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n\n')
        .map((monkeyData, monkeyIdx) => {
            let lines = monkeyData.split('\n')
            let items = lines[1].split(': ')[1].split(', ').map(item => parseInt(item))
            let operationData = lines[2].split('= ')[1].split(' ').slice(1)
            let operator = operationData[0] as Operator
            let operand = parseInt(operationData[1])
            let operationParams: OperationParams = [operator, operand]
            let testCase = parseInt(lines[3].split('by ')[1])
            let toTrueMonkeyId = parseInt(lines[4].split('monkey ')[1])
            let toFalseMonkeyId = parseInt(lines[5].split('monkey ')[1])
            let testParams: TestParams = [testCase, toTrueMonkeyId, toFalseMonkeyId]
            return new Monkey(monkeyIdx.toString(), items, operationParams, testParams)
        })
}

function calcMonkeyBusinessLevel(monkeys: Monkey[]): number {
    return monkeys
        .map(monkey => monkey.inspectCnt)
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce(multiply, 1)
}

function part1(monkeys: Monkey[]): number {
    let reduceWorry = (item: number) => Math.floor(item / 3)

    range(20).forEach(_ => {
        monkeys.forEach(monkey => {
            monkey.inspectItems(monkeys, reduceWorry)
        })
    })

    return calcMonkeyBusinessLevel(monkeys)
}

function part2(monkeys: Monkey[]): number {
    let masterModulo = monkeys.map(monkey => monkey.testCase).reduce(multiply, 1)
    let reduceWorry = (item: number) => item % masterModulo

    range(10000).forEach(_ => {
        monkeys.forEach(monkey => {
            monkey.inspectItems(monkeys, reduceWorry)
        })
    })

    return calcMonkeyBusinessLevel(monkeys)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d11.txt'
const inputTestPath1 = './src/inputs/d11-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 10605)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 2713310158)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
