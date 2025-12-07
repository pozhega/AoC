""" https://adventofcode.com/2025/day/7 """

from typing import List
from copy import deepcopy

Map = List[List[str]]

def parse_input(filename: str):
    lines = [line.strip() for line in open(filename, "r")]
    map: Map = [list(line) for line in lines]
    return map


def is_int(val: str | int) -> bool:
    return isinstance(val, int)


def solve(data: Map):
    splits = 0; map = deepcopy(data)
    map[1][len(map[1]) // 2] = 1
    
    for row_i in range(2, len(map)):
        for col_i, val in enumerate(map[row_i]):
            parent_val = map[row_i - 1][col_i]
            if not is_int(parent_val): continue

            if val == ".":
                map[row_i][col_i] = parent_val
            elif val == "^":
                left_val = map[row_i][col_i - 1]
                map[row_i][col_i - 1] = left_val + parent_val if is_int(left_val) else parent_val
                map[row_i][col_i + 1] = parent_val
                splits += 1
            else:
                map[row_i][col_i] = val + parent_val
    
    timelines = sum([val for val in map[-1] if is_int(val)])
    
    return (splits, timelines)


if __name__ == "__main__":
    TEST = parse_input("tests/d7.txt")
    PUZZLE = parse_input("puzzles/d7.txt")

    # print ("Part 1(TEST):", solve(TEST)[0])
    # assert solve(TEST)[0] == 21
    print(f"Part 1: {solve(PUZZLE)[0]}")

    # print ("Part 2(TEST):", solve(TEST)[1])
    # assert solve(TEST)[1] == 40
    print(f"Part 2: {solve(PUZZLE)[1]}")
