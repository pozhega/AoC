def part_1(dirs)
  dirs.each_char.reduce(0) { |floor, dir| dir == '(' ? floor + 1 : floor - 1 }
end

def part_2(dirs)
  floor = 0
  dirs.each_char.with_index do |dir, i|
    floor = dir == '(' ? floor + 1 : floor - 1
    return i + 1 if floor == -1
  end
end

PUZZLE = File.open("puzzles/d1.txt").readlines.map(&:strip)[0]

p "Part 1: #{part_1(PUZZLE)}"
p "Part 2: #{part_2(PUZZLE)}"
