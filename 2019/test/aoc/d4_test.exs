defmodule AoC.D4Test do
  use ExUnit.Case

  alias AoC.D4

  test "validates passwords with simple validator" do
    assert D4.validate_password(111_111, &D4.simple_validator/2)
    refute D4.validate_password(223_450, &D4.simple_validator/2)
    refute D4.validate_password(123_789, &D4.simple_validator/2)
  end

  test "validates passwords with complex validator" do
    assert D4.validate_password(112_233, &D4.complex_validator/2)
    refute D4.validate_password(123_444, &D4.complex_validator/2)
    refute D4.validate_password(111_111, &D4.complex_validator/2)
    assert D4.validate_password(111_122, &D4.complex_validator/2)
    assert D4.validate_password(223_333, &D4.complex_validator/2)
  end
end
