""" https://adventofcode.com/2025/day/10 """

from typing import List, Tuple
from collections import deque, defaultdict
from copy import deepcopy
import z3

Target = List[str]
Button = Tuple[int, ...]
Unknown = str
Data = List[Tuple[Target, List[Button], Unknown]]

def parse_input(filename: str):
    lines = []

    for line in open(filename, "r"):
        line = line.strip().split(" ")
        target: Target = line[0][1:-1]
        jolts: Unknown = eval(line[-1].replace("{", "[").replace("}", "]"))
        buttons: List[Button] = [list(map(int, element[1:-1].split(","))) for element in line[1:-1]]
        lines.append((target, buttons, jolts))

    return lines


def part1(data: Data):
    all_steps = []
    for entry in data:
        target, buttons, _ = entry
        start = "." * len(target)

        queue = deque([(deepcopy(start), 0)])
        visited = set()
        while len(queue) > 0:
            current, steps = queue.popleft()

            if current == target:
                all_steps.append(steps)
                break

            if current in visited: continue
            visited.add(current)

            for button in buttons:
                current_arr = list(current)
                for pos in button:
                    current_arr[pos] = "#" if current_arr[pos] == "." else "."

                queue.append((str("".join(current_arr)), steps + 1))
        
    return sum(all_steps)


def part2(data: Data):
    total_presses = 0

    for _, buttons, jolts in data:
        solver = z3.Optimize()
        button_presses = z3.IntVector("button_presses", len(buttons))
        button_indices = defaultdict(list)

        for button_i, button in enumerate(buttons):
            solver.add(button_presses[button_i] >= 0)
            for position in button:
                button_indices[position].append(button_i)

        for j, indices in button_indices .items():
            solver.add(jolts[j] == sum(button_presses[i] for i in indices))

        presses = z3.Sum(button_presses)
        solver.minimize(presses)
        solver.check()
        total_presses += solver.model().eval(presses).as_long()
    
    return total_presses

if __name__ == "__main__":
    TEST = parse_input("tests/d10.txt")
    PUZZLE = parse_input("puzzles/d10.txt")

    # print ("Part 1(TEST):", part1(TEST))
    # assert part1(TEST) == 7
    print(f"Part 1: {part1(PUZZLE)}")

    # print ("Part 2(TEST):", part2(TEST))
    # assert part2(TEST) == 33
    print(f"Part 2: {part2(PUZZLE)}")
