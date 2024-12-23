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
    .map((line) => line.split("-"))
}

function getNetwork(data: Data) {
  const network = new Map<string, Set<string>>()
  data.forEach(([node1, node2]) => {
    if (!network.has(node1)) network.set(node1, new Set([node2]))
    else network.get(node1).add(node2)

    if (!network.has(node2)) network.set(node2, new Set([node1]))
    else network.get(node2).add(node1)
  })

  return network
}

function part1(data: Data) {
  const network = getNetwork(data)

  const lans = new Set<string>()
  network.keys().forEach((node) => {
    const visited = new Set<string>()
    const queue = [{ current: node, path: [node] }]
    while (queue.length) {
      const { current, path } = queue.shift()

      if (path.length === 4 && current !== node) continue
      if (path.length === 4 && current === node) {
        lans.add(path.slice(0, 3).sort().toString())
        continue
      }

      // prettier-ignore
      network.get(current).keys().forEach((node) => queue.push({ current: node, path: [...path, node] }))
    }

    network.set(node, visited)
  })

  return Array.from(lans.keys()).filter((lan) => lan.split(",").some((node) => node.startsWith("t"))).length
}

function part2(data: Data) {
  const network = getNetwork(data)

  const lans = new Map<string, number>()
  network.keys().forEach((node) => {
    const lan = [node]
    network.get(node).forEach((connection) => {
      if (lan.every((node) => network.get(connection).has(node))) lan.push(connection)
    })
    const lanKey = lan.sort().toString()
    lans.set(lanKey, (lans.get(lanKey) || 0) + 1)
  })

  let maxLanSize = 0
  let maxLan = undefined
  lans.keys().forEach((lan) => {
    if (lans.get(lan) > maxLanSize) {
      maxLanSize = lans.get(lan)
      maxLan = lan
    }
  })

  return maxLan
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d23.txt"
const inputTestPath1 = "./src/inputs/d23-t1.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 7)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  assert(part2(parseInput(inputTestPath1)) === "co,de,ka,ta")

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
