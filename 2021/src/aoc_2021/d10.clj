(ns aoc-2021.d10 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)))

(defn part-1
  "Problem description"
  [data]
  nil)

;; Puzzle: https://adventofcode.com/2021/day/10

(def test-input (parse-input "resources/tests/d10.txt"))
(def input (parse-input "resources/puzzles/d10.txt"))

(= (part-1 test-input) nil)
(time (part-1 test-input))
