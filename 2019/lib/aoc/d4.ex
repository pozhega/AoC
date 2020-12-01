defmodule AoC.D4 do
  @moduledoc """
    Solution for puzzle on https://adventofcode.com/2019/day/4.

    NOTE: Refactor -> do increasing syntesis instead of O(n) analysis!!!
  """

  @spec part1() :: integer
  def part1 do
    AoC.read_puzzle_input(4)
    |> deserialize_input()
    |> count_valid_passwords(&simple_validator/2)
  end

  @spec part2() :: integer
  def part2 do
    AoC.read_puzzle_input(4)
    |> deserialize_input()
    |> count_valid_passwords(&complex_validator/2)
  end

  @spec count_valid_passwords(list(integer), fun) :: integer
  def count_valid_passwords([from_password, to_password], fun) do
    Enum.count(from_password..to_password, &validate_password(&1, fun))
  end

  @spec validate_password(integer, fun) :: boolean
  def validate_password(password, validator) do
    validation_meta =
      "#{password}"
      |> String.split("", trim: true)
      |> Enum.reduce_while(
        %{double: false, repeating: 0, decreasing: false, previous_num: 0},
        fn num, meta ->
          num = String.to_integer(num)
          meta = validator.(num, meta)

          if meta.decreasing do
            {:halt, meta}
          else
            {:cont, %{meta | previous_num: num}}
          end
        end
      )

    (validation_meta.double or validation_meta.repeating == 1) and !validation_meta.decreasing
  end

  @spec simple_validator(integer, map) :: map
  def simple_validator(num, meta) do
    meta = if num < meta.previous_num, do: %{meta | decreasing: true}, else: meta
    if num == meta.previous_num, do: %{meta | double: true}, else: meta
  end

  @spec simple_validator(integer, map) :: map
  def complex_validator(num, meta) do
    cond do
      num < meta.previous_num ->
        %{meta | decreasing: true}

      meta.repeating == 0 and num == meta.previous_num ->
        %{meta | repeating: 1}

      meta.repeating == 1 and num != meta.previous_num ->
        %{meta | double: true, repeating: 0}

      meta.repeating > 0 and num == meta.previous_num ->
        %{meta | repeating: meta.repeating + 1}

      meta.repeating > 1 and num != meta.previous_num ->
        %{meta | repeating: 0}

      true ->
        meta
    end
  end

  defp deserialize_input(input_binary) do
    input_binary
    |> String.split("-")
    |> Stream.map(&String.trim/1)
    |> Enum.map(&String.to_integer/1)
  end
end
