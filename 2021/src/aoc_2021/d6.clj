(ns aoc-2021.d6 (:require
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

;; Puzzle: https://adventofcode.com/2021/day/6

(def test-input (parse-input "resources/tests/d6.txt"))
(def input (parse-input "resources/puzzles/d6.txt"))

(= (part-1 test-input) nil)
(part-1 input)

(= (part-2 test-input) nil)
(part-2 input)

