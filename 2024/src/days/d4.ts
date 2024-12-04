import { EnhancedSet } from "@datastructures-js/set"
import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = string[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs.readFileSync(path, "utf-8").trimEnd().split("\n")
}

function countXMAS(matrix: string[][]) {
  return matrix.map((row) => row.join("").match(/(?=XMAS|SAMX)/g)?.length ?? 0).reduce((sum, val) => sum + val, 0)
}

function findA(matrix: string[][][]) {
  const regex = /M(A)S|S(A)M/g

  return matrix.flatMap((line) => {
    const diagonal = line.map((cell) => cell[1] || " ").join("")
    const indexes = []
    let match: RegExpExecArray | null
    while ((match = regex.exec(diagonal)) !== null) {
      indexes.push(match.index + 1)
      regex.lastIndex = match.index + 1
    }

    return indexes.map((index) => line[index][0])
  })
}

function part1(data: Data) {
  const rows = data.map((line) => line.split(""))
  const colls = rows[0].map((_, i) => rows.map((row) => row[i]))
  const diagonalRange = _.range(0, rows[0].length * 2)
  const rightDiagonals = diagonalRange.map((_, i) => rows.map((row, j) => row[i - j]))
  const rowsReversed = rows.map((row) => row.toReversed())
  const leftDiagonals = diagonalRange.map((_, i) => rowsReversed.map((row, j) => row[i - j]))
  return countXMAS(rows) + countXMAS(colls) + countXMAS(leftDiagonals) + countXMAS(rightDiagonals)
}

function countIntersections(array1: string[], array2: string[]) {
  return new EnhancedSet(array1).intersect(new EnhancedSet(array2)).size
}

function part2(data: Data) {
  const rows = data.map((line) => line.split(""))
  const width = rows[0].length
  const diagonalRange = _.range(0, width * 2)
  const rightDiagonals = diagonalRange.map((_, i) => rows.map((row, j) => [`${j},${j - i + width - 1}`, row[i - j]]))
  const rowsReversed = rows.map((row) => row.toReversed())
  const leftDiagonals = diagonalRange.map((_, i) => rowsReversed.map((row, j) => [`${j},${i - j}`, row[i - j]]))
  return countIntersections(findA(leftDiagonals), findA(rightDiagonals))
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d4.txt"
const inputTestPath2 = "./src/inputs/d4-t2.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath2)))
  assert(part1(parseInput(inputTestPath2)) === 18)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath2)))
  assert(part2(parseInput(inputTestPath2)) === 9)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
