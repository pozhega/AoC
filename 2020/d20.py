""" https://adventofcode.com/2020/day/20 """

from typing import Dict, List
from collections import defaultdict
from copy import deepcopy
import math

Edges = Dict[str, List[str]]
Tile = List[str]


def part1(data: List[str]) -> int:
    """ O(?) solution """

    tiles = defaultdict(list)
    for line in data:
        if line:
            if line.startswith("Tile"):
                current_tile = line.split()[1].replace(":", "")
                continue
            else:
                tiles[current_tile].append(list(line))

    square_size = int(math.sqrt(len(tiles)))
    image = [[False] * square_size for _ in range(square_size)]

    for num, tile in tiles.items():
        variants = []
        for rotation in [tile, rotate(tile), rotate(rotate(tile)), rotate(rotate(rotate(tile)))]:
            variants.append(rotation)
            variants.append(flip_hor(rotation))

        print(len(variants))
        tiles[num] = variants

    _invalid = []
    for y, row in enumerate(image):
        for x, _part in enumerate(row):
            pos = (x, y)
            if pos == (0, 0):
                for num, variants in tiles.items():
                    for variant in variants:
                        edges = get_edges(variant)
                        count = {"top": 0, "left": 0, "right": 0, "bottom": 0}
                        for num2, variants2 in tiles.items():
                            if num2 != num:
                                for variant2 in variants2:
                                    edges2 = get_edges(variant2)
                                    count["left"] += (edges["left"]
                                                      in edges2.values())
                                    count["top"] += (edges["top"]
                                                     in edges2.values())
                                    count["right"] += (edges["right"]
                                                       == edges2["left"])
                                    count["bottom"] += (edges["bottom"]
                                                        == edges2["top"])

                        if count["top"] == 0 and count["left"] == 0 and count["right"] == 1 and count["bottom"] == 1:
                            print(count)
                            image[0][0] = num
                            print(num)
                            print_tile(variant)
                            print("")

            elif pos == (square_size - 1, 0):
                # upright
                pass
            elif pos == (0, square_size - 1):
                # downleft
                pass
            elif pos == (square_size - 1, square_size - 1):
                # downright
                pass
            elif y == 0:
                # up
                pass
            elif x == 0:
                # left
                pass
            elif x == square_size - 1:
                # right
                pass
            elif y == square_size - 1:
                # down
                pass
            else:

                pass

    print(image)
    return 0


def rotate(tile: Tile) -> Tile:
    rotated = deepcopy(tile)
    for i, row in enumerate(tile):
        for j, part in enumerate(row):
            rotated[j][-1 - i] = part

    return rotated


def flip_hor(tile: Tile) -> Tile:
    flipped = deepcopy(tile)
    for row in flipped:
        row.reverse()

    return flipped


def get_edges(tile: Tile) -> Edges:
    return {"top": tile[0], "right": [row[-1] for row in tile],
            "left": [row[0] for row in tile], "bottom": tile[-1]}


def print_tile(tile: Tile) -> None:
    for row in tile:
        print(" ".join(map(str, row)))


def part2(data: List[str]) -> int:
    """ O(?) solution """
    return 0


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d20.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d20.txt", "r")]

    assert part1(TEST) == 20899048083289

    # print(part1(PUZZLE))
    # print(part2(PUZZLE))
