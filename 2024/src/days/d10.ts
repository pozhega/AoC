import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = (number | null)[][]
type Position = [number, number]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split("").map((char) => (char !== "." ? Number(char) : null)))
}

function getNeigbours(data: Data, position: Position) {
  const [x, y] = position
  // prettier-ignore
  const candidates: Position[] = [[x, y - 1], [x - 1, y], [x, y + 1], [x + 1, y]]
  return candidates.filter(([x, y]) => data[x] && data[x][y])
}

function part1(data: Data) {
  let count = 0
  data.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell !== 0) return

      const queue: [number, Position][] = [[-1, [x, y]]]
      const visited = new Set<string>()
      while (queue.length) {
        const [prevHeight, position] = queue.shift()

        const height = data[position[0]][position[1]]
        if (height !== prevHeight + 1) continue
        if (height === 9) visited.add(position.toString())

        getNeigbours(data, position).forEach((position) => queue.push([height, position]))
      }

      count += visited.size
    })
  })

  return count
}

function part2(data: Data) {
  let count = 0
  data.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell !== 0) return

      const queue: [number, Position][] = [[-1, [x, y]]]
      while (queue.length) {
        const [prevHeight, position] = queue.shift()

        const height = data[position[0]][position[1]]
        if (height !== prevHeight + 1) continue
        if (height === 9) count++

        getNeigbours(data, position).forEach((position) => queue.push([height, position]))
      }
    })
  })

  return count
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d10.txt"
const inputTestPath1 = "./src/inputs/d10-t1.txt"
const inputTestPath2 = "./src/inputs/d10-t2.txt"
const inputTestPath3 = "./src/inputs/d10-t3.txt"
const inputTestPath4 = "./src/inputs/d10-t4.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 2)
  console.log("Test 2: ", part1(parseInput(inputTestPath2)))
  assert(part1(parseInput(inputTestPath2)) === 4)
  console.log("Test 3: ", part1(parseInput(inputTestPath3)))
  assert(part1(parseInput(inputTestPath3)) === 3)
  console.log("Test 4: ", part1(parseInput(inputTestPath4)))
  assert(part1(parseInput(inputTestPath4)) === 36)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath4)))
  assert(part2(parseInput(inputTestPath4)) === 81)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
