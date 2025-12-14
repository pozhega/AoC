""" https://adventofcode.com/2025/day/12 """

from copy import deepcopy
from typing import List, Tuple

Shape = List[str]
Wrap = Tuple[int, List[int]]
Data = Tuple[List[Shape], List[Wrap]]

def parse_input(filename: str) -> List[str]:    
    mode = "shapes"; shapes = []; wraps = []; shape = []
    for line in open(filename, "r"):
        line = line.strip()

        if line == "@":
            shapes.append(deepcopy(shape))
            shape = []
            continue

        if line == "":
            shapes.append(deepcopy(shape))
            mode = "wrap"
            continue

        if mode == "shapes":
            shape.append(line)
        
        if mode == "wrap":
            dimensions, fits_str = line.split(": ")
            fits = list(map(int, fits_str.split(" ")))
            width, height = dimensions.split("x")
            size = int(width) * int(height)
            wraps.append((size, fits))
            
    return (shapes, wraps)


def part1(data: Data):
    shapes, wraps = data
    valid_wraps = 0

    for size, fits in wraps:
        consumes = 0
        for shape_i, shape_n in enumerate(fits):
            for line in shapes[shape_i]:
                consumes += line.count("#") * shape_n

        valid_wraps += consumes <= size

    return valid_wraps


if __name__ == "__main__":
    TEST = parse_input("tests/d12.txt")
    PUZZLE = parse_input("puzzles/d12.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 2
    print(f"Part 1: {part1(PUZZLE)}")
