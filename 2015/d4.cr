# https://adventofcode.com/2015/day/4

require "digest/md5"

def solve(secret : String, zeros : Int) : Int
  i = 0
  pattern = "0" * zeros
  loop do
    return i if Digest::MD5.hexdigest(secret + i.to_s).starts_with?(pattern)
    i += 1
  end
end

PUZZLE = File.read_lines("puzzles/d4.txt").map(&.strip)[0]

p "Part 1: #{solve(PUZZLE, 5)}"
p "Part 2: #{solve(PUZZLE, 6)}"
