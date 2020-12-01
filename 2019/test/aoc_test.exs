defmodule AoCTest do
  use ExUnit.Case

  test "get puzzle solution for 2019" do
    assert AoC.solve_puzzle(1, 1)
    assert AoC.solve_puzzle(1, 2)
    assert AoC.solve_puzzle(2, 1)
    assert AoC.solve_puzzle(2, 2)
    assert AoC.solve_puzzle(3, 1)
    assert AoC.solve_puzzle(3, 2)
    assert AoC.solve_puzzle(4, 1)
    assert AoC.solve_puzzle(4, 2)
    # assert AoC.solve_puzzle(5, 1)
    # assert AoC.solve_puzzle(5, 2)
    assert AoC.solve_puzzle(6, 1)
    assert AoC.solve_puzzle(6, 2)
    assert AoC.solve_puzzle(8, 1)
    assert AoC.solve_puzzle(8, 2)
  end

  test "reads puzzle input" do
    assert AoC.read_puzzle_input(1)
  end

  test "streams puzzle input" do
    assert AoC.stream_puzzle_input(1)
  end
end
