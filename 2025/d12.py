""" https://adventofcode.com/2025/day/12 """

from typing import List

def parse_input(filename: str) -> List[str]:
    lines = [line.strip() for line in open(filename, "r")]
    return lines


def part1(data: List[str]):
    return 0


def part2(data: List[str]):
    return 0


if __name__ == "__main__":
    TEST = parse_input("tests/d12.txt")
    PUZZLE = parse_input("puzzles/d12.txt")

    print ("Part 1(TEST):", part1(TEST))
    assert part1(TEST) == 0
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 0
    # print(f"Part 2: {part2(PUZZLE)}")
