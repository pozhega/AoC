""" https://adventofcode.com/2020/day/3 """

from functools import reduce


def part1(map, step):
    """ O(n) solution """

    x, y = step[0], step[1]
    height, width = len(map), len(map[0])
    trees = 0
    while y < height:
        trees += (map[y][x] == "#")
        x = (x + step[0]) % width
        y += step[1]

    return trees


def part2(map, steps):
    """ O(n) solution """

    return reduce(lambda x, step: x * part1(map, step), steps, 1)


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d3.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d3.txt", "r")]
    PART_1_STEP = (3, 1)
    PART_2_STEPS = [(1, 1), (3, 1), (5, 1), (7, 1), (1, 2)]

    print(part1(TEST, PART_1_STEP))
    print(part1(PUZZLE, PART_1_STEP))
    print(part2(TEST, PART_2_STEPS))
    print(part2(PUZZLE, PART_2_STEPS))
