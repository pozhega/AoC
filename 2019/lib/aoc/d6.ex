defmodule AoC.D6 do
  @moduledoc """
    Solution for puzzle on https://adventofcode.com/2019/day/6.
  """

  @root_object "COM"
  @transfers_start "YOU"
  @transfers_end "SAN"

  @spec part1() :: integer
  def part1 do
    orbit_tree =
      AoC.stream_puzzle_input(6)
      |> Stream.map(&parse_relationship/1)
      |> Enum.reduce(%{}, &build_orbit_tree/2)

    count_orbits(orbit_tree[@root_object][:to], orbit_tree)
  end

  @spec part2() :: integer
  def part2 do
    orbit_tree =
      AoC.stream_puzzle_input(6)
      |> Stream.map(&parse_relationship/1)
      |> Enum.reduce(%{}, &build_orbit_tree/2)

    count_orbital_transfers(orbit_tree[@transfers_start][:from], orbit_tree)
  end

  def build_orbit_tree([around, in_orbit], orbit_tree) do
    around_node = orbit_tree[around] || %{to: [], from: nil}
    orbit_node = orbit_tree[in_orbit] || %{to: [], from: nil}

    orbit_tree
    |> Map.put(around, Map.put(around_node, :to, [in_orbit] ++ around_node[:to]))
    |> Map.put(in_orbit, Map.put(orbit_node, :from, around))
  end

  def count_orbits(_, _, tree_depth \\ 1, count \\ 0)

  def count_orbits([], _, _, count), do: count

  def count_orbits([object | rest], orbit_tree, tree_depth, count) do
    case orbit_tree[object][:to] do
      [] ->
        count_orbits(rest, orbit_tree, tree_depth, count + tree_depth)

      object_orbits ->
        orbit_count = count_orbits(object_orbits, orbit_tree, tree_depth + 1, 0)
        count_orbits(rest, orbit_tree, tree_depth, count + orbit_count + tree_depth)
    end
  end

  def count_orbital_transfers(_, _, count \\ 0)

  def count_orbital_transfers([@transfers_end | _], _, count), do: count

  def count_orbital_transfers([], _, _), do: 0

  def count_orbital_transfers(@transfers_end, _, count), do: count

  def count_orbital_transfers([object | rest], orbit_tree, count) do
    case orbit_tree[object][:to] do
      [] ->
        count_orbital_transfers(rest, orbit_tree, count)

      object_orbits ->
        case count_orbital_transfers(object_orbits, orbit_tree, count + 1) do
          0 -> count_orbital_transfers(rest, orbit_tree, count)
          count -> count
        end
    end
  end

  def count_orbital_transfers(object, orbit_tree, count) do
    case orbit_tree[object][:to] do
      [] ->
        count_orbital_transfers(orbit_tree[object][:from], orbit_tree, count + 1)

      object_orbits ->
        case count_orbital_transfers(object_orbits, orbit_tree, count) do
          0 -> count_orbital_transfers(orbit_tree[object][:from], orbit_tree, count + 1)
          count -> count
        end
    end
  end

  def parse_relationship(relationship_code),
    do: String.split(relationship_code, ")")
end
