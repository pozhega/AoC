(ns aoc-2021.d13 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)))

(defn part-1
  "Problem description"
  [data]
  nil)

;; Puzzle: https://adventofcode.com/2021/day/13

(def test-input (parse-input "resources/tests/d13.txt"))
(def input (parse-input "resources/puzzles/d13.txt"))

(= (part-1 test-input) nil)
(time (part-1 test-input))

