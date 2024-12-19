import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = { patterns: string[]; designes: string[] }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const patterns = []
  const designes = []

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line, i) => {
      if (i === 0) line.split(", ").forEach((x) => patterns.push(x))
      else if (line === "") return
      else designes.push(line)
    })

  return { patterns, designes }
}

function getCombinations(design: string, patterns: string[]) {
  const patternsSet = new Set(patterns)
  const map = new Map<number, number>([[-1, 1]])
  _.range(0, design.length).forEach((position) => {
    let countHistory = 0
    _.range(-1, position).forEach((fromPosition) => {
      const search = design.slice(fromPosition + 1, position + 1)
      if (!patternsSet.has(search)) return
      countHistory += map.get(fromPosition)
    })
    map.set(position, countHistory)
  })

  return map.get(design.length - 1)
}

function part1({ patterns, designes }: Data) {
  const regex = new RegExp(`^(${patterns.join("|")})+$`, "gi")
  return designes.reduce((count, design) => count + Number(Boolean(design.match(regex))), 0)
}

function part2({ patterns, designes }: Data) {
  return designes.reduce((count, design) => count + getCombinations(design, patterns), 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d19.txt"
const inputTestPath1 = "./src/inputs/d19-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 6)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 16)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
