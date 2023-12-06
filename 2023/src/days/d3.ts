import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = { id: number; type: "number" | "symbol" | "space"; value: number | string; groupValue: number }
type Data = Point[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
  let numId = 0

  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const numbers = line.match(/[0-9]+/g)
      let currentNumberIdx = -1
      let parsingNumber = false
      return Array.from(line.trim()).map((char) => {
        if (char === ".") {
          if (parsingNumber) {
            parsingNumber = false
          }
          return { type: "space" }
        }

        if (!isNaN(Number(char))) {
          if (!parsingNumber) {
            parsingNumber = true
            currentNumberIdx++
            numId++
          }

          return {
            type: "number",
            id: numId,
            value: Number(char),
            groupValue: Number(numbers[currentNumberIdx])
          }
        }

        if (parsingNumber) {
          parsingNumber = false
        }
        return { type: "symbol", value: char }
      })
    })
}

function getAdjacentValues(matrix: Data, x: number, y: number): Point[] {
  const adjacentValues: Point[] = []
  const rows = matrix.length
  const cols = matrix[0].length

  const isValidPosition = (i: number, j: number) => {
    return i >= 0 && i < rows && j >= 0 && j < cols
  }

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ]

  for (const [dx, dy] of directions) {
    const newX = x + dx
    const newY = y + dy
    if (isValidPosition(newX, newY)) {
      adjacentValues.push(matrix[newX][newY])
    }
  }

  return adjacentValues
}

function part1(data: Data): number {
  const validNumbers: number[] = []

  data.forEach((row, x) => {
    row.forEach((point, y) => {
      if (point.type === "symbol") {
        _.chain(getAdjacentValues(data, x, y))
          .filter((adjacentPoint) => adjacentPoint.type === "number")
          .uniqBy("id")
          .forEach((adjacentNumPoint) => validNumbers.push(adjacentNumPoint.groupValue))
          .value()
      }
    })
  })

  return validNumbers.reduce((a, b) => a + b)
}

function part2(data: Data): number {
  const gears: number[] = []

  data.forEach((row, x) => {
    row.forEach((point, y) => {
      if (point.type === "symbol" && point.value === "*") {
        const adjacentNumPoints = _.chain(getAdjacentValues(data, x, y))
          .filter((adjacentPoint) => adjacentPoint.type === "number")
          .uniqBy("id")
          .value()

        if (adjacentNumPoints.length === 2) {
          gears.push(adjacentNumPoints[0].groupValue * adjacentNumPoints[1].groupValue)
        }
      }
    })
  })

  return gears.reduce((a, b) => a + b)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d3.txt"
const inputTestPath1 = "./src/inputs/d3-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.timeEnd("Time")
  assert(part1(parseInput(inputTestPath1)) === 4361)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 467835)
  console.timeEnd("Time")

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
