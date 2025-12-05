""" https://adventofcode.com/2025/day/1 """

from typing import List, Tuple

Move = Tuple[str, int]

def parse_input(filename: str) -> List[Move]:
    lines = [line.strip() for line in open(filename, "r")]
    moves = [(line[0], int(line[1:])) for line in lines]
    return moves

def part1(data: List[Move]):
    zero_count = 0; dial = 50

    for (dir, distance) in data:
        relative_dial = dial + (distance if dir == "R" else -distance)
        dial = relative_dial % 100
        zero_count += dial == 0

    return zero_count


def part2(data: List[Move]):
    zero_count = 0; dial = 50

    for (dir, distance) in data:
        relative_dial = dial + (distance if dir == "R" else -distance)
        zero_distance = distance + (dial if dir == "R" else ((dial > 0) * 100) - dial)
        zero_count += zero_distance // 100
        dial = relative_dial % 100

    return zero_count


if __name__ == "__main__":
    TEST = parse_input("tests/d1.txt")
    PUZZLE = parse_input("puzzles/d1.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 3
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 6
    print(f"Part 2: {part2(PUZZLE)}")

