""" https://adventofcode.com/2020/day/16 """

from typing import Dict, List, Tuple
from collections import defaultdict

Ticket = List[int]
Tickets = List[Ticket]
Fields = Dict[int, List[str]]


def part1(data: Tuple[Fields, Tickets]) -> int:
    """ O(n) solution """

    fields, tickets = data[0], data[1]
    return sum([val for ticket in tickets[1:] for val in ticket if not fields[val]])


def part2(data: Tuple[Fields, Tickets]) -> int:
    """ O(n^2) solution """

    fields, tickets = data[0], data[1]

    valid_tickets = [tickets[0]]
    for ticket in tickets[1:]:
        valid = True
        for value in ticket:
            if not fields[value]:
                valid = False
                break
        if valid:
            valid_tickets.append(ticket)

    field_order = {}
    for i in range(len(valid_tickets[0])):
        candidates: Dict[str, int] = defaultdict(lambda: 0)
        for ticket in valid_tickets:
            for field in fields[ticket[i]]:
                candidates[field] += 1
        field_order[i] = dict(
            filter(lambda x: x[1] == len(valid_tickets), candidates.items()))

    for i in field_order:
        for field in field_order[i]:
            for j in field_order:
                if field in field_order[j]:
                    field_order[i][field] -= 1

    multi = 1
    for i in field_order:
        field = max(field_order[i].items(), key=lambda x: x[1])[0]
        if field.startswith("departure"):
            multi *= valid_tickets[0][i]

    return multi


def parse_input(file: str) -> Tuple[Fields, Tickets]:
    fields, tickets = defaultdict(list), []
    segment = 1
    for line in open(file, "r"):
        line = line.strip()
        if line:
            if line in ("your ticket:", "nearby tickets:"):
                segment = 2
                continue

            if segment == 1:
                field, values = line.split(": ")
                for interval in values.split(" or "):
                    start, stop = list(map(int, interval.split("-")))
                    for i in range(start, stop + 1):
                        fields[i].append(field)
            else:
                tickets.append(list(map(int, line.split(","))))

    return (fields, tickets)


if __name__ == "__main__":
    TEST = parse_input("tests/d16.txt")
    PUZZLE = parse_input("puzzles/d16.txt")

    assert part1(TEST) == 71

    print(f"Part 1: {part1(PUZZLE)}")
    print(f"Part 2: {part2(PUZZLE)}")
