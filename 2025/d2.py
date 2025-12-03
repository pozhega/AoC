""" https://adventofcode.com/2025/day/2 """

from typing import List

IdRange = List[str]

def parse_input(filename: str) -> List[IdRange]:
    line = [line.strip() for line in open(filename, "r")][0]
    id_ranges = [range.split("-") for range in line.split(",")]
    return id_ranges

def part1(data: List[IdRange]):
    sum = 0
    
    for id_ranges in data:
        start, end = id_ranges
        for id in range(int(start), int(end) + 1):
            id_str = str(id)
            id_len = len(id_str)
            if id_str[:id_len//2] == id_str[id_len//2:]: sum += id

    return sum
    

def part2(data: List[IdRange]):    
    sum = 0
    
    for id_ranges in data:
        start, end = id_ranges
        for id in range(int(start), int(end) + 1):
            id_str = str(id)
            id_len = len(id_str)
            for chunk_size in range(id_len//2, 0, -1):
                base_chunk = id_str[:chunk_size]
                chunk_count = id_len//chunk_size
                if (base_chunk * chunk_count) == id_str:
                    sum += id
                    break

    return sum

if __name__ == "__main__":
    TEST = parse_input("tests/d2.txt")
    PUZZLE = parse_input("puzzles/d2.txt")

    assert part1(TEST) == 1227775554
    assert part2(TEST) == 4174379265

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")

