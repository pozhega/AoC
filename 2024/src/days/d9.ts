import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = number[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => line.split("").map(Number))[0]
}

function part1(memory: Data) {
  const [blocks, spaces] = [[], []]
  // prettier-ignore
  let checksum = 0, mode = "file", blockIndex = 0, positionIndex = 0
  memory.forEach((cell) => {
    if (mode === "file") {
      _.range(0, cell).forEach(() => {
        blocks.push([positionIndex, blockIndex])
        checksum += positionIndex * blockIndex
        positionIndex++
      })

      blockIndex++
      mode = "space"
    } else {
      _.range(0, cell).forEach(() => {
        spaces.push(positionIndex)
        positionIndex++
      })

      mode = "file"
    }
  })

  blocks.reverse()
  spaces.forEach((spaceIndex, i) => {
    const [blockPositionIndex, blockindex] = blocks[i]
    if (spaceIndex >= blockPositionIndex) return
    checksum -= blockPositionIndex * blockindex
    checksum += spaceIndex * blockindex
  })

  return checksum
}

function part2(memory: Data) {
  const [blocks, spaces] = [[], []]
  // prettier-ignore
  let checksum = 0, mode = "file", blockID = 0, position = 0
  memory.forEach((cell) => {
    if (mode === "file") {
      blocks.push([position, position + cell, blockID])
      _.range(0, cell).forEach(() => {
        checksum += position * blockID
        position++
      })
      blockID++
      mode = "space"
    } else {
      spaces.push([position, position + cell])
      position += cell
      mode = "file"
    }
  })

  blocks.toReversed().forEach(([fromBlock, toBlock, blockID]) => {
    const spaceRequirement = toBlock - fromBlock
    for (let i = 0; i < spaces.length; i++) {
      const [fromSpace, toSpace] = spaces[i]
      if (fromBlock < fromSpace) break
      const spaceAvailable = toSpace - fromSpace
      if (spaceRequirement > spaceAvailable) continue

      _.range(fromBlock, toBlock).forEach((position) => (checksum -= position * blockID))
      _.range(fromSpace, fromSpace + spaceRequirement).forEach((position) => (checksum += position * blockID))
      spaces[i] = [fromSpace + spaceRequirement, toSpace]

      break
    }
  })

  return checksum
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d9.txt"
const inputTestPath1 = "./src/inputs/d9-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 1928)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === 2858)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
