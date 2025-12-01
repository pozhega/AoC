""" https://adventofcode.com/2025/day/1 """

from typing import Any, List, DefaultDict, Tuple, Set, Literal
from collections import defaultdict, deque
from python_datastructures import Stack, Queue, MinHeap, MaxHeap, Trie, SinglyLinkedList, DoublyLinkedList
import heapq

Move = Tuple[str, int]

def parse_input(filename: str) -> List[Move]:
    lines = [line.strip() for line in open(filename, "r")]
    moves = [(line[0], int(line[1:])) for line in lines]
    return moves

def part1(data: List[Move]) -> int:
    """ O(n) solution """

    zero_count = 0; dial = 50

    for (direction, distance) in data:
        if direction == "L": dial = (dial + (100 - distance)) % 100
        elif direction == "R": dial = (dial + distance) % 100
        
        if dial == 0: zero_count += 1

    return zero_count


def part2(data: List[Move]) -> int:
    """ O(n) solution """

    zero_count = 0; dial = 50

    for (direction, distance) in data:
        if direction == "L":
            zero_count += ((100 - dial) + distance) // 100
            zero_count -= dial == 0
            dial = (dial + (100 - distance)) % 100

        elif direction == "R":
            zero_count += (dial + distance) // 100
            dial = (dial + distance) % 100

    return zero_count


if __name__ == "__main__":
    TEST = parse_input("tests/d1.txt")
    PUZZLE = parse_input("puzzles/d1.txt")

    assert part1(TEST) == 3
    assert part2(TEST) == 6

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")

