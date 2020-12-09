""" https://adventofcode.com/2020/day/8 (WIP) """

from typing import List
import copy


class Console:
    def __init__(self, code):
        self.instructions = self.__parse_code(code)
        self.executed = [False] * len(self.instructions)
        self.acc = 0
        self.pos = 0
        self.finished = False
        self.terminated = False

    def run(self):
        while not self.terminated and not self.finished:
            self.exec()

    def exec(self):
        name, value = self.instructions[self.pos]
        self.executed[self.pos] = True

        if name == "nop":
            self.pos += 1
        elif name == "acc":
            self.acc += value
            self.pos += 1
        elif name == "jmp":
            self.pos += value

        if self.pos >= len(self.instructions):
            self.finished = True
        elif self.executed[self.pos]:
            self.terminated = True

    def deploy_fix(self):
        name, value = self.instructions[self.pos]

        if name == "nop" and value != 0 and not self.executed[self.pos + value]:
            self.instructions[self.pos][0] = "jmp"
        elif name == "jmp":
            self.instructions[self.pos][0] = "nop"

    def __parse_code(self, code):
        return [[line.split()[0], int(line.split()[1])] for line in code]


def part1(code: List[str]) -> int:
    """ O(n) solution """

    console = Console(code)
    console.run()
    return console.acc


def part2(code: List[str]) -> int:
    """ O(?) solution """

    console = Console(code)
    while True:
        fix = copy.deepcopy(console)
        fix.deploy_fix()
        fix.run()

        if fix.finished:
            return fix.acc
        else:
            console.exec()
            if console.terminated or console.finished:
                return console.acc


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d8.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d8.txt", "r")]

    print(part1(TEST))
    print(part1(PUZZLE))
    print(part2(TEST))
    print(part2(PUZZLE))
