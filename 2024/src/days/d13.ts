import assert from "assert"
import * as fs from "fs"
// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
type Machine = { buttonA: [number, number]; buttonB: [number, number]; prize: [number, number] }
type Data = Machine[]
// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------
function parseInput(path: string): Data {
  const machines = []
  let buttonA, buttonB, prize
  fs.readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .forEach((line) => {
      if (line.trim() === "") machines.push({ buttonA, buttonB, prize })
      else if (line.startsWith("Button A"))
        buttonA = line
          .split(": ")[1]
          .split(", ")
          .map((x) => Number(x.split("+")[1]))
      else if (line.startsWith("Button B"))
        buttonB = line
          .split(": ")[1]
          .split(", ")
          .map((x) => Number(x.split("+")[1]))
      else if (line.startsWith("Prize"))
        prize = line
          .split(": ")[1]
          .split(", ")
          .map((x) => Number(x.split("=")[1]))
    })
  machines.push({ buttonA, buttonB, prize })
  return machines
}
function getTokens(buttonA: [number, number], buttonB: [number, number], prize: [number, number]) {
  const aX = buttonA[0]
  const aY = buttonA[1]
  const bX = buttonB[0]
  const bY = buttonB[1]
  const pX = prize[0]
  const pY = prize[1]
  const bPress = (pY * aX - aY * pX) / (bY * aX - bX * aY)
  const aPress = (pX - bX * bPress) / aX
  if (bPress === Math.floor(bPress) && aPress === Math.floor(aPress)) return aPress * 3 + bPress
  else return 0
}
function part1(data: Data) {
  return data.reduce((total, { buttonA, buttonB, prize }) => total + getTokens(buttonA, buttonB, prize), 0)
}
function part2(data: Data) {
  return data.reduce(
    (total, { buttonA, buttonB, prize }) => total + getTokens(buttonA, buttonB, [prize[0] + 10000000000000, prize[1] + 10000000000000]),
    0
  )
}
// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------
const inputPath = "./src/inputs/d13.txt"
const inputTestPath1 = "./src/inputs/d13-t1.txt"
export function runPart1() {
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 480)
  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}
export function runPart2() {
  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
