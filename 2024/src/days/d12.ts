import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = any

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs.readFileSync(path, "utf-8").trimEnd().split("\n")
}

function part1(data: Data) {
  return 0
}

function part2(data: Data) {
  return 0
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d12.txt"
const inputTestPath1 = "./src/inputs/d12-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === undefined)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === undefined)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
