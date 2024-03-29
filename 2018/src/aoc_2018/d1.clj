(ns aoc-2018.d1 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (map #(Integer/parseInt %)
       (str/split-lines (slurp path))))

(defn- apply-freq-changes [changes] (reduce + changes))

(defn- detect-duplicate-freq
  "Tracks changes in hash-set and detects first repetition"
  [changes]
  (reduce (fn [[freqs last-freq] change]
            (let [new-freq (+ last-freq change)]
              (if (freqs new-freq)
                (reduced new-freq)
                [(conj freqs new-freq) new-freq])))
          [#{0} 0]
          (cycle changes)))

(defn part-1
  "What is the resulting frequency after all of the changes?"
  [changes]
  (apply-freq-changes changes))

(defn part-2
  "What is the first frequency your device reaches twice?"
  [changes]
  (detect-duplicate-freq changes))

;; Puzzle: https://adventofcode.com/2018/day/1

(def test-input (parse-input "resources/tests/d1.txt"))
(def input (parse-input "resources/puzzles/d1.txt"))

(= (part-1 test-input) 3)
(part-1 input)

(= (part-2 test-input) 2)
(part-2 input)


