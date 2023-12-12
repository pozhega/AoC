import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Galaxy = [number, number]
type Galaxies = Map<number, [number, number]>
type Data = string[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.trim().split(""))
}

function calcGalaxies(data: Data, bigExpansion = false) {
  const rowExpand = []
  const colExpand = []

  _.range(0, data.length).forEach((x) => {
    if (data[x].every((item) => item === ".")) {
      rowExpand.push(x)
    }
  })

  _.range(0, data[0].length).forEach((y) => {
    const col = _.range(0, data.length).map((x) => data[x][y])
    if (col.every((item) => item === ".")) {
      colExpand.push(y)
    }
  })

  const galaxies = findGalaxies(data)
  const shift = bigExpansion ? 999999 : 1
  let galaxy: Galaxy
  Array.from(galaxies.keys()).forEach((id) => {
    rowExpand.forEach((row, index) => {
      galaxy = galaxies.get(id)
      if (galaxy[0] > row + index * shift) {
        galaxies.set(id, [galaxy[0] + shift, galaxy[1]])
      }
    })

    colExpand.forEach((col, index) => {
      galaxy = galaxies.get(id)
      if (galaxy[1] > col + index * shift) {
        galaxies.set(id, [galaxy[0], galaxy[1] + shift])
      }
    })
  })

  return galaxies
}

function findGalaxies(data: Data) {
  const galaxies = new Map<number, [number, number]>()
  data.forEach((row, x) => {
    row.forEach((item, y) => {
      if (item === "#") {
        galaxies.set(galaxies.size + 1, [x, y])
      }
    })
  })
  return galaxies
}

function calcCombinations(galaxyIds: number[]) {
  return galaxyIds.flatMap((v, i) => galaxyIds.slice(i + 1).map((w) => [v, w]))
}

function calcManhattanDistance(from: Galaxy, to: Galaxy) {
  return Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1])
}

function sumGalaxyDistances(galaxies: Galaxies) {
  const galaxyIds = Array.from(galaxies.keys())
  const galaxyCombinations = calcCombinations(galaxyIds)

  return galaxyCombinations.reduce((sum, path) => {
    const distance = calcManhattanDistance(galaxies.get(path[0]), galaxies.get(path[1]))
    return sum + distance
  }, 0)
}

function part1(data: Data): number {
  const galaxies = calcGalaxies(data)
  return sumGalaxyDistances(galaxies)
}

function part2(data: Data): number {
  const galaxies = calcGalaxies(data, true)
  return sumGalaxyDistances(galaxies)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d11.txt"
const inputTestPath1 = "./src/inputs/d11-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 374)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
