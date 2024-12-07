import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = { map: Map<string, string>; start: string }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const map = new Map<string, string>()
  let start = undefined
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line, y) =>
      line.split("").forEach((char, x) => {
        if (char === "^") start = `${x},${y}`
        map.set(`${x},${y}`, char === "^" ? "." : char)
      })
    )
  return { map, start }
}

function walkthrough(map: Map<string, string>, start: string) {
  const backTurns = { N: "S", E: "W", S: "N", W: "E" }
  const rightTurns = { N: "E", E: "S", S: "W", W: "N" }
  const steps = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }

  let position = start
  let direction = "N"
  const visited = new Set<string>()
  while (map.has(position)) {
    if (map.get(position) === ".") visited.add(position)
    else if (map.get(position) === "#") {
      const [x, y] = position.split(",").map(Number)
      const [backstepX, backstepY] = steps[backTurns[direction]]
      position = `${x + backstepX},${y + backstepY}`
      direction = rightTurns[direction]
    }

    const [x, y] = position.split(",").map(Number)
    const [stepX, stepY] = steps[direction]
    position = `${x + stepX},${y + stepY}`
  }

  return visited
}

function part1({ map, start }: Data) {
  return walkthrough(map, start).size
}

function part2({ map, start }: Data) {
  const backTurns = { N: "S", E: "W", S: "N", W: "E" }
  const rightTurns = { N: "E", E: "S", S: "W", W: "N" }
  const steps = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }

  let count = 0
  for (const obstacle of walkthrough(map, start)) {
    let position = start
    let direction = "N"
    const visited = new Map<string, number>()
    while (map.has(position)) {
      if (map.get(position) === "." && position !== obstacle) {
        if (!visited.has(position) || visited.get(position) < visited.size) {
          visited.set(position, visited.size)
        } else {
          count += 1
          break
        }
      } else if (map.get(position) === "#" || position === obstacle) {
        const [x, y] = position.split(",").map(Number)
        const [backstepX, backstepY] = steps[backTurns[direction]]
        position = `${x + backstepX},${y + backstepY}`
        direction = rightTurns[direction]
      }

      const [x, y] = position.split(",").map(Number)
      const [stepX, stepY] = steps[direction]
      position = `${x + stepX},${y + stepY}`
    }
  }

  return count
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d6.txt"
const inputTestPath1 = "./src/inputs/d6-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 41)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 6)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
