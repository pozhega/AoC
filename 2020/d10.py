""" https://adventofcode.com/2020/day/10 """

from typing import Dict, List
from collections import defaultdict

Adapters = List[int]


def part1(adapters: Adapters) -> int:
    """ O(nLogn) solution """

    jolts = 0
    diffs: Dict[int, int] = defaultdict(int)
    for adapter in sorted(adapters):
        diffs[adapter - jolts] += 1
        jolts = adapter

    return diffs[1] * (diffs[3] + 1)


def part2(adapters: Adapters) -> int:
    """ O(nLogn) solution """

    adapters = sorted(adapters)
    adapters = [0] + adapters + [max(adapters)+3]
    paths = {adapters[0]: 1}
    for x in adapters[1:]:
        paths[x] = sum(paths[x - y] for y in range(1, 4) if x - y in paths)

    return paths[adapters[-1]]


if __name__ == "__main__":
    TEST1 = [int(line.strip()) for line in open("tests/d10.txt", "r")]
    TEST2 = [int(line.strip()) for line in open("tests/d10_2.txt", "r")]
    PUZZLE = [int(line.strip()) for line in open("puzzles/d10.txt", "r")]

    assert part1(TEST1) == 35
    assert part1(TEST2) == 220
    assert part2(TEST1) == 8
    assert part2(TEST2) == 19208

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
