defmodule AoC do
  @moduledoc """
    Helper functions for loading and solving puzzle inputs
  """

  @type day :: 1..25
  @type part :: 1 | 2

  @spec solve_puzzle(day, part) :: any
  def solve_puzzle(day, part) do
    module = Module.concat([AoC, "D#{day}"])
    solution = apply(module, :"part#{part}", [])
    IO.inspect(solution, label: "Solution for AoC day #{day}, part #{part}")
  end

  @spec read_puzzle_input(day) :: binary
  def read_puzzle_input(day) do
    File.read!("priv/inputs/d#{day}.txt")
  end

  @spec stream_puzzle_input(day) :: File.Stream.t()
  def stream_puzzle_input(day) do
    "priv/inputs/d#{day}.txt"
    |> File.stream!()
    |> Stream.map(&String.trim/1)
  end
end
