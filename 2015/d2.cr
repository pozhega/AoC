# https://adventofcode.com/2015/day/2

alias Present = Array(Int)

def part_1(presents : Array(Present)) : Int
  presents.reduce(0) do |paper, (l, w, h)|
    sides = [l*w, w*h, h*l]
    paper + 2*sides[0] + 2*sides[1] + 2*sides[2] + sides.min
  end
end

def part_2(presents : Array(Present)) : Int
  presents.reduce(0) do |ribbon, dims|
    dims = dims.sort
    ribbon + 2*dims[0] + 2*dims[1] + dims[0] * dims[1] * dims[2]
  end
end

PUZZLE = File.read_lines("puzzles/d2.txt").map(&.strip.split("x").map(&.to_i))

p "Part 1: #{part_1(PUZZLE)}"
p "Part 2: #{part_2(PUZZLE)}"
