(ns aoc-2021.d1 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map #(Integer/parseInt %))))

(defn- count-increases [coll]
  (->> coll
       (partition 2 1)
       (filter (partial apply <))
       (count)))

(defn part-1
  "How many measurements are larger than the previous measurement?"
  [measurements]
  (count-increases measurements))

(defn part-2
  "How many sums are larger than the previous sum?"
  [measurements]
  (->> measurements
       (partition 3 1)
       (map (partial apply +))
       (count-increases)))

;; Puzzle: https://adventofcode.com/2021/day/1

(def test-input (parse-input "resources/tests/d1.txt"))
(def input (parse-input "resources/puzzles/d1.txt"))

(= (part-1 test-input) 7)
(time (part-1 input))

(= (part-2 test-input) 5)
(time (part-2 input))
