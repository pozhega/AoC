import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { add, range } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type Valve = string
type Rates = Map<Valve, number>
type Tunnels = Map<Valve, Valve[]>
type Cache = Map<Valve, Map<string, number>[]>

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

function parseInput(path: string): [Rates, Tunnels] {
    let rules = new Map()
    let valveRates = new Map()

    fs.readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => {
            let [left, right] = line.split(' to valv')
            left = left.split(';')[0]
            let [valve, rate] = left.split(' has flow rate=')
            valve = valve.split(' ')[1]
            let tunnels = right.split(' ').slice(1).map(tunnel => tunnel.replace(',', ''))
            valveRates.set(valve, parseInt(rate))
            rules.set(valve, [])
            tunnels.forEach(tunnel => {
                rules.get(valve).push(tunnel)
            })
        })

    return [valveRates, rules]
}

function calcPressure(
    cache: Cache,
    valve: Valve,
    opened: Set<Valve>,
    minute: number,
    maxMinute: number,
    rates: Rates,
    tunnels: any,
    filter: Set<Valve>): number {
    let hash = [...opened].sort().toString()
    let valveCache = cache.get(valve) as Map<string, number>[]
    let pressureCache = valveCache[minute].get(hash)
    if (pressureCache) return pressureCache

    if (rates.get(valve) === 0) opened.add(valve)
    let pressure = [...opened].map(valve => rates.get(valve) as number).reduce(add, 0)
    if (minute === maxMinute - 1) {
        valveCache[minute].set(hash, pressure)
        return pressure
    }

    let candidates = tunnels.get(valve).map((tunnel: string) => calcPressure(cache, tunnel, opened, minute + 1, maxMinute, rates, tunnels, filter))
    if (!opened.has(valve) && filter.has(valve)) {
        candidates.push(calcPressure(cache, valve, new Set(opened).add(valve), minute + 1, maxMinute, rates, tunnels, filter))
    }

    pressure += Math.max(...candidates)
    valveCache[minute].set(hash, pressure)
    return pressure
}

function getOpenedValves(cache: any): Valve[] {
    let maxMinutePressure = 0
    let elephantOpened: Valve[] = []

    Array.from(cache.keys()).forEach(valve => {
        let minutes = cache.get('AA').length
        Array.from(cache.get(valve)[minutes - 1].keys()).forEach(opened => {
            let pressure = cache.get(valve)[minutes - 1].get(opened)
            if (pressure > maxMinutePressure) {
                maxMinutePressure = pressure
                elephantOpened = opened.split(',')
            }
        })
    })

    return elephantOpened
}

function createCache(valves: Valve[], minutes: number): Cache {
    let cache: Cache = new Map()
    valves.forEach(valve => {
        let vals: Map<string, number>[] = []
        range(minutes).forEach(_ => vals.push(new Map()))
        cache.set(valve, vals)
    })
    return cache
}

function part1([rates, tunnels]: [Rates, Tunnels]): number {
    let minutes = 30,
        start = 'AA',
        valves = Array.from(rates.keys()),
        cache = createCache(valves, minutes)

    return calcPressure(cache, start, new Set(), 0, minutes, rates, tunnels, new Set(valves))
}

function part2([rates, tunnels]: [Rates, Tunnels]): number {
    let minutes = 26,
        start = 'AA',
        valves = Array.from(rates.keys()) as Valve[],
        elephantCache = createCache(valves, minutes)

    let elephantPressure = calcPressure(elephantCache, start, new Set(), 0, minutes, rates, tunnels, new Set(valves))
    let elephantOpened = getOpenedValves(elephantCache)
    let leftValues = valves.filter(valve => !elephantOpened.includes(valve))
    let humanCache = createCache(valves, minutes)
    let humanPressure = calcPressure(humanCache, start, new Set(), 0, minutes, rates, tunnels, new Set(leftValues))

    return elephantPressure + humanPressure
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d16.txt'
const inputTestPath1 = './src/inputs/d16-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1)) === 1651)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath)))
    console.timeEnd('Time');
}

export function runPart2() {
    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath)))
    console.timeEnd('Time');
}
