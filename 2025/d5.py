""" https://adventofcode.com/2025/day/5 """

from typing import List, Tuple

Range = Tuple[int, int]
Ingredient = int
Data = Tuple[List[Ingredient], List[Range]]

def parse_input(filename: str) -> List[str]:
    lines = [line.strip() for line in open(filename, "r")]
    ingredients: List[Ingredient] = []; ranges: List[Range] = []; mode = "ranges"
    for line in lines:
        if line == "":
            mode = "ingredients"
            continue

        if mode == "ranges":
            ranges.append(tuple(map(int, line.split("-"))))
            continue

        if mode == "ingredients":
            ingredients.append(int(line))

    return (ingredients, ranges)


def part1(data: Data):
    ingredients, ranges = data
    fresh = 0
    
    for ingredient in ingredients:
        for range in ranges:
            if range[0] <= ingredient <= range[1]:
                fresh += 1
                break

    return fresh


def part2(data: Data):
    _, ranges = data
    ranges = sorted(ranges, key=lambda x: (x[0], x[1]))

    fresh = 0; max_stop = 0
    for (start, stop) in ranges:
        if start > max_stop: fresh += stop - start + 1
        elif stop > max_stop: fresh += stop - max_stop
        max_stop = max(max_stop, stop)

    return fresh


if __name__ == "__main__":
    TEST = parse_input("tests/d5.txt")
    TEST_2 = parse_input("tests/d5_2.txt")
    PUZZLE = parse_input("puzzles/d5.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 3
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 14
    print(f"Part 2: {part2(PUZZLE)}")
