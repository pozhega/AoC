""" https://adventofcode.com/2025/day/8 """

from typing import List
import math
from collections import deque
from functools import reduce


Box = List[int]

def parse_input(filename: str):
    lines = [line.strip() for line in open(filename, "r")]
    boxes = [list(map(int, line.split(","))) for line in lines]

    distances = []

    for box_i, box_1 in enumerate(boxes):
        for box_j in range(box_i + 1, len(boxes)):
            box_2 = boxes[box_j]
            x1, y1, z1 = box_1
            x2, y2, z2 = box_2
            distance = math.sqrt((x1 - x2)**2 + (y1 - y2)**2 + (z1 - z2)**2)
            distances.append((f"{box_1}-{box_2}", distance))

    distances.sort(key=lambda x: x[1])

    circuits = {}
    for box in boxes:
        circuits[str(box)] = set()

    return (boxes, distances, circuits)


def part1(data: List[Box], size: int):
    boxes, distances, circuits = data

    for distance in distances[:size]:
        box_1, box_2 = distance[0].split("-")
        circuits[box_1].add(box_2)
        circuits[box_2].add(box_1)

    groups = []
    visited = set()

    for box in circuits.keys():
        group_size = 0
        if box in visited: continue
        queue = deque([box])
        while len(queue) > 0:
            current_box = queue.popleft()
            if current_box in visited: continue
            visited.add(current_box)
            group_size += 1
            for adjacent_box in circuits[current_box]:
                queue.append(adjacent_box)
        
        groups.append(group_size)

    groups.sort(reverse=True)
    
    return reduce(lambda x, y: x * y, groups[:3])


def part2(data: List[Box]):
    boxes, distances, circuits = data

    start = distances[0][0].split("-")[0]

    all_visited = set([start])
    for distance in distances:
        box_1, box_2 = distance[0].split("-")
        circuits[box_1].add(box_2)
        circuits[box_2].add(box_1)

        if box_1 in all_visited and box_2 in all_visited: continue
        if box_1 not in all_visited and box_2 not in all_visited: continue

        queue = deque([start])
        visited = set()
        while len(queue) > 0:
            current_box = queue.popleft()
            if current_box in visited: continue
            visited.add(current_box)
            for wired_box in circuits[current_box]:
                queue.append(wired_box)
        
        all_visited = visited

        if (len(visited) == len(boxes)):
            box_1, box_2 = distance[0].split("-")
            return eval(box_1)[0] * eval(box_2)[0]


if __name__ == "__main__":
    # TEST = parse_input("tests/d8.txt")
    PUZZLE = parse_input("puzzles/d8.txt")

    # print ("Part 1(TEST):", part1(TEST, 10))
    # assert part1(TEST, 10) == 40
    print(f"Part 1: {part1(PUZZLE, 1000)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 25272
    print(f"Part 2: {part2(PUZZLE)}")
