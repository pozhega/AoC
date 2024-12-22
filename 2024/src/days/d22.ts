import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = number[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs.readFileSync(path, "utf-8").trimEnd().split("\n").map(Number)
}

function nextSecret(secret: number) {
  let result: number
  result = Number(BigInt(secret * 64) ^ BigInt(secret)) % 16777216
  result = Number(BigInt(Math.floor(result / 32)) ^ BigInt(result)) % 16777216
  result = Number(BigInt(result * 2048) ^ BigInt(result)) % 16777216
  return result
}

function part1(data: Data) {
  return data.reduce((count, secret) => {
    for (let i = 1; i < 2001; i++) {
      secret = nextSecret(secret)
    }

    return (count += secret)
  }, 0)
}

function part2(data: Data) {
  const trends = data.map((secret) => {
    const secretTrends = []
    let prevPrice = 0
    for (let i = 1; i < 2001; i++) {
      const bananas = Number(secret.toString().at(-1))
      const trend = bananas - prevPrice
      secretTrends.push([bananas, trend])
      prevPrice = bananas
      secret = nextSecret(secret)
    }
    return secretTrends
  })

  const visited = new Set<string>()
  const sequences = new Map<string, number>()
  trends.forEach((secretTrends, j) => {
    for (let i = 1; i < secretTrends.length - 4; i += 1) {
      const sequence = [secretTrends[i][1], secretTrends[i + 1][1], secretTrends[i + 2][1], secretTrends[i + 3][1]].toString()
      const secretSequenceKey = `${sequence},${j}`
      if (visited.has(secretSequenceKey)) continue
      sequences.set(sequence, (sequences.get(sequence) || 0) + secretTrends[i + 3][0])
      visited.add(secretSequenceKey)
    }
  })

  return Math.max(...sequences.values())
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d22.txt"
const inputTestPath1 = "./src/inputs/d22-t1.txt"
const inputTestPath2 = "./src/inputs/d22-t2.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 37327623)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath2)))
  assert(part2(parseInput(inputTestPath2)) === 23)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
