import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

// type Data = { map: Map<string, string>; start: string }

type Data = {
  map: string[][]
  width: number
  height: number
  xMap: Map<number, number[][]>
  yMap: Map<number, number[][]>
  start: number[]
}

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

// function parseInput(path: string): Data {
//   const map = new Map<string, string>()
//   let start = undefined
//   fs.readFileSync(path, "utf-8")
//     .trimEnd()
//     .split("\n")
//     .forEach((line, y) =>
//       line.split("").forEach((char, x) => {
//         if (char === "^") start = `${x},${y}`
//         map.set(`${x},${y}`, char === "^" ? "." : char)
//       })
//     )
//   return { map, start }
// }

// function part1({ map, start }: Data) {
//   const backTurns = { N: "S", E: "W", S: "N", W: "E" }
//   const rightTurns = { N: "E", E: "S", S: "W", W: "N" }
//   const steps = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] }

//   let position = start
//   let direction = "N"
//   const visited = new Set<string>()
//   while (map.has(position)) {
//     if (map.get(position) === ".") visited.add(position)
//     else if (map.get(position) === "#") {
//       const [x, y] = position.split(",").map(Number)
//       const [backstepX, backstepY] = steps[backTurns[direction]]
//       position = `${x + backstepX},${y + backstepY}`
//       direction = rightTurns[direction]
//     }

//     const [x, y] = position.split(",").map(Number)
//     const [stepX, stepY] = steps[direction]
//     position = `${x + stepX},${y + stepY}`
//   }

//   return visited.size
// }

function parsePaths(map: string[][]) {
  const iMap = new Map<number, number[][]>()

  map.forEach((line, i) => {
    iMap.set(i, [])
    let path = false
    let pathStart = 0
    line.forEach((char, j) => {
      if ([".", "^"].includes(char)) {
        if (!path) {
          path = true
          pathStart = j
        }
        return
      }

      if (char === "#") {
        if (path) iMap.get(i).push([pathStart, j - 1])
        path = false
        return
      }
    })
    if (path) iMap.get(i).push([pathStart, line.length - 1])
    if (iMap.get(i).length === 0) iMap.set(i, [[0, line.length - 1]])
  })

  return iMap
}

function parseStart(map: string[][]) {
  let start: number[] = []

  map.forEach((line, x) =>
    line.forEach((char, y) => {
      if (char === "^") start = [x, y]
    })
  )

  return start
}

function parseInput(path: string): Data {
  const map = fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split(""))

  const xMap = parsePaths(map)
  const yMap = parsePaths(map[0].map((_, i) => map.map((line) => line[i])))
  const start = parseStart(map)
  const width = map[0].length
  const height = map.length

  return { map, width, height, xMap, yMap, start }
}

function part1({ width, height, xMap, yMap, start }: Data) {
  const rightTurns = { N: "E", E: "S", S: "W", W: "N" }
  let position = start
  let direction = "N"
  const visited = new Set<string>([position.toString()])
  while (1) {
    const [x, y] = position
    if (x < 1 || x > height - 2) break
    if (y < 1 || y > width - 2) break

    if (direction === "N") {
      const [pathStart, _pathEnd] = yMap.get(y).find(([start, end]) => x >= start && x <= end)
      _.range(pathStart, x).forEach((x) => visited.add([x, y].toString()))
      direction = rightTurns[direction]
      position = [pathStart, y]
      continue
    }

    if (direction === "S") {
      const [_pathStart, pathEnd] = yMap.get(y).find(([start, end]) => x >= start && x <= end)
      _.range(x, pathEnd + 1).forEach((x) => visited.add([x, y].toString()))
      direction = rightTurns[direction]
      position = [pathEnd, y]
      continue
    }

    if (direction === "E") {
      const [_pathStart, pathEnd] = xMap.get(x).find(([start, end]) => y >= start && y <= end)
      _.range(y, pathEnd + 1).forEach((y) => visited.add([x, y].toString()))
      direction = rightTurns[direction]
      position = [x, pathEnd]
      continue
    }

    if (direction === "W") {
      const [pathStart, _pathEnd] = xMap.get(x).find(([start, end]) => y >= start && y <= end)
      _.range(pathStart, y).forEach((y) => visited.add([x, y].toString()))
      direction = rightTurns[direction]
      position = [x, pathStart]
      continue
    }
  }

  return visited.size
}

function part2({ map, width, height, xMap, yMap, start }: Data) {
  const rightTurns = { N: "E", E: "S", S: "W", W: "N" }

  let count = 0
  for (let candX = 0; candX < height; candX++) {
    for (let candY = 0; candY < width; candY++) {
      if (["#", "^"].includes(map[candX][candY])) continue
      let position = start
      let direction = "N"
      const visited = new Set<string>([position.toString()])
      const mapVisited = new Map<string, number>()
      let i = 0
      while (1) {
        if (mapVisited.get(position.toString()) === visited.size) {
          console.log([candX, candY], visited.size)
          count += 1
          break
        }

        mapVisited.set(position.toString(), visited.size)
        const [x, y] = position
        if (x < 1 || x > height - 2) break
        if (y < 1 || y > width - 2) break

        if (direction === "N") {
          if (!yMap.get(y).find(([start, end]) => x >= start && x <= end)) {
            direction = rightTurns[direction]
            continue
          }
          let [pathStart, pathEnd] = yMap.get(y).find(([start, end]) => x >= start && x <= end)
          if (candY === y && candX >= pathStart && candX <= pathEnd) {
            pathStart = candX + 1
          }
          _.range(pathStart, x).forEach((x) => visited.add([x, y].toString()))
          direction = rightTurns[direction]
          position = [pathStart, y]
          i++
          continue
        }

        if (direction === "S") {
          if (!yMap.get(y).find(([start, end]) => x >= start && x <= end)) {
            direction = rightTurns[direction]
            continue
          }
          let [pathStart, pathEnd] = yMap.get(y).find(([start, end]) => x >= start && x <= end)
          if (candY === y && candX >= pathStart && candX <= pathEnd) {
            pathEnd = candX - 1
          }
          _.range(x, pathEnd + 1).forEach((x) => visited.add([x, y].toString()))
          direction = rightTurns[direction]
          position = [pathEnd, y]
          i++
          continue
        }

        if (direction === "E") {
          if (!xMap.get(x).find(([start, end]) => y >= start && y <= end)) {
            direction = rightTurns[direction]
            continue
          }
          let [pathStart, pathEnd] = xMap.get(x).find(([start, end]) => y >= start && y <= end)
          if (candX === x && candY >= pathStart && candY <= pathEnd) {
            pathEnd = candY + 1
          }
          _.range(y, pathEnd + 1).forEach((y) => visited.add([x, y].toString()))
          direction = rightTurns[direction]
          position = [x, pathEnd]
          i++
          continue
        }

        if (direction === "W") {
          if (!xMap.get(x).find(([start, end]) => y >= start && y <= end)) {
            direction = rightTurns[direction]
            continue
          }
          let [pathStart, pathEnd] = xMap.get(x).find(([start, end]) => y >= start && y <= end)
          if (candX === x && candY >= pathStart && candY <= pathEnd) {
            pathStart = candY - 1
          }
          _.range(pathStart, y).forEach((y) => visited.add([x, y].toString()))
          direction = rightTurns[direction]
          position = [x, pathStart]
          i++
          continue
        }
      }
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
