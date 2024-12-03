import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = number[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split(" ").map((level) => parseInt(level)))
}

function isLineSafe(line: number[]) {
  const diffs = new Set(line.map((level, i) => line[i + 1] - level).slice(0, -1))
  return diffs.isSubsetOf(new Set([1, 2, 3])) || diffs.isSubsetOf(new Set([-1, -2, -3]))
}

function part1(data: Data) {
  // prettier-ignore
  return data
    .map(isLineSafe)
    .filter(Boolean)
    .length
}

function part2(data: Data) {
  // prettier-ignore
  return data
    .map((line) => _.range(0, line.length).some((i) => isLineSafe(line.toSpliced(i, 1))))
    .filter(Boolean)
    .length
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d2.txt"
const inputTestPath1 = "./src/inputs/d2-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 2)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 4)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
