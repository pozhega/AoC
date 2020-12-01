defmodule AoC.D3Test do
  use ExUnit.Case

  alias AoC.D3

  @wire_1_commands ["R75", "D30", "R83", "U83", "L12", "D49", "R71", "U7", "L72"]
  @wire_2_commands ["U62", "R66", "U55", "R34", "D71", "R55", "D58", "R83"]
  @wire_3_commands [
    "R98",
    "U47",
    "R26",
    "D63",
    "R33",
    "U87",
    "L62",
    "D20",
    "R33",
    "U53",
    "R51"
  ]
  @wire_4_commands ["U98", "R91", "D20", "R16", "D67", "R40", "U7", "R15", "U6", "R7"]

  test "calculates distance; case #1" do
    wire_segments = D3.translate_wires_commands([@wire_1_commands, @wire_2_commands])

    assert D3.calculate_min_intersection(wire_segments) |> Map.get(:distance) == 159
  end

  test "calculates distance; case #2" do
    wire_segments = D3.translate_wires_commands([@wire_3_commands, @wire_4_commands])

    assert D3.calculate_min_intersection(wire_segments) |> Map.get(:distance) == 135
  end

  test "calculates steps; case #1" do
    wire_segments = D3.translate_wires_commands([@wire_1_commands, @wire_2_commands])

    assert D3.calculate_min_intersection(wire_segments) |> Map.get(:steps) == 610
  end

  test "calculates steps; case #2" do
    wire_segments = D3.translate_wires_commands([@wire_3_commands, @wire_4_commands])

    assert D3.calculate_min_intersection(wire_segments) |> Map.get(:steps) == 410
  end
end
