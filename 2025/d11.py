""" https://adventofcode.com/2025/day/11 """

from typing import List, Dict, Set, Tuple
from collections import defaultdict, deque
from copy import deepcopy

Devices = Dict[str, Set[str]]

def parse_input(filename: str):
    devices: Devices = defaultdict(set)

    for line in open(filename, "r"):
        node, neighbors = line.strip().split(": ")
        neighbors = neighbors.split(" ")
        for neighbor in neighbors:
            devices[node].add(neighbor)

    return devices


def part1(devices: Devices):
    start_node = "you"; end_node = "out"
    return calc_paths(start_node, end_node, devices)

def calc_paths(node: str, end_node: str, devices: Devices):
    cache = {}

    def calc(node: str, end_node: str, devices: Devices):
        if node in cache: return cache[node]
        if node == end_node: return 1
        
        paths = 0
        for neighbor in devices[node]: paths += calc(neighbor, end_node, devices)
        cache[node] = paths

        return paths
    
    return calc(node, end_node, devices)
    

def part2(devices: Devices):
    paths = 1

    for start_node, end_node in [("dac", "out"), ("fft", "dac"), ("svr", "fft")]:
        paths *= calc_paths(start_node, end_node, devices)

    return paths


if __name__ == "__main__":
    # TEST = parse_input("tests/d11.txt")
    # TEST_2 = parse_input("tests/d11_2.txt")
    PUZZLE = parse_input("puzzles/d11.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 5
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST_2))
    # assert part2(TEST_2) == 2
    print(f"Part 2: {part2(PUZZLE)}")
