defmodule AoC.D8 do
  @moduledoc """
    Solution for puzzle on https://adventofcode.com/2019/day/8.
  """

  @wide 25
  @tall 6
  @layer_length @wide * @tall
  @transparent_pixel "2"
  @image_meta %{
    layers: [],
    current_layer: [],
    fewest_zeros: nil,
    checksum: nil,
    current_zeros: 0,
    current_ones: 0,
    current_twos: 0,
    layer_pixels: nil
  }

  @spec part1() :: integer
  def part1 do
    AoC.read_puzzle_input(8)
    |> String.trim()
    |> String.graphemes()
    |> process_image(@wide * @tall)
    |> Map.get(:checksum)
  end

  @spec part2() :: integer
  def part2 do
    AoC.read_puzzle_input(8)
    |> String.trim()
    |> String.graphemes()
    |> process_image(@wide * @tall)
    |> decode_image()
  end

  def process_image(digits, layer_size) do
    Enum.reduce(
      digits,
      %{@image_meta | layer_pixels: layer_size},
      &get_metadata(&1, &2, layer_size)
    )
  end

  def decode_image(meta) do
    Enum.map(0..(@layer_length - 1), fn pixel ->
      meta.layers
      |> Stream.map(fn layer -> Enum.at(layer, pixel) end)
      |> Enum.find(fn pixel_value -> pixel_value != @transparent_pixel end)
    end)
    |> Enum.join("")
  end

  defp get_metadata(digit, meta, layer_size) do
    current_zeros = if digit == "0", do: meta.current_zeros + 1, else: meta.current_zeros
    current_ones = if digit == "1", do: meta.current_ones + 1, else: meta.current_ones
    current_twos = if digit == "2", do: meta.current_twos + 1, else: meta.current_twos

    if meta.layer_pixels == 1 do
      meta =
        if meta.current_zeros < meta.fewest_zeros do
          %{
            meta
            | fewest_zeros: meta.current_zeros,
              checksum: current_ones * current_twos
          }
        else
          meta
        end

      %{
        meta
        | layers: meta.layers ++ [meta.current_layer ++ [digit]],
          current_layer: [],
          current_zeros: 0,
          current_ones: 0,
          current_twos: 0,
          layer_pixels: layer_size
      }
    else
      %{
        meta
        | current_layer: meta.current_layer ++ [digit],
          current_zeros: current_zeros,
          current_ones: current_ones,
          current_twos: current_twos,
          layer_pixels: meta.layer_pixels - 1
      }
    end
  end
end
