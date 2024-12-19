import assert from "assert"
import { PriorityQueue } from "datastructures-js"
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
    .map((line) => line.split(""))
}

function part1(data: Data) {
  let startPos: number[]
  data.forEach((row, x) => row.forEach((cell, y) => (cell === "S" ? (startPos = [x, y]) : null)))

  const visited = new Set<string>()
  const queue = new PriorityQueue<{ pos: number[]; score: number; dir: string }>((a, b) => a.score - b.score)
  queue.push({ pos: startPos, score: 0, dir: "E" })

  while (!queue.isEmpty()) {
    let { pos, score, dir } = queue.dequeue()
    const posKey = pos.toString()

    if (visited.has(posKey)) continue
    visited.add(posKey)

    const [x, y] = pos
    const cell = data[x][y]

    if (cell === ".") score += 1
    else if (cell === "#") continue
    else if (cell === "E") return score + 1

    if (dir !== "N") queue.push({ pos: [x + 1, y], score: score + (["E", "W"].includes(dir) ? 1000 : 0), dir: "S" })
    if (dir !== "S") queue.push({ pos: [x - 1, y], score: score + (["E", "W"].includes(dir) ? 1000 : 0), dir: "N" })
    if (dir !== "W") queue.push({ pos: [x, y + 1], score: score + (["S", "N"].includes(dir) ? 1000 : 0), dir: "E" })
    if (dir !== "E") queue.push({ pos: [x, y - 1], score: score + (["S", "N"].includes(dir) ? 1000 : 0), dir: "W" })
  }
}

function part2(data: Data) {
  let startPos: number[]
  data.forEach((row, x) => row.forEach((cell, y) => (cell === "S" ? (startPos = [x, y]) : null)))

  let winner = undefined
  const queue = new PriorityQueue<{ path: any[]; pos: number[]; score: number; dir: string }>((a, b) => a.score - b.score)
  queue.push({ path: [], pos: startPos, score: 0, dir: "E" })
  const visited = new Set<string>()
  while (!queue.isEmpty()) {
    let { path, pos, score, dir } = queue.dequeue()
    const posKey = pos.toString()

    if (visited.has(posKey)) continue
    visited.add(posKey)

    const [x, y] = pos
    const cell = data[x][y]

    if (cell === ".") score += 1
    else if (cell === "#") continue
    else if (cell === "E") {
      score += 1
      winner = { score, path: [...path, { pos, dir, score }] }
      break
    }

    path = [...path, { pos, dir, score }]
    if (dir !== "N") queue.push({ path, pos: [x + 1, y], score: score + (["E", "W"].includes(dir) ? 1000 : 0), dir: "S" })
    if (dir !== "S") queue.push({ path, pos: [x - 1, y], score: score + (["E", "W"].includes(dir) ? 1000 : 0), dir: "N" })
    if (dir !== "W") queue.push({ path, pos: [x, y + 1], score: score + (["S", "N"].includes(dir) ? 1000 : 0), dir: "E" })
    if (dir !== "E") queue.push({ path, pos: [x, y - 1], score: score + (["S", "N"].includes(dir) ? 1000 : 0), dir: "W" })
  }

  let allPaths = new Set<string>([...winner.path.map(({ pos }) => pos.toString())])
  winner.path.forEach(({ pos, dir, score }, i: number) => {
    const queue = new PriorityQueue<{ path: any[]; pos: number[]; score: number; dir: string }>((a, b) => a.score - b.score)
    queue.push({ path: [], pos, score, dir })
    const visited = new Set<string>()
    _.range(0, i).forEach((j) => visited.add(winner.path[j].pos.toString()))
    if (i < winner.path.length - 1) visited.add(winner.path[i + 1].pos.toString())
    while (!queue.isEmpty()) {
      let { path, pos, score, dir } = queue.dequeue()
      const posKey = pos.toString()
      if (visited.has(posKey)) continue
      visited.add(posKey)

      if (score > winner.score) break

      const [x, y] = pos
      const cell = data[x][y]

      if (cell === "#") continue
      else if (cell === ".") score += 1
      else if (cell === "E") {
        path.forEach(({ pos }) => allPaths.add(pos.toString()))
        break
      }

      path = [...path, { pos, dir, score }]
      if (dir !== "N") queue.push({ path, pos: [x + 1, y], score: score + (["E", "W"].includes(dir) ? 1000 : 0), dir: "S" })
      if (dir !== "S") queue.push({ path, pos: [x - 1, y], score: score + (["E", "W"].includes(dir) ? 1000 : 0), dir: "N" })
      if (dir !== "W") queue.push({ path, pos: [x, y + 1], score: score + (["S", "N"].includes(dir) ? 1000 : 0), dir: "E" })
      if (dir !== "E") queue.push({ path, pos: [x, y - 1], score: score + (["S", "N"].includes(dir) ? 1000 : 0), dir: "W" })
    }
  })

  return allPaths.size
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d16.txt"
const inputTestPath1 = "./src/inputs/d16-t1.txt"
const inputTestPath2 = "./src/inputs/d16-t2.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 7036)
  console.log("Test 2: ", part1(parseInput(inputTestPath2)))
  assert(part1(parseInput(inputTestPath2)) === 11048)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 1: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 45)
  console.log("Test 2: ", part2(parseInput(inputTestPath2)))
  assert(part2(parseInput(inputTestPath2)) === 64)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
