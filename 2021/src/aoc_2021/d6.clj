(ns aoc-2021.d6 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map #(str/split % #","))
       (first)
       (map #(Integer/parseInt %))))


(def child-fishes
  (memoize (fn [fish days]
             (if (< days fish)
               1
               (+ 1
                  (reduce + (map #(child-fishes 9 %) (range (- days fish) 0 -7))))))))

(defn- count-lanterfish [state days]
  (reduce + (map #(child-fishes % days) state)))

(defn part-1
  "How many lanternfish would there be after 80 days?"
  [state]
  (count-lanterfish state 80))

(defn part-2
  "How many lanternfish would there be after 256 days?"
  [state]
  (count-lanterfish state 256))

;; Puzzle: https://adventofcode.com/2021/day/6

(def test-input (parse-input "resources/tests/d6.txt"))
(def input (parse-input "resources/puzzles/d6.txt"))

(= (part-1 test-input) 5934)
(part-1 input)

(= (part-2 test-input) 26984457539)
(part-2 input)
