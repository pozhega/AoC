import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type TransformerMap = { sourceStart: number; destinationStart: number; range: number }
type Transformer = {
  from: string
  to: string
  maps: TransformerMap[]
}
type Data = { seeds: number[]; transformers: Transformer[] }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  let seeds: number[]
  let transformers: Transformer[] = []
  let currentTransformer: Transformer

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line, index) => {
      if (line.trim() === "") {
        return
      }

      if (index === 0) {
        seeds = line.split(":")[1].trim().split(" ").map(Number)
        return
      }

      if (line.trim().endsWith("map:")) {
        const [from, to] = line.split("map:")[0].trim().split("-to-")
        currentTransformer = { from, to, maps: [] }
        transformers.push({ ...currentTransformer })
        return
      }

      const [destinationStart, sourceStart, range] = line.trim().split(" ").map(Number)
      currentTransformer.maps.push({ sourceStart, destinationStart, range })
    })

  return { seeds, transformers }
}

function findNearestBiggerSource(maps: TransformerMap[], seed: number) {
  return maps
    .map((map) => map.sourceStart)
    .filter((sourceStart) => sourceStart > seed)
    .toSorted((a, b) => a - b)
    .at(0)
}

function findSeedMap(maps: TransformerMap[], seed: number): TransformerMap {
  return maps.find((map) => seed >= map.sourceStart && seed < map.sourceStart + map.range)
}

function part1(data: Data): number {
  const mappedSeeds = data.seeds.map((seed) => {
    return data.transformers.reduce((newSeed, transformer) => {
      const map = findSeedMap(transformer.maps, newSeed)
      if (!map) return newSeed
      return map.destinationStart + newSeed - map.sourceStart
    }, seed)
  })

  return Math.min(...mappedSeeds)
}

function part2(data: Data): number {
  const seedPairs = _.chunk(data.seeds, 2)

  let lowestSeed = Infinity
  seedPairs.forEach(([fromSeed, toSeed]) => {
    let currentSeed = fromSeed
    while (currentSeed < fromSeed + toSeed) {
      let minLeft = Infinity
      const locationSeed = data.transformers.reduce((newSeed, transformer) => {
        const map = findSeedMap(transformer.maps, newSeed)
        if (!map) {
          const nearestBiggerSource = findNearestBiggerSource(transformer.maps, newSeed)
          if (nearestBiggerSource) minLeft = Math.min(minLeft, nearestBiggerSource - newSeed - 1)
          return newSeed
        }

        const mappedSeed = map.destinationStart + newSeed - map.sourceStart
        minLeft = Math.min(minLeft, map.sourceStart + map.range - newSeed - 1)
        return mappedSeed
      }, currentSeed)

      lowestSeed = Math.min(locationSeed, lowestSeed)
      currentSeed += minLeft + 1
    }
  })

  return lowestSeed
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d5.txt"
const inputTestPath1 = "./src/inputs/d5-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.timeEnd("Time")
  assert(part1(parseInput(inputTestPath1)) === 35)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.timeEnd("Time")
  assert(part2(parseInput(inputTestPath1)) === 46)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
