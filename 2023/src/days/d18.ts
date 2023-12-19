import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = [number, number]
type Range = [number, number]
type Instruction = { dir: string; distance: number; color: string }
type Data = Instruction[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [dir, distanceRaw, colorRaw] = line.split(" ")
      const distance = Number(distanceRaw)
      const color = colorRaw.replace("(", "").replace(")", "")
      return { dir, distance, color }
    })
}

function mergeRanges(ranges: Range[]) {
  const mergedRanges: Range[] = []
  let currentRange: Range = ranges[0]
  ranges.slice(1).forEach((range) => {
    if (range[0] <= currentRange[1] + 1) {
      currentRange = [currentRange[0], range[1]]
    } else {
      mergedRanges.push(currentRange)
      currentRange = range
    }
  })
  mergedRanges.push(currentRange)
  return mergedRanges
}

function updateMap(map: Map<number, Range[]>, row: number, range: Range) {
  if (!map.has(row)) {
    map.set(row, [range])
    return
  } else {
    map.set(row, [...map.get(row), range])
  }

  map.set(
    row,
    mergeRanges(
      map.get(row).toSorted((a, b) => {
        const diff = a[0] - b[0]
        if (diff === 0) return a[1] - b[1]
        return diff
      })
    )
  )
}

function part1(data: Data) {
  const map = new Map<number, Range[]>()
  let pos: Point = [0, 0]

  data.forEach((instruction) => {
    if (instruction.dir === "R") {
      const endCol = pos[1] + instruction.distance
      const range: Range = [pos[1], endCol]
      updateMap(map, pos[0], range)
      pos = [pos[0], endCol]
    }

    if (instruction.dir === "L") {
      const endCol = pos[1] - instruction.distance
      const range: Range = [endCol, pos[1]]
      updateMap(map, pos[0], range)
      pos = [pos[0], endCol]
    }

    if (instruction.dir === "D") {
      _.range(instruction.distance).forEach((_step) => {
        const range: Range = [pos[1], pos[1]]
        updateMap(map, pos[0], range)
        pos = [pos[0] + 1, pos[1]]
      })
    }

    if (instruction.dir === "U") {
      _.range(instruction.distance).forEach((_step) => {
        const range: Range = [pos[1], pos[1]]
        updateMap(map, pos[0], range)
        pos = [pos[0] - 1, pos[1]]
      })
    }
  })

  let count = 0
  Array.from(map.keys()).forEach((row) => {
    let col = map.get(row)[0][1] + 1
    let inLoop = false
    map.get(row).forEach((range) => {
      if (inLoop) {
        count += Math.abs(range[1] - col) + 1
      } else {
        count += Math.abs(range[1] - range[0]) + 1
      }

      if (range[0] === range[1]) {
        inLoop = !inLoop
      }

      if (map.has(row - 1) && Array.from(map.get(row - 1)).find((r: Range) => r[0] === range[0] && r[1] === range[0])) {
        inLoop = !inLoop
      }

      if (map.has(row - 1) && Array.from(map.get(row - 1)).find((r: Range) => r[0] === range[1] && r[1] === range[1])) {
        inLoop = !inLoop
      }

      col = range[1] + 1
    })
    console.log(count)
  })

  return count
}

function part2(data: Data) {
  const map = new Map<number, Range[]>()
  let pos: Point = [0, 0]

  data.forEach((instruction) => {
    const color = instruction.color.replace("#", "")
    const directionDict = { 0: "R", 1: "D", 2: "L", 3: "U" }
    const directionNum = parseInt(color.slice(-1), 16)
    const direction = directionDict[directionNum]
    const distance = parseInt(color.slice(0, -1), 16)

    if (direction === "R") {
      const endCol = pos[1] + distance
      const range: Range = [pos[1], endCol]
      updateMap(map, pos[0], range)
      pos = [pos[0], endCol]
    }

    if (direction === "L") {
      const endCol = pos[1] - distance
      const range: Range = [endCol, pos[1]]
      updateMap(map, pos[0], range)
      pos = [pos[0], endCol]
    }

    if (direction === "D") {
      _.range(distance).forEach((_step) => {
        const range: Range = [pos[1], pos[1]]
        updateMap(map, pos[0], range)
        pos = [pos[0] + 1, pos[1]]
      })
    }

    if (direction === "U") {
      _.range(distance).forEach((_step) => {
        const range: Range = [pos[1], pos[1]]
        updateMap(map, pos[0], range)
        pos = [pos[0] - 1, pos[1]]
      })
    }
  })

  let count = 0
  Array.from(map.keys()).forEach((row) => {
    let col = map.get(row)[0][1] + 1
    let inLoop = false
    map.get(row).forEach((range) => {
      if (inLoop) {
        count += Math.abs(range[1] - col) + 1
      } else {
        count += Math.abs(range[1] - range[0]) + 1
      }

      if (range[0] === range[1]) {
        inLoop = !inLoop
      }

      if (map.has(row - 1) && Array.from(map.get(row - 1)).find((r: Range) => r[0] === range[0] && r[1] === range[0])) {
        inLoop = !inLoop
      }

      if (map.has(row - 1) && Array.from(map.get(row - 1)).find((r: Range) => r[0] === range[1] && r[1] === range[1])) {
        inLoop = !inLoop
      }

      col = range[1] + 1
    })
  })

  return count
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d18.txt"
const inputTestPath1 = "./src/inputs/d18-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 62)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 952408144115)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
