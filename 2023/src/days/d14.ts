import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

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

function transposeRight(map: string[][]) {
  const rows = map.length
  const cols = map[0].length
  let transposed: string[][] = []

  for (let col = cols - 1; col >= 0; col--) {
    let newRow: string[] = []
    for (let row = 0; row < rows; row++) {
      newRow.push(map[row][col])
    }
    transposed.push(newRow)
  }

  return transposed
}

function tiltNorth(map: Data) {
  const newMap = _.cloneDeep(map)

  map.forEach((row, x) => {
    row.forEach((col, y) => {
      if (col === "O") {
        newMap[x][y] = "."
      }
    })
  })

  map.forEach((row, x) => {
    row.forEach((item, y) => {
      if (item === "O") {
        let i = x - 1
        while (true) {
          if (i < 0 || map[i][y] === "#" || newMap[i][y] === "O") {
            newMap[i + 1][y] = "O"
            break
          }
          i--
        }
      }
    })
  })

  return newMap
}

function tiltEast(map: Data) {
  map = transposeRight(map)
  map = tiltNorth(map)
  map = transposeRight(map)
  map = transposeRight(map)
  map = transposeRight(map)
  return map
}

function tiltWest(map: Data) {
  map = transposeRight(map)
  map = transposeRight(map)
  map = transposeRight(map)
  map = tiltNorth(map)
  map = transposeRight(map)
  return map
}

function tiltSouth(map: Data) {
  map = transposeRight(map)
  map = transposeRight(map)
  map = tiltNorth(map)
  map = transposeRight(map)
  map = transposeRight(map)
  return map
}

function runCylce(map: Data) {
  map = tiltNorth(map)
  map = tiltWest(map)
  map = tiltSouth(map)
  map = tiltEast(map)
  return map
}

function calcLoad(map: Data) {
  return map.reduce((result, row, index) => {
    const factor = map.length - index
    const rowScore = row.filter((item) => item === "O").length * factor
    return result + rowScore
  }, 0)
}

function part1(data: Data): number {
  const map = tiltNorth(data)
  return calcLoad(map)
}

function part2(data: Data): number {
  let map = data
  let i = 1
  let loopDetected = false
  let cache = new Map()
  while (i <= 1000000000) {
    map = runCylce(map)

    if (!loopDetected) {
      const hash = map.flat(2).join("")
      if (cache.has(hash)) {
        loopDetected = true
        const loopSize = i - cache.get(hash)
        const loopCount = Math.floor((1000000000 - i) / loopSize)
        i = i + loopSize * loopCount + 1
        continue
      }
      cache.set(hash, i)
    }

    i++
  }

  return calcLoad(map)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d14.txt"
const inputTestPath1 = "./src/inputs/d14-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 136)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 64)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
