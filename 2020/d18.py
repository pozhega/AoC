""" https://adventofcode.com/2020/day/18 """

from typing import Callable, List
import re


def solve(calc: Callable) -> Callable:
    """ O(?) solution """

    def wrapper(expressions: List[str]) -> int:

        total = 0
        for expression in expressions:
            while re.search(ATOMIC_RE, expression):
                expression = re.sub(
                    ATOMIC_RE,
                    lambda x: str(calc(x.group(0)[1:-1])),
                    expression
                )

            total += calc(expression)

        return total

    return wrapper


@solve
def part1(expression: str) -> int:
    while re.search(ANY_OP_RE, expression):
        expression = re.sub(
            ANY_OP_RE,
            lambda x: str(eval(x.group(0))),
            expression,
            1
        )

    return int(expression)


@solve
def part2(expression: str) -> int:
    while re.search(ADD_OP_RE, expression):
        expression = re.sub(
            ADD_OP_RE,
            lambda x: str(sum(map(int, x.group(0).split(" + ")))),
            expression,
            1
        )

    return eval(expression)


if __name__ == "__main__":
    TEST1 = [line.strip() for line in open("tests/d18.txt", "r")]
    TEST2 = [line.strip() for line in open("tests/d18_2.txt", "r")]
    TEST3 = [line.strip() for line in open("tests/d18_3.txt", "r")]
    TEST4 = [line.strip() for line in open("tests/d18_4.txt", "r")]
    TEST5 = [line.strip() for line in open("tests/d18_5.txt", "r")]
    TEST6 = [line.strip() for line in open("tests/d18_6.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d18.txt", "r")]

    ATOMIC_RE = re.compile(r"\(\d+(\s[\*|\+]\s\d+\s?)+\)")
    ADD_OP_RE = re.compile(r"\d+\s\+\s\d+")
    ANY_OP_RE = re.compile(r"\d+\s[\+|\*]\s\d+")

    assert part1(TEST1) == 26
    assert part1(TEST2) == 437
    assert part1(TEST3) == 12240
    assert part1(TEST4) == 13632
    assert part1(TEST5) == 51
    assert part1(TEST6) == 71

    assert part2(TEST1) == 46
    assert part2(TEST2) == 1445
    assert part2(TEST3) == 669060
    assert part2(TEST4) == 23340
    assert part2(TEST5) == 51
    assert part2(TEST6) == 231

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
