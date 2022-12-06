import * as fs from 'fs'
import assert from 'assert'

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

function parseInput(path: string): string {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')[0]
}

function runSubroutine(signal: string, bufferSize: number): number {
    for (let i = 0; i < signal.length; i++) {
        let uniqueBuffer = new Set(signal.substring(i, i + bufferSize))
        if (uniqueBuffer.size === bufferSize) return i + bufferSize
    }

    return -1
}

function part1(signal: string): number {
    return runSubroutine(signal, 4)
}

function part2(signal: string): number {
    return runSubroutine(signal, 14)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d6.txt'

export function runPart1() {
    assert(part1('mjqjpqmgbljsphdztnvjfqwrcgsmlb') === 7)
    assert(part1('bvwbjplbgvbhsrlpgdmjqwftvncz') === 5)
    assert(part1('nppdvjthqldpwncqszvftbrmjlhg') === 6)
    assert(part1('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg') === 10)
    assert(part1('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw') === 11)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2('mjqjpqmgbljsphdztnvjfqwrcgsmlb') === 19)
    assert(part2('bvwbjplbgvbhsrlpgdmjqwftvncz') === 23)
    assert(part2('nppdvjthqldpwncqszvftbrmjlhg') === 23)
    assert(part2('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg') === 29)
    assert(part2('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw') === 26)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
