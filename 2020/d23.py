""" https://adventofcode.com/2020/day/23 """

from typing import Dict, List, Tuple
from copy import deepcopy


class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

    def __repr__(self):
        return str(self.data)


class LinkedList:
    """ Implement true cirucular linked list instead! """

    def __init__(self, nodes=None):
        self.head = None
        if nodes is not None:
            node = Node(data=nodes.pop(0))
            self.head = node
            for elem in nodes:
                node.next = Node(data=elem)
                node = node.next

    def __iter__(self):
        node = self.head
        while node is not None:
            yield node
            node = node.next

    def __repr__(self):
        node = self.head
        nodes = []
        while node is not None:
            nodes.append(str(node.data))
            node = node.next
        nodes.append("None")
        return " -> ".join(nodes)


def part1(cups: List[int]) -> int:
    """ O(n) solution """

    cups, ref = play(cups, 100)

    result = ""
    node = ref[1].next
    while node != None:
        result += str(node.data)
        node = node.next

    node = cups.head
    while node.data != 1:
        result += str(node.data)
        node = node.next

    return int(result)


def part2(cups: List[int]) -> int:
    """ O(n) solution """

    for i in range(max(cups) + 1, 1000000 + 1):
        cups.append(i)

    cups, ref = play(cups, 10000000)

    one = ref[1]
    if not one.next:
        return cups.head.data * cups.head.next.data
    elif not one.next.next:
        return one.next.data * cups.head.data
    else:
        return one.next.data * one.next.next.data


def play(cups: List[int], moves: int) -> Tuple[LinkedList, Dict[int, Node]]:
    cups_max = max(cups)
    cups = LinkedList(cups)
    ref = dict([(cup.data, cup) for cup in cups])
    curr = cups.head
    for _ in range(moves):
        pick_1 = curr.next if curr.next else cups.head
        pick_2 = pick_1.next if pick_1.next else cups.head
        pick_3 = pick_2.next if pick_2.next else cups.head
        cont = pick_3.next if pick_3.next else cups.head
        if cups.head == pick_1 or cups.head == pick_2 or cups.head == pick_3:
            cups.head = cont
            curr.next = None
        elif cups.head == cont:
            curr.next = None
        else:
            curr.next = cont

        dest = curr.data - 1
        while dest in (pick_1.data, pick_2.data, pick_3.data) or dest < 1:
            dest -= 1
            if dest < 1:
                dest = cups_max

        dest = ref[dest]
        pick_3.next = dest.next
        pick_2.next = pick_3
        pick_1.next = pick_2
        dest.next = pick_1
        curr = cont

    return cups, ref


if __name__ == "__main__":
    TEST = [int(num) for line in open("tests/d23.txt", "r")
            for num in line.strip()]

    PUZZLE = [int(num) for line in open("puzzles/d23.txt", "r")
              for num in line.strip()]

    assert part1(deepcopy(TEST)) == 67384529
    assert part2(deepcopy(TEST)) == 149245887792

    print(f"Part 1: {part1(deepcopy(PUZZLE))}")
    print(f"Part 2: {part2(deepcopy(PUZZLE))}")
