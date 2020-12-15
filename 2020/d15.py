""" https://adventofcode.com/2020/day/15 """

from typing import List
from collections import defaultdict


def solve(starting_nums: List[int], limit: int) -> int:
    """ O(n) solution """

    memory = defaultdict(list)
    for i, num in enumerate(starting_nums):
        memory[num].append(i + 1)
        last_num = num

    for i in range(len(starting_nums) + 1, limit + 1):
        if len(memory[last_num]) > 1:
            last_num = memory[last_num][-1] - memory[last_num][-2]
        else:
            last_num = 0

        if len(memory[last_num]) == 2:
            memory[last_num][0] = memory[last_num][1]
            memory[last_num][1] = i
        else:
            memory[last_num].append(i)

    return last_num


def parse_input(file: str) -> List[int]:
    return list([map(int, line.strip().split(","))
                 for line in open(file, "r")][0])


if __name__ == "__main__":
    TEST1 = parse_input("tests/d15.txt")
    TEST2 = parse_input("tests/d15_2.txt")
    TEST3 = parse_input("tests/d15_3.txt")
    TEST4 = parse_input("tests/d15_4.txt")
    TEST5 = parse_input("tests/d15_5.txt")
    TEST6 = parse_input("tests/d15_6.txt")
    TEST7 = parse_input("tests/d15_7.txt")
    PUZZLE = parse_input("puzzles/d15.txt")

    PART1 = 2020
    PART2 = 30000000

    assert solve(TEST1, PART1) == 436
    assert solve(TEST2, PART1) == 1
    assert solve(TEST3, PART1) == 10
    assert solve(TEST4, PART1) == 27
    assert solve(TEST5, PART1) == 78
    assert solve(TEST6, PART1) == 438
    assert solve(TEST7, PART1) == 1836
    assert solve(TEST1, PART2) == 175594
    assert solve(TEST2, PART2) == 2578
    assert solve(TEST3, PART2) == 3544142
    assert solve(TEST4, PART2) == 261214
    assert solve(TEST5, PART2) == 6895259
    assert solve(TEST6, PART2) == 18
    assert solve(TEST7, PART2) == 362

    print(f"Part 1: {solve(PUZZLE, PART1)}")
    print(f"Part 2: {solve(PUZZLE, PART2)}")
