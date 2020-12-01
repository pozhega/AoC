""" https://adventofcode.com/2020/leaderboard/private/view/227112 """


def part1(data):
    for i in range(0, len(DATA) - 1):
        for j in range(i + 1, len(DATA) - 1):
            e1, e2 = int(DATA[i]), int(DATA[j])
            if e1 + e2 == 2020:
                return e1 * e2


def part2(data):
    for i in range(0, len(DATA) - 1):
        for j in range(i + 1, len(DATA) - 1):
            for z in range(j + 1, len(DATA) - 1):
                e1, e2, e3 = int(DATA[i]), int(DATA[j]), int(DATA[z])
                if e1 + e2 + e3 == 2020:
                    return e1 * e2 * e3


if __name__ == "__main__":
    test = ["1721", "979", "366", "299", "675", "1456"]
    puzzle = [line.strip() for line in open("inputs/d1.txt", "r")]

    print(part1(test))
    print(part1(puzzle))
    print(part2(test))
    print(part2(puzzle))
