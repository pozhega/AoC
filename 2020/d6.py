""" https://adventofcode.com/2020/day/6 """

from typing import List, Set


def part1(people: List[str]) -> int:
    """ O(n) solution """

    group: Set[str] = set()
    cnt = 0
    for questions in people:
        if questions:
            group = group.union(set(questions))
        else:
            cnt += len(group)
            group.clear()

    return cnt


def part2(people: List[str]) -> int:
    """ O(n) solution """

    group, cnt = [], 0
    for questions in people:
        if questions:
            group.append(set(questions))
        else:
            cnt += len(group[0].intersection(*group))
            group.clear()

    return cnt


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d6.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d6.txt", "r")]

    assert part1(TEST) == 11
    assert part2(TEST) == 6

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
