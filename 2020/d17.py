""" https://adventofcode.com/2020/day/17 """

from typing import List
from copy import deepcopy


def part1(data: List[str]) -> int:
    """ O(n) solution """

    size_x = len(data[0]) + 2 * CYCLES
    size_y = len(data) + 2 * CYCLES
    size_z = CYCLES * 2 + 1

    pocket = [[[False] * size_x for _ in range(size_y)] for _ in range(size_z)]

    for y in range(len(data)):
        for x in range(len(data[y])):
            pocket[CYCLES][CYCLES + y][CYCLES + x] = data[y][x] == "#"

    for _ in range(CYCLES):
        temp = deepcopy(pocket)
        for z, depth in enumerate(pocket):
            for y, row in enumerate(depth):
                for x, cube in enumerate(row):
                    position = (z, y, x)
                    adjacents = find_3d_adjacents(pocket, position)
                    active = sum([(pocket[i][j][k]) for i, j, k in adjacents])

                    if cube and active not in (2, 3):
                        temp[z][y][x] = False
                    elif not cube and active == 3:
                        temp[z][y][x] = True

        pocket = deepcopy(temp)

    return sum([x for z in pocket for y in z for x in y])


def part2(data: List[str]) -> int:
    """ O(?) solution """

    size_x = len(data[0]) + 2 * CYCLES
    size_y = len(data) + 2 * CYCLES
    size_z = CYCLES * 2 + 1
    size_w = CYCLES * 2 + 1

    pocket = [[[[False] * size_x for _ in range(size_y)]
               for _ in range(size_z)] for _ in range(size_w)]

    for y, _ in enumerate(data):
        for x, _ in enumerate(data[y]):
            pocket[CYCLES][CYCLES][CYCLES +
                                   y][CYCLES + x] = data[y][x] == "#"

    for _ in range(CYCLES):
        temp = deepcopy(pocket)
        for w, time in enumerate(pocket):
            for z, depth in enumerate(time):
                for y, row in enumerate(depth):
                    for x, cube in enumerate(row):
                        position = (w, z, y, x)
                        adjacents = find_4d_adjacents(pocket, position)
                        active = sum([(pocket[i][j][k][l])
                                      for i, j, k, l in adjacents])

                        if cube and active not in (2, 3):
                            temp[w][z][y][x] = False
                        elif not cube and active == 3:
                            temp[w][z][y][x] = True

        pocket = deepcopy(temp)

    return sum([x for w in pocket for z in w for y in z for x in y])


def find_3d_adjacents(pocket, pos):
    z, y, x = pos

    adjacents = []
    for i in range(z - 1, z + 2):
        for j in range(y - 1, y + 2):
            for k in range(x - 1, x + 2):
                if (i, j, k) != pos and - 1 < i < len(pocket) and - 1 < j < len(pocket[0]) and - 1 < k < len(pocket[0]):
                    adjacents.append((i, j, k))

    return adjacents


def find_4d_adjacents(pocket, pos):
    w, z, y, x = pos

    adjacents = []
    for i in range(w - 1, w + 2):
        for j in range(z - 1, z + 2):
            for k in range(y - 1, y + 2):
                for l in range(x - 1, x + 2):
                    if (i, j, k, l) != pos and - 1 < i < len(pocket) and - 1 < j < len(pocket[0]) and - 1 < k < len(pocket[0][0]) and - 1 < l < len(pocket[0][0]):
                        adjacents.append((i, j, k, l))

    return adjacents


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d17.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d17.txt", "r")]
    CYCLES = 6

    assert part1(TEST) == 112
    assert part2(TEST) == 848

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
