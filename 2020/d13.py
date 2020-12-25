""" https://adventofcode.com/2020/day/13 """

from typing import List
from collections import defaultdict
from copy import deepcopy


def part1(data: List[str]) -> int:
    """ O(n) solution """

    timestamp = int(data[0])
    buses = data[1].replace("x,", "").split(",")
    first = min(map(lambda x: (int(x), int(x) - timestamp %
                               int(x)), buses), key=lambda x: x[1])

    return first[0] * first[1]


def part2(data: List[str]) -> int:
    """ O(n) solution """

    data = list(map(lambda x: int(x) if x != "x" else "x", data[1].split(",")))
    buses = {offset: bus for offset, bus in enumerate(data) if bus != "x"}
    for i, bus in enumerate(data):
        if bus != "x":
            for j in range(i + bus, len(data), bus):
                if data[j] != "x":
                    buses[j] *= bus
                    del buses[i]

            for j in range(i - bus, -1, -bus):
                if data[j] != "x":
                    buses[j] *= bus
                    del buses[i]

    mc_offset, max_cycle = list(sorted(buses.items(), key=lambda x: -x[1]))[0]
    del buses[mc_offset]

    ts = max_cycle
    while True:
        match = 0

        for offset in buses:
            if offset > mc_offset:
                match += ((ts + (offset - mc_offset)) % buses[offset] == 0)
            else:
                match += ((ts - (mc_offset - offset)) % buses[offset] == 0)

        if match == len(buses):
            return ts - mc_offset

        ts += max_cycle


if __name__ == "__main__":
    TEST1 = [line.strip() for line in open("tests/d13.txt", "r")]
    TEST2 = [line.strip() for line in open("tests/d13_2.txt", "r")]
    TEST3 = [line.strip() for line in open("tests/d13_3.txt", "r")]
    TEST4 = [line.strip() for line in open("tests/d13_4.txt", "r")]
    TEST5 = [line.strip() for line in open("tests/d13_5.txt", "r")]
    TEST6 = [line.strip() for line in open("tests/d13_6.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d13.txt", "r")]

    assert part1(TEST1) == 295
    assert part2(TEST1) == 1068781
    assert part2(TEST2) == 3417
    assert part2(TEST3) == 754018
    assert part2(TEST4) == 779210
    assert part2(TEST5) == 1261476
    assert part2(TEST6) == 1202161486

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
