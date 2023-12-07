import assert from "assert"
import * as fs from "fs"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Card = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K" | "A"
type Cards = [Card, Card, Card, Card, Card]
type HandType = "fiveOAK" | "fourOAK" | "full" | "threeOAK" | "twoOAK" | "oneOAK" | "high"
type Hand = { cards: Cards; bid: number; type: HandType; jokerType: HandType }
type Data = Hand[]

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function compareCards(a: Card, b: Card, joker = false): number {
  const order = joker
    ? ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"]
    : ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]

  return order.indexOf(b) - order.indexOf(a)
}

function sortByRank(hands: Hand[], joker = false): Hand[] {
  const handTypeOrder: HandType[] = ["fiveOAK", "fourOAK", "full", "threeOAK", "twoOAK", "oneOAK", "high"]

  return hands.sort((a, b) => {
    const sortKey = joker ? "jokerType" : "type"
    const typeComparison = handTypeOrder.indexOf(a[sortKey]) - handTypeOrder.indexOf(b[sortKey])
    if (typeComparison !== 0) return typeComparison

    for (let i = 0; i < a.cards.length; i++) {
      const cardComparison = compareCards(a.cards[i], b.cards[i], joker)
      if (cardComparison !== 0) return cardComparison
    }

    return 0
  })
}

function calcHand(cards: Cards): { type: HandType; jokerType: HandType } {
  const freq = cards.reduce((freq, card) => {
    const count = cards.filter((x) => x === card).length
    if (!freq[count]) freq[count] = []
    if (!freq[count].includes(card)) {
      freq[count].push(card)
    }
    return freq
  }, {})

  if (freq[5]) return { type: "fiveOAK", jokerType: "fiveOAK" }
  if (freq[4] && freq[4].includes("J")) return { type: "fourOAK", jokerType: "fiveOAK" }
  if (freq[4] && freq[1].includes("J")) return { type: "fourOAK", jokerType: "fiveOAK" }
  if (freq[4]) return { type: "fourOAK", jokerType: "fourOAK" }
  if (freq[3] && freq[2] && freq[3].includes("J")) return { type: "full", jokerType: "fiveOAK" }
  if (freq[3] && freq[2] && freq[2].includes("J")) return { type: "full", jokerType: "fiveOAK" }
  if (freq[3] && freq[2] && freq[1]?.includes("J")) return { type: "full", jokerType: "fourOAK" }
  if (freq[3] && freq[2]) return { type: "full", jokerType: "full" }
  if (freq[3] && freq[3].includes("J")) return { type: "threeOAK", jokerType: "fourOAK" }
  if (freq[3] && freq[1].includes("J")) return { type: "threeOAK", jokerType: "fourOAK" }
  if (freq[3]) return { type: "threeOAK", jokerType: "threeOAK" }
  if (freq[2] && freq[2].length === 2 && freq[2].includes("J")) return { type: "twoOAK", jokerType: "fourOAK" }
  if (freq[2] && freq[2].length === 2 && freq[1].includes("J")) return { type: "twoOAK", jokerType: "full" }
  if (freq[2] && freq[2].length === 2) return { type: "twoOAK", jokerType: "twoOAK" }
  if (freq[2] && freq[2].includes("J")) return { type: "oneOAK", jokerType: "threeOAK" }
  if (freq[2] && freq[1].includes("J")) return { type: "oneOAK", jokerType: "threeOAK" }
  if (freq[2]) return { type: "oneOAK", jokerType: "oneOAK" }
  if (freq[1].includes("J")) return { type: "high", jokerType: "oneOAK" }

  return { type: "high", jokerType: "high" }
}

function parseInput(path: string): any[] {
  return fs
    .readFileSync(path, "utf-8")
    .trimEnd()
    .split("\n")
    .map((line) => {
      const [cardsStr, bidStr] = line.split(" ")
      const bid = Number(bidStr)
      const cards = cardsStr.split("") as Cards
      const win = calcHand(cards)
      return { cards, bid, ...win }
    })
}

function part1(data: Data): number {
  return sortByRank(data).reduce((sum, hand, index) => {
    return sum + hand.bid * (data.length - index)
  }, 0)
}

function part2(data: Data): number {
  return sortByRank(data, true).reduce((sum, hand, index) => {
    return sum + hand.bid * (data.length - index)
  }, 0)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = "./src/inputs/d7.txt"
const inputTestPath1 = "./src/inputs/d7-t1.txt"
const inputTestPath2 = "./src/inputs/d7-t2.txt"

export function runPart1() {
  console.time("Time")
  console.log("Test 1: ", part1(parseInput(inputTestPath1)))
  console.time("Time")

  console.time("Time")
  console.log("Test 2: ", part1(parseInput(inputTestPath2)))
  console.time("Time")

  assert(part1(parseInput(inputTestPath1)) === 6440)

  console.time("Time")
  console.log("Part 1: ", part1(parseInput(inputPath)))
  console.timeEnd("Time")
}

export function runPart2() {
  console.time("Time")
  console.log("Test 2: ", part2(parseInput(inputTestPath1)))
  console.time("Time")
  assert(part2(parseInput(inputTestPath1)) === 5905)

  console.time("Time")
  console.log("Part 2: ", part2(parseInput(inputPath)))
  console.timeEnd("Time")
}
