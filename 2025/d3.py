""" https://adventofcode.com/2025/day/3 """

from typing import Any, List

Bank = List[int]

def parse_input(filename: str):
    lines = [line.strip() for line in open(filename, "r")]
    banks: List[Bank] = [list(map(lambda x: int(x), line)) for line in lines]
    return banks


def find_next_max(bank: Bank, start_idx: int, left: int):
    max_val = 0; max_idx = start_idx

    for i in range(start_idx, len(bank)):
        if len(bank) - i <= left:
            break

        if bank[i] > max_val:
            max_val = bank[i]
            max_idx = i
        
    return max_val, max_idx


def solve(data: List[Bank], output: int):
    joltage = 0

    for bank in data:
        batteries = ""; battery_idx = 0
        
        for i in range(1, output + 1):
            batteries_left = output - i
            max_battery, max_battery_idx = find_next_max(bank, battery_idx, batteries_left)
            battery_idx = max_battery_idx + 1
            batteries += str(max_battery)
        
        joltage += int(batteries)

    return joltage

if __name__ == "__main__":
    TEST = parse_input("tests/d3.txt")
    PUZZLE = parse_input("puzzles/d3.txt")

    assert solve(TEST, 2) == 357
    print(f"Part 1: {solve(PUZZLE, 2)}")

    assert solve(TEST, 12) == 3121910778619
    print(f"Part 2: {solve(PUZZLE, 12)}")

