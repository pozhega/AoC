""" https://adventofcode.com/2020/day/22 """

from typing import Dict, List, Tuple
from copy import deepcopy
from collections import defaultdict


def part1(player_1: List[int], player_2: List[int]) -> int:
    """ O(?) solution """

    while player_1 and player_2:
        card_1, card_2 = player_1.pop(0), player_2.pop(0)
        if card_1 > card_2:
            player_1 += [card_1, card_2]
        else:
            player_2 += [card_2, card_1]

    return checksum(max([player_1, player_2]))


def part2(player_1: List[int], player_2: List[int]) -> int:
    """ O(?) solution """

    _, player = recursive_combat(player_1, player_2)
    return checksum(player)


def recursive_combat(player_1: List[int], player_2: List[int]) -> Tuple[int, List[int]]:
    configs: Dict[int, bool] = defaultdict(lambda: False)
    while player_1 and player_2:
        config = hash(str(player_1) +
                      "[♥]]] [♦]]] [♣]]] [♠]]]" + str(player_2))

        if configs[config]:
            return (0, player_1)
        else:
            configs[config] = True
            card_1, card_2 = player_1.pop(0), player_2.pop(0)
            if len(player_1) >= card_1 and len(player_2) >= card_2:
                winner, _ = recursive_combat(
                    deepcopy(player_1[:card_1]), deepcopy(player_2[:card_2]))
                if winner == 1:
                    player_2 += [card_2, card_1]
                else:
                    player_1 += [card_1, card_2]
            else:
                if card_1 > card_2:
                    player_1 += [card_1, card_2]
                else:
                    player_2 += [card_2, card_1]

    if player_1:
        return (0, player_1)
    else:
        return (1, player_2)


def parse_input(file: str) -> Tuple[List[int], List[int]]:
    segment, player_1, player_2 = 1, [], []
    for line in open(file, "r"):
        line = line.strip()
        if not line:
            segment += 1
            continue

        if "Player" in line:
            continue

        if segment == 1:
            player_1.append(int(line))
        else:
            player_2.append(int(line))

    return player_1, player_2


def checksum(player: List[int]) -> int:
    return sum([(i + 1) * val for i, val in enumerate(list(reversed(player)))])


if __name__ == "__main__":
    TEST_1 = parse_input("tests/d22.txt")
    TEST_2 = parse_input("tests/d22_2.txt")
    PUZZLE = parse_input("puzzles/d22.txt")

    assert part1(*deepcopy(TEST_1)) == 306
    assert part2(*deepcopy(TEST_2)) == 105
    assert part2(*deepcopy(TEST_1)) == 291

    print(f"Part 1: {part1(*deepcopy(PUZZLE))}")
    print(f"Part 2: {part2(*deepcopy(PUZZLE))}")
