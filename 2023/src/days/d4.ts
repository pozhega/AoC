import assert from "assert"
import { EnhancedSet } from "datastructures-js"
import * as fs from "fs"
import { range } from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = [number, number][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [card, numbers] = line.split(":")
      const cardId = Number(card.split("Card")[1].trim())
      const [numbers1, numbers2] = numbers.split("|")
      const numbers1Set = new EnhancedSet(numbers1.trim().replaceAll("  ", " ").split(" ").map(Number))
      const numbers2Set = new EnhancedSet(numbers2.trim().replaceAll("  ", " ").split(" ").map(Number))
      const intersection = numbers1Set.intersect(numbers2Set)
      return [cardId, intersection.size]
    })
}

function part1(data: Data): number {
  return data.map(([_, points]) => (points === 0 ? 0 : 2 ** (points - 1))).reduce((a, b) => a + b)
}

function part2(data: Data): number {
  const counter = new Map<number, number>()
  data.forEach(([card, _]) => counter.set(card, 1))

  data.forEach(([card, points]) => {
    range(1, points + 1).forEach((jump) => {
      counter.set(card + jump, counter.get(card + jump) + counter.get(card))
    })
  })

  return Array.from(counter.values()).reduce((a, b) => a + b)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d4.txt"
const inputTestPath1 = "./src/inputs/d4-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.timeEnd("Time")
  assert(part1(parseInput(inputTestPath1)) === 13)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 30)
  console.timeEnd("Time")

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
