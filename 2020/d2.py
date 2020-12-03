"""
https://adventofcode.com/2020/day/2

O(n) solutions in functional paradigm
"""

from functools import reduce
import re


def part1(count, policy):
    low, high, letter, pwd = re.match(INPUT_PATTERN, policy).groups()
    return count + (int(low) <= pwd.count(letter) <= int(high))


def part2(count, policy):
    pos1, pos2, letter, pwd = re.match(INPUT_PATTERN, policy).groups()
    return count + ((pwd[int(pos1)-1] + pwd[int(pos2)-1]).count(letter) == 1)


if __name__ == "__main__":
    TEST = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"]
    PUZZLE = [line.strip() for line in open("inputs/d2.txt", "r")]
    INPUT_PATTERN = re.compile(r"(\d+)-(\d+) (\w): (\w*)")

    print(reduce(part1, TEST, 0))
    print(reduce(part1, PUZZLE, 0))
    print(reduce(part2, TEST, 0))
    print(reduce(part2, PUZZLE, 0))
