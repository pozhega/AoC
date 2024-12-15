import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = { map: Map<string, string>; start: number[]; dirs: string[][] }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string, expand = false): Data {
  let mode = "map"
  const map = new Map<string, string>()
  const dirs = []
  let start = [0, 0]
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line, x) => {
      if (line.trim() === "") mode = "dirs"
      else if (mode === "map") {
        line.split("").forEach((char, y) => {
          if (expand && y > 0) y *= 2
          if (expand && char === "O") char = "["
          map.set([x, y].toString(), char)
          if (expand && char === "[") char = "]"
          if (char === "@") start = [x, y]
          if (expand && char === "@") char = "."
          if (expand) map.set([x, y + 1].toString(), char)
        })
      } else dirs.push(line.split(""))
    })

  return { map, start, dirs }
}

function movePosition(position: number[], dir: string) {
  if (dir === ">") return [position[0], position[1] + 1]
  if (dir === "<") return [position[0], position[1] - 1]
  if (dir === "^") return [position[0] - 1, position[1]]
  return [position[0] + 1, position[1]]
}

function part1({ map, start, dirs }: Data) {
  let position = start
  dirs.flat().forEach((dir) => {
    let nextPosition = movePosition(position, dir)
    // prettier-ignore
    let updates = [[position, "."], [nextPosition, "@"]]
    while (true) {
      const cell = map.get(nextPosition.toString())
      if (cell === ".") break
      else if (cell === "O") {
        nextPosition = movePosition(nextPosition, dir)
        updates.push([nextPosition, "O"])
      } else {
        updates = []
        break
      }
    }

    updates.forEach(([pos, cell]) => map.set(pos.toString(), cell as string))
    if (updates.length > 0) position = movePosition(position, dir)
  })

  return map.entries().reduce((count, [positionKey, cell]) => {
    if (cell === "O") {
      position = positionKey.split(",").map(Number)
      count += position[0] * 100 + position[1]
    }
    return count
  }, 0)
}

function part2({ map, start, dirs }: Data) {
  const opositeDir = { "<": ">", ">": "<", "^": "v", v: "^" }

  let position = start
  dirs.flat().forEach((dir) => {
    let nextPosition = movePosition(position, dir)
    // prettier-ignore
    let updates = [[position, "."], [nextPosition, "@"]]
    const queue = [nextPosition]
    const visited = new Set<string>()
    while (queue.length) {
      const position = queue.shift()
      const positionKey = position.toString()

      if (visited.has(positionKey)) continue
      visited.add(positionKey)

      const cell = map.get(positionKey)

      if (cell === ".") continue
      else if (cell === "#") {
        updates = []
        break
      } else {
        if (["^", "v"].includes(dir)) {
          const pairPosition = movePosition(position, cell === "]" ? "<" : ">")
          queue.push(pairPosition)
        }
        const prevPositionKey = movePosition(position, opositeDir[dir]).toString()
        const prevCell = map.get(prevPositionKey)
        const currentCellUpdate = visited.has(prevPositionKey) ? prevCell : prevCell === "@" ? "@" : "."
        updates.push([position, currentCellUpdate])
        nextPosition = movePosition(position, dir)
        updates.push([nextPosition, cell])
        queue.push(nextPosition)
      }
    }

    updates.forEach(([pos, cell]) => map.set(pos.toString(), cell as string))
    if (updates.length > 0) position = movePosition(position, dir)
  })

  return map.entries().reduce((count, [positionKey, cell]) => {
    if (cell === "[") {
      position = positionKey.split(",").map(Number)
      count += position[0] * 100 + position[1]
    }
    return count
  }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d15.txt"
const inputTestPath1 = "./src/inputs/d15-t1.txt"
const inputTestPath2 = "./src/inputs/d15-t2.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 2028)

  console.log("Test 1: ", part1(parseInput(inputTestPath2)))
  assert(part1(parseInput(inputTestPath2)) === 10092)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  const expand = true
  console.log("Test 2: ", part2(parseInput(inputTestPath2, expand)))
  assert(part2(parseInput(inputTestPath2, expand)) === 9021)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath, expand)))
  console.timeEnd("Time")
}
