import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Cube = "red" | "blue" | "green"
type Draw = { count: number; cube: Cube }
type Set = Draw[]
type Game = { id: number; sets: Set[] }
type Data = Game[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [left, right] = line.trim().split(":")
      const id = Number(left.split(" ")[1])
      const sets = right.split(";").map((set) =>
        set.split(",").map((draw) => {
          const [count, cube] = draw.trim().split(" ")
          return { count: Number(count), cube }
        })
      )
      return { id, sets } as Game
    })
}

function part1(data: Data): number {
  return data
    .filter((game) => {
      return game.sets.flat().every((draw) => {
        if (draw.cube === "red" && draw.count > 12) return false
        if (draw.cube === "green" && draw.count > 13) return false
        if (draw.cube === "blue" && draw.count > 14) return false
        return true
      })
    })
    .reduce((sum, game) => sum + game.id, 0)
}

function part2(data: Data): number {
  return data
    .map((game) => {
      const allDraws = game.sets.flat().toSorted((a, b) => b.count - a.count)
      const fewestRed = allDraws.filter((draw) => draw.cube === "red")[0].count
      const fewestGreen = allDraws.filter((draw) => draw.cube === "green")[0].count
      const fewestBlue = allDraws.filter((draw) => draw.cube === "blue")[0].count
      return fewestRed * fewestGreen * fewestBlue
    })
    .reduce((a, b) => a + b, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d2.txt"
const inputTestPath1 = "./src/inputs/d2-t1.txt"

export function runPart1() {
  console.log(part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 8)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log(part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 2286)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
