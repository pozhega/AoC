import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Range = [number, number]
type Part = { x: number; m: number; a: number; s: number }
type Workflows = Map<string, string[]>
type Data = { parts: Part[]; workflows: Workflows }

// px{a<2006:qkq,m>2090:A,rfg}
// pv{a>1716:R,A}
// lnx{m>1548:A,A}
// rfg{s<537:gd,x>2440:R,A}
// qs{s>3448:A,lnx}
// qkq{x<1416:A,crn}
// crn{x>2662:A,R}
// in{s<1351:px,qqz}
// qqz{s>2770:qs,m<1801:hdj,R}
// gd{a>3333:R,R}
// hdj{m>838:A,pv}

// {x=787,m=2655,a=1222,s=2876}
// {x=1679,m=44,a=2067,s=496}
// {x=2036,m=264,a=79,s=2244}
// {x=2461,m=1339,a=466,s=291}
// {x=2127,m=1623,a=2188,s=1013}

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  const workflows = new Map<string, string[]>()
  const parts = []
  let part = "workflows"
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      if (line.trim() === "") {
        part = "parts"
        return
      }

      if (part === "workflows") {
        const [id, rest] = line.split("{")
        const conditionsRaw = rest.replace("}", "")
        const conditions = conditionsRaw.split(",")
        workflows.set(id, conditions)
      }

      if (part === "parts") {
        line = line.replace("{", "").replace("}", "")
        const [xRaw, mRaw, aRaw, sRaw] = line.split(",")
        const x = Number(xRaw.split("=")[1])
        const m = Number(mRaw.split("=")[1])
        const a = Number(aRaw.split("=")[1])
        const s = Number(sRaw.split("=")[1])
        parts.push({ x, m, a, s })
      }
    })

  return { workflows, parts }
}

function intersectRanges(ranges: Range[]): Range[] {
  if (ranges.length < 2) return ranges

  const [range1, range2] = ranges
  const start = Math.max(range1[0], range2[0])
  const end = Math.min(range1[1], range2[1])

  return start <= end ? [[start, end]] : [[0, 0]]
}

function part1(data: Data) {
  const { workflows, parts } = data

  return parts.reduce((sum, part) => {
    let workflow = "in"

    while (!["A", "R"].includes(workflow)) {
      const conditions = workflows.get(workflow)
      for (const condition of conditions) {
        const operator = condition.includes(">") ? ">" : condition.includes("<") ? "<" : null
        if (!operator) {
          workflow = condition
          break
        }

        if (operator === ">") {
          const [expression, targetWorkflow] = condition.split(":")
          const [key, value] = expression.split(">")
          if (part[key] > Number(value)) {
            workflow = targetWorkflow
            break
          }
        }

        if (operator === "<") {
          const [expression, targetWorkflow] = condition.split(":")
          const [key, value] = expression.split("<")
          if (part[key] < Number(value)) {
            workflow = targetWorkflow
            break
          }
        }
      }
    }

    return (sum += workflow === "A" ? Object.values(part).reduce((a, b) => a + b) : 0)
  }, 0)
}

function part2(data: Data) {
  const reverseWorkflows = new Map<string, any>()
  const acceptedWorkflows = []
  for (const [id, conditions] of data.workflows) {
    const falseRanges = { x: [[1, 4000]], m: [[1, 4000]], a: [[1, 4000]], s: [[1, 4000]] }
    for (const condition of conditions) {
      const operator = condition.includes(">") ? ">" : condition.includes("<") ? "<" : null
      if (!operator) {
        if (condition == "R") continue
        if (condition === "A") {
          acceptedWorkflows.push({ ranges: falseRanges, parent: id })
        } else {
          reverseWorkflows.set(condition, { ranges: falseRanges, parent: id })
        }
      }

      if (operator === ">") {
        const [expression, targetWorkflow] = condition.split(":")
        const [key, value] = expression.split(">")

        if (targetWorkflow !== "R") {
          const trueRanges = _.cloneDeep(falseRanges)
          trueRanges[key] = intersectRanges([...trueRanges[key], [Number(value) + 1, 4000]])
          if (targetWorkflow === "A") {
            acceptedWorkflows.push({ ranges: trueRanges, parent: id })
          } else {
            reverseWorkflows.set(targetWorkflow, { ranges: trueRanges, parent: id })
          }
        }

        falseRanges[key] = intersectRanges([...falseRanges[key], [1, Number(value)]])
      }

      if (operator === "<") {
        const [expression, targetWorkflow] = condition.split(":")
        const [key, value] = expression.split("<")

        if (targetWorkflow !== "R") {
          const trueRanges = _.cloneDeep(falseRanges)
          trueRanges[key] = intersectRanges([...trueRanges[key], [1, Number(value) - 1]])
          if (targetWorkflow === "A") {
            acceptedWorkflows.push({ ranges: trueRanges, parent: id })
          } else {
            reverseWorkflows.set(targetWorkflow, { ranges: trueRanges, parent: id })
          }
        }

        falseRanges[key] = intersectRanges([...falseRanges[key], [Number(value), 4000]])
      }
    }
  }

  const acceptedCominbations = acceptedWorkflows.map((acceptedWorkflow) => {
    let parent = acceptedWorkflow.parent
    let ranges = _.cloneDeep(acceptedWorkflow.ranges)
    while (parent !== "in") {
      const workflow = reverseWorkflows.get(parent)
      ranges = {
        x: intersectRanges([...ranges.x, ...workflow.ranges.x]),
        m: intersectRanges([...ranges.m, ...workflow.ranges.m]),
        a: intersectRanges([...ranges.a, ...workflow.ranges.a]),
        s: intersectRanges([...ranges.s, ...workflow.ranges.s])
      }
      parent = workflow.parent
    }

    return (
      (ranges.x[0][1] - ranges.x[0][0] + 1) *
      (ranges.m[0][1] - ranges.m[0][0] + 1) *
      (ranges.a[0][1] - ranges.a[0][0] + 1) *
      (ranges.s[0][1] - ranges.s[0][0] + 1)
    )
  })

  return acceptedCominbations.reduce((a, b) => a + b)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d19.txt"
const inputTestPath1 = "./src/inputs/d19-t1.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part1(parseInput(inputTestPath1)) === 19114)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 167409079868000)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
