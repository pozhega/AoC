""" https://adventofcode.com/2025/day/8 """

from typing import List

def parse_input(filename: str) -> List[str]:
    lines = [line.strip() for line in open(filename, "r")]
    return lines


def part1(data: List[str]):
    return 0


def part2(data: List[str]):
    return 0


if __name__ == "__main__":
    TEST = parse_input("tests/d8.txt")
    PUZZLE = parse_input("puzzles/d8.txt")

    assert part1(TEST) == 0
    # assert part2(TEST) == 0

    print(f"Part 1: {part1(PUZZLE)}")
    # print(f"Part 2: {part2(PUZZLE)}")
