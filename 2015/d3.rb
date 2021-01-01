# https://adventofcode.com/2015/day/3

require 'set'

def part_1(dirs)
  houses = Set["0x0"]
  pos = [0, 0]
  dirs.each_char do |dir|
    pos = move(pos, dir)
    houses << pos.join("x")
  end

  houses.size
end

def part_2(dirs)
  houses = Set["0x0"]
  s1_pos = [0, 0]
  s2_pos = [0, 0]
  dirs.each_char.with_index do |dir, i|
    if i.even?
      move(s1_pos, dir)
      houses << s1_pos.join("x")
    else
      move(s2_pos, dir)
      houses << s2_pos.join("x")
    end
  end

  houses.size
end

def move(pos, dir)
  pos[1] += 1 if dir == '^'
  pos[0] += 1 if dir == '>'
  pos[0] -= 1 if dir == '<'
  pos[1] -= 1 if dir == 'v'

  pos
end

PUZZLE = File.open("puzzles/d3.txt").readlines.map(&:strip)[0]

p "Part 1: #{part_1(PUZZLE)}"
p "Part 2: #{part_2(PUZZLE)}"
