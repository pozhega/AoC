""" https://adventofcode.com/2020/day/19 """

from typing import Callable, Dict, List, Tuple
import re

Rules = Dict[str, str]
Messages = List[str]


def solve(gen: Callable) -> Callable:
    """ O(?) solution """

    def wrapper(data: List[str]) -> int:
        rules, messages = parse_input(data)
        grammar = rules["0"]
        while re.search(NUM_RE, grammar):
            grammar = re.sub(NUM_RE, lambda x: gen(
                x.group(0), rules), grammar, 1)

        grammar = grammar.replace(" ", "")
        grammar_re = re.compile(f"^{grammar}$")

        return sum([re.match(grammar_re, msg) != None for msg in messages])

    return wrapper


@ solve
def part1(num: str, rules: Rules) -> str:
    rule = rules[num]
    return f"(?:{rule})" if "|" in rule else rule


@ solve
def part2(num: str, rules: Rules) -> str:
    rule = rules[num]

    if "|" in rule:
        rule = f"(?:{rule})"
    elif num == "8":
        rule = f"{rule}+"
    elif num == "11":
        palindrome = "(42 " * 10 + "31)? " * 10
        rule = f"42 {palindrome} 31"

    return rule


def parse_input(data: List[str]) -> Tuple[Rules, Messages]:
    rules, messages = {}, []
    segment = 1
    for line in data:
        if not line:
            segment = 2
            continue

        if segment == 1:
            num, rule = line.split(": ")
            rules[num] = rule.replace("\"", "")
        elif segment == 2:
            messages.append(line)

    return rules, messages


if __name__ == "__main__":
    TEST1 = [line.strip() for line in open("tests/d19.txt", "r")]
    TEST2 = [line.strip() for line in open("tests/d19_2.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d19.txt", "r")]

    NUM_RE = re.compile(r"\d+")

    assert part1(TEST1) == 2
    assert part1(TEST2) == 3
    assert part2(TEST2) == 12

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
