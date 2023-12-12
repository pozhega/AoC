import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = number[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) =>
      line
        .trim()
        .split(" ")
        .map((num) => Number(num))
    )
}

function calcNextValue(history: number[], reverse = false) {
  const stack = [history, []]
  while (true) {
    const previous = stack.at(-2)
    const current = stack.at(-1)
    const size = previous.length - 1

    if (current.length === size) {
      if (current.every((num) => num === 0)) {
        break
      }

      stack.push([])
      continue
    }

    current.push(previous[current.length + 1] - previous[current.length])
  }

  stack.reverse()

  return stack.reduce((newValue, history, index) => {
    if (reverse) {
      return stack[index + 1] ? stack[index + 1][0] - newValue : newValue
    }

    return stack[index + 1] ? newValue + stack[index + 1][history.length] : newValue
  }, 0)
}

function part1(data: Data): number {
  return data.reduce((sum, history) => sum + calcNextValue(history), 0)
}

function part2(data: Data): number {
  return data.reduce((sum, history) => sum + calcNextValue(history, true), 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d9.txt"
const inputTestPath1 = "./src/inputs/d9-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 114)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 2)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
