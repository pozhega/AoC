""" https://adventofcode.com/2025/day/7 """

from typing import List
from copy import deepcopy

Map = List[List[str]]

def parse_input(filename: str):
    lines = [line.strip() for line in open(filename, "r")]
    map: Map = [list(line) for line in lines]
    return map


def part1(data: Map):
    splits = 0; map = deepcopy(data)
    map[1][len(map[1]) // 2] = "|"
    
    for row_i in range(2, len(map), 2):
        for col_i, val in enumerate(map[row_i]):
            if val == "." and map[row_i - 1][col_i] == "|":
                map[row_i][col_i] = "|"
                map[row_i + 1][col_i] = "|"
            elif val == "^" and map[row_i - 1][col_i] == "|":
                map[row_i][col_i - 1] = "|"
                map[row_i + 1][col_i - 1] = "|"
                map[row_i][col_i + 1] = "|"
                map[row_i + 1][col_i + 1] = "|"
                splits += 1

    return splits


def part2(data: Map):
    map = deepcopy(data)
    map[1][len(map[1]) // 2] = "1"
    
    for row_i in range(2, len(map), 2):
        for col_i, val in enumerate(map[row_i]):
            active_parent = map[row_i - 1][col_i].isnumeric()
            parent_val = map[row_i - 1][col_i]
            if val == "." and active_parent:
                map[row_i][col_i] = parent_val
                map[row_i + 1][col_i] = parent_val
            elif val == "^" and active_parent:
                active_left = map[row_i][col_i - 1].isnumeric()
                left_val = map[row_i][col_i - 1]
                new_left_val = str(int(left_val) + int(parent_val)) if active_left else parent_val
                map[row_i][col_i - 1] = new_left_val
                map[row_i + 1][col_i - 1] = new_left_val
                map[row_i][col_i + 1] = parent_val
                map[row_i + 1][col_i + 1] = parent_val
            elif active_parent:
                map[row_i][col_i] = str(int(val) + int(parent_val))
                map[row_i + 1][col_i] = str(int(val) + int(parent_val))
    
    return sum([int(val) for val in map[-1] if val.isnumeric()])


if __name__ == "__main__":
    TEST = parse_input("tests/d7.txt")
    PUZZLE = parse_input("puzzles/d7.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 21
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 40
    print(f"Part 2: {part2(PUZZLE)}")
