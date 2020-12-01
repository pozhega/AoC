defmodule AoC.D1Test do
  use ExUnit.Case

  alias AoC.D1

  test "calculates basic fuel requirements" do
    assert D1.basic_fuel_requirement(12) == 2
    assert D1.basic_fuel_requirement(14) == 2
    assert D1.basic_fuel_requirement(1969) == 654
    assert D1.basic_fuel_requirement(100_756) == 33583
  end

  test "calculates complex fuel requirements" do
    assert D1.complex_fuel_requirement(14) == 2
    assert D1.complex_fuel_requirement(1969) == 966
    assert D1.complex_fuel_requirement(100_756) == 50346
  end
end
