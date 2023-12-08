import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Dir = "L" | "R"
type Data = { dirs: Dir[]; map: Map<string, [string, string]>; ghostStarts: string[] }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  let dirs: Dir[]
  let map = new Map<string, [string, string]>()
  let ghostStarts = []

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line, index) => {
      if (index === 0) {
        dirs = line.trim().split("") as Dir[]
        return
      }

      if (line.trim() === "") {
        return
      }

      const [node, rest] = line.split(" = ")
      const [left, right] = rest.replace("(", "").replace(")", "").split(",")
      map.set(node.trim(), [left.trim(), right.trim()])

      if (node.trim().endsWith("A")) {
        ghostStarts.push(node.trim())
      }
    })

  return { dirs, map, ghostStarts }
}

function calcLowestCommonDivident(nums: number[]) {
  let add = nums[0],
    divident = 0,
    maxMatch = 1
  while (maxMatch < nums.length) {
    divident += add

    const match = nums.filter((num) => divident % num === 0).length
    if (match > maxMatch) {
      add = divident
      maxMatch = match
    }
  }

  return divident
}

function part1(data: Data): number {
  const dirMap = { L: 0, R: 1 }
  let current = "AAA",
    currentDir = 0,
    count = 0

  while (current !== "ZZZ") {
    const dir = data.dirs[currentDir % data.dirs.length]
    current = data.map.get(current)[dirMap[dir]]
    currentDir++
    count++
  }

  return count
}

function part2(data: Data): number {
  const dirMap = { L: 0, R: 1 }
  let currents = data.ghostStarts,
    finishes = currents.map((_current) => undefined),
    currentDir = 0,
    count = 0

  while (!finishes.every((current) => !isNaN(Number(current)))) {
    const dir = data.dirs[currentDir % data.dirs.length]
    currentDir++
    count++
    currents.forEach((current, index) => {
      currents[index] = data.map.get(current)[dirMap[dir]]
      if (currents[index].endsWith("Z")) {
        finishes[index] = count
      }
    })
  }

  return calcLowestCommonDivident(finishes)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d8.txt"
const inputTestPath1 = "./src/inputs/d8-t1.txt"
const inputTestPath2 = "./src/inputs/d8-t2.txt"
const inputTestPath3 = "./src/inputs/d8-t3.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")

  console.time("Time")
  console.log("Test 2: ", part1(parseInput(inputTestPath2)))
  console.time("Time")

  assert(part1(parseInput(inputTestPath1)) === 2)
  assert(part1(parseInput(inputTestPath2)) === 6)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 3: ", part2(parseInput(inputTestPath3)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath3)) === 6)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
