import assert from "assert"
import * as fs from "fs"

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
  let isSafe = true,
    generalDir = undefined,
    prev = line.at(0)
  for (const level of line.slice(1)) {
    const diff = level - prev
    const levelDir = [-3, -2, -1].includes(diff) ? -1 : [1, 2, 3].includes(diff) ? 1 : 0

    if (levelDir === 0) isSafe = false
    else if (generalDir === undefined) generalDir = levelDir
    else if (generalDir !== levelDir) isSafe = false

    if (!isSafe) break
    prev = level
  }

  return isSafe
}

function part1(data: Data) {
  return data.map(isLineSafe).filter(Boolean).length
}

function part2(data: Data) {
  let safeCount = 0
  for (const line of data) {
    for (let i = 0; i < line.length; i++) {
      const newLine = line.toSpliced(i, 1)
      if (isLineSafe(newLine)) {
        safeCount++
        break
      }
    }
  }

  return safeCount
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d2.txt"
const inputTestPath1 = "./src/inputs/d2-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 2)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 4)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
