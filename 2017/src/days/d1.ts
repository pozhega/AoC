import * as fs from 'fs';
import assert from 'assert';

type Tuple = [number, number];

const parseInput = (path: string): number[] => {
    return fs.readFileSync(path, 'utf-8')
        .split('\n')[0]
        .split('')
        .map(num => parseInt(num))
}

const createTuples = (numbers: number[], shiftFn: Function): Tuple[] => {
    let tuples: Tuple[] = []
    for (let i = 0; i < numbers.length; i++) {
        tuples.push([
            numbers.at(i) as number,
            numbers.at(shiftFn(i)) as number])
    }

    return tuples
}

const sumTuples = (tuples: Tuple[]) => {
    return tuples
        .filter(([num1, num2]) => num1 === num2)
        .reduce((sum, [num1, _]) => sum + num1, 0)
}

const part1 = (numbers: number[]): number => {
    return sumTuples(
        createTuples(
            numbers,
            (i: number) => i - 1))
}

const part2 = (numbers: number[]): number => {
    return sumTuples(
        createTuples(
            numbers,
            (i: number) => (i + numbers.length / 2) % numbers.length))
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d1.txt'

export const runPart1 = () => {
    assert(part1([1, 1, 2, 2]) === 3)

    console.log('Part 1: ', part1(parseInput(inputPath)))
}

export const runPart2 = () => {
    assert(part2([1, 2, 1, 2]) === 6)

    console.log('Part 2: ', part2(parseInput(inputPath)))
}
