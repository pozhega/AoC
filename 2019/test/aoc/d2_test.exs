defmodule AoC.D2Test do
  use ExUnit.Case

  alias AoC.D2

  test "processes intcode" do
    assert D2.process_instructions([1, 0, 0, 0, 99]) == [2, 0, 0, 0, 99]
    assert D2.process_instructions([2, 3, 0, 3, 99]) == [2, 3, 0, 6, 99]
    assert D2.process_instructions([2, 4, 4, 5, 99, 0]) == [2, 4, 4, 5, 99, 9801]
    assert D2.process_instructions([1, 1, 1, 4, 99, 5, 6, 0, 99]) == [30, 1, 1, 4, 2, 5, 6, 0, 99]
  end
end
