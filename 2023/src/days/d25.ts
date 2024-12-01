import assert from "assert"
import { Queue } from "datastructures-js"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Graph = Map<string, string[]>
type Data = { graph: Graph; wires: [string, string][]; components: Set<string> }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const graph = new Map<string, string[]>()
  const wires = []
  const components = new Set<string>()

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [from, tos] = line.trim().split(": ")
      tos.split(" ").forEach((to) => {
        components.add(from)
        components.add(to)
        graph.set(from, [...(graph.get(from) ?? []), to])
        graph.set(to, [...(graph.get(to) ?? []), from])
        wires.push([from, to])
      })
    })

  return { graph, wires, components }
}

function isReachable(graph: Graph, start: string, end: string, invalids: object) {
  const visited = new Set<string>()
  const queue = new Queue<string>([start])
  while (!queue.isEmpty()) {
    const node = queue.dequeue()
    if (node === end) return true
    if (visited.has(node)) continue
    visited.add(node)
    graph.get(node)?.forEach((next) => {
      if (invalids[node] && next === invalids[node]) return
      queue.enqueue(next)
    })
  }

  return false
}

function countReachable(graph: Graph, start: string, invalids: object) {
  const visited = new Set<string>()
  const queue = new Queue<string>([start])
  while (!queue.isEmpty()) {
    const node = queue.dequeue()
    if (visited.has(node)) continue
    visited.add(node)
    graph.get(node)?.forEach((next) => {
      if (invalids[node] && next === invalids[node]) return
      queue.enqueue(next)
    })
  }

  return visited.size
}

function part1(data: Data) {
  const { graph, wires } = data
  for (let i = 0; i < wires.length; i++) {
    for (let j = i + 1; j < wires.length; j++) {
      for (let k = j + 1; k < wires.length; k++) {
        const candidates = [wires[i], wires[j], wires[k]]
        const invalids = {
          [wires[i][0]]: wires[i][1],
          [wires[i][1]]: wires[i][0],
          [wires[j][0]]: wires[j][1],
          [wires[j][1]]: wires[j][0],
          [wires[k][0]]: wires[k][1],
          [wires[k][1]]: wires[k][0]
        }

        const isSeparated = candidates.every(([from, to]) => !isReachable(graph, from, to, invalids))
        if (isSeparated) {
          const reachable1 = countReachable(graph, wires[i][0], invalids)
          const reachable2 = countReachable(graph, wires[i][1], invalids)
          return reachable1 * reachable2
        }
      }
    }
  }

  return -1
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d25.txt"
const inputTestPath1 = "./src/inputs/d25-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 54)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}
