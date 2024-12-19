import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = number[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split(",").map(Number))
    .map(([x, y]) => [y, x])
}

function findPath(data: Data, byteSize: number, size: number) {
  const start = [0, 0]
  const exit = [size - 1, size - 1]
  const visited = new Set(data.slice(0, byteSize).map((position) => position.toString()))
  const queue: [number[], number][] = [[start, 0]]
  while (queue.length > 0) {
    let [pos, track] = queue.shift()
    const [x, y] = pos
    const posKey = pos.toString()

    if (x < 0 || x >= size || y < 0 || y >= size) continue
    if (visited.has(posKey)) continue
    visited.add(posKey)

    if (x === exit[0] && y === exit[1]) return track
    track += 1

    queue.push([[x + 1, y], track])
    queue.push([[x - 1, y], track])
    queue.push([[x, y + 1], track])
    queue.push([[x, y - 1], track])
  }
}

function part1(data: Data, byteSize: number, size: number) {
  return findPath(data, byteSize, size)
}

function part2(data: Data, byteStart: number, size: number) {
  let hi = data.length
  let lo = byteStart
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (findPath(data, mid, size)) lo = mid + 1
    else hi = mid
  }

  return data[hi - 1].toReversed().join(",")
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d18.txt"
const inputTestPath1 = "./src/inputs/d18-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1), 12, 7))
  assert(part1(parseInput(inputTestPath1), 12, 7) === 22)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath), 1024, 71))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1), 13, 7))
  assert(part2(parseInput(inputTestPath1), 13, 7) === "6,1")

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath), 1025, 71))
  console.timeEnd("Time")
}
