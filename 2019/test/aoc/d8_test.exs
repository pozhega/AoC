defmodule AoC.D8Test do
  use ExUnit.Case

  alias AoC.D8

  @image_tall 2
  @image_wide 2

  test "decode image" do
    image =
      "0222112222120000"
      |> String.graphemes()
      |> D8.process_image(@image_tall * @image_wide)
      |> D8.decode_image()

    assert image == "0110"
  end
end
