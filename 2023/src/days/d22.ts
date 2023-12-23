import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point = [string, string, string]
type Data = { bricksToPoints: Map<string, Point[]>; pointsToBricks: Map<string, Map<string, Map<string, string>>> }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  let brickId = 1
  const bricksToPoints = new Map<string, Point[]>()

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      const [from, to] = line.trim().split("~")
      const [fromX, fromY, fromZ] = from.split(",").map(Number)
      const [toX, toY, toZ] = to.split(",").map(Number)
      let points: Point[] = []
      _.range(Math.min(fromX, toX), Math.max(fromX, toX) + 1).forEach((x) => {
        _.range(Math.min(fromY, toY), Math.max(fromY, toY) + 1).forEach((y) => {
          _.range(Math.min(fromZ, toZ), Math.max(fromZ, toZ) + 1).forEach((z) => {
            points.push([x.toString(), y.toString(), z.toString()])
          })
        })
      })
      bricksToPoints.set(brickId.toString(), points)
      brickId++
    })

  const pointsToBricks = new Map()
  bricksToPoints.forEach((points, brickId) => {
    points.forEach((point) => {
      const [x, y, z] = point as Point
      if (!pointsToBricks.has(z)) {
        pointsToBricks.set(z, new Map())
      }

      if (!pointsToBricks.get(z)?.has(x)) {
        pointsToBricks.get(z).set(x, new Map())
      }

      if (!pointsToBricks.get(z)?.get(x).has(y)) {
        pointsToBricks.get(z).get(x).set(y, brickId)
      }
    })
  })

  return { bricksToPoints, pointsToBricks }
}

function fallDown(
  bricksToPoints: Map<string, Point[]>,
  pointsToBricks: Map<string, Map<string, Map<string, string>>>,
  startLevel = 1,
  endLevel = Infinity
) {
  let fallenTotal = 0
  const levels = Array.from(pointsToBricks.keys()).toSorted((a, b) => Number(a) - Number(b))
  levels.forEach((level) => {
    if (Number(level) > endLevel) return
    if (Number(level) <= startLevel) return

    const levelBricks = new Set<string>()
    pointsToBricks.get(level).forEach((xPoints) => {
      Array.from(xPoints.values()).forEach((brickId) => {
        levelBricks.add(brickId)
      })
    })

    levelBricks.forEach((brickId) => {
      let fallen = false
      while (true) {
        const brickPoints = bricksToPoints.get(brickId)
        const canFall = brickPoints.every((point) => {
          const [x, y, z] = point
          const levelBellow = (Number(z) - 1).toString()
          const brickBellow = pointsToBricks.get(levelBellow)?.get(x)?.get(y)
          return (!brickBellow || brickBellow === brickId) && Number(levelBellow) > 0
        })

        if (!canFall) break

        bricksToPoints.set(
          brickId,
          brickPoints.map((point) => {
            const [x, y, z] = point
            const newLevel = (Number(z) - 1).toString()
            if (!pointsToBricks.has(newLevel)) pointsToBricks.set(newLevel, new Map())
            if (!pointsToBricks.get(newLevel)?.has(x)) pointsToBricks.get(newLevel)?.set(x, new Map())
            pointsToBricks.get(newLevel)?.get(x)?.set(y, brickId)
            pointsToBricks.get(z)?.get(x)?.delete(y)
            return [x, y, newLevel]
          })
        )
        fallen = true
      }

      if (fallen) {
        fallenTotal++
      }
    })
  })

  return fallenTotal
}

function part1(data: Data) {
  const { bricksToPoints, pointsToBricks } = data
  fallDown(bricksToPoints, pointsToBricks)
  let totalFallenBricks = 0
  Array.from(bricksToPoints.keys()).forEach((brickId) => {
    const newBricksToPoints = _.cloneDeep(bricksToPoints)
    const newPointsToBricks = _.cloneDeep(pointsToBricks)
    const pointsToDelete = newBricksToPoints.get(brickId)
    newBricksToPoints.delete(brickId)
    let maxLevel = 0
    pointsToDelete.forEach((point) => {
      const [x, y, z] = point
      maxLevel = Math.max(maxLevel, Number(z))
      newPointsToBricks.get(z)?.get(x)?.delete(y)
    })
    const fallenBricks = fallDown(newBricksToPoints, newPointsToBricks, maxLevel, maxLevel + 1)
    if (fallenBricks === 0) {
      totalFallenBricks++
    }
  })

  return totalFallenBricks
}

function part2(data: Data) {
  const { bricksToPoints, pointsToBricks } = data
  fallDown(bricksToPoints, pointsToBricks)
  let totalFallenBricks = 0
  Array.from(bricksToPoints.keys()).forEach((brickId) => {
    const newBricksToPoints = _.cloneDeep(bricksToPoints)
    const newPointsToBricks = _.cloneDeep(pointsToBricks)
    const pointsToDelete = newBricksToPoints.get(brickId)
    newBricksToPoints.delete(brickId)
    let maxLevel = 0
    pointsToDelete.forEach((point) => {
      const [x, y, z] = point
      maxLevel = Math.max(maxLevel, Number(z))
      newPointsToBricks.get(z)?.get(x)?.delete(y)
    })
    const fallenBricks = fallDown(newBricksToPoints, newPointsToBricks, maxLevel)
    if (fallenBricks > 0) {
      totalFallenBricks += fallenBricks
    }
  })

  return totalFallenBricks
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d22.txt"
const inputTestPath1 = "./src/inputs/d22-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 5)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 7)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
