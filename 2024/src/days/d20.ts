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

function findPath(data: Data, start: number[]) {
  const visited = new Set<string>()
  const queue = [[start, new Map<string, number[]>()]]
  while (queue.length > 0) {
    let move = queue.shift()
    const pos = move[0] as number[]
    let path = move[1] as Map<string, number[]>
    const posKey = pos.toString()

    const [x, y] = pos
    const cell = data[x][y]
    if (cell === "#") continue

    if (visited.has(posKey)) continue
    visited.add(posKey)

    path = new Map(path).set(posKey, [path.size])
    if (cell === "E") {
      path.keys().forEach((pos) => path.get(pos).push(path.size - 1 - path.get(pos)[0]))
      return { path, pathSize: path.size - 1 }
    }

    if (x - 1 >= 0) queue.push([[x - 1, y], path])
    if (x + 1 < data.length) queue.push([[x + 1, y], path])
    if (y - 1 >= 0) queue.push([[x, y - 1], path])
    if (y + 1 < data[0].length) queue.push([[x, y + 1], path])
  }
}

function findCheats(path: Map<string, number[]>, pathSize: number, picoseconds: number) {
  const cheats = new Map<number, number>()
  path.keys().forEach((pos, i) => {
    const [x, y] = pos.split(",").map(Number)
    const [from, _to] = path.get(pos)

    const candidates = []
    let yRange = 0
    for (let i = x - picoseconds; i <= x; i++) {
      for (let j = y - yRange; j <= y + yRange; j++) {
        candidates.push([i, j])
      }
      yRange++
    }

    yRange = picoseconds - 1
    for (let i = x + 1; i <= x + picoseconds; i++) {
      for (let j = y - yRange; j <= y + yRange; j++) {
        candidates.push([i, j])
      }
      yRange--
    }

    candidates.forEach((pos) => {
      const posKey = pos.toString()
      if (path.has(posKey)) {
        const [_fromCheat, toCheat] = path.get(posKey)
        const pico = pathSize - (from + manhattanDistance([x, y], pos) + toCheat)
        cheats.set(pico, (cheats.get(pico) || 0) + 1)
      }
    })
  })

  return cheats
}

function part1(data: Data) {
  let start: number[]
  data.forEach((row, x) => row.forEach((cell, y) => (cell === "S" ? (start = [x, y]) : void 0)))

  const { path, pathSize } = findPath(data, start)
  const cheats = findCheats(path, pathSize, 2)

  return cheats.keys().reduce((count, key) => {
    if (key >= 100) return (count += cheats.get(key))
    return count
  }, 0)
}

function manhattanDistance(a: number[], b: number[]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

function part2(data: Data) {
  let start: number[]
  data.forEach((row, x) => row.forEach((cell, y) => (cell === "S" ? (start = [x, y]) : void 0)))

  const { path, pathSize } = findPath(data, start)
  const cheats = findCheats(path, pathSize, 20)

  return cheats.keys().reduce((count, key) => {
    if (key >= 100) return (count += cheats.get(key))
    return count
  }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d20.txt"
const inputTestPath1 = "./src/inputs/d20-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
