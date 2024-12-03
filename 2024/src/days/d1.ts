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
  const left: number[] = []
  const right: number[] = []

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      line
        .split("   ")
        .map((n) => parseInt(n))
        .forEach((n, i) => (i === 0 ? left : right).push(n))
    })

  return [left, right]
}

function part1(data: Data) {
  const left = data[0].toSorted()
  const right = data[1].toSorted()
  return left.reduce((acc, curr, idx) => (acc += Math.abs(curr - right[idx])), 0)
}

function part2(data: Data) {
  const [left, right] = data
  const rightFreq = _.countBy(right)
  return left.reduce((acc, curr) => (acc += curr * (rightFreq[curr] || 0)), 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d1.txt"
const inputTestPath1 = "./src/inputs/d1-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 11)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 31)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
