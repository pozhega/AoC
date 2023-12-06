import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = [number, number][]
type Data2 = [number, number]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput1(path: string): Data {
  let times: number[]
  let distances: number[]

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      const [name, values] = line.split(":")
      const numbers = values
        .trim()
        .match(/[0-9]+/g)
        .map(Number)

      if (name.trim() === "Time") {
        times = numbers
      }

      if (name.trim() === "Distance") {
        distances = numbers
      }
    })

  return _.zip(times, distances)
}

function parseInput2(path: string): Data2 {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      return Number(line.trim().split(":")[1].trim().replace(/\s+/g, ""))
    }) as Data2
}

function calcWinnings(time: number, distance: number): number {
  let count = 0
  for (let holdFor = 1; holdFor <= time; holdFor++) {
    const maxDistance = (time - holdFor) * holdFor
    if (maxDistance > distance) {
      count++
      continue
    }

    if (count > 0) {
      return count
    }
  }
}

function part1(data: Data): number {
  return data.map(([time, distance]) => calcWinnings(time, distance)).reduce((a, b) => a * b)
}

function part2(data: Data2): number {
  const [time, distance] = data
  return calcWinnings(time, distance)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d6.txt"
const inputTestPath1 = "./src/inputs/d6-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput1(inputTestPath1)))
  console.timeEnd("Time")
  assert(part1(parseInput1(inputTestPath1)) === 288)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput1(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput2(inputTestPath1)))
  console.timeEnd("Time")
  assert(part2(parseInput2(inputTestPath1)) === 71503)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput2(inputPath)))
  console.timeEnd("Time")
}
