defmodule AoC.D3 do
  @moduledoc """
    Solution for puzzle on https://adventofcode.com/2019/day/3.

    NOTE: Refactor -> fix complexity for part 1. Implement segmentation tree and line sweep algorithm for nLog(n).
  """

  @type wire_input :: list(String.t())
  @type coordinate :: {integer, integer}
  @type axis :: :x | :y
  @type wire_segment :: %{
          from: coordinate,
          to: coordinate,
          axis: axis,
          step: integer,
          total_step: integer
        }

  @spec part1() :: integer
  def part1 do
    AoC.read_puzzle_input(3)
    |> deserialize_input()
    |> translate_wires_commands()
    |> calculate_min_intersection()
    |> Map.get(:distance)
  end

  @spec part2() :: integer
  def part2 do
    AoC.read_puzzle_input(3)
    |> deserialize_input()
    |> translate_wires_commands()
    |> calculate_min_intersection()
    |> Map.get(:steps)
  end

  @spec translate_wire_commands(list(wire_input)) :: list(wire_segment)
  def translate_wires_commands([wire_1_commands, wire_2_commands]) do
    [
      translate_wire_commands(wire_1_commands),
      translate_wire_commands(wire_2_commands)
    ]
  end

  @spec calculate_min_intersection(list(wire_segment)) :: integer
  def calculate_min_intersection([wire_1_segments, wire_2_segments]) do
    Enum.reduce(
      wire_1_segments,
      %{steps: nil, distance: nil},
      &find_intersections(&1, &2, wire_2_segments)
    )
  end

  defp translate_wire_commands(wire_commands) do
    Enum.reduce(wire_commands, [], &commands_to_segments/2)
  end

  defp commands_to_segments(command, wire_segments) do
    {direction, step} = String.split_at(command, 1)
    step = String.to_integer(step)

    %{to: {last_x, last_y} = last_coordinate, total_steps: total_steps} =
      List.last(wire_segments) || %{to: {0, 0}, total_steps: 0}

    {axis, to} =
      case direction do
        "U" -> {:y, {last_x, last_y + step}}
        "D" -> {:y, {last_x, last_y - step}}
        "L" -> {:x, {last_x - step, last_y}}
        "R" -> {:x, {last_x + step, last_y}}
      end

    wire_segments ++
      [%{from: last_coordinate, to: to, axis: axis, step: step, total_steps: total_steps + step}]
  end

  defp find_intersections(%{from: {0, 0}}, closest_interaction, _), do: closest_interaction

  defp find_intersections(wire_1_segment, min, wire_2_segments) do
    intersection =
      Enum.find_value(wire_2_segments, fn wire_2_segment ->
        {w1_from_x, w1_from_y} = wire_1_segment.from
        {w1_to_x, w1_to_y} = wire_1_segment.to
        {w2_from_x, w2_from_y} = wire_2_segment.from
        {w2_to_x, w2_to_y} = wire_2_segment.to

        cond do
          w1_from_x in w2_from_x..w2_to_x and w2_from_y in w1_from_y..w1_to_y ->
            manhatan_distance = manhatan_distance({w1_from_x, w2_from_y})

            x_interaction_steps =
              cond do
                w2_to_x > w2_from_x -> w1_from_x - w2_from_x
                w2_to_x < w2_from_x -> w2_from_x - w1_from_x
              end

            y_interaction_steps =
              cond do
                w1_to_y > w1_from_y -> w2_from_y - w1_from_y
                w1_to_y < w1_from_y -> w1_from_y - w2_from_y
              end

            acumulated_steps =
              wire_1_segment.total_steps + wire_2_segment.total_steps - wire_1_segment.step -
                wire_2_segment.step

            {manhatan_distance,
             acumulated_steps + abs(x_interaction_steps) + abs(y_interaction_steps)}

          w2_from_x in w1_from_x..w1_to_x and w1_from_y in w2_from_y..w2_to_y ->
            manhatan_distance = manhatan_distance({w2_from_x, w1_from_y})

            x_interaction_steps =
              cond do
                w1_to_x > w1_from_x -> w2_from_x - w1_from_x
                w1_to_x < w1_from_x -> w1_from_x - w2_from_x
              end

            y_interaction_steps =
              cond do
                w2_to_y > w2_from_y -> w1_from_y - w2_from_y
                w2_to_y < w2_from_y -> w2_from_y - w1_from_y
              end

            acumulated_steps =
              wire_1_segment.total_steps + wire_2_segment.total_steps - wire_1_segment.step -
                wire_2_segment.step

            {manhatan_distance,
             acumulated_steps + abs(x_interaction_steps) + abs(y_interaction_steps)}

          true ->
            nil
        end
      end)

    case intersection do
      {intersection_distance, intersection_steps} ->
        distance =
          if intersection_distance < min.distance do
            intersection_distance
          else
            min.distance
          end

        steps =
          if intersection_steps < min.steps do
            intersection_steps
          else
            min.steps
          end

        %{distance: distance, steps: steps}

      nil ->
        min
    end
  end

  defp manhatan_distance({x, y}), do: abs(x) + abs(y)

  defp deserialize_input(input_binary) do
    input_binary
    |> String.trim()
    |> String.split("\n")
    |> Enum.map(&String.split(&1, ","))
  end
end
