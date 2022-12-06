import * as fs from 'fs'
import assert from 'assert'

// -----------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------

type Shape1 = 'A' | 'B' | 'C'
type Shape2 = 'X' | 'Y' | 'Z'
type Strategy = [Shape1, Shape2]
type StrategyGuide = Strategy[]
type Outcome = 'win' | 'draw' | 'loss'
type GameRules = Record<Outcome, GameRule>

interface OutcomeRules {
    'X': Outcome;
    'Y': Outcome;
    'Z': Outcome;
}

interface OutcomeScores {
    'win': number;
    'draw': number;
    'loss': number;
}

interface ShapeScores {
    'X': number;
    'Y': number;
    'Z': number;
}

interface GameRule {
    'A': Shape2;
    'B': Shape2;
    'C': Shape2;
}

// -----------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

const parseInput = (path: string): any[] => {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => line.split(' '))
}

const rules: GameRules = {
    'win': { 'A': 'Z', 'B': 'X', 'C': 'Y' },
    'draw': { 'A': 'X', 'B': 'Y', 'C': 'Z' },
    'loss': { 'A': 'Y', 'B': 'Z', 'C': 'X' }
}
const outcomeScores: OutcomeScores = { 'win': 0, 'draw': 3, 'loss': 6 }
const shapeScores: ShapeScores = { 'X': 1, 'Y': 2, 'Z': 3 }
const outcomeRules: OutcomeRules = { 'X': 'win', 'Y': 'draw', 'Z': 'loss' }

const part1 = (strategy: StrategyGuide): number => {
    return strategy.reduce((score, [shape1, shape2]) => {
        score += shapeScores[shape2]
        if (rules['win'][shape1] === shape2) return score += outcomeScores['win']
        if (rules['loss'][shape1] === shape2) return score += outcomeScores['loss']
        return score += outcomeScores['draw']
    }, 0)
}

const part2 = (strategy: StrategyGuide): number => {
    return strategy.reduce((score, [shape1, rule]) => {
        let outcome = outcomeRules[rule]
        let shape2 = rules[outcome][shape1]
        return score += outcomeScores[outcome] + shapeScores[shape2]
    }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

const inputPath = './src/inputs/d2.txt'
const inputTestPath1 = './src/inputs/d2-t1.txt'

export const runPart1 = () => {
    assert(part1(parseInput(inputTestPath1)) === 15)

    console.time('Time');
    console.log('Part 1:', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export const runPart2 = () => {
    assert(part2(parseInput(inputTestPath1)) === 12)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
