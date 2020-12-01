""" https://adventofcode.com/2020/leaderboard/private/view/227112 """


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
                data_schema[e1] = True
                data_schema[e2] = True


if __name__ == "__main__":
    test = [1721, 979, 366, 299, 675, 1456]
    puzzle = [int(line.strip()) for line in open("inputs/d1.txt", "r")]

    print(part1(test))
    print(part1(puzzle))
    print(part2(test))
    print(part2(puzzle))
