(ns aoc-2021.d14 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)))

(defn part-1
  "Problem description"
  [data]
  nil)

;; Puzzle: https://adventofcode.com/2021/day/14

(def test-input (parse-input "resources/tests/d14.txt"))
(def input (parse-input "resources/puzzles/d14.txt"))

(= (part-1 test-input) nil)
(time (part-1 test-input))

