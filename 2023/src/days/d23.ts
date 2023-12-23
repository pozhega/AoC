import assert from "assert"
import { Queue, Stack } from "datastructures-js"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = [number, number]
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

function manhattanDistance(a: Point, b: Point) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

function getAdjacents(map: Data, pos: Point) {
  const adjacents: Point[] = []
  const [x, y] = pos

  if (x > 0) adjacents.push([x - 1, y])
  if (x < map.length - 1) adjacents.push([x + 1, y])
  if (y > 0) adjacents.push([x, y - 1])
  if (y < map[0].length - 1) adjacents.push([x, y + 1])

  return adjacents.filter((adjacentPos) => map[adjacentPos[0]][adjacentPos[1]] !== "#")
}

function part1(map: Data) {
  const startingPos: Point = [0, 1]
  const endingPos: Point = [map.length - 1, map[0].length - 2]

  const junctions = new Set([startingPos.toString(), endingPos.toString()])
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[0].length; y++) {
      if (map[x][y] !== "#") {
        const adjacents = getAdjacents(map, [x, y])
        if (adjacents.length > 2) {
          junctions.add([x, y].toString())
        }
      }
    }
  }

  const graph = new Map<string, [string, number][]>()
  junctions.forEach((junction) => {
    if (junction === endingPos.toString()) {
      graph.set(junction, [])
      return
    }
    const start = junction.split(",").map(Number) as Point
    const visited = new Set<string>()
    const queue = new Queue<{ pos: Point; visited: Set<string> }>([{ pos: start, visited }])
    while (!queue.isEmpty()) {
      const { pos, visited } = queue.dequeue()
      const posKey = pos.toString()
      if (visited.has(posKey)) continue
      visited.add(posKey)
      if (junctions.has(posKey) && posKey !== junction && posKey !== startingPos.toString()) {
        graph.set(junction, [...(graph.get(junction) || []), [posKey, visited.size - 1]])
        continue
      }

      getAdjacents(map, pos).forEach((adjacentPos) => {
        queue.enqueue({ pos: adjacentPos, visited: _.cloneDeep(visited) })
      })
    }
  })

  const endingPosCounts = []
  const queue = new Queue<{ pos: Point; visited: Set<string>; count: number }>([
    { pos: startingPos, visited: new Set<string>(), count: 0 }
  ])
  while (!queue.isEmpty()) {
    const { pos, visited, count } = queue.dequeue()
    const posKey = pos.toString()
    visited.add(posKey)
    if (posKey === endingPos.toString()) {
      endingPosCounts.push(count)
      continue
    }
    graph.get(posKey).forEach(([nextPosKey, distance]) => {
      if (visited.has(nextPosKey)) return
      const nextPos = nextPosKey.split(",").map(Number) as Point
      queue.enqueue({ pos: nextPos, visited: _.cloneDeep(visited), count: count + distance })
    })
  }

  return Math.max(...endingPosCounts)
}

function part2(map: Data) {
  const startingPos: Point = [0, 1]
  const endingPos: Point = [map.length - 1, map[0].length - 2]

  const junctions = new Set([startingPos.toString(), endingPos.toString()])
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[0].length; y++) {
      if (map[x][y] !== "#") {
        const adjacents = getAdjacents(map, [x, y])
        if (adjacents.length > 2) {
          junctions.add([x, y].toString())
        }
      }
    }
  }

  let preExitNode = null
  const graph = new Map<string, [string, number][]>()
  junctions.forEach((junction) => {
    if (junction === endingPos.toString()) {
      graph.set(junction, [])
      return
    }
    const start = junction.split(",").map(Number) as Point
    const visited = new Set<string>()
    const queue = new Queue<{ pos: Point; visited: Set<string> }>([{ pos: start, visited }])
    while (!queue.isEmpty()) {
      const { pos, visited } = queue.dequeue()
      const posKey = pos.toString()
      if (visited.has(posKey)) continue
      visited.add(posKey)
      if (junctions.has(posKey) && posKey !== junction && posKey !== startingPos.toString()) {
        if (posKey === endingPos.toString()) {
          preExitNode = junction
        }
        graph.set(junction, [...(graph.get(junction) || []), [posKey, visited.size - 1]])
        continue
      }

      getAdjacents(map, pos).forEach((adjacentPos) => {
        queue.enqueue({ pos: adjacentPos, visited: _.cloneDeep(visited) })
      })
    }
  })

  graph.set(
    preExitNode,
    graph.get(preExitNode).filter(([pos, count]) => pos === endingPos.toString())
  )

  let maxSteps = 0
  const stack = new Stack<{ pos: Point; visited: Set<string>; count: number }>([
    { pos: startingPos, visited: new Set<string>(), count: 0 }
  ])
  while (!stack.isEmpty()) {
    const { pos, visited, count } = stack.pop()
    const posKey = pos.toString()
    visited.add(posKey)
    if (posKey === endingPos.toString()) {
      maxSteps = Math.max(maxSteps, count)
      continue
    }

    graph.get(posKey).forEach(([nextPosKey, distance]) => {
      if (visited.has(nextPosKey)) return
      const nextPos = nextPosKey.split(",").map(Number) as Point
      stack.push({ pos: nextPos, visited: _.cloneDeep(visited), count: count + distance })
    })
  }

  return maxSteps
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d23.txt"
const inputTestPath1 = "./src/inputs/d23-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 94)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 154)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
