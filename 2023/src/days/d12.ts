import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Rules = number[]
type Row = string
type Record = { row: Row; rules: Rules }
type Data = Record[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [rowStr, rulesStr] = line.trim().split(" ")
      const row = rowStr.trim()
      const rules = rulesStr.split(",").map(Number)
      return { row, rules }
    })
}

function evaluateRow(row: Row, rule: number) {
  const regex = new RegExp(`^\\.*#{${rule}}\\.*$`)
  const match = regex.exec(row)
  return Boolean(match)
}

// function part1(data: Data): number {
//   let count = 0

//   data.forEach((record) => {
//     const missing = _.sum(record.rules) - record.row.filter((elem) => elem === "#").length
//     const placeholders = record.row.map((elem, index) => (elem === "?" ? index : elem)).filter((elem) => isNumber(elem))
//     const combinations = getCombinations(placeholders, missing)
//     combinations.forEach((combination) => {
//       let row = [...record.row]
//       combination.forEach((index) => (row[index] = "#"))
//       row = row.map((elem) => (elem === "?" ? "." : elem))
//       const valid = evaluateRow(row, record.rules)
//       count += Number(valid)
//     })
//   })

//   return count
// }

let cache = new Map<string, number>()
function calcArrangements(row: Row, rules: Rules) {
  row = row.replaceAll(/\.+/g, ".").replace(/^\.+/g, "")

  const hash = `${row}:${rules.join("-")}`
  if (cache.has(hash)) {
    return cache.get(hash)
  }

  if (row === "") {
    return rules.length === 0
  }

  const group = row.match(/^#+\./g)?.at(0)
  if (group) {
    if (!evaluateRow(group, rules[0])) {
      return 0
    }

    const restRow = row.replace(/^#+\./, "")
    const restRules = rules.slice(1)
    const arrangements = calcArrangements(restRow, restRules)
    cache.set(hash, arrangements)
    return arrangements
  }

  const withSpring = row.replace("?", "#")
  const withSpace = row.replace("?", ".")
  const arrangements = calcArrangements(withSpring, rules) + calcArrangements(withSpace, rules)
  cache.set(hash, arrangements)
  return arrangements
}

function part1(data: Data): number {
  return data.reduce((sum, line) => {
    const arrangements = calcArrangements(line.row + ".", line.rules)
    return sum + arrangements
  }, 0)
}

function part2(data: Data): number {
  return data.reduce((sum, line) => {
    const row = `${line.row}?${line.row}?${line.row}?${line.row}?${line.row}.`
    const rules = [...line.rules, ...line.rules, ...line.rules, ...line.rules, ...line.rules]
    const arrangements = calcArrangements(row, rules)
    return sum + arrangements
  }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d12.txt"
const inputTestPath1 = "./src/inputs/d12-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 21)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 525152)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
