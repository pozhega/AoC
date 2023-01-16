import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Pattern = string[]
type Pos = [number, number]
type Stack = Set<string>
type Shape = '-' | '+' | '⅃' | '|' | 'o'

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Pattern {
    return fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')[0]
        .split('')
}

function getStartingShapePos(shape: Shape, stackHeight: number): Pos {
    if (shape === '-') return [2, stackHeight + 4]
    else if (shape === '+') return [3, stackHeight + 6]
    else if (shape === '⅃') return [4, stackHeight + 6]
    else if (shape === '|') return [2, stackHeight + 7]
    else return [2, stackHeight + 5]
}

function pushPos(shape: Shape, shapePos: Pos, push: string) {
    if (push === '<' && (
        (shape === '-' && shapePos[0] > 0) ||
        (shape === '+' && shapePos[0] > 1) ||
        (shape === '⅃' && shapePos[0] > 2) ||
        (shape === '|' && shapePos[0] > 0) ||
        (shape === 'o' && shapePos[0] > 0))) shapePos[0] -= 1
    else if (push === '>' && (
        (shape === '-' && shapePos[0] < 3) ||
        (shape === '+' && shapePos[0] < 5) ||
        (shape === '⅃' && shapePos[0] < 6) ||
        (shape === '|' && shapePos[0] < 6) ||
        (shape === 'o' && shapePos[0] < 5))) shapePos[0] += 1
}

function hasCollision(stack: Stack, shape: Shape, shapePos: Pos): boolean {
    let positions: Pos[] = []

    if (shape === '-') {
        for (let x = 0; x < 4; x++) positions.push([shapePos[0] + x, shapePos[1]])
    }
    else if (shape === '+') {
        for (let y = 0; y < 3; y++) positions.push([shapePos[0], shapePos[1] - y])
        positions.push([shapePos[0] - 1, shapePos[1] - 1])
        positions.push([shapePos[0] + 1, shapePos[1] - 1])
    }
    else if (shape === '⅃') {
        for (let y = 0; y < 3; y++) positions.push([shapePos[0], shapePos[1] - y])
        for (let x = 0; x < 2; x++) positions.push([shapePos[0] - 2 + x, shapePos[1] - 2])
    }
    else if (shape === '|') {
        for (let y = 0; y < 4; y++) positions.push([shapePos[0], shapePos[1] - y])
    }
    else {
        for (let x = 0; x < 2; x++) positions.push([shapePos[0] + x, shapePos[1]])
        for (let x = 0; x < 2; x++) positions.push([shapePos[0] + x, shapePos[1] - 1])
    }

    return positions.some(pos => stack.has(pos.toString()))
}

function stackShape(stack: Stack, shape: Shape, shapePos: Pos): void {
    if (shape === '-') {
        for (let x = 0; x < 4; x++) stack.add([shapePos[0] + x, shapePos[1]].toString())
    }
    else if (shape === '+') {
        for (let y = 0; y < 3; y++) stack.add([shapePos[0], shapePos[1] - y].toString())
        stack.add([shapePos[0] - 1, shapePos[1] - 1].toString())
        stack.add([shapePos[0] + 1, shapePos[1] - 1].toString())
    }
    else if (shape === '⅃') {
        for (let y = 0; y < 3; y++) stack.add([shapePos[0], shapePos[1] - y].toString())
        for (let x = 0; x < 2; x++) stack.add([shapePos[0] - 2 + x, shapePos[1] - 2].toString())
    }
    else if (shape === '|') {
        for (let y = 0; y < 4; y++) stack.add([shapePos[0], shapePos[1] - y].toString())
    }
    else {
        for (let x = 0; x < 2; x++) stack.add([shapePos[0] + x, shapePos[1]].toString())
        for (let x = 0; x < 2; x++) stack.add([shapePos[0] + x, shapePos[1] - 1].toString())
    }
}

function getStackSetting(stack: Stack, stackHeight: number): string {
    let setting = [-1, -1, -1, -1, -1, -1, -1]
    for (let offset = 0; offset < 50; offset++) {
        for (let x = 0; x < 7; x++) {
            if (setting[x] >= 0) continue
            let y = stackHeight - offset
            if (stack.has([x, y].toString())) setting[x] = offset
        }
    }

    return setting.toString()
}

function runSimulation(pattern: Pattern, rocks: number): number {
    let stack: Stack = new Set([
        [0, 0].toString(),
        [1, 0].toString(),
        [2, 0].toString(),
        [3, 0].toString(),
        [4, 0].toString(),
        [5, 0].toString(),
        [6, 0].toString()]),
        seen: Map<string, [number, number]> = new Map(),
        stackHeight = 0,
        pushCnt = 0,
        cycleDetected = false,
        stackHeightCyclesSum
    for (let rockCnt = 0; rockCnt < rocks; rockCnt++) {
        const shape = SHAPES[rockCnt % SHAPES.length]
        let shapePos = getStartingShapePos(shape, stackHeight)
        let stackSetting = getStackSetting(stack, stackHeight)
        let cycleHash = `${stackSetting}-${rockCnt % SHAPES.length}-${pushCnt % pattern.length}`
        if (seen.has(cycleHash) && !cycleDetected) {
            let [seenRockCnt, seenStackHeight] = seen.get(cycleHash) as [number, number]
            let heightDiff = stackHeight - seenStackHeight
            let rockDiff = rockCnt - seenRockCnt
            stackHeightCyclesSum = Math.floor((rocks - rockCnt) / rockDiff) * heightDiff
            rockCnt = rocks - (rocks - rockCnt) % rockDiff - 1
            cycleDetected = true
            continue
        } else if (!cycleDetected) {
            seen.set(cycleHash, [rockCnt, stackHeight])
        }

        while (true) {
            let push = pattern[pushCnt % pattern.length]
            pushPos(shape, shapePos, push)

            if (hasCollision(stack, shape, shapePos)) {
                if (push === '<') shapePos[0] += 1
                else shapePos[0] -= 1
            }

            pushCnt++
            shapePos[1] -= 1

            if (hasCollision(stack, shape, shapePos)) {
                shapePos[1] += 1
                stackShape(stack, shape, shapePos)
                stackHeight = Math.max(stackHeight, shapePos[1])
                break
            }
        }
    }

    return stackHeight + (stackHeightCyclesSum as number)
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const INPUT_PATH = './src/inputs/d17.txt'
const INPUT_TEST_PATH = './src/inputs/d17-t1.txt'
const SHAPES: Shape[] = ['-', '+', '⅃', '|', 'o']

export function runPart1() {
    assert(runSimulation(parseInput(INPUT_TEST_PATH), 2022) === 3068)

    console.time('Time');
    console.log('Part 1: ', runSimulation(parseInput(INPUT_PATH), 2022))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(runSimulation(parseInput(INPUT_TEST_PATH), 1000000000000) === 1514285714288)

    console.time('Time');
    console.log('Part 2: ', runSimulation(parseInput(INPUT_PATH), 1000000000000))
    console.timeEnd('Time');
}
