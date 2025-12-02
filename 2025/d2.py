""" https://adventofcode.com/2025/day/2 """

from typing import List

Range = List[str]

def parse_input(filename: str) -> List[Range]:
    line = [line.strip() for line in open(filename, "r")][0]
    ranges = [range.split("-") for range in line.split(",")]
    return ranges

def part1(data: List[Range]) -> int:
    sum = 0

    for id_ranges in data:
        start, end = id_ranges
        for id in range(int(start), int(end) + 1):
            id_str = str(id)
            id_len = len(id_str)
            if id_str[:id_len//2] == id_str[id_len//2:]: sum += id

    return sum
    

def part2(data: List[Range]) -> int:
    sum = 0
    
    for id_ranges in data:
        start, end = id_ranges
        for id in range(int(start), int(end) + 1):
            id_str = str(id)
            id_len = len(id_str)
            for chunk_size in range(id_len//2, 0, -1):
                compare_chunk = id_str[:chunk_size]
                for chunk_index in range(chunk_size, id_len, chunk_size):
                    if id_str[chunk_index:chunk_index+chunk_size] != compare_chunk:
                        break
                else:
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

