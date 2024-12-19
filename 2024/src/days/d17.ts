import assert from "assert"
import * as fs from "fs"
import _ from "lodash"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = { registers: number[]; program: number[] }

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): Data {
  let mode = "registers"
  const registers = []
  let program = []
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      if (line === "") mode = "program"
      else if (mode === "registers") registers.push(Number(line.split(": ")[1]))
      else program = line.split(": ")[1].split(",").map(Number)
    })

  return { registers, program }
}

function getComboOperand(operand: number, regA: number, regB: number, regC: number) {
  if (operand >= 0 && operand <= 3) return operand
  if (operand === 4) return regA
  if (operand === 5) return regB
  if (operand === 6) return regC
  if (operand === 7) console.log("Not valid operand!")
}

function runProgram(registers: number[], program: number[]) {
  let [regA, regB, regC] = registers
  let pointer = 0
  const output = []
  while (pointer < program.length - 1) {
    const opcode = program[pointer]
    const operand = program[pointer + 1]
    const comboOperand = getComboOperand(operand, regA, regB, regC)

    // adv
    if (opcode === 0) {
      regA = Math.trunc(regA / 2 ** comboOperand)
      pointer += 2
    }
    // bxl
    else if (opcode === 1) {
      regB = Number(BigInt(regB) ^ BigInt(operand))
      pointer += 2
    }
    // bst
    else if (opcode === 2) {
      regB = comboOperand % 8
      pointer += 2
    }
    // jnz
    else if (opcode === 3) {
      if (regA !== 0) pointer = operand
      else pointer += 2
    }
    // bxc
    else if (opcode === 4) {
      regB = Number(BigInt(regB) ^ BigInt(regC))
      pointer += 2
    }
    // out
    else if (opcode === 5) {
      output.push(comboOperand % 8)
      pointer += 2
    }
    // bdv
    else if (opcode === 6) {
      regB = Math.trunc(regA / 2 ** comboOperand)
      pointer += 2
    }
    // cdv
    else {
      regC = Math.trunc(regA / 2 ** comboOperand)
      pointer += 2
    }
  }

  return output
}

function part1({ registers, program }: Data) {
  return runProgram(registers, program).join(",")
}

function part2({ registers, program }: Data) {
  let digit = program.length - 1
  let candidates = new Map<number, number[]>()
  candidates.set(digit + 1, [8 ** digit])
  while (digit >= 0) {
    candidates.set(digit, [])
    for (const candidate of candidates.get(digit + 1)) {
      for (let offset = 0; offset < 8; offset++) {
        const regA = candidate + 8 ** digit * offset
        const output = runProgram([regA, registers[1], registers[2]], program)
        if (output[digit] === program[digit]) candidates.get(digit).push(regA)
        if (_.isEqual(output, program)) return regA
      }
    }

    digit -= 1
  }
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d17.txt"
const inputTestPath1 = "./src/inputs/d17-t1.txt"
const inputTestPath2 = "./src/inputs/d17-t2.txt"
const inputTestPath3 = "./src/inputs/d17-t3.txt"

export function runPart1() {
  console.log("Test 2: ", part1(parseInput(inputTestPath2)))
  assert(part1(parseInput(inputTestPath2)) === "0,1,2")
  console.log("Test 3: ", part1(parseInput(inputTestPath3)))
  assert(part1(parseInput(inputTestPath3)) === "4,2,5,6,7,7,7,7,3,1,0")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === "4,6,3,5,6,3,5,2,1,0")

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  // console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  // assert(part2(parseInput(inputTestPath1)) === 117440)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
