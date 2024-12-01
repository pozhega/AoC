import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Point3D = [number, number, number]
type Point2D = [number, number]
type Data = { start: Point3D; velocities: [number, number, number]; min?: Point2D | Point3D; max?: Point2D | Point3D }[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [startPoint, velocities] = line.trim().split(" @ ")
      const [startX, startY, startZ] = startPoint.trim().split(", ").map(Number)
      const [velX, velY, velZ] = velocities.trim().split(", ").map(Number)
      return {
        start: [startX, startY, startZ],
        velocities: [velX, velY, velZ]
      }
    })
}

function calculateIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number, // Coordinates for line segment 1
  x3: number,
  y3: number,
  x4: number,
  y4: number // Coordinates for line segment 2
) {
  // Line 1 represented as a1x + b1y = c1
  let a1 = y2 - y1
  let b1 = x1 - x2
  let c1 = a1 * x1 + b1 * y1

  // Line 2 represented as a2x + b2y = c2
  let a2 = y4 - y3
  let b2 = x3 - x4
  let c2 = a2 * x3 + b2 * y3

  let delta = a1 * b2 - a2 * b1

  if (delta == 0) {
    return null // Lines are parallel or coincident
  } else {
    let x = (b2 * c1 - b1 * c2) / delta
    let y = (a1 * c2 - a2 * c1) / delta

    // Check if the intersection point lies on both the line segments
    if (isInsideSegment(x, y, x1, y1, x2, y2) && isInsideSegment(x, y, x3, y3, x4, y4)) {
      return { x: x, y: y }
    } else {
      return null // The intersection point doesn't lie on both segments
    }
  }
}

function isInsideSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number): boolean {
  return x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && y >= Math.min(y1, y2) && y <= Math.max(y1, y2)
}

function findOptimalCycles(value: number, velocity: number, from: number, to: number) {
  if ((from > value && velocity < 0) || (to < value && velocity > 0)) {
    return null
  }

  let minCycles: number
  let maxCycles: number

  if (value >= from && value <= to) {
    minCycles = 0
  } else if (value < from && velocity > 0) {
    minCycles = Math.ceil(Math.abs(from - value) / Math.abs(velocity))
  } else if (value > to && velocity < 0) {
    minCycles = Math.ceil(Math.abs(to - value) / Math.abs(velocity))
  }

  if (velocity > 0) {
    maxCycles = Math.floor(Math.abs(to - value) / Math.abs(velocity))
  } else {
    maxCycles = Math.floor(Math.abs(from - value) / Math.abs(velocity))
  }

  return [minCycles, maxCycles]
}

function part1(data: Data, from: number, to: number) {
  data = data.map(({ start, velocities }) => {
    const [x, y, _z] = start
    const [velX, velY, _velZ] = velocities

    const [minXCycles, maxXCycles] = findOptimalCycles(x, velX, from, to)
    const [minYCycles, maxYCycles] = findOptimalCycles(y, velY, from, to)

    const minCycles = Math.max(minXCycles, minYCycles)
    const minX = x + velX * minCycles
    const minY = y + velY * minCycles

    const maxCycles = Math.min(maxXCycles, maxYCycles)
    const maxX = x + velX * maxCycles
    const maxY = y + velY * maxCycles

    return { start, velocities, min: [minX, minY], max: [maxX, maxY] }
  })

  let count = 0
  for (let i = 0; i < data.length; i++) {
    const {
      min: [x1, y1],
      max: [x2, y2]
    } = data[i]

    for (let j = i + 1; j < data.length; j++) {
      const {
        min: [x3, y3],
        max: [x4, y4]
      } = data[j]
      const intersection = calculateIntersection(x1, y1, x2, y2, x3, y3, x4, y4)
      if (intersection) count++
    }
  }

  return count
}

function part2(data: Data) {
  return 0
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d24.txt"
const inputTestPath1 = "./src/inputs/d24-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1), 7, 27))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1), 7, 27) === 2)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath), 200000000000000, 400000000000000))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 0)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
