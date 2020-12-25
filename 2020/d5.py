""" https://adventofcode.com/2020/day/5 """

from functools import reduce
from typing import List


def part1(boarding_passes: List[str]) -> int:
    """ O(n) solution """

    return max([get_row(bp) * 8 + get_column(bp) for bp in boarding_passes])


def part2(boarding_passes: List[str]) -> int:
    """ O(n) solution """

    max_seats = 2 ** len(boarding_passes[0])
    seats = [False] * max_seats
    hi_seat, lo_seat = 0, max_seats
    for bp in boarding_passes:
        id = get_row(bp) * 8 + get_column(bp)
        hi_seat = max(hi_seat, id)
        lo_seat = min(lo_seat, id)
        seats[id] = True

    for i in range(lo_seat, hi_seat):
        if not seats[i]:
            return i

    return -1


def get_row(bp: str) -> int:
    return int(reduce(lambda x, y: x + str(y.count("B")), bp[:7], ""), 2)


def get_column(bp: str) -> int:
    return int(reduce(lambda x, y: x + str(y.count("R")), bp[-3:], ""), 2)


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d5.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d5.txt", "r")]

    assert part1(TEST) == 820
    assert part2(TEST) == 120

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
