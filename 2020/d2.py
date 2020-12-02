"""
https://adventofcode.com/2020/day/2

O(n) solutions in functional paradigm
"""

from functools import reduce


def part1(count, policy):
    policy = policy.split()
    low, high = map(int, policy[0].split("-"))
    letter, pwd = policy[1][0], policy[2]
    return count + (low <= pwd.count(letter) <= high)


def part2(count, policy):
    policy = policy.split()
    pos1, pos2 = map(lambda x: int(x) - 1, policy[0].split("-"))
    letter, pwd = policy[1][0], policy[2]
    return count + ((pwd[pos1] + pwd[pos2]).count(letter) == 1)


if __name__ == "__main__":
    test = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"]
    puzzle = [line.strip() for line in open("inputs/d2.txt", "r")]

    print(reduce(part1, test, 0))
    print(reduce(part1, puzzle, 0))
    print(reduce(part2, test, 0))
    print(reduce(part2, puzzle, 0))
