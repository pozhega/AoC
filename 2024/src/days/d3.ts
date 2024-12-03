import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = string[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs.readFileSync(path, "utf-8").trimEnd().split("\n")
}

function part1(data: Data) {
  return data
    .map((line) => line.match(/mul\(\d\d?\d?,\d\d?\d?\)/g))
    .flat()
    .map((line) => line.replace("mul(", "").replace(")", "").split(","))
    .map(([a, b]) => parseInt(a) * parseInt(b))
    .reduce((acc, val) => acc + val, 0)
}

function part2(data: Data) {
  return data
    .map((line) => line.match(/do\(\)|don't\(\)|mul\(\d\d?\d?,\d\d?\d?\)/g))
    .flat()
    .reduce(
      ({ instructions, condition }, candidate) => {
        if (candidate.startsWith("mul") && condition) return { instructions: [...instructions, candidate], condition }
        else if (candidate === "do()") return { instructions, condition: true }
        else if (candidate === "don't()") return { instructions, condition: false }
        return { instructions, condition }
      },
      { instructions: [], condition: true }
    )
    .instructions.map((line) => line.replace("mul(", "").replace(")", "").split(","))
    .map(([a, b]) => parseInt(a) * parseInt(b))
    .reduce((acc, val) => acc + val, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d3.txt"
const inputTestPath1 = "./src/inputs/d3-t1.txt"
const inputTestPath2 = "./src/inputs/d3-t2.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 161)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath2)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath2)) === 48)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
