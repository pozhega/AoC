""" https://adventofcode.com/2020/day/1 """


def part1(data):
    """ O(n) solution """

    data_schema = [False] * 2020
    for e1 in data:
        e2 = 2020 - e1
        if e2 > 0 and data_schema[e2]:
            return e1 * e2
        else:
            data_schema[e1] = True


def part2(data):
    """ O(n^2) solution """

    data_schema = [False] * 2020
    for e1 in data:
        for e2 in data:
            e3 = 2020 - e2 - e1
            if e3 > 0 and data_schema[e3]:
                return e1 * e2 * e3
            else:
                data_schema[e1], data_schema[e2] = True, True


if __name__ == "__main__":
    TEST = [1721, 979, 366, 299, 675, 1456]
    PUZZLE = [int(line.strip()) for line in open("inputs/d1.txt", "r")]

    print(part1(TEST))
    print(part1(PUZZLE))
    print(part2(TEST))
    print(part2(PUZZLE))
