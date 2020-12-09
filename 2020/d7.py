""" https://adventofcode.com/2020/day/7 """

from collections import defaultdict
from typing import List, DefaultDict, Tuple, Set
import re

RevBagTree = DefaultDict[str, List[str]]
BagTree = DefaultDict[str, List[List[str]]]
Edge = Tuple[str, List[List[str]]]


def part1(nodes: List[Edge]) -> int:
    """ O(?) solution """

    rev_bag_tree = defaultdict(list)
    for parent, children in nodes:
        for _, bag in children:
            rev_bag_tree[bag].append(parent)

    return len(find_bag_colors(rev_bag_tree, BAG)) - 1


def part2(nodes: List[Edge]) -> int:
    """ O(?) solution """

    bag_tree = defaultdict(list)
    for parent, children in nodes:
        for child in children:
            bag_tree[parent].append(child)

    return count_individual_bags(bag_tree, BAG) - 1


def parse_input(line: str) -> Edge:
    """ Maybe use regex for this or find more sexy solution ?! """
    print(re.search(INPUT_PATTERN, line).group(3))
    rule = line.strip().split(" bags contain ")
    parent = rule[0].strip().rstrip("s")

    if rule[1] == "no other bags.":
        children = []
    else:
        children = list(map(lambda x: x.split(" bag")
                            [0].split(" ", 1), rule[1].split(", ")))

    return (parent, children)


def find_bag_colors(rev_bag_tree: RevBagTree, child: str) -> Set[str]:
    valid = {child}
    for bag in rev_bag_tree[child]:
        valid = valid.union(find_bag_colors(rev_bag_tree, bag))

    return valid


def count_individual_bags(bag_tree: BagTree, child: str) -> int:
    total = 1
    for contains, bag in bag_tree[child]:
        total += int(contains) * count_individual_bags(bag_tree, bag)

    return total


if __name__ == "__main__":
    INPUT_PATTERN = re.compile(
        r"(.+) bags contain (?:no other bags\.|(?:(\d) (.+) bags?(?:\.|,))+)")
    TEST = [parse_input(line) for line in open("tests/d7.txt", "r")]
    TEST2 = [parse_input(line) for line in open("tests/d7_2.txt", "r")]
    PUZZLE = [parse_input(line) for line in open("puzzles/d7.txt", "r")]
    BAG = "shiny gold"

    print(part1(TEST))
    print(part1(PUZZLE))
    print(part2(TEST))
    print(part2(TEST2))
    print(part2(PUZZLE))
