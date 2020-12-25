""" https://adventofcode.com/2020/day/24 """

from typing import Dict, List
from copy import deepcopy


class Hexagon:
    def __init__(self, position):
        self.color = -1
        self.adjacents = set()
        self.position = position


Floor = Dict[str, Hexagon]
Position = List[int]
Commands = List[str]


def part1(data: List[str]) -> int:
    """ O(?) solution """

    return count_black_tiles(flip_tiles(parse_commands(data)))


def part2(data: List[str]) -> int:
    """ O(?) solution """

    floor = expand_map(flip_tiles(parse_commands(data)))
    for _ in range(100):
        floor = expand_map(floor)

        flip = []
        for tile in floor.values():
            count = 0

            for adjacent in tile.adjacents:
                if adjacent and adjacent.color == 1:
                    count += 1

            if tile.color == 1:
                if count == 0 or count > 2:
                    flip.append((tile, -1))
            else:
                if count == 2:
                    flip.append((tile, 1))

        for tile, color in flip:
            tile.color = color

    return count_black_tiles(floor)


def count_black_tiles(floor: Floor) -> int:
    return sum([(tile.color == 1) for tile in floor.values()])


def flip_tiles(all_commands: List[Commands]) -> Floor:
    center = Hexagon([0, 0])
    floor = {}
    floor[hash_position(center.position)] = center
    for tile_commands in all_commands:
        tile = center
        position = deepcopy(center.position)
        for command in tile_commands:
            position[0] += MOVE[command][0]
            position[1] += MOVE[command][1]
            position_hash = hash_position(position)

            if floor.get(position_hash):
                new_tile = floor[position_hash]
            else:
                new_tile = Hexagon(deepcopy(position))
                floor[position_hash] = new_tile

            tile.adjacents.add(new_tile)
            new_tile.adjacents.add(tile)
            tile = new_tile
        tile.color *= -1

    return floor


def hash_position(position: Position) -> str:
    return "hex".join(map(str, position))


def expand_map(floor: Floor) -> Floor:
    current = floor.copy()
    for tile in current.values():
        if len(tile.adjacents) < 6:
            for move in MOVE.values():
                position = deepcopy(tile.position)
                position[0] += move[0]
                position[1] += move[1]
                position_hash = hash_position(position)

                if floor.get(position_hash):
                    new_tile = floor[position_hash]
                else:
                    new_tile = Hexagon(deepcopy(position))
                    floor[position_hash] = new_tile

                tile.adjacents.add(new_tile)
                new_tile.adjacents.add(tile)

    return floor


def parse_commands(data: List[str]) -> List[Commands]:
    all_commands = []
    for line in data:
        i, j = 0, 1
        tile_commands = []
        while i < len(line):
            if i == len(line) - 1:
                tile_commands.append(line[i])
                i += 1
            elif line[i] + line[j] in ("se", "sw", "ne", "nw"):
                tile_commands.append(line[i] + line[j])
                i += 2
                j += 2
            else:
                tile_commands.append(line[i])
                i += 1
                j += 1

        all_commands.append(tile_commands)

    return all_commands


if __name__ == "__main__":
    TEST_1 = [line.strip() for line in open("tests/d24.txt", "r")]
    TEST_2 = [line.strip() for line in open("tests/d24_2.txt", "r")]
    TEST_3 = [line.strip() for line in open("tests/d24_3.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d24.txt", "r")]

    MOVE = {"e": (4, 0), "w": (-4, 0), "se": (2, -4),
            "sw": (-2, -4), "ne": (2, 4), "nw": (-2, 4)}

    assert part1(TEST_1) == 10
    assert part1(TEST_2) == 1
    assert part1(TEST_3) == 1
    assert part2(TEST_1) == 2208

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
