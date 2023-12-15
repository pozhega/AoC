import assert from "assert"
import { LinkedList, LinkedListNode } from "datastructures-js"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Box = LinkedList<{ label: string; focalLength: number }>[]
type Group = string[]
type Data = Group[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")[0]
    .trim()
    .split(",")
    .map((item) => item.split(""))
}

function calcHash(group: Group) {
  return group.reduce((hash, item) => {
    return ((hash + item.charCodeAt(0)) * 17) % 256
  }, 0)
}

function part1(data: Data): number {
  return data.reduce((sum, group) => sum + calcHash(group), 0)
}

function part2(data: Data): number {
  const boxes: Box = new Array(256).fill(null).map(() => new LinkedList())

  data.forEach((group) => {
    const operation = group.includes("=") ? "=" : "-"

    if (operation === "-") {
      const label = group.join("").split("-")[0]
      const boxNumber = calcHash(label.split(""))
      const existingLensPosition = boxes[boxNumber]
        .toArray()
        .map((node, index) => [node, index])
        .filter((val) => (val[0] as LinkedListNode).getValue().label === label)
        .at(0)
      if (existingLensPosition) {
        boxes[boxNumber].removeAt(existingLensPosition[1] as number)
      }
    }

    if (operation === "=") {
      const label = group.join("").split("=")[0]
      const focalLength = Number(group.join("").split("=")[1])
      const boxNumber = calcHash(label.split(""))

      if (boxes[boxNumber].isEmpty()) {
        boxes[boxNumber].insertFirst({ label, focalLength })
        return
      }

      const existingLens = boxes[boxNumber].find((node) => node.getValue().label === label)
      if (existingLens) {
        existingLens.setValue({ label, focalLength })
        return
      }

      boxes[boxNumber].insertLast({ label, focalLength })
    }
  })

  return boxes.reduce((power, box, index) => {
    box.forEach((node, position) => {
      power += (index + 1) * (position + 1) * node.getValue().focalLength
    })
    return power
  }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d15.txt"
const inputTestPath1 = "./src/inputs/d15-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 1320)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 145)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
