""" https://adventofcode.com/2020/day/9 """

from typing import List


def part1(data: List[int], preamble_size: int) -> int:
    """ O(n) solution """

    preamble: List[int] = []
    for num in data:
        valid = False
        if len(preamble) == preamble_size:
            for x in preamble:
                if num - x != x and num - x in preamble:
                    valid = True
                    break

            preamble.pop(0)
        else:
            valid = True

        if not valid:
            return num

        preamble.append(num)

    return -1


def part2(data: List[int], preamble_size: int) -> int:
    """ O(n) solution """

    invalid = part1(data, preamble_size)
    cont_set: List[int] = []
    set_sum = 0
    for num in data:
        while set_sum > invalid:
            set_sum -= cont_set.pop(0)

        if set_sum == invalid:
            return min(cont_set) + max(cont_set)

        cont_set.append(num)
        set_sum += num

    return -1


if __name__ == "__main__":
    TEST = [int(line.strip()) for line in open("tests/d9.txt", "r")]
    PUZZLE = [int(line.strip()) for line in open("puzzles/d9.txt", "r")]

    assert part1(TEST, 5) == 127
    assert part2(TEST, 5) == 62

    print(f"Part 1: {part1(PUZZLE, 25)}")
    print(f"Part 2: {part2(PUZZLE, 25)}")
