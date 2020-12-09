""" https://adventofcode.com/2020/day/8  """

from typing import List
import copy


class Console:
    def __init__(self, code):
        self.instructions = self.__parse_code(code)
        self.executed = [False] * len(self.instructions)
        self.accumulator = 0
        self.pointer = 0
        self.status = "running"

    def run(self):
        while self.status not in ["terminated", "halted"]:
            self.exec()

    def exec(self):
        name, value = self.instructions[self.pointer]
        self.executed[self.pointer] = True

        if name == "nop":
            self.pointer += 1
        elif name == "acc":
            self.accumulator += value
            self.pointer += 1
        elif name == "jmp":
            self.pointer += value

        if self.pointer >= len(self.instructions):
            self.status = "terminated"
        elif self.executed[self.pointer]:
            self.status = "halted"

    def is_fixable(self):
        name, value = self.instructions[self.pointer]
        return (name == "nop" and value != 0 and not self.executed[self.pointer + value]) or name == "jmp"

    def deploy_fix(self):
        name = self.instructions[self.pointer][0]

        if name == "nop":
            self.instructions[self.pointer][0] = "jmp"
        elif name == "jmp":
            self.instructions[self.pointer][0] = "nop"

    def __parse_code(self, code):
        return [[line.split()[0], int(line.split()[1])] for line in code]


def part1(code: List[str]) -> int:
    """ O(n) solution """

    console = Console(code)
    console.run()
    return console.accumulator


def part2(code: List[str]) -> int:
    """ O(n) solution """

    console = Console(code)
    while True:
        if console.is_fixable:
            fix = copy.deepcopy(console)
            fix.deploy_fix()
            fix.run()

            if fix.status == "terminated":
                return fix.accumulator

        console.exec()


if __name__ == "__main__":
    TEST = [line.strip() for line in open("tests/d8.txt", "r")]
    PUZZLE = [line.strip() for line in open("puzzles/d8.txt", "r")]

    print(part1(TEST))
    print(part1(PUZZLE))
    print(part2(TEST))
    print(part2(PUZZLE))
