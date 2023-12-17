import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Beam = { pos: [number, number]; dir: "R" | "L" | "U" | "D" }
type Data = string[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((row) => row.split(""))
}

function calcEnergized(map: Data, beam: Beam) {
  const visited = new Set<string>()
  const energized = new Set<string>()
  let beams = [beam]
  while (beams.length > 0) {
    const splitBeams = []

    beams = beams.map((beam) => {
      const [dx, dy] = beam.dir === "R" ? [0, 1] : beam.dir === "L" ? [0, -1] : beam.dir === "U" ? [-1, 0] : [1, 0]
      beam.pos = [beam.pos[0] + dx, beam.pos[1] + dy]

      if (visited.has(`[${beam.pos[0]},${beam.pos[1]}]-${beam.dir}`)) {
        return { pos: null, dir: beam.dir }
      }

      if (beam.pos[0] < 0 || beam.pos[0] >= map.length || beam.pos[1] < 0 || beam.pos[1] >= map[0].length) {
        return { pos: null, dir: beam.dir }
      }

      energized.add(`[${beam.pos[0]},${beam.pos[1]}]`)
      visited.add(`[${beam.pos[0]},${beam.pos[1]}]-${beam.dir}`)
      const newTile = map[beam.pos[0]][beam.pos[1]]

      if (newTile === "|" && ["R", "L"].includes(beam.dir)) {
        splitBeams.push({ pos: [beam.pos[0], beam.pos[1]], dir: "U" })
        beam.dir = "D"
      } else if (newTile === "-" && ["U", "D"].includes(beam.dir)) {
        splitBeams.push({ pos: [beam.pos[0], beam.pos[1]], dir: "L" })
        beam.dir = "R"
      } else if (newTile === "\\" && beam.dir === "R") beam.dir = "D"
      else if (newTile === "\\" && beam.dir === "L") beam.dir = "U"
      else if (newTile === "\\" && beam.dir === "U") beam.dir = "L"
      else if (newTile === "\\" && beam.dir === "D") beam.dir = "R"
      else if (newTile === "/" && beam.dir === "R") beam.dir = "U"
      else if (newTile === "/" && beam.dir === "L") beam.dir = "D"
      else if (newTile === "/" && beam.dir === "U") beam.dir = "R"
      else if (newTile === "/" && beam.dir === "D") beam.dir = "L"

      return beam
    })

    beams = [...beams, ...splitBeams].filter((beam) => beam.pos)
  }

  return energized.size
}

function part1(data: Data): number {
  const startingBeam: Beam = { pos: [0, -1], dir: "R" }
  return calcEnergized(data, startingBeam)
}

function part2(data: Data): number {
  let startBeams = []

  data.forEach((row, x) => {
    if (x === 0) {
      row.forEach((_tile, y) => {
        if (y === 0) {
          startBeams.push({ pos: [x, y - 1], dir: "R" })
          startBeams.push({ pos: [x - 1, y], dir: "D" })
          return
        }

        if (y === row.length - 1) {
          startBeams.push({ pos: [x, y + 1], dir: "L" })
          startBeams.push({ pos: [x - 1, y], dir: "D" })
          return
        }

        startBeams.push({ pos: [x - 1, y], dir: "D" })
      })

      return
    }

    if (x === data.length - 1) {
      row.forEach((_tile, y) => {
        if (y === 0) {
          startBeams.push({ pos: [x, -1], dir: "R" })
          startBeams.push({ pos: [x + 1, y], dir: "U" })
          return
        }

        if (y === row.length - 1) {
          startBeams.push({ pos: [x, y + 1], dir: "L" })
          startBeams.push({ pos: [x + 1, y], dir: "U" })
          return
        }

        startBeams.push({ pos: [x + 1, y], dir: "U" })
      })

      return
    }

    startBeams.push({ pos: [x, -1], dir: "R" })
    startBeams.push({ pos: [x, row.length], dir: "L" })
  })

  return Math.max(...startBeams.map((beam) => calcEnergized(data, beam)))
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d16.txt"
const inputTestPath1 = "./src/inputs/d16-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 46)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 51)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
