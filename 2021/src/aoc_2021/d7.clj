(ns aoc-2021.d7 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map #(str/split % #","))
       (map (partial map #(Integer/parseInt %)))
       (first)))

(defn- abs [n] (max n (- n)))

(defn- median [coll]
  (let [coll (sort coll)
        cnt (count coll)
        mid (bit-shift-right cnt 1)]
    (if (odd? cnt)
      (nth coll mid)
      (/ (+ (nth coll mid) (nth coll (dec mid))) 2))))

(defn- diff [n1 n2]
  (abs (- n1 n2)))

(defn- linear-sum [n]
  (/ (* n (+ n 1)) 2))

(defn mean [coll]
  (int (/ (reduce + coll) (count coll))))

(defn part-1
  "How much fuel must they spend to align to that position?"
  [crabs]
  (let [align-at (median crabs)]
    (->> crabs
         (map #(diff % align-at))
         (reduce +))))

(defn part-2
  "How much fuel must they spend to align to that position?"
  [crabs]
  (let [align-at (mean crabs)]
    (->> crabs
         (map #(linear-sum (diff % align-at)))
         (reduce +))))

;; Puzzle: https://adventofcode.com/2021/day/7

(def test-input (parse-input "resources/tests/d7.txt"))
(def input (parse-input "resources/puzzles/d7.txt"))

(= (part-1 test-input) 37)
(time (part-1 input))

(= (part-2 test-input) 168)
(time (part-2 input))
