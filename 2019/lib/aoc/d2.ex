defmodule AoC.D2 do
  @moduledoc """
    Solution for puzzle on https://adventofcode.com/2019/day/2.
  """

  @arithmetic_opcodes [1, 2]
  @part2_result 19_690_720
  @noun_range 0..99
  @verb_range 0..99

  @type memory :: list(integer)

  @spec part1() :: integer
  def part1 do
    AoC.read_puzzle_input(2)
    |> deserialize_input()
    |> modify_memory()
    |> process_instructions()
    |> hd()
  end

  @spec part2() :: integer
  def part2 do
    intcode = deserialize_input(AoC.read_puzzle_input(2))
    generator = for noun <- @noun_range, verb <- @verb_range, do: {noun, verb}

    Enum.find_value(generator, fn {noun, verb} ->
      result =
        intcode
        |> modify_memory(noun, verb)
        |> process_instructions()
        |> hd()

      if result == @part2_result, do: 100 * noun + verb
    end)
  end

  @spec process_instructions(memory, integer) :: memory | String.t()
  def process_instructions(memory), do: process_instructions(memory, 0)

  defp process_instructions(memory, address) do
    opcode = Enum.at(memory, address)

    cond do
      opcode == 99 ->
        memory

      opcode in @arithmetic_opcodes ->
        memory
        |> process_arithmetic_instruction(address)
        |> process_instructions(address + 4)

      true ->
        "Bad opcode: #{opcode} in memory: #{memory}:#{address}"
    end
  end

  defp process_arithmetic_instruction(intcode, address) do
    [opcode, param_1, param_2, ins_res_pos | _] = Enum.slice(intcode, address..-1)
    param_1 = Enum.at(intcode, param_1)
    param_2 = Enum.at(intcode, param_2)
    ins_res = opcode_arithmetic(opcode, param_1, param_2)

    List.replace_at(intcode, ins_res_pos, ins_res)
  end

  defp opcode_arithmetic(1, param_1, param_2), do: param_1 + param_2
  defp opcode_arithmetic(2, param_1, param_2), do: param_1 * param_2

  defp deserialize_input(intcode_binary) do
    intcode_binary
    |> String.split(",")
    |> Stream.map(&String.trim/1)
    |> Enum.map(&String.to_integer/1)
  end

  defp modify_memory(memory, noun \\ 12, verb \\ 2) do
    memory
    |> List.replace_at(1, noun)
    |> List.replace_at(2, verb)
  end
end
