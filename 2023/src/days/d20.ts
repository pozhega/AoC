import assert from "assert"
import { Queue } from "datastructures-js"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type ModuleType = "broadcaster" | "conjuction" | "flip-flop"
type Module = { type: ModuleType; alive: boolean; memory: Map<string, number>; nodes: string[] }
type Data = Map<string, Module>

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const modules = new Map<string, Module>()

  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      const [fromRaw, toRaw] = line.trim().split(" -> ")

      let from: string
      let type: ModuleType
      if (fromRaw.includes("%")) {
        from = fromRaw.replace("%", "")
        type = "flip-flop"
      } else if (fromRaw.includes("&")) {
        from = fromRaw.replace("&", "")
        type = "conjuction"
      } else {
        from = fromRaw
        type = "broadcaster"
      }

      const to = toRaw.split(", ")

      modules.set(from, { type, alive: false, memory: new Map(), nodes: to })
    })

  Array.from(modules.keys()).forEach((node) => {
    const module = modules.get(node)
    if (module.type === "conjuction") {
      Array.from(modules.keys()).forEach((candidateNode) => {
        const candidateModule = modules.get(candidateNode)
        if (candidateModule.nodes.includes(node)) {
          module.memory.set(candidateNode, 0)
        }
      })
    }
  })

  return modules
}

function part1(data: Data) {
  let lowPulses = 0
  let highPulses = 0

  _.range(1000).forEach((i) => {
    lowPulses++
    const queue = new Queue<[string, string, number]>([["button", "broadcaster", 0]])
    while (!queue.isEmpty()) {
      const [from, to, pulse] = queue.dequeue()
      const module = data.get(to)
      if (!module) continue

      let sendPulse = null

      if (module.type === "broadcaster") {
        sendPulse = pulse
      }

      if (module.type === "flip-flop") {
        if (pulse === 1) continue
        module.alive = !module.alive
        sendPulse = Number(module.alive)
      }

      if (module.type === "conjuction") {
        module.memory.set(from, pulse)
        sendPulse = Number(!Array.from(module.memory.values()).every((pulse) => pulse === 1))
      }

      if (sendPulse !== null) {
        module.nodes.forEach((node) => {
          sendPulse === 0 ? lowPulses++ : highPulses++
          queue.push([to, node, sendPulse])
        })
      }
    }
  })

  return lowPulses * highPulses
}

function part2(data: Data) {
  let found = false
  let buttonPress = 0

  const qlMemoryCycles = _.cloneDeep(data.get("ql").memory)
  const qrMemoryDetected = _.cloneDeep(data.get("ql").memory)

  while (true) {
    buttonPress++
    const queue = new Queue<[string, string, number]>([["button", "broadcaster", 0]])
    while (!queue.isEmpty()) {
      const [from, to, pulse] = queue.dequeue()
      const module = data.get(to)
      if (!module) {
        continue
      }

      let sendPulse = null

      if (module.type === "broadcaster") {
        sendPulse = pulse
      }

      if (module.type === "flip-flop") {
        if (pulse === 1) continue
        module.alive = !module.alive
        sendPulse = Number(module.alive)
      }

      if (module.type === "conjuction") {
        module.memory.set(from, pulse)
        if (to === "ql" && pulse === 1) {
          console.log(from, pulse, buttonPress)
        }
        sendPulse = Number(!Array.from(module.memory.values()).every((pulse) => pulse === 1))
      }

      if (sendPulse !== null) {
        module.nodes.forEach((node) => {
          queue.push([to, node, sendPulse])
        })
      }
    }
  }

  return buttonPress
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d20.txt"
const inputTestPath1 = "./src/inputs/d20-t1.txt"
const inputTestPath2 = "./src/inputs/d20-t2.txt"

export function runPart1() {
  console.time("Time")
  const test1 = part1(parseInput(inputTestPath1))
  console.log("Test 1: ", test1)
  console.time("Time")
  assert(test1 === 32000000)

  console.time("Time")
  const test2 = part1(parseInput(inputTestPath2))
  console.log("Test 2: ", test2)
  console.time("Time")
  assert(test2 === 11687500)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
