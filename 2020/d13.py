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

    data = list(map(lambda x: int(x) if x != "x" else x, data[1].split(",")))
    departures = deepcopy(data)
    for i, bus in enumerate(data):
        if bus != "x":
            for j in range(i + bus, len(data), bus):
                if data[j] != "x":
                    departures[i] = "x"
                    departures[j] *= bus

            for j in range(i - bus, -1, -bus):
                if data[j] != "x":
                    departures[i] = "x"
                    departures[j] *= bus

    referent_offset, biggest_cycle = 0, 0
    offsets = []
    for i, bus in enumerate(departures):
        if bus != "x":
            offsets.append(i)
            if bus > biggest_cycle:
                referent_offset, biggest_cycle = i, bus
    offsets.remove(referent_offset)

    timestamp = biggest_cycle
    while True:
        match = 0

        for offset in offsets:
            if offset > referent_offset:
                match += ((timestamp + (offset - referent_offset)) %
                          departures[offset] == 0)
            else:
                match += ((timestamp - (referent_offset - offset)) %
                          departures[offset] == 0)

        if match == len(offsets):
            return timestamp - referent_offset

        timestamp += biggest_cycle


if __name__ == "__main__":
    TEST1 = [line.strip() for line in open("tests/d13.txt", "r")]
    TEST2 = [line.strip() for line in open("tests/d13_2.txt", "r")]
    TEST3 = [line.strip() for line in open("tests/d13_3.txt", "r")]
    TEST4 = [line.strip() for line in open("tests/d13_4.txt", "r")]
    TEST5 = [line.strip() for line in open("tests/d13_5.txt", "r")]
    TEST6 = [line.strip() for line in open("tests/d13_6.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d13.txt", "r")]

    print(part1(TEST1))
    print(part1(PUZZLE))
    print(part2(TEST1))
    print(part2(TEST2))
    print(part2(TEST3))
    print(part2(TEST4))
    print(part2(TEST5))
    print(part2(TEST6))
    print(part2(PUZZLE))
