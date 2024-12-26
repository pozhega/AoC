import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = { keys: string[][][]; locks: string[][][] }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const keys = []
  const locks = []
  let current = []
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      if (line === "") {
        if (current[0].every((cell: string) => cell === "#")) locks.push(current)
        else keys.push(current)
        current = []
      } else {
        current.push(line.split(""))
      }
    })

  if (current[0].every((cell: string) => cell === "#")) locks.push(current)
  else keys.push(current)

  return { keys, locks }
}

function part1({ keys, locks }: Data) {
  let count = 0
  keys.forEach((key) => {
    locks.forEach((lock) => {
      const lockPin = new Set<string>()
      lock.forEach((row, x) => row.forEach((cell, y) => (cell === "#" ? lockPin.add(`${x},${y}`) : void 0)))

      const keyPin = new Set<string>()
      key.forEach((row, x) => row.forEach((cell, y) => (cell === "#" ? keyPin.add(`${x},${y}`) : void 0)))

      if (!keyPin.intersection(lockPin).size) count += 1
    })
  })

  return count
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d25.txt"
const inputTestPath1 = "./src/inputs/d25-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 3)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}
