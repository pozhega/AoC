import * as fs from 'fs'
import assert from 'assert'
import '../helpers/array'
import { range } from 'lodash'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

interface Node {
    id: number
    val: number
    next: Node | null
    prev: Node | null
}

interface LinkedList {
    head: Node
    length: number
}

// -----------------------------------------------------------------------------
// PRIVATE
// -----------------------------------------------------------------------------

class Node implements Node {
    constructor(id: number, val: number) {
        this.id = id
        this.val = val
        this.next = null
        this.prev = null
    }
}

class LinkedList implements LinkedList {
    constructor(array: number[]) {
        this.head = new Node(0, array[0])
        this.length = array.length

        let currNode = this.head
        array.slice(1).map((val, idx) => new Node(idx + 1, val)).forEach(node => {
            currNode.next = node
            node.prev = currNode
            currNode = node
        })
        currNode.next = this.head
        this.head.prev = currNode
    }

    findAndCount() {
        let currNode = this.head
        while (currNode.val !== 0) currNode = currNode.next as Node

        return range(3).reduce((sum, _) => {
            range(1000).forEach(_ => currNode = currNode.next as Node)
            return sum += currNode.val
        }, 0)
    }

    findAndMove(id: number) {
        let currNode = this.head
        while (currNode.id !== id) {
            currNode = currNode.next as Node
        }

        let val = currNode.val
        if (val % (this.length - 1) === 0) return

        let moveNode = currNode
        let prevNode = moveNode.prev as Node
        let nextNode = moveNode.next as Node
        prevNode.next = nextNode
        nextNode.prev = prevNode

        range(val % (this.length - 1)).forEach(_ => {
            if (val < 0) currNode = currNode.prev as Node
            else currNode = currNode.next as Node
        })

        if (val > 0) {
            nextNode = currNode.next as Node
            currNode.next = moveNode
            moveNode.prev = currNode
            nextNode.prev = moveNode
            moveNode.next = nextNode
        } else if (val < 0) {
            prevNode = currNode.prev as Node
            currNode.prev = moveNode
            moveNode.next = currNode
            prevNode.next = moveNode
            moveNode.prev = prevNode
        }
    }

    print() {
        let currNode = this.head
        console.log(range(this.length + 1).map(_ => {
            let val = currNode.val
            currNode = currNode.next as Node
            return val
        }).join(' -> '))
    }
}


function parseInput(path: string, multipler: number): [number[], LinkedList] {
    let array = fs
        .readFileSync(path, 'utf-8')
        .trimEnd()
        .split('\n')
        .map(line => parseInt(line) * multipler)

    let list = new LinkedList(array)
    return [array, list]
}

function part1([array, list]: [number[], LinkedList]): number {
    range(array.length).forEach(id => list.findAndMove(id))
    return list.findAndCount()
}

function part2([array, list]: [number[], LinkedList]): number {
    range(10).forEach(_ => range(array.length).forEach(id => list.findAndMove(id)))
    return list.findAndCount()
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

const inputPath = './src/inputs/d20.txt'
const inputTestPath1 = './src/inputs/d20-t1.txt'

export function runPart1() {
    assert(part1(parseInput(inputTestPath1, 1)) === 3)

    console.time('Time');
    console.log('Part 1: ', part1(parseInput(inputPath, 1)))
    console.timeEnd('Time');
}

export function runPart2() {
    assert(part2(parseInput(inputTestPath1, 811589153)) === 1623178306)

    console.time('Time');
    console.log('Part 2: ', part2(parseInput(inputPath, 811589153)))
    console.timeEnd('Time');
}
