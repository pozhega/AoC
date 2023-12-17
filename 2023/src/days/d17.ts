import assert from "assert"
import { PriorityQueue } from "datastructures-js"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = { heatLoss: number; pos: [number, number]; consecutive: number; dir?: "R" | "L" | "U" | "D" }
type Pos = [number, number]
type Data = number[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((row) => row.split("").map(Number))
}

function part1(map: Data) {
  const startingPoint: Point = { pos: [0, 0], heatLoss: 0, consecutive: 0, dir: null }
  const endingPos: Pos = [map.length - 1, map[0].length - 1]
  const visited = new Set<string>()
  const queue = new PriorityQueue<Point>((a, b) => a.heatLoss - b.heatLoss, [startingPoint])

  while (!_.isEqual(queue.front().pos, endingPos)) {
    const point = queue.dequeue()
    const pos = point.pos

    if (visited.has(`[${pos[0]},${pos[1]}]-${point.dir}-${point.consecutive}`)) continue
    visited.add(`[${pos[0]},${pos[1]}]-${point.dir}-${point.consecutive}`)

    if (pos[1] > 0 && ((point.dir === "L" && point.consecutive < 3) || [null, "U", "D"].includes(point.dir))) {
      queue.enqueue({
        pos: [pos[0], pos[1] - 1],
        heatLoss: point.heatLoss + map[pos[0]][pos[1] - 1],
        consecutive: point.dir === "L" ? point.consecutive + 1 : 1,
        dir: "L"
      })
    }

    if (
      pos[1] < map[0].length - 1 &&
      ((point.dir === "R" && point.consecutive < 3) || [null, "U", "D"].includes(point.dir))
    ) {
      queue.enqueue({
        pos: [pos[0], pos[1] + 1],
        heatLoss: point.heatLoss + map[pos[0]][pos[1] + 1],
        consecutive: point.dir === "R" ? point.consecutive + 1 : 1,
        dir: "R"
      })
    }

    if (pos[0] > 0 && ((point.dir === "U" && point.consecutive < 3) || [null, "L", "R"].includes(point.dir))) {
      queue.enqueue({
        pos: [pos[0] - 1, pos[1]],
        heatLoss: point.heatLoss + map[pos[0] - 1][pos[1]],
        consecutive: point.dir === "U" ? point.consecutive + 1 : 1,
        dir: "U"
      })
    }

    if (
      pos[0] < map.length - 1 &&
      ((point.dir === "D" && point.consecutive < 3) || [null, "L", "R"].includes(point.dir))
    ) {
      queue.enqueue({
        pos: [pos[0] + 1, pos[1]],
        heatLoss: point.heatLoss + map[pos[0] + 1][pos[1]],
        consecutive: point.dir === "D" ? point.consecutive + 1 : 1,
        dir: "D"
      })
    }
  }

  return queue.pop().heatLoss
}

function part2(map: Data) {
  const startingPoint: Point = { pos: [0, 0], heatLoss: 0, consecutive: 0, dir: null }
  const endingPos: Pos = [map.length - 1, map[0].length - 1]
  const visited = new Set<string>()
  const queue = new PriorityQueue<Point>((a, b) => a.heatLoss - b.heatLoss, [startingPoint])

  while (!_.isEqual(queue.front().pos, endingPos)) {
    const point = queue.dequeue()
    const pos = point.pos

    if (visited.has(`[${pos[0]},${pos[1]}]-${point.dir}-${point.consecutive}`)) continue
    visited.add(`[${pos[0]},${pos[1]}]-${point.dir}-${point.consecutive}`)

    if (
      pos[1] > 0 &&
      ((point.dir === "L" && point.consecutive < 10) ||
        !point.dir ||
        (["U", "D"].includes(point.dir) && point.consecutive > 3))
    ) {
      queue.enqueue({
        pos: [pos[0], pos[1] - 1],
        heatLoss: point.heatLoss + map[pos[0]][pos[1] - 1],
        consecutive: point.dir === "L" ? point.consecutive + 1 : 1,
        dir: "L"
      })
    }

    if (
      pos[1] < map[0].length - 1 &&
      ((point.dir === "R" && point.consecutive < 10) ||
        !point.dir ||
        (["U", "D"].includes(point.dir) && point.consecutive > 3))
    ) {
      queue.enqueue({
        pos: [pos[0], pos[1] + 1],
        heatLoss: point.heatLoss + map[pos[0]][pos[1] + 1],
        consecutive: point.dir === "R" ? point.consecutive + 1 : 1,
        dir: "R"
      })
    }

    if (
      pos[0] > 0 &&
      ((point.dir === "U" && point.consecutive < 10) ||
        !point.dir ||
        (["L", "R"].includes(point.dir) && point.consecutive > 3))
    ) {
      queue.enqueue({
        pos: [pos[0] - 1, pos[1]],
        heatLoss: point.heatLoss + map[pos[0] - 1][pos[1]],
        consecutive: point.dir === "U" ? point.consecutive + 1 : 1,
        dir: "U"
      })
    }

    if (
      pos[0] < map.length - 1 &&
      ((point.dir === "D" && point.consecutive < 10) ||
        !point.dir ||
        (["L", "R"].includes(point.dir) && point.consecutive > 3))
    ) {
      queue.enqueue({
        pos: [pos[0] + 1, pos[1]],
        heatLoss: point.heatLoss + map[pos[0] + 1][pos[1]],
        consecutive: point.dir === "D" ? point.consecutive + 1 : 1,
        dir: "D"
      })
    }
  }

  return queue.pop().heatLoss
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d17.txt"
const inputTestPath1 = "./src/inputs/d17-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 102)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 94)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
