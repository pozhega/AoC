import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Machine = { buttonA: [number, number]; buttonB: [number, number]; prize: [number, number] }
type Data = Machine[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const machines = []
  let buttonA, buttonB, prize
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      if (line.trim() === "") machines.push({ buttonA, buttonB, prize })
      else if (line.startsWith("Button A"))
        buttonA = line
          .split(": ")[1]
          .split(", ")
          .map((x) => Number(x.split("+")[1]))
      else if (line.startsWith("Button B"))
        buttonB = line
          .split(": ")[1]
          .split(", ")
          .map((x) => Number(x.split("+")[1]))
      else if (line.startsWith("Prize"))
        prize = line
          .split(": ")[1]
          .split(", ")
          .map((x) => Number(x.split("=")[1]))
    })

  machines.push({ buttonA, buttonB, prize })

  return machines
}

function part1(data: Data) {
  let tokens = 0
  data.map(({ buttonA, buttonB, prize }) => {
    let aHi = Math.ceil(Math.min(prize[0] / buttonA[0], prize[1] / buttonA[1]))
    let aLo = 1
    while (aHi - aLo > 1) {
      const aPress = Math.floor((aHi + aLo) / 2)

      let bHi = Math.ceil(Math.min(prize[0] / buttonB[0], prize[1] / buttonB[1]))
      let bLo = 1
      while (bHi - bLo > 1) {
        const bPress = Math.floor((bHi + bLo) / 2)

        if (aPress * buttonA[0] + bPress * buttonB[0] === prize[0] && aPress * buttonA[1] + bPress * buttonB[1] === prize[1]) {
          tokens += aPress * 3 + bPress
          break
        }

        if (aPress * buttonA[0] + bPress * buttonB[0] > prize[0] || aPress * buttonA[1] + bPress * buttonB[1] > prize[1]) {
          bHi = bPress
          continue
        }

        if (aPress * buttonA[0] + bPress * buttonB[0] < prize[0] || aPress * buttonA[1] + bPress * buttonB[1] < prize[1]) {
          bLo = bPress
          continue
        }
      }
    }
  })

  return tokens
}

function part2(data: Data) {
  let tokens = 0
  data.map(({ buttonA, buttonB, prize }) => {
    prize[0] += 10000000000000
    prize[1] += 10000000000000

    for (let aPress = 100680000000; aPress < Math.min(prize[0] / buttonA[0], prize[1] / buttonA[1]); aPress++) {
      console.log(Math.min(prize[1] / buttonA[1]))
      if (aPress % 10000000 === 0) console.log(aPress)
      let bHi = Math.ceil(Math.min(prize[0] / buttonB[0], prize[1] / buttonB[1]))
      let bLo = 1
      while (bHi - bLo > 1) {
        const bPress = Math.floor((bHi + bLo) / 2)

        if (aPress * buttonA[0] + bPress * buttonB[0] === prize[0] && aPress * buttonA[1] + bPress * buttonB[1] === prize[1]) {
          tokens += aPress * 3 + bPress
          break
        }

        if (aPress * buttonA[0] + bPress * buttonB[0] > prize[0] || aPress * buttonA[1] + bPress * buttonB[1] > prize[1]) {
          bHi = bPress
          continue
        }

        if (aPress * buttonA[0] + bPress * buttonB[0] < prize[0] || aPress * buttonA[1] + bPress * buttonB[1] < prize[1]) {
          bLo = bPress
          continue
        }
      }
    }
  })

  return tokens
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d13.txt"
const inputTestPath1 = "./src/inputs/d13-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 480)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === undefined)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
