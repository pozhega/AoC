defmodule AoC.D1 do
  @moduledoc """
    Solution for puzzle on https://adventofcode.com/2019/day/1.
  """

  @spec part1() :: integer
  def part1, do: calculate_fuel_requirement(&basic_fuel_requirement/1)

  @spec part2() :: integer
  def part2, do: calculate_fuel_requirement(&complex_fuel_requirement/1)

  @spec basic_fuel_requirement(integer) :: integer
  def basic_fuel_requirement(mass), do: trunc(mass / 3) - 2

  @spec complex_fuel_requirement(integer, integer) :: integer
  def complex_fuel_requirement(mass, fuel_required \\ 0)
  def complex_fuel_requirement(mass, fuel_required) when mass < 9, do: fuel_required

  def complex_fuel_requirement(mass, fuel_required) do
    requirement = basic_fuel_requirement(mass)
    complex_fuel_requirement(requirement, fuel_required + requirement)
  end

  defp calculate_fuel_requirement(fun) do
    AoC.stream_puzzle_input(1)
    |> Stream.map(&String.to_integer/1)
    |> Stream.map(fun)
    |> Enum.sum()
  end
end
