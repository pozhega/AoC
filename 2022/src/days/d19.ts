import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { range } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): any[] {
    return fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => {
            let [left, right] = line.split(':')
            let blueprintId = parseInt(left.split(' ')[1])
            let [oreRaw, clayRaw, obsidianRaw, geodeRaw] = right.split('. ')
            let oreRobot = parseInt(oreRaw.split('costs ')[1].split(' ')[0])
            let clayRobot = parseInt(clayRaw.split('costs ')[1].split(' ')[0])
            let obsidianRobot = obsidianRaw.replace(' clay', '').split('costs ')[1].split(' ore and ').map(val => parseInt(val))
            let geodeRobot = geodeRaw.replace(' obsidian', '').split('costs ')[1].split(' ore and ').map(val => parseInt(val))
            return [blueprintId, [oreRobot, clayRobot, obsidianRobot, geodeRobot]]
        })
}

function calcGeodes(cache: any, minute: number, maxMinute: number, rules: any, resources: any): void {
    let [oreR, ore, clayR, clay, obsidianR, obsidian, geodeR, geode] = resources
    ore += oreR; clay += clayR; obsidian += obsidianR; geode += geodeR

    let hash = [oreR, ore, clayR, clay, obsidianR, obsidian, geodeR, geode].toString()
    if (cache[minute].has(hash)) return
    else cache[minute].set(hash, geode)

    if (minute + 1 === maxMinute) return

    let [oreRCost, clayRCost, obsidianRCost, geodeRCost] = rules
    if (resources[1] >= geodeRCost[0] && resources[5] >= geodeRCost[1]) {
        calcGeodes(cache, minute + 1, maxMinute, rules, [oreR, ore - geodeRCost[0], clayR, clay, obsidianR, obsidian - geodeRCost[1], geodeR + 1, geode])
    }
    else {
        if (resources[1] >= obsidianRCost[0] && resources[3] >= obsidianRCost[1] && obsidianR < geodeRCost[1]) calcGeodes(cache, minute + 1, maxMinute, rules, [oreR, ore - obsidianRCost[0], clayR, clay - obsidianRCost[1], obsidianR + 1, obsidian, geodeR, geode])
        if (resources[1] >= clayRCost && clayR < obsidianRCost[1]) calcGeodes(cache, minute + 1, maxMinute, rules, [oreR, ore - clayRCost, clayR + 1, clay, obsidianR, obsidian, geodeR, geode])
        if (resources[1] >= oreRCost && (oreR < geodeRCost[0] || oreR < obsidianRCost[0] || oreR < clayRCost)) calcGeodes(cache, minute + 1, maxMinute, rules, [oreR + 1, ore - oreRCost, clayR, clay, obsidianR, obsidian, geodeR, geode])
        calcGeodes(cache, minute + 1, maxMinute, rules, [oreR, ore, clayR, clay, obsidianR, obsidian, geodeR, geode])
    }
}

function createCache(minutes: number): any {
    let cache: Map<string, number>[] = []
    range(minutes).forEach(_ => cache.push(new Map()))
    return cache
}

function findMax(nums: number[]): number {
    let max = 0
    nums.forEach(num => max = Math.max(max, num))
    return max
}

function part1(blueprints: any[]): number {
    let minutes = 24

    return blueprints.reduce((quality, [id, rules]) => {
        let cache = createCache(minutes)
        calcGeodes(cache, 0, minutes, rules, [1, 0, 0, 0, 0, 0, 0, 0])
        return quality += id * findMax(Array.from(cache[minutes - 1].values()))
    }, 0)
}

function part2(blueprints: any[]): number {
    let minutes = 32

    return blueprints.slice(0, 3).reduce((result, [, rules]) => {
        let cache = createCache(minutes)
        calcGeodes(cache, 0, minutes, rules, [1, 0, 0, 0, 0, 0, 0, 0])
        return result *= findMax(Array.from(cache[minutes - 1].values()))
    }, 1)
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d19.txt'
const inputTestPath1 = './src/inputs/d19-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 33)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1)) === 3472)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
