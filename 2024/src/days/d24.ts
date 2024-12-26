import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = { wires: Map<string, number>; gates: Array<[string, string, string, string]> }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  let mode = "wires"
  const wires = new Map<string, number>()
  const gates = []
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      if (line === "") {
        mode = "gates"
        return
      } else if (mode === "wires") {
        const [name, value] = line.split(": ")
        wires.set(name, parseInt(value))
      } else {
        const [from, result] = line.split(" -> ")
        const [a, operator, b] = from.split(" ")
        gates.push([a, operator, b, result])
      }
    })

  return { wires, gates }
}

function gateToBinary(wires: Map<string, number>, prefix: string) {
  return Array.from(wires.keys())
    .filter((key) => key.startsWith(prefix))
    .toSorted()
    .toReversed()
    .map((key) => wires.get(key))
    .join("")
}

function binaryToDecimal(binary: string) {
  return parseInt(binary, 2)
}

function gateToDecimal(wires: Map<string, number>, key: string) {
  return binaryToDecimal(gateToBinary(wires, key))
}

function getZ(wires: Map<string, number>, gates: Set<string>) {
  let prevSize = 0
  while (gates.size) {
    if (prevSize === gates.size) return undefined
    prevSize = gates.size
    for (const gate of gates.keys()) {
      let [a, operator, b, to] = gate.split(",")

      if (!wires.has(a) || !wires.has(b)) continue
      const wireA = wires.get(a)
      const wireB = wires.get(b)

      let result: number
      if (operator === "AND") result = wireA & wireB
      else if (operator === "OR") result = wireA | wireB
      else result = wireA ^ wireB

      wires.set(to, result)
      gates.delete(gate)
    }
  }

  return gateToDecimal(wires, "z")
}

function part1({ wires, gates }: Data) {
  const gatesSet = new Set(gates.map((gate) => gate.join(",")))
  return getZ(wires, gatesSet)
}

function part2({ gates }: Data) {
  const zBinSize = gates.filter(([_, __, ___, to]) => to.startsWith("z")).length

  const reverseRules = new Map()
  const rules = new Map()
  gates.forEach(([a, operator, b, to]) => {
    rules.set(to, [a, operator, b])
    reverseRules.set([a, operator, b].toString(), to)
  })

  function expandGates(rules: Map<string, string[]>, wire: string, used = new Set<string>()) {
    used.add(wire)
    const rule = rules.get(wire)
    const [a, operator, b] = rule
    if (a.startsWith("x") || a.startsWith("y")) return [[operator, [a, b].toSorted()], used]
    if (b.startsWith("x") || b.startsWith("y")) return [[operator, [a, b].toSorted()], used]
    used.add(a)
    used.add(b)
    const [expandedA, usedA] = expandGates(rules, a, used)
    const [expandedB, usedB] = expandGates(rules, b, used)
    used = used.union(usedA)
    used = used.union(usedB)
    const expanded = [operator, [expandedA, expandedB].toSorted()]
    return [expanded, used]
  }

  function getLevelKey(level: number) {
    return level < 10 ? `0${level}` : level.toString()
  }

  function buildGates(level: number) {
    const levelKey = getLevelKey(level)
    if (level === 0) return ["XOR", ["x00", "y00"]]
    if (level === 1)
      return [
        "XOR",
        [
          ["AND", ["x00", "y00"]],
          ["XOR", ["x01", "y01"]]
        ]
      ]

    const previousLevel = buildGates(level - 1)
    previousLevel[0] = "AND"

    return [
      "XOR",
      [
        ["OR", [previousLevel, ["AND", [`x${getLevelKey(level - 1)}`, `y${getLevelKey(level - 1)}`]]]],
        ["XOR", [`x${levelKey}`, `y${levelKey}`]]
      ]
    ]
  }

  const swaps = []
  let validUsed = new Set<string>([])
  let newRules = new Map(rules)
  for (let level = 0; level < zBinSize; level++) {
    const zLevel = `z${getLevelKey(level)}`
    const expected = buildGates(level)
    const [actual, used] = expandGates(newRules, zLevel)
    const match = _.isEqual(expected, actual)
    if (match) {
      validUsed = validUsed.union(used)
      continue
    }
    let found = false
    if (!match) {
      for (const wire of rules.keys()) {
        if (swaps.flat().includes(wire)) continue
        if (validUsed.has(wire)) continue
        const alterRules = new Map(newRules)
        const wireRule = alterRules.get(wire)
        const zRule = alterRules.get(zLevel)
        alterRules.set(wire, zRule)
        alterRules.set(zLevel, wireRule)

        const [actual, used] = expandGates(alterRules, zLevel)
        const match = _.isEqual(expected, actual)

        if (match) {
          swaps.push([zLevel, wire])
          newRules = alterRules
          found = true
          validUsed = validUsed.union(used)
          break
        }
      }
    }

    if (!found) {
      const candidates = Array.from(
        used
          .keys()
          .filter((gate: string) => !swaps.flat().includes(gate))
          .filter((gate: string) => !gate.startsWith("z"))
          .filter((gate: string) => !validUsed.has(gate))
      )

      let swapPairs = []
      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          swapPairs.push([candidates[i], candidates[j]])
        }
      }

      for (const pair of swapPairs) {
        const alter2Rules = new Map(newRules)
        const wire0Rule = alter2Rules.get(pair[0])
        const wire1Rule = alter2Rules.get(pair[1])
        alter2Rules.set(pair[0], wire1Rule)
        alter2Rules.set(pair[1], wire0Rule)

        const [actual, used] = expandGates(alter2Rules, zLevel)
        const match = _.isEqual(expected, actual)

        if (match) {
          swaps.push([pair[1], pair[0]])
          newRules = alter2Rules
          validUsed = validUsed.union(used)
          break
        }
      }
    }
  }

  return swaps.flat().toSorted().join(",")
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d24.txt"
const inputTestPath1 = "./src/inputs/d24-t1.txt"
const inputTestPath2 = "./src/inputs/d24-t2.txt"

export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 4)

  console.log("Test 2: ", part1(parseInput(inputTestPath2)))
  assert(part1(parseInput(inputTestPath2)) === 2024)

  console.log("Test 3: ", part1(parseInput(inputTestPath2)))
  assert(part1(parseInput(inputTestPath2)) === 2024)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
