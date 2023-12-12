import assert from "assert"
import * as fs from "fs"
import _, { isNumber } from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = [number, number]
type Data = any[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => [".", ...line.trim().split(""), "."])
}

function findStart(data: Data): Point {
  let start: Point

  data.forEach((row, x) => {
    row.find((tile, y) => {
      if (tile === "S") {
        return (start = [x, y])
      }
    })
  })

  return start
}

function calcStartPipe(data: Data, start: Point) {
  const upper = data.at(start[0] - 1)?.at(start[1])
  const left = data.at(start[0])?.at(start[1] - 1)
  const right = data.at(start[0])?.at(start[1] + 1)
  const down = data.at(start[0] + 1)?.at(start[1])

  if (["|", "7", "F"].includes(upper) && ["|", "J", "L"].includes(down)) return "|"
  if (["|", "7", "F"].includes(upper) && ["-", "L", "F"].includes(left)) return "J"
  if (["|", "7", "F"].includes(upper) && ["-", "7", "J"].includes(right)) return "L"
  if (["|", "J", "L"].includes(down) && ["-", "L", "F"].includes(left)) return "7"
  if (["|", "J", "L"].includes(down) && ["-", "7", "J"].includes(right)) return "F"
  if (["-", "L", "F"].includes(left) && ["-", "7", "J"].includes(right)) return "-"
}

// prettier-ignore
function findValidAjacents(data: Data, point: Point): [Point, Point] {
  const value = data.at(point[0]).at(point[1])
  const upper = data.at(point[0] - 1)?.at(point[1])
  const left = data.at(point[0])?.at(point[1] - 1)
  const right = data.at(point[0])?.at(point[1] + 1)
  const down = data.at(point[0] + 1)?.at(point[1])

  if (value === "|" && ["|", "7", "F"].includes(upper) && ["|", "J", "L"].includes(down)) {
    return [[point[0] - 1, point[1]], [point[0] + 1, point[1]]]
  }

  if (value === "-" && ["-", "L", "F"].includes(left) && ["-", "7", "J"].includes(right)) {
    return [[point[0], point[1] - 1], [point[0], point[1] + 1]]
  }

  if (value === "J" && ["|", "7", "F"].includes(upper) && ["-", "L", "F"].includes(left)) {
    return [[point[0] - 1, point[1]], [point[0], point[1] - 1]]
  }

  if (value === "L" && ["|", "7", "F"].includes(upper) && ["-", "7", "J"].includes(right)) {
    return [[point[0] - 1, point[1]], [point[0], point[1] + 1]]
  }

  if (value === "7" && ["-", "L", "F"].includes(left) && ["|", "J", "L"].includes(down)) {
    return [[point[0], point[1] - 1], [point[0] + 1, point[1]]]
  }

  if (value === "F" && ["-", "7", "J"].includes(right) && ["|", "J", "L"].includes(down)) {
    return [[point[0], point[1] + 1], [point[0] + 1, point[1]]]
  }
}

function findLoop(data: Data) {
  const start = findStart(data)
  const startPipe = calcStartPipe(data, start)
  data[start[0]][start[1]] = startPipe
  const map = _.cloneDeep(data)

  let queue = [start]
  while (queue.length > 0) {
    const point = queue.shift()
    const validAdjacents = findValidAjacents(data, point)
    if (!validAdjacents) continue
    const [adjPoint1, adjPoint2] = validAdjacents
    const adjPipe1 = map[adjPoint1[0]][adjPoint1[1]]
    const adjPipe2 = map[adjPoint2[0]][adjPoint2[1]]

    if (isNumber(adjPipe1) && isNumber(adjPipe2)) {
      map[point[0]][point[1]] = adjPipe1 + 1
      continue
    }

    if (isNumber(adjPipe1)) {
      map[point[0]][point[1]] = adjPipe1 + 1
      queue.push(adjPoint2)
      continue
    }

    if (isNumber(adjPipe2)) {
      map[point[0]][point[1]] = adjPipe2 + 1
      queue.push(adjPoint1)
      continue
    }

    queue.push(adjPoint1)
    queue.push(adjPoint2)
    map[point[0]][point[1]] = 0
  }

  return map
}

function part1(data: Data): number {
  const map = findLoop(data)

  let maxDistance = 0
  map.forEach((row) => {
    row.forEach((tile) => {
      if (isNumber(tile)) {
        maxDistance = Math.max(maxDistance, tile)
      }
    })
  })

  return maxDistance
}

function part2(data: Data): number {
  const map = findLoop(data)

  let enclosedTiles = 0
  map.forEach((row, x) => {
    let inLoop = false
    row.forEach((_tile, y) => {
      if (isNumber(map[x][y]) && ["|", "L", "J"].includes(data[x][y])) {
        inLoop = !inLoop
      }

      if (!isNumber(map[x][y]) && inLoop) {
        enclosedTiles++
      }
    })
  })

  return enclosedTiles
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d10.txt"
const inputTestPath1 = "./src/inputs/d10-t1.txt"
const inputTestPath2 = "./src/inputs/d10-t2.txt"
const inputTestPath3 = "./src/inputs/d10-t3.txt"
const inputTestPath4 = "./src/inputs/d10-t4.txt"
const inputTestPath5 = "./src/inputs/d10-t5.txt"
const inputTestPath6 = "./src/inputs/d10-t6.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 4)

  console.time("Time")
  console.log("Test 2: ", part1(parseInput(inputTestPath2)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath2)) === 8)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 3: ", part2(parseInput(inputTestPath3)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath3)) === 4)

  console.time("Time")
  console.log("Test 4: ", part2(parseInput(inputTestPath4)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath4)) === 4)

  console.time("Time")
  console.log("Test 5: ", part2(parseInput(inputTestPath5)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath5)) === 8)

  console.time("Time")
  console.log("Test 6: ", part2(parseInput(inputTestPath6)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath6)) === 10)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
