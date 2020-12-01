defmodule AoC.D6Test do
  use ExUnit.Case

  alias AoC.D6

  @orbits_map_1 "COM)B
  B)C
  C)D
  D)E
  E)F
  B)G
  G)H
  D)I
  E)J
  J)K
  K)L"

  @orbit_map_2 "COM)B
  B)C
  C)D
  D)E
  E)F
  B)G
  G)H
  D)I
  E)J
  J)K
  K)L
  K)YOU
  I)SAN"

  test "count orbits" do
    orbit_tree =
      @orbits_map_1
      |> String.split()
      |> Enum.map(&D6.parse_relationship/1)
      |> Enum.reduce(%{}, &D6.build_orbit_tree/2)

    assert D6.count_orbits(orbit_tree["COM"][:to], orbit_tree) == 42
  end

  test "count transfers" do
    orbit_tree =
      @orbit_map_2
      |> String.split()
      |> Enum.map(&D6.parse_relationship/1)
      |> Enum.reduce(%{}, &D6.build_orbit_tree/2)

    assert D6.count_orbital_transfers(orbit_tree["YOU"][:from], orbit_tree) == 4
  end
end
