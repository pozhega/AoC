(ns aoc-2021.d10 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)))

(defn- middle-element [vector]
  (nth vector (quot (count vector) 2)))

(def openning-chars #{\(, \[, \{, \<})

(def matching-chars-map {\) \(, \] \[, \} \{, \> \<
                         \( \), \[ \], \{ \}, \< \>})

(def char-points-1 {\) 3, \] 57, \} 1197, \> 25137})

(def char-points-2 {\) 1, \] 2, \} 3, \> 4})

(defn- find-illegal-char [line]
  (reduce (fn [open-stack char]
            (if (openning-chars char)
              (conj open-stack char)
              (if (not= (matching-chars-map char)
                        (last open-stack))
                (reduced char)
                (vec (butlast open-stack)))))
          (vector)
          line))

(defn- score-incomplete-line [line]
  (->> line
       (map matching-chars-map)
       (reverse)
       (reduce #(+ (* %1 5) (char-points-2 %2)) 0)))

(defn part-1
  "What is the total syntax error score for those errors?"
  [lines]
  (->> lines
       (map find-illegal-char)
       (filter char?)
       (map char-points-1)
       (reduce +)))

(defn part-2
  "What is the middle score?"
  [lines]
  (->> lines
       (map find-illegal-char)
       (filter vector?)
       (map score-incomplete-line)
       (sort)
       (middle-element)))

;; Puzzle: https://adventofcode.com/2021/day/10

(def test-input (parse-input "resources/tests/d10.txt"))
(def input (parse-input "resources/puzzles/d10.txt"))

(= (part-1 test-input) 26397)
(time (part-1 input))

(= (part-2 test-input) 288957)
(time (part-2 input))
