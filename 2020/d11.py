""" https://adventofcode.com/2020/day/11 """

from typing import Callable, Dict, List, Tuple
from copy import deepcopy
from functools import lru_cache

Position = Tuple[int, int]
Layout = List[List[str]]
Adjacents = Dict[str, Position]


def find_occupied_seats(fun: Callable) -> Callable:
    def wrapper(layout):
        changed = True
        transformed = deepcopy(layout)
        while changed:
            changed = False
            for i, row in enumerate(layout):
                for j, seat in enumerate(row):
                    change = fun(layout, (i, j))
                    if seat != change:
                        changed = True
                        transformed[i][j] = change

            layout = deepcopy(transformed)
        return sum([x.count("#") for x in layout])

    return wrapper


@find_occupied_seats
def part1(layout: Layout, pos: Position) -> str:
    x, y = pos
    seat = layout[x][y]
    width, height = len(layout[0]), len(layout)
    adjacents = find_adjacents((y, x), width, height)
    local_layout = list(map(lambda x: layout[x[1]][x[0]], adjacents.values()))

    if seat == "#" and local_layout.count("#") >= 4:
        return "L"
    elif seat == "L" and local_layout.count("#") == 0:
        return "#"

    return seat


@find_occupied_seats
def part2(layout: Layout, pos: Position) -> str:
    x, y = pos
    seat = layout[x][y]
    width, height = len(layout[0]), len(layout)
    adjacents = find_adjacents((y, x), width, height)

    for direction in adjacents:
        x, y = adjacents[direction]
        while layout[y][x] == ".":
            temp_adjacents = find_adjacents(
                (x, y), width, height, direction)
            if direction in temp_adjacents.keys():
                x, y = temp_adjacents[direction]
            else:
                break

            adjacents[direction] = (x, y)

    local_layout = list(map(lambda x: layout[x[1]][x[0]], adjacents.values()))

    if seat == "#" and local_layout.count("#") >= 5:
        return "L"
    elif seat == "L" and local_layout.count("#") == 0:
        return "#"

    return seat


@lru_cache(maxsize=None)
def find_adjacents(pos, width, height, direction="ALL"):
    x, y = pos
    adjacents = {}

    if x > 0 and y > 0 and (direction in ["ALL", "UL"]):
        adjacents["UL"] = (x - 1, y - 1)
    if y > 0 and (direction in ["ALL", "U"]):
        adjacents["U"] = (x, y - 1)
    if x < width - 1 and y > 0 and (direction in ["ALL", "UR"]):
        adjacents["UR"] = (x + 1, y - 1)
    if x > 0 and (direction in ["ALL", "L"]):
        adjacents["L"] = (x - 1, y)
    if x < width - 1 and (direction in ["ALL", "R"]):
        adjacents["R"] = (x + 1, y)
    if x > 0 and y < width - 1 and (direction in ["ALL", "DL"]):
        adjacents["DL"] = (x - 1, y + 1)
    if y < width - 1 and (direction in ["ALL", "D"]):
        adjacents["D"] = (x, y + 1)
    if x < width - 1 and y < width - 1 and (direction in ["ALL", "DR"]):
        adjacents["DR"] = (x + 1, y + 1)

    return adjacents


if __name__ == "__main__":
    TEST = [list(line.strip()) for line in open("tests/d11.txt", "r")]
    PUZZLE = [list(line.strip()) for line in open("puzzles/d11.txt", "r")]

    assert part1(TEST) == 37
    assert part2(TEST) == 26

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
