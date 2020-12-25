""" https://adventofcode.com/2020/day/4 """

from typing import Callable, List
import re


def check_passport(fun: Callable) -> Callable:
    """ O(n) solution """

    def wrapper(data):
        fields = []
        valid = 0
        for line in data:
            if line:
                fields += filter(fun, line.split())
            else:
                valid += (len(fields) == len(RULES))
                fields = []

        return valid
    return wrapper


@check_passport
def part1(field: str) -> bool: return field.split(":")[0] in RULES


@check_passport
def part2(field: str) -> bool:
    key, value = field.split(":")
    return key in RULES and RULES[key](value)


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d4.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d4.txt", "r")]
    RULES = {
        "byr": lambda x: 1920 <= int(x) <= 2002,
        "iyr": lambda x: 2010 <= int(x) <= 2020,
        "eyr": lambda x: 2020 <= int(x) <= 2030,
        "hgt": lambda x: bool(re.findall(r"^(1([5-8][0-9]|9[0-3])cm|(59|6[0-9]|7[0-6])in)$", x)),
        "hcl": lambda x: bool(re.findall(r"^#[0-9a-f]{6}$", x)),
        "ecl": lambda x: x in ("amb", "blu", "brn", "gry", "grn", "hzl", "oth"),
        "pid": lambda x: bool(re.findall(r"^[0-9]{9}$", x))
    }

    assert part1(TEST) == 2
    assert part2(TEST) == 2

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
