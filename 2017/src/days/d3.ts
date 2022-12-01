import assert from 'assert';

type Point = [number, number]
type Matrix = Map<string, number>

const getMatrixNeighbours = (matrix: Matrix, [xPos, yPos]: Point): Point[] => {
    let neighbours: Point[] = []
    for (let i = xPos - 1; i < xPos + 2; i++) {
        for (let j = yPos - 1; j < yPos + 2; j++) {
            if (xPos === i && yPos === j) continue
            neighbours.push([i, j])
        }
    }

    return neighbours
}

const calcPointVal = (matrix: Matrix, point: Point): number => {
    return getMatrixNeighbours(matrix, point)
        .reduce((sum, point) => {
            let pointVal = matrix.get(JSON.stringify(point))
            if (pointVal === undefined) return sum
            return sum + pointVal
        }, 0)
}

const getSpiralDistance = (limit: number): number => {
    let matrix: Matrix = new Map
    matrix.set(JSON.stringify([0, 0]), 1)
    let xRange = 1
    let yRange = 1
    let xPos = 0
    let yPos = 0
    let counter = 1

    while (true) {
        for (let i = 0; i < xRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            xPos++
            counter++
            let pointVal = calcPointVal(matrix, [xPos, yPos])
            if (pointVal > limit) return pointVal
            matrix.set(JSON.stringify([xPos, yPos]), pointVal)
        }
        xRange++

        for (let i = 0; i < yRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            yPos++
            counter++
            let pointVal = calcPointVal(matrix, [xPos, yPos])
            if (pointVal > limit) return pointVal
            matrix.set(JSON.stringify([xPos, yPos]), pointVal)
        }
        yRange++

        for (let i = 0; i < xRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            xPos--
            counter++
            let pointVal = calcPointVal(matrix, [xPos, yPos])
            if (pointVal > limit) return pointVal
            matrix.set(JSON.stringify([xPos, yPos]), pointVal)
        }
        xRange++

        for (let i = 0; i < yRange; i++) {
            // if (counter === limit) return Math.abs(xPos) + Math.abs(yPos)
            yPos--
            counter++
            let pointVal = calcPointVal(matrix, [xPos, yPos])
            if (pointVal > limit) return pointVal
            matrix.set(JSON.stringify([xPos, yPos]), pointVal)
        }
        yRange++
    }
}

const part1 = (data: number): number => {
    return getSpiralDistance(data)
}

const part2 = (data: number): number => {
    return getSpiralDistance(data)
}

// -----------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

export const runPart1 = () => {
    assert(part1(1) === 0)
    assert(part1(12) === 3)
    assert(part1(23) === 2)
    assert(part1(1024) === 31)

    console.log('Part 1: ', part1(312051))
}

export const runPart2 = () => {
    // assert(part2(1) === 1)
    // assert(part2(2) === 1)
    // assert(part2(3) === 2)
    // assert(part2(4) === 4)
    // assert(part2(4) === 4)

    console.log('Part 2: ', part2(312051))
}
