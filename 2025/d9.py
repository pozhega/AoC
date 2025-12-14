""" https://adventofcode.com/2025/day/9 """

from typing import List, Tuple
from collections import defaultdict

Point = Tuple[int, int]

def parse_input(filename: str):
    lines = [line.strip() for line in open(filename, "r")]
    points: List[Point] = [tuple(map(int, line.split(","))) for line in lines]
    return points


def part1(data: List[Point]):
    max_square = 0

    for point1_i, point1 in enumerate(data):
        for point2 in data[point1_i + 1:]:
            x1, y1 = point1
            x2, y2 = point2
            max_square = max(max_square, (abs(x1 - x2) + 1) * (abs(y1 - y2) + 1))

    return max_square

def intersects(segment1: Tuple[int, int, int, int], segment2: Tuple[int, int, int, int]) -> bool:
    x1, y1, x2, y2 = segment1
    x3, y3, x4, y4 = segment2
    
    denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if denom == 0: return None 
    
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
    u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom
    
    if 0 <= t <= 1 and 0 <= u <= 1:
        x = x1 + t * (x2 - x1)
        y = y1 + t * (y2 - y1)
        return (x, y)
    
    return None 

def part2(data: List[Point]):
    vertical_segments = []; horizontal_segments = [];

    for point_i, point1 in enumerate(data):
        point2 = data[point_i + 1] if point_i + 1 < len(data) else data[0]
        x1, y1 = point1
        x2, y2 = point2
        if x2 == x1: vertical_segments.append((x1, y1, x2, y2))
        else: horizontal_segments.append((x1, y1, x2, y2))

    max_square = 0
    for point1_i, point1 in enumerate(data):
        for point2 in data[point1_i + 1:]:
            x1, y1 = point1
            x2, y2 = point2
            point3 = (x1, y2)
            point4 = (x2, y1)
    
            valid = True
            for vertical_segment in vertical_segments:
                intersection = intersects((point1[0], point1[1], point4[0], point4[1]), vertical_segment)
                if intersection and intersection[0] != point1[0]:
                    valid = False
                    break

                intersection = intersects((point2[0], point2[1], point3[0], point3[1]), vertical_segment)
                if intersection and intersection[0] not in (point2[0], point3[0]):
                    valid = False
                    break

            if not valid: continue

            for horizontal_segment in horizontal_segments:
                intersection = intersects((point1[0], point1[1], point3[0], point3[1]), horizontal_segment)
                if intersection and intersection[1] not in (point1[1], point3[1]):
                    valid = False
                    break

                intersection = intersects((point2[0], point2[1], point4[0], point4[1]), horizontal_segment)
                if intersection and intersection[1] not in (point2[1], point4[1]):
                    valid = False
                    break
            
            if valid:
                square = (abs(x1 - x2) + 1) * (abs(y1 - y2) + 1)
                max_square = max(max_square, square)
                

    return max_square


if __name__ == "__main__":
    # TEST = parse_input("tests/d9.txt")
    PUZZLE = parse_input("puzzles/d9.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 50
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 24
    print(f"Part 2: {part2(PUZZLE)}") # 4605625856
