# https://adventofcode.com/2015/day/3

alias Position = StaticArray(Int32, 2)

def part_1(dirs : String) : Int
  houses = Set{"0x0"}
  pos = StaticArray[0, 0]
  dirs.each_char do |dir|
    pos = move(pos, dir)
    houses << pos.join("x")
  end

  houses.size
end

def part_2(dirs : String) : Int
  houses = Set{"0x0"}
  s1_pos = StaticArray[0, 0]
  s2_pos = StaticArray[0, 0]
  dirs.each_char_with_index do |dir, i|
    if i.even?
      s1_pos = move(s1_pos, dir)
      houses << s1_pos.join("x")
    else
      s2_pos = move(s2_pos, dir)
      houses << s2_pos.join("x")
    end
  end

  houses.size
end

def move(pos : Position, dir : Char) : Position
  pos[1] += 1 if dir == '^'
  pos[0] += 1 if dir == '>'
  pos[0] -= 1 if dir == '<'
  pos[1] -= 1 if dir == 'v'

  pos
end

PUZZLE = File.read_lines("puzzles/d3.txt").map(&.strip)[0]

p "Part 1: #{part_1(PUZZLE)}"
p "Part 2: #{part_2(PUZZLE)}"
