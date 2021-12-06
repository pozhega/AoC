(ns aoc-2021.d2 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map #(let [[dir val] (str/split % #" ")]
               [dir (Integer/parseInt val)]))))

(defn- naive-interpreter [[v-pos h-pos] [dir val]]
  (case dir
    "up"      [v-pos (- h-pos val)]
    "down"    [v-pos (+ h-pos val)]
    "forward" [(+ v-pos val) h-pos]))

(defn- manual-interpreter [[v-pos h-pos aim] [dir val]]
  (case dir
    "up"      [v-pos h-pos (- aim val)]
    "down"    [v-pos h-pos (+ aim val)]
    "forward" [(+ v-pos (* aim val)) (+ h-pos val) aim]))

(defn part-1
  "What do you get if you multiply your final horizontal position by your final depth?"
  [instructions]
  (->> instructions
       (reduce naive-interpreter [0 0])
       (apply *)))

(defn part-2
  "What do you get if you multiply your final horizontal position by your final depth?"
  [instructions]
  (->> instructions
       (reduce manual-interpreter [0 0 0])
       (take 2)
       (apply *)))

;; Puzzle: https://adventofcode.com/2021/day/2

(def test-input (parse-input "resources/tests/d2.txt"))
(def input (parse-input "resources/puzzles/d2.txt"))

(= (part-1 test-input) 150)
(time (part-1 input))

(= (part-2 test-input) 900)
(time (part-2 input))
