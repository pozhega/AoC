import assert from "assert"
import { Queue } from "datastructures-js"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = [number, number]
type Data = { start: [number, number]; rocks: Set<string>; mapWidth: number; mapHeight: number }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const rocks = new Set<string>()
  let mapWidth = 0
  let mapHeight = 0
  let start: [number, number]

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line, x) => {
      line
        .trim()
        .split("")
        .forEach((char, y) => {
          if (char === "S") {
            start = [x, y]
          }
          if (char === "#") {
            rocks.add(`[${x},${y}]`)
          }

          mapWidth = Math.max(mapWidth, y + 1)
        })
      mapHeight = Math.max(mapHeight, x + 1)
    })

  return { start, rocks, mapWidth, mapHeight }
}

function calcRockKey(mapWidth: number, mapHeight: number, point: Point) {
  let [x, y] = point
  if (y >= mapWidth) y = y % mapWidth
  if (x >= mapHeight) x = x % mapHeight
  if (x < 0) x = mapHeight + (x % mapHeight)
  if (y < 0) y = mapWidth + (y % mapWidth)
  return `[${x},${y}]`
}

function solve(data: Data, steps: number) {
  const { start, rocks, mapWidth, mapHeight } = data
  const startKey = `[${start[0]},${start[1]}]`
  let queue = new Queue([start])
  let visited = new Set<string>([startKey])
  let count = 0
  for (let step = 0; step < steps + 1; step++) {
    if (step % 100 === 0) console.log(step)
    const stepSize = queue.size()
    for (let i = 0; i < stepSize; i++) {
      const [x, y] = queue.dequeue()
      count += (steps - step + 1) % 2

      const adjacents = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ]
      adjacents.forEach((point: [number, number]) => {
        const [x, y] = point
        const key = `[${x},${y}]`
        const rockKey = calcRockKey(mapWidth, mapHeight, point)
        if (!rocks.has(rockKey) && !visited.has(key)) {
          queue.enqueue(point)
          visited.add(key)
        }
      })
    }
  }

  return count
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d21.txt"
const inputTestPath1 = "./src/inputs/d21-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", solve(parseInput(inputTestPath1), 6))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 6) === 16)

  console.time("Time")
  console.log("Part 1: ", solve(parseInput(inputPath), 64))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 3: ", solve(parseInput(inputTestPath1), 6))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 6) === 16)

  console.time("Time")
  console.log("Test 4: ", solve(parseInput(inputTestPath1), 10))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 10) === 50)

  console.time("Time")
  console.log("Test 5: ", solve(parseInput(inputTestPath1), 50))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 50) === 1594)

  console.time("Time")
  console.log("Test 6: ", solve(parseInput(inputTestPath1), 100))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 100) === 6536)

  console.time("Time")
  console.log("Test 7: ", solve(parseInput(inputTestPath1), 500))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 500) === 167004)

  console.time("Time")
  console.log("Test 8: ", solve(parseInput(inputTestPath1), 1000))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 1000) === 668697)

  console.time("Time")
  console.log("Test 9: ", solve(parseInput(inputTestPath1), 5000))
  console.time("Time")
  assert(solve(parseInput(inputTestPath1), 5000) === 16733044)

  console.time("Time")
  console.log("Part 2: ")
  console.log(solve(parseInput(inputPath), 65))
  console.log(solve(parseInput(inputPath), 65 + 131 * 1))
  console.log(solve(parseInput(inputPath), 65 + 131 * 2))
  console.timeEnd("Time")

  // https://www.wolframalpha.com/input?i2d=true&i=3787+%2B+15114+x+%2B+15075+Power%5Bx%2C2%5D%5C%2844%29+x%3D202300
}
