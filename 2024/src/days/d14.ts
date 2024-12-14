import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = number[][][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split(" ").map((x) => x.split("=")[1].split(",").reverse().map(Number)))
}

function printMap(map: Map<string, number>, width: number, height: number) {
  for (let i = 0; i < height; i++) {
    let line = ""
    for (let j = 0; j < width; j++) {
      line += map.get([i, j].toString()) || "."
    }
    console.log(line)
  }
}

function getMap(robots: Data, width: number, height: number, second: number) {
  const map = new Map<string, number>()

  robots.forEach((robot) => {
    let [position, velocity] = robot
    _.range(0, second).forEach((_second) => {
      position = [position[0] + velocity[0], position[1] + velocity[1]]
      if (position[0] < 0) position[0] = position[0] + height
      if (position[0] > height - 1) position[0] = position[0] - height
      if (position[1] < 0) position[1] = position[1] + width
      if (position[1] > width - 1) position[1] = position[1] - width
    })

    map.set(position.toString(), (map.get(position.toString()) || 0) + 1)
  })

  return map
}

function part1(robots: Data, width: number, height: number) {
  const map = getMap(robots, width, height, 100)

  let q1 = 0
  let q2 = 0
  let q3 = 0
  let q4 = 0
  map.keys().forEach((position) => {
    const [x, y] = position.split(",").map(Number)
    if (x < Math.floor(height / 2) && y < Math.floor(width / 2)) q1 += map.get(position)
    else if (x < Math.floor(height / 2) && y > Math.floor(width / 2)) q2 += map.get(position)
    else if (x > Math.floor(height / 2) && y < Math.floor(width / 2)) q3 += map.get(position)
    else if (x > Math.floor(height / 2) && y > Math.floor(width / 2)) q4 += map.get(position)
  })

  return q1 * q2 * q3 * q4
}

function part2(data: Data) {
  const width = 101
  const height = 103

  _.range(23, 8000, 101).forEach((second) => {
    const map = getMap(data, width, height, second)
    printMap(map, width, height)
    console.log("\n\nSecond: ", second)
  })
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d14.txt"
const inputTestPath1 = "./src/inputs/d14-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1), 11, 7))
  assert(part1(parseInput(inputTestPath1), 11, 7) === 12)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath), 101, 103))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
