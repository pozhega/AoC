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
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split(" "))[0]
}

const cache = new Map<string, number>()
function countRocks(blink: number, stone: string, endBlink: number) {
  if (blink === endBlink) return 1
  if (cache.has(`${stone},${blink}`)) return cache.get(`${stone},${blink}`)

  let result: number
  if (stone === "0") {
    result = countRocks(blink + 1, "1", endBlink)
  } else if (stone.length % 2 === 0) {
    const partOne = Number(stone.slice(0, stone.length / 2)).toString()
    const partTwo = Number(stone.slice(stone.length / 2, stone.length)).toString()
    result = countRocks(blink + 1, partOne, endBlink) + countRocks(blink + 1, partTwo, endBlink)
  } else {
    const number = `${parseInt(stone) * 2024}`
    result = countRocks(blink + 1, number, endBlink)
  }

  cache.set(`${stone},${blink}`, result)
  return result
}

function part1(data: Data) {
  return data.map((stone) => countRocks(0, stone, 25)).reduce((total, count) => total + count)
}

function part2(data: Data) {
  return data.map((stone) => countRocks(0, stone, 75)).reduce((total, count) => total + count)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d11.txt"
const inputTestPath1 = "./src/inputs/d11-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 55312)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
