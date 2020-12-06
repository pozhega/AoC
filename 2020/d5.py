""" https://adventofcode.com/2020/day/5 """

from functools import reduce
from typing import List, Optional


def part1(boarding_passes: List[str]) -> int:
    """ O(n) solution """

    hi_seat = 0
    for bp in boarding_passes:
        hi_seat = max(hi_seat, get_row(bp) * 8 + get_column(bp))

    return hi_seat


def part2(boarding_passes: List[str]) -> Optional[int]:
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

    return None


def get_row(bp: str) -> int:
    return int(reduce(lambda x, y: x + str(y.count("B")), bp[:7], ""), 2)


def get_column(bp: str) -> int:
    return int(reduce(lambda x, y: x + str(y.count("R")), bp[-3:], ""), 2)


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d5.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d5.txt", "r")]

    print(part1(TEST))
    print(part1(PUZZLE))
    print(part2(TEST))
    print(part2(PUZZLE))
