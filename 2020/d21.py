""" https://adventofcode.com/2020/day/21 """

from typing import Any, Dict, List, Set, Tuple, Union
from collections import defaultdict
import itertools


def part1(legends: Tuple[Dict, Dict]) -> int:
    """ O(?) solution """
    allergens_menu, ingredients_legend = legends
    invalids = find_invalids(allergens_menu, ingredients_legend)
    return sum([ingredients_legend[ingredient]["freq"] for ingredient in invalids])


def part2(legends: Tuple[Dict, Dict]) -> str:
    """ O(?) solution """

    allergens_menu, ingredients_legend = legends

    for ingredient in find_invalids(allergens_menu, ingredients_legend):
        remove_ingredient(allergens_menu, ingredients_legend, ingredient)

    translation = {}
    for allergen, meals in allergens_menu.items():
        candidate_freq: Dict[str, int] = defaultdict(lambda: 0)
        for meal in meals:
            for candidate in meal:
                candidate_freq[candidate] += 1

        match = max(candidate_freq.items(), key=lambda x: x[1])[0]
        translation[match] = allergen
        remove_ingredient(allergens_menu, ingredients_legend, match)

    return ",".join([translation[0] for translation in sorted(translation.items(), key=lambda x: x[1])])


def parse_input(file: str) -> Tuple[Dict, Dict]:
    allergens_menu = defaultdict(list)
    ingredients_legend: Dict[str, Any] = defaultdict(
        lambda: {"freq": 0, "candidates": set()})
    for line in open(file, "r"):
        line = line.strip()
        ingredients_list, allergens_list = line.split(" (contains ")
        ingredients = ingredients_list.split()
        allergens = allergens_list.strip(")").split(", ")
        for ingredient in ingredients:
            for allergen in allergens:
                ingredients_legend[ingredient]["candidates"].add(allergen)
            ingredients_legend[ingredient]["freq"] += 1
        for allergen in allergens:
            allergens_menu[allergen].append(ingredients)

    return allergens_menu, ingredients_legend


def find_invalids(allergens_menu, ingredients_legend):
    invalids = []
    for ingredient, legend in ingredients_legend.items():
        for allergen in legend["candidates"]:
            valid = False
            if all([ingredient in meal for meal in allergens_menu[allergen]]):
                valid = True
                break

        if not valid:
            invalids.append(ingredient)

    return invalids


def remove_ingredient(allergens_menu, ingredients_legend, ingredient):
    del ingredients_legend[ingredient]

    for meals in allergens_menu.values():
        for meal in meals:
            if ingredient in meal:
                meal.remove(ingredient)


if __name__ == "__main__":
    TEST = parse_input("tests/d21.txt")
    PUZZLE = parse_input("puzzles/d21.txt")

    assert part1(TEST) == 5
    assert part2(TEST) == "mxmxvkd,sqjhc,fvjkl"

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
