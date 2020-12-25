""" https://adventofcode.com/2020/day/14 """

from typing import List, Iterator
from copy import deepcopy


def part1(program: List[str]) -> int:
    """ O(n) solution """

    memory = {}
    for instruction in program:
        key, value = instruction.split(" = ")
        if key == "mask":
            mask = list(value)
        else:
            address = key.split("[")[1].split("]")[0]
            memory[address] = decoder_v1(mask, value)

    return sum(memory.values())


def decoder_v1(mask: List[str], value: str) -> int:
    value = "{0:b}".format(int(value))
    value_expand = list("0" * (len(mask) - len(value)) + value)
    for i, bit in enumerate(mask):
        if bit != "X":
            value_expand[i] = bit

    return int("".join(value), 2)


def part2(program: List[str]) -> int:
    """ O(n) solution """

    memory = {}
    for instruction in program:
        key, value = instruction.split(" = ")
        if key == "mask":
            mask = list(value)
        else:
            encoded = key.split("[")[1].split("]")[0]
            for address in decoder_v2(mask, encoded):
                memory[address] = int(value)

    return sum(memory.values())


def decoder_v2(mask: List[str], encoded: str) -> Iterator[int]:
    encoded = "{0:b}".format(int(encoded))
    addresses = [list("0" * (len(mask) - len(encoded)) + encoded)]
    diverges = []
    for i, bit in enumerate(mask):
        if bit == "1":
            for address in addresses:
                address[i] = "1"
        elif bit == "X":
            for address in addresses:
                diverge = deepcopy(address)
                diverge[i], address[i] = "0", "1"
                diverges.append(diverge)

            addresses += diverges
            diverges = []

    return map(lambda x: int("".join(x), 2), addresses)


if __name__ == "__main__":
    TEST1 = [line.strip() for line in open("tests/d14.txt", "r")]
    TEST2 = [line.strip() for line in open("tests/d14_2.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d14.txt", "r")]

    assert part1(TEST1) == 165
    assert part2(TEST2) == 208

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
