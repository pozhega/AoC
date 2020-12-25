""" https://adventofcode.com/2020/day/12 """

from typing import List, Tuple

Instructions = List[Tuple[str, int]]


def part1(instructions: Instructions) -> int:
    """ O(n) solution """

    ship, direction = [0, 0], 90
    for code, val in instructions:
        if code in COMPASS:
            ship[0] += COMPASS[code][0] * val
            ship[1] += COMPASS[code][1] * val
        elif code == "R":
            direction = (direction + val) % 360
        elif code == "L":
            direction = (direction - val) % 360
        elif code == "F":
            ship[0] += ROTATIONS[direction][0] * val
            ship[1] += ROTATIONS[direction][1] * val

    return abs(ship[0]) + abs(ship[1])


def part2(instructions: Instructions) -> int:
    """ O(n) solution """

    wp, ship = [10, 1], [0, 0]
    for instruction in instructions:
        code, val = instruction
        if code in COMPASS:
            wp[0] += COMPASS[code][0] * val
            wp[1] += COMPASS[code][1] * val
        elif code in ("R", "L") and val == 180:
            wp[0], wp[1] = -wp[0], -wp[1]
        elif (code == "R" and val == 90) or (code == "L" and val == 270):
            wp[0], wp[1] = wp[1], -wp[0]
        elif (code == "L" and val == 90) or (code == "R" and val == 270):
            wp[0], wp[1] = -wp[1], wp[0]
        elif code == "F":
            ship[0] += wp[0] * val
            ship[1] += wp[1] * val

    return abs(ship[0]) + abs(ship[1])


if __name__ == "__main__":
    TEST = [(line[0], int(line[1:]))
            for line in open("tests/d12.txt", "r")]

    TEST2 = [(line[0], int(line[1:]))
             for line in open("tests/d12_2.txt", "r")]

    PUZZLE = [(line[0], int(line[1:]))
              for line in open("puzzles/d12.txt", "r")]

    COMPASS = {"N": (0, 1), "S": (0, -1), "E": (1, 0), "W": (-1, 0)}
    ROTATIONS = {0: (0, 1), 180: (0, -1), 90: (1, 0), 270: (-1, 0)}

    assert part1(TEST) == 25
    assert part2(TEST) == 286
    assert part2(TEST2) == 52069

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
