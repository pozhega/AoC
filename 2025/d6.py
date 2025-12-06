""" https://adventofcode.com/2025/day/6 """

from typing import List

Problems = List[List[str]]

def parse_input(filename: str):
    lines = [line for line in open(filename, "r")]

    problems: Problems = [[] for _ in range(len(lines))]

    coll_i = -1
    for char_i, char in enumerate(lines[-1]):
        if char != " ":
            coll_i += 1
            for row_i, row in enumerate(problems):
                row.append(lines[row_i][char_i]) 
        else:
            if char_i + 1 < len(lines[-1]) and lines[-1][char_i + 1] != " ":
                continue

            for row_i, row in enumerate(problems):
                row[coll_i] += lines[row_i][char_i]

    return problems


def part1(data: Problems):
    sum = 0

    for i in range(len(data[0])):
        operator = data[-1][i]
        equation = ""
        for row_i, row in enumerate(data):
            if (row_i == len(data) - 1): continue
            equation += row[i] + operator
        
        sum += eval(equation.strip()[0:-1])
        
    return sum


def part2(data: Problems):
    sum = 0

    for coll_i in range(len(data[0])):
        operator = data[-1][coll_i]
        equation = ""
        for num_i in range(len(operator)):
            number = ""
            for row in (data[:-1]):
                number += row[coll_i][num_i]

            equation += number + operator

        sum += eval(equation.strip()[0:-1])
        
    return sum


if __name__ == "__main__":
    TEST = parse_input("tests/d6.txt")
    PUZZLE = parse_input("puzzles/d6.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 4277556
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 3263827
    print(f"Part 2: {part2(PUZZLE)}")
