(ns aoc-2021.d7 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)))

(defn part-1
  "Problem description"
  [data]
  nil)

;; Puzzle: https://adventofcode.com/2021/day/7

(def test-input (parse-input "resources/tests/d7.txt"))
(def input (parse-input "resources/puzzles/d7.txt"))

(= (part-1 test-input) nil)
(time (part-1 test-input))

