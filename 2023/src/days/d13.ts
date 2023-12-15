import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Map = string[][]
type Data = Map[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const maps = []
  let currentMap = []
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      if (line.trim() === "") {
        maps.push(currentMap)
        currentMap = []
        return
      }

      currentMap.push(line.trim().split(""))
    })
  maps.push(currentMap)
  return maps
}

function getCols(map: Map) {
  const cols = new Array(map[0].length).fill(null).map(() => new Array(map.length).fill(null))
  for (let col = 0; col < cols.length; col++) {
    map.forEach((row) => {
      cols[col].push(row[col])
    })
  }
  return cols
}

function findLines(map: Map) {
  const lines = []
  for (let line = 0; line < map.length - 1; line++) {
    if (_.isEqual(map[line], map[line + 1])) {
      let i = line - 1
      let j = line + 2
      while (true) {
        if (i < 0 || j > map.length - 1) {
          lines.push(line + 1)
          break
        }

        if (!_.isEqual(map[i], map[j])) {
          break
        }

        i--
        j++
      }
    }
  }

  return lines
}

function part1(data: Data): number {
  let verticalCnt = 0
  let horizontalCnt = 0

  data.forEach((rows) => {
    const cols = getCols(rows).map((col) => col)
    const vertical = findLines(cols)[0]
    const horizontal = findLines(rows)[0]

    if (vertical && !horizontal) {
      verticalCnt += vertical
    }

    if (horizontal && !vertical) {
      horizontalCnt += horizontal
    }
  })

  return verticalCnt + horizontalCnt * 100
}

function part2(data: Data): number {
  let verticalCnt = 0
  let horizontalCnt = 0

  data.forEach((rows) => {
    const cols = getCols(rows)
    const vertical = findLines(cols)[0]
    const horizontal = findLines(rows)[0]
    let originalLine = null

    if (vertical && !horizontal) {
      originalLine = ["vertical", vertical]
    }

    if (horizontal && !vertical) {
      originalLine = ["horizontal", horizontal]
    }

    let match = false
    for (let row = 0; row < rows.length; row++) {
      if (match) {
        break
      }

      for (let col = 0; col < rows[0].length; col++) {
        const newRows = _.cloneDeep(rows)
        newRows[row][col] = newRows[row][col] === "#" ? "." : "#"
        const newCols = getCols(newRows)
        let newVerticals = findLines(newCols)
        let newHorizontals = findLines(newRows)

        newVerticals = newVerticals.filter((v) => v !== originalLine[1] || originalLine[0] !== "vertical")
        newHorizontals = newHorizontals.filter((h) => h !== originalLine[1] || originalLine[0] !== "horizontal")

        if (newVerticals.length === 1 && newHorizontals.length === 0) {
          verticalCnt += newVerticals[0]
          match = true
          break
        }

        if (newHorizontals.length === 1 && newVerticals.length === 0) {
          horizontalCnt += newHorizontals[0]
          match = true
          break
        }
      }
    }
  })

  return verticalCnt + horizontalCnt * 100
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d13.txt"
const inputTestPath1 = "./src/inputs/d13-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 405)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 400)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
