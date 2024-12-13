import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = string[][]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split(""))
}

function getNeigbours(data: Data, position: number[]) {
  const [x, y] = position
  // prettier-ignore
  return [[x, y - 1], [x - 1, y], [x, y + 1], [x + 1, y]]
}

function part1(data: Data) {
  const visited = new Set<string>()
  const fences = new Map<string, number[]>()
  data.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (visited.has(`${x},${y}`)) return
      const region = data[x][y]
      let perimiter = 0
      let area = 0
      const queue = [[x, y]]
      while (queue.length) {
        const [x, y] = queue.shift()
        const plant = data[x] && data[x][y]

        if (plant === region && !visited.has(`${x},${y}`)) {
          visited.add(`${x},${y}`)
          area++

          getNeigbours(data, [x, y]).forEach(([x, y]) => queue.push([x, y]))
          continue
        }

        if (plant !== region) perimiter++
      }

      fences.set(`${region}-${[x, y]}`, [area, perimiter])
    })
  })

  return fences.entries().reduce((sum, [, [area, perimiter]]) => sum + area * perimiter, 0)
}

function part2(data: Data) {
  const visited = new Set<string>()
  const fences = new Map<string, any[]>()
  data.forEach((row, x) => {
    row.forEach((region, y) => {
      if (visited.has(`${x},${y}`)) return
      let perimiter = { yl: [], yr: [], xt: [], xb: [] }
      let area = 0
      const queue = [[x, y]]
      while (queue.length) {
        const [x, y] = queue.shift()

        if (visited.has(`${x},${y}`)) continue
        visited.add(`${x},${y}`)
        area++

        if (!data[x - 1] || data[x - 1][y] !== region) perimiter.xt.push([x - 1, y])
        else queue.push([x - 1, y])

        if (!data[x + 1] || data[x + 1][y] !== region) perimiter.xb.push([x + 1, y])
        else queue.push([x + 1, y])

        if (!data[x][y - 1] || data[x][y - 1] !== region) perimiter.yl.push([x, y - 1])
        else queue.push([x, y - 1])

        if (!data[x][y + 1] || data[x][y + 1] !== region) perimiter.yr.push([x, y + 1])
        else queue.push([x, y + 1])
      }

      fences.set(`${region}-${Math.random()}`, [area, perimiter])
    })
  })

  let count = 0
  fences.entries().forEach(([key, [area, perimiter]]) => {
    const xtPerimiter = Object.values(Object.groupBy(perimiter.xt, ([x, y]) => x)).map((x) => x.toSorted())
    const xbPerimiter = Object.values(Object.groupBy(perimiter.xb, ([x, y]) => x)).map((x) => x.toSorted())
    const ylPerimiter = Object.values(Object.groupBy(perimiter.yl, ([x, y]) => y)).map((x) => x.toSorted())
    const yrPerimiter = Object.values(Object.groupBy(perimiter.yr, ([x, y]) => y)).map((x) => x.toSorted())

    let permiterCount = 0
    let lastPosition = undefined

    for (const xPerimiter of [xtPerimiter, xbPerimiter]) {
      for (const xLine of xPerimiter) {
        permiterCount++
        lastPosition = undefined
        for (const position of xLine) {
          if (lastPosition && (position[1] - lastPosition[1] > 1 || position[1] - lastPosition[1] === 0)) permiterCount++
          lastPosition = position
        }
      }
    }

    for (const yPerimiter of [ylPerimiter, yrPerimiter]) {
      for (const yLine of yPerimiter) {
        permiterCount++
        lastPosition = undefined
        for (const position of yLine) {
          if (lastPosition && (position[0] - lastPosition[0] > 1 || position[0] - lastPosition[0] === 0)) permiterCount++
          lastPosition = position
        }
      }
    }

    count += area * permiterCount
  })

  return count
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d12.txt"
const inputTestPath1 = "./src/inputs/d12-t1.txt"
const inputTestPath2 = "./src/inputs/d12-t2.txt"
const inputTestPath3 = "./src/inputs/d12-t3.txt"
const inputTestPath4 = "./src/inputs/d12-t4.txt"
const inputTestPath5 = "./src/inputs/d12-t5.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 1930)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 1206)

  console.log("Test 3: ", part2(parseInput(inputTestPath2)))
  assert(part2(parseInput(inputTestPath2)) === 236)

  console.log("Test 4: ", part2(parseInput(inputTestPath3)))
  assert(part2(parseInput(inputTestPath3)) === 368)

  console.log("Test 5: ", part2(parseInput(inputTestPath4)))
  assert(part2(parseInput(inputTestPath4)) === 80)

  console.log("Test 6: ", part2(parseInput(inputTestPath5)))
  assert(part2(parseInput(inputTestPath5)) === 436)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
