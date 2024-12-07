import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = { rules: Map<number, number[]>; updates: number[][] }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .reduce(
      ({ rules, updates }, line) => {
        if (line.includes("|")) {
          const [a, b] = line.split("|").map((x) => parseInt(x))
          rules.has(a) ? rules.get(a).push(b) : rules.set(a, [b])
        } else if (line.includes(",")) {
          updates.push(line.split(",").map((x) => parseInt(x)))
        }
        return { rules, updates }
      },
      { rules: new Map<number, number[]>(), updates: [] }
    )
}

function part1({ rules, updates }: Data) {
  return updates
    .map((update) => [update, update.toSorted((a, b) => (rules.get(a)?.includes(b) ? -1 : 1))])
    .filter(([update, sorted]) => update.join("") === sorted.join(""))
    .map(([update, _]) => update[(update.length - 1) / 2])
    .reduce((a, b) => a + b)
}

function part2({ rules, updates }: Data) {
  return updates
    .map((update) => [update, update.toSorted((a, b) => (rules.get(a)?.includes(b) ? -1 : 1))])
    .filter(([update, sorted]) => update.join("") !== sorted.join(""))
    .map(([_, sorted]) => sorted[(sorted.length - 1) / 2])
    .reduce((a, b) => a + b)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d5.txt"
const inputTestPath1 = "./src/inputs/d5-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 143)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 123)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
