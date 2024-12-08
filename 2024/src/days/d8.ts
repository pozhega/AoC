import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = string[][]
type Antennas = Map<string, number[][]>

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split(""))
}

function getAntennas(data: Data) {
  const antennas = new Map<string, number[][]>()
  data.forEach((row, x) =>
    row.forEach((cell, y) => {
      if (cell !== ".") {
        if (!antennas.has(cell)) antennas.set(cell, [[x, y]])
        else antennas.get(cell).push([x, y])
      }
    })
  )
  return antennas
}

function getAntinodes(antennas: Antennas, width: number, height: number, from = 1, range = 2) {
  const antinodes = new Set<string>()
  for (const [_antenna, positions] of antennas) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [x1, y1] = positions[i]
        const [x2, y2] = positions[j]
        const [diffX, diffY] = [Math.abs(x1 - x2), Math.abs(y1 - y2)]

        _.range(from, range).forEach((i) => {
          let shifts: number[]
          if ((y1 < y2 && x1 < x2) || (y1 > y2 && x1 > x2)) shifts = [x1 - diffX * i, x2 + diffX * i, y1 - diffY * i, y2 + diffY * i]
          if (y1 > y2 && x1 < x2) shifts = [x1 - diffX * i, x2 + diffX * i, y1 + diffY * i, y2 - diffY * i]
          if (y1 < y2 && x1 > x2) shifts = [x1 + diffX * i, x2 - diffX * i, y1 - diffY * i, y2 + diffY * i]
          const [lShiftX, rShiftX, lShiftY, rShiftY] = shifts

          if (lShiftX >= 0 && lShiftX < height && lShiftY >= 0 && lShiftY < width) antinodes.add([lShiftX, lShiftY].toString())
          if (rShiftX >= 0 && rShiftX < height && rShiftY >= 0 && rShiftY < width) antinodes.add([rShiftX, rShiftY].toString())
        })
      }
    }
  }
  return antinodes
}

function part1(data: Data) {
  const height = data.length
  const width = data[0].length
  const antennas = getAntennas(data)
  const antinodes = getAntinodes(antennas, width, height)
  return antinodes.size
}

function part2(data: Data) {
  const height = data.length
  const width = data[0].length
  const antennas = getAntennas(data)
  const antinodes = getAntinodes(antennas, width, height, 0, width)
  return antinodes.size
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d8.txt"
const inputTestPath1 = "./src/inputs/d8-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 14)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 34)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
