""" https://adventofcode.com/2025/day/4 """

from typing import List

Grid = List[List[str]]

def parse_input(filename: str):
    lines = [line.strip() for line in open(filename, "r")]
    grid: Grid = [list(line) for line in lines]
    return grid

def count_adjacent(data: Grid, row_i: int, col_i: int):
    count = 0
    
    for row_j in range(row_i - 1, row_i + 2):
        for col_j in range(col_i - 1, col_i + 2):
            if row_j == row_i and col_j == col_i: continue
            if not(0 <= row_j < len(data)) or not(0 <= col_j < len(data[0])): continue
            if data[row_j][col_j] == "@": count += 1
                
    return count

def part1(data: Grid):
    rolls = 0

    for row_i, row in enumerate(data):
        for col_i, val in enumerate(row):
            if (val == "."): continue
            rolls += count_adjacent(data, row_i, col_i) < 4

    return rolls
    

def part2(data: Grid):
    rolls = 0
    
    while True:
        iter_rolls = 0

        for row_i, row in enumerate(data):
            for col_i, val in enumerate(row):
                if (val in [".", "x"]): continue
                if count_adjacent(data, row_i, col_i) < 4:
                    data[row_i][col_i] = "x"
                    iter_rolls += 1

        rolls += iter_rolls
        if iter_rolls == 0: break

    return rolls


if __name__ == "__main__":
    # TEST = parse_input("tests/d4.txt")
    PUZZLE = parse_input("puzzles/d4.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 13
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 43
    print(f"Part 2: {part2(PUZZLE)}")
