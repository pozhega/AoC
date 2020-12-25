""" https://adventofcode.com/2020/day/2 """

from functools import reduce
from typing import Callable, List
import re


def validator(fun: Callable) -> Callable:
    """ O(n) solution """

    return lambda data: reduce(fun, data, 0)


@validator
def part1(count: int, policy: str) -> int:
    pattern = re.match(INPUT_PATTERN, policy)
    if pattern:
        low, high, letter, pwd = pattern.groups()
        return count + (int(low) <= pwd.count(letter) <= int(high))
    return count


@validator
def part2(count: int, policy: str) -> int:
    pattern = re.match(INPUT_PATTERN, policy)
    if pattern:
        pos1, pos2, letter, pwd = pattern.groups()
        return count + ((pwd[int(pos1) - 1] + pwd[int(pos2) - 1]).count(letter) == 1)
    return count


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d2.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d2.txt", "r")]
    INPUT_PATTERN = re.compile(r"(\d+)-(\d+) (\w): (\w*)")

    assert part1(TEST) == 2
    assert part2(TEST) == 1

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
