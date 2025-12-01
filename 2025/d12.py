""" https://adventofcode.com/2025/day/12 """

from typing import List


def parse_input(filename: str) -> List[str]:
    return [line.strip() for line in open(filename, "r")]


def part1(data: List[str]) -> int:
    pass


def part2(data: List[str]) -> int:
    pass


if __name__ == "__main__":
    TEST = parse_input("tests/d12.txt")
    PUZZLE = parse_input("puzzles/d12.txt")

    # assert part1(TEST) == None
    # assert part2(TEST) == None

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")

