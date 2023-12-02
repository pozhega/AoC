import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Data = string[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): string[] {
  return fs.readFileSync(path, "utf-8").trimEnd().split("\n")
}

function part1(data: Data): number {
  return data
    .map((line) => {
      const numbers = filterNums(line)
      return Number(numbers.at(0) + numbers.at(-1))
    })
    .reduce((a, b) => a + b)
}

function wordToNum(word: string): string {
  return {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9"
  }[word]
}

function reverseString(string: string) {
  return string.split("").reverse().join("")
}

function filterNums(string: string) {
  return Array.from(string).filter((char) => !isNaN(Number(char)))
}

function part2(data: Data): number {
  // Dynamically build regex for searching first and last word occurance
  const numWords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
  const numWordsRegex = new RegExp(numWords.join("|"), "g")
  const reverseNumWordsRegex = new RegExp(numWords.map((numWord) => reverseString(numWord)).join("|"), "g")

  return data
    .map((line) => {
      // Find first word occurance
      const firstMatches = line.match(numWordsRegex)
      const firstNumWord = firstMatches ? firstMatches.at(0) : ""

      // Find last word occurance by reversing string and reversing words in regex
      const reversedLine = reverseString(line)
      const lastMatches = reversedLine.match(reverseNumWordsRegex)
      const lastNumWord = lastMatches ? lastMatches.at(0) : ""

      // Replace words with numbers
      const firstNumWordReplace = wordToNum(firstNumWord)
      const lastNumWordReplace = wordToNum(reverseString(lastNumWord))
      const line1 = line.replace(firstNumWord, firstNumWordReplace)
      const line2 = reverseString(reversedLine.replace(lastNumWord, lastNumWordReplace))

      // Filter numbers
      const numbers1 = filterNums(line1)
      const numbers2 = filterNums(line2)

      // Take first and last
      return Number(numbers1.at(0) + numbers2.at(-1))
    })
    .reduce((a, b) => a + b)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d1.txt"
const inputTestPath1 = "./src/inputs/d1-t1.txt"
const inputTestPath2 = "./src/inputs/d1-t2.txt"

export function runPart1() {
  console.log(part1(parseInput(inputTestPath1)))
  assert(part1(parseInput(inputTestPath1)) === 142)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.log(part2(parseInput(inputTestPath2)))
  assert(part2(parseInput(inputTestPath2)) === 281)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
