import * as fs from 'fs';
import assert from 'assert';

type Memory = number[]
type History = Map<string, number>

const parseInput = (path: string): any[] => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')[0]
        .split('\t')
        .map(val => parseInt(val))
}

const findMaxBlockIdx = (memory: Memory): number => {
    let maxIndex = 0
    memory.forEach((val, index) => { if (val > memory[maxIndex]) maxIndex = index })
    return maxIndex
}

const runCycles = (memory: Memory): [Memory, History, number] => {
    let history: History = new Map(),
        currentIdx,
        reallocationCnt,
        cycleCnt = 0
    while (!history.has(memory.toString())) {
        history.set(memory.toString(), cycleCnt)
        currentIdx = findMaxBlockIdx(memory)
        reallocationCnt = memory[currentIdx]
        memory[currentIdx] = 0
        for (let i = 0; i < reallocationCnt; i++) {
            currentIdx = (currentIdx + 1) % memory.length
            memory[currentIdx]++
        }
        cycleCnt++
    }

    return [memory, history, cycleCnt]
}

const part1 = (memory: Memory): number => {
    let cycleCnt: number
    [, , cycleCnt] = runCycles(memory)
    return cycleCnt
}

const part2 = (memory: Memory): number => {
    let history: History, cycleCnt: number
    [memory, history, cycleCnt] = runCycles(memory)
    return cycleCnt - (history.get(memory.toString()) || 0)
}


// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d6.txt'
const inputTestPath = './src/inputs/d6-t1.txt'

export const runPart1 = () => {
    assert(part1(parseInput(inputTestPath)) === 5)

    console.log('Part 1: ', part1(parseInput(inputPath)))
}

export const runPart2 = () => {
    assert(part2(parseInput(inputTestPath)) === 4)

    console.log('Part 2: ', part2(parseInput(inputPath)))
}
