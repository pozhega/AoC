(ns aoc-2021.d12 (:require
                  [clojure.string :as str]))

(defn- parse-input [path] (str/split-lines (slurp path)))

(defn part-1
  "Problem description"
  [data]
  nil)

(defn part-2
  "Problem description"
  [data]
  nil)

;; Puzzle: https://adventofcode.com/2021/day/12

(def test-input (parse-input "resources/tests/d12.txt"))
(def input (parse-input "resources/puzzles/d12.txt"))

(= (part-1 test-input) nil)
(part-1 input)

(= (part-2 test-input) nil)
(part-2 input)


