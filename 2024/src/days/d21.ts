import assert from "assert"
import * as fs from "fs"

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

// prettier-ignore
const NUMBERIC_KEYPAD = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["" , "0", "A"]
  ]

const NUMBERIC_MAP = {
  "7": [0, 0],
  "8": [0, 1],
  "9": [0, 2],
  "4": [1, 0],
  "5": [1, 1],
  "6": [1, 2],
  "1": [2, 0],
  "2": [2, 1],
  "3": [2, 2],
  "0": [3, 1],
  A: [3, 2]
}

// prettier-ignore
const DIRECTION_KEYPAD = [
    ["" , "^", "A"],
    ["<", "v", ">"],
  ]

const DIRECTION_MAP = {
  "^": [0, 1],
  "<": [1, 0],
  v: [1, 1],
  ">": [1, 2],
  A: [0, 2]
}

function manhattanDistance(a: number[], b: number[]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

function shortestPaths(keypad: string[][], map: Record<string, number[]>) {
  const paths = new Map<string, Map<string, string[][]>>()
  for (const from of Object.keys(map)) {
    if (from === "") continue
    paths.set(from, new Map())
    for (const to of Object.keys(map)) {
      if (from === to) {
        if (!paths.get(from).has(to)) paths.get(from).set(to, [[]])
        else paths.get(from).get(to).push([])
        continue
      }
      const pathLimit = manhattanDistance(map[from], map[to])
      const start = map[from]
      const queue = [{ pos: start, path: [] }]
      while (queue.length > 0) {
        let { pos, path } = queue.shift()

        if (path.length > pathLimit) continue

        const [x, y] = pos
        if (x < 0 || y < 0 || x >= keypad.length || y >= keypad[0].length) continue

        const cell = keypad[x][y]
        if (cell === "") continue

        if (cell === to.toString()) {
          if (!paths.get(from).has(to)) paths.get(from).set(to, [path])
          else paths.get(from).get(to).push(path)
          continue
        }

        queue.push({ pos: [x - 1, y], path: [...path, "^"] })
        queue.push({ pos: [x + 1, y], path: [...path, "v"] })
        queue.push({ pos: [x, y - 1], path: [...path, "<"] })
        queue.push({ pos: [x, y + 1], path: [...path, ">"] })
      }
    }
  }

  return paths
}

const NUMERIC_PATHS = shortestPaths(NUMBERIC_KEYPAD, NUMBERIC_MAP)
const DIRECTION_PATHS = shortestPaths(DIRECTION_KEYPAD, DIRECTION_MAP)

const cache = new Map<string, number>()
function getDirCount(from: string, to: string, remaining: string[], depth: number) {
  const cacheKey = `${from}|${to}|${remaining.join("")}|${depth}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  if (depth === 1) {
    if (!to) return 1
    if (remaining.length === 0) {
      const result = DIRECTION_PATHS.get(from).get(to)[0].length + 1 + DIRECTION_PATHS.get(to).get("A")[0].length + 1
      return result
    }

    const result = DIRECTION_PATHS.get(from).get(to)[0].length + 1 + getDirCount(to, remaining[0], remaining.slice(1), depth)
    return result
  }

  if (!to) return 1
  if (remaining.length === 0) {
    const result =
      Math.min(
        ...DIRECTION_PATHS.get(from)
          .get(to)
          .map((path) => getDirCount("A", path[0], path.slice(1), depth - 1))
      ) +
      Math.min(
        ...DIRECTION_PATHS.get(to)
          .get("A")
          .map((path) => getDirCount("A", path[0], path.slice(1), depth - 1))
      )

    cache.set(cacheKey, result)
    return result
  }

  const result =
    Math.min(
      ...DIRECTION_PATHS.get(from)
        .get(to)
        .map((path) => getDirCount("A", path[0], path.slice(1), depth - 1))
    ) + getDirCount(to, remaining[0], remaining.slice(1), depth)
  cache.set(cacheKey, result)
  return result
}

function calcComplexities(data: Data, robots: number) {
  let complexities = 0
  for (const code of data) {
    let codeComplexity = 0
    const numbers = Number(
      code
        .map(Number)
        .filter((x) => !isNaN(x))
        .join("")
    )
    let from = "A"
    let to = code[0]
    for (let i = 1; i <= code.length; i++) {
      const dirPaths = NUMERIC_PATHS.get(from).get(to)
      codeComplexity += Math.min(...dirPaths.map((path) => getDirCount("A", path[0], path.slice(1), robots)))
      from = to
      to = code[i]
    }

    complexities += codeComplexity * numbers
  }

  return complexities
}

function part1(data: Data) {
  return calcComplexities(data, 2)
}

function part2(data: Data) {
  return calcComplexities(data, 25)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d21.txt"
const inputTestPath1 = "./src/inputs/d21-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 126384)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
