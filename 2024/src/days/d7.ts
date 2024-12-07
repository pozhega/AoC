import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Equation = { result: number; operands: number[] }
type Data = Equation[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [resultRaw, operandsRaw] = line.split(": ")
      const result = parseInt(resultRaw)
      const operands = operandsRaw.split(" ").map((operand) => parseInt(operand))
      return { result, operands }
    })
}

function canEvaluate({ result, operands, concat }: Equation & { concat?: boolean }) {
  let results = new Set([operands[0]])
  operands.slice(1).forEach((operand) => {
    const operatorResults = new Set<number>()
    results.forEach((value) => {
      operatorResults.add(value + operand)
      operatorResults.add(value * operand)
      if (concat) operatorResults.add(Number(`${value}${operand}`))
    })
    results = operatorResults
  })

  return results.has(result)
}

function part1(data: Data) {
  return data.filter(canEvaluate).reduce((sum, { result }) => sum + result, 0)
}

function part2(data: Data) {
  // prettier-ignore
  return data
    .map((equation) => { return { ...equation, concat: true } })
    .filter(canEvaluate)
    .reduce((sum, { result }) => sum + result, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d7.txt"
const inputTestPath1 = "./src/inputs/d7-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 3749)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 11387)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
