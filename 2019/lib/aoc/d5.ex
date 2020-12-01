defmodule AoC.D5 do
  @moduledoc """
    Solution for puzzle on https://adventofcode.com/2019/day/5.

    NOTE: make clearer abstractions (separate to another module and resuse in day 2, 7, 9 ...)
    NOTE: add test cases
  """

  @arithmetic_opcodes [1, 2]
  @io_opcodes [3, 4]
  @jump_opcodes [5, 6]
  @compare_opcodes [7, 8]

  @type memory :: list(integer)

  @spec part1() :: integer
  def part1 do
    AoC.read_puzzle_input(5)
    |> deserialize_input()
    |> process_instructions()
  end

  @spec part2() :: integer
  def part2 do
    AoC.read_puzzle_input(5)
    |> deserialize_input()
    |> process_instructions()
  end

  @spec process_instructions(memory, integer) :: memory | String.t()
  def process_instructions(memory), do: process_instructions(memory, 0)

  defp process_instructions(memory, address) do
    opcode = Enum.at(memory, address)
    opcode_instruction = rem(opcode, 100)
    mods = parse_mods(opcode)

    cond do
      opcode_instruction == 99 ->
        memory

      opcode_instruction in @arithmetic_opcodes ->
        memory
        |> process_arithmetic_instruction(opcode_instruction, address, mods)
        |> process_instructions(address + 4)

      opcode_instruction in @io_opcodes ->
        memory
        |> process_io_instruction(opcode_instruction, address, mods)
        |> process_instructions(address + 2)

      opcode_instruction in @jump_opcodes ->
        address = process_jump_instruction(memory, opcode_instruction, address, mods)
        process_instructions(memory, address)

      opcode_instruction in @compare_opcodes ->
        memory
        |> process_compare_instruction(opcode_instruction, address, mods)
        |> process_instructions(address + 4)

      true ->
        "Bad opcode: #{opcode}"
    end
  end

  defp process_arithmetic_instruction(
         memory,
         instruction,
         address,
         {param_1_mod, param_2_mod, _}
       ) do
    [param_1, param_2, param_3] = Enum.slice(memory, (address + 1)..(address + 3))

    param_1 = get_param_value(memory, param_1, param_1_mod)
    param_2 = get_param_value(memory, param_2, param_2_mod)

    ins_res = opcode_arithmetic(instruction, param_1, param_2)

    List.replace_at(memory, param_3, ins_res)
  end

  defp process_io_instruction(memory, instruction, address, _) do
    param_1 = Enum.at(memory, address + 1)

    case instruction do
      3 ->
        List.replace_at(memory, param_1, parse_input())

      4 ->
        IO.puts("Output: #{Enum.at(memory, param_1)}")
        memory
    end
  end

  defp process_jump_instruction(memory, instruction, address, {param_1_mod, param_2_mod, _}) do
    [param_1, param_2] = Enum.slice(memory, (address + 1)..(address + 2))
    param_1 = get_param_value(memory, param_1, param_1_mod)
    param_2 = get_param_value(memory, param_2, param_2_mod)

    cond do
      instruction == 5 and param_1 != 0 ->
        param_2

      instruction == 6 and param_1 == 0 ->
        param_2

      true ->
        address + 3
    end
  end

  defp process_compare_instruction(
         memory,
         instruction,
         address,
         {param_1_mod, param_2_mod, _}
       ) do
    [param_1, param_2, param_3] = Enum.slice(memory, (address + 1)..(address + 3))

    param_1 = get_param_value(memory, param_1, param_1_mod)
    param_2 = get_param_value(memory, param_2, param_2_mod)

    store_value =
      cond do
        instruction == 7 and param_1 < param_2 -> 1
        instruction == 8 and param_1 == param_2 -> 1
        true -> 0
      end

    List.replace_at(memory, param_3, store_value)
  end

  defp parse_mods(opcode) do
    case Integer.digits(opcode) do
      [_] -> {0, 0, 0}
      [_, _] -> {0, 0, 0}
      [first_mode, _, _] -> {first_mode, 0, 0}
      [second_mode, first_mode, _, _] -> {first_mode, second_mode, 0}
      [third_mode, second_mode, first_mode, _, _] -> {first_mode, second_mode, third_mode}
    end
  end

  defp get_param_value(_, param_value, 1), do: param_value
  defp get_param_value(memory, param_value, 0), do: Enum.at(memory, param_value)

  defp opcode_arithmetic(1, param_1, param_2), do: param_1 + param_2
  defp opcode_arithmetic(2, param_1, param_2), do: param_1 * param_2

  defp parse_input do
    IO.gets("Input:")
    |> String.trim()
    |> String.to_integer()
  end

  defp deserialize_input(intcode_binary) do
    intcode_binary
    |> String.split(",")
    |> Stream.map(&String.trim/1)
    |> Enum.map(&String.to_integer/1)
  end
end
