""" https://adventofcode.com/2020/day/25 """

from typing import List


def part1(data: List[int]) -> int:
    """ O(?) solution """

    pub_key_1, pub_key_2 = data

    s_num, loop_size = 1, 0
    while s_num != pub_key_1:
        s_num = (s_num * 7) % 20201227
        loop_size += 1

    encryption_key = 1
    for _ in range(loop_size):
        encryption_key = (encryption_key * pub_key_2) % 20201227

    return encryption_key


if __name__ == "__main__":
    TEST = [int(line.strip()) for line in open("tests/d25.txt", "r")]
    PUZZLE = [int(line.strip()) for line in open("puzzles/d25.txt", "r")]

    assert part1(TEST) == 14897079

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: Go and solve Jurasic Jigsaw!")
