(ns aoc-2021.d5 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map (fn [line] (->> line
                            (re-matcher #"(\d+),(\d+) -> (\d+),(\d+)")
                            (re-find)
                            (rest)
                            (map #(Integer/parseInt %))
                            (partition 2))))))

(defn- update-vent-map [vent-map point]
  (update vent-map point (fnil inc 0)))

(defn- calc-straight-line [[x1 y1] [x2 y2]]
  (cond
    (= x1 x2) (map vector
                   (repeat x1)
                   (range (min y1 y2) (inc (max y1 y2))))
    (= y1 y2) (map vector
                   (range (min x1 x2) (inc (max x1 x2)))
                   (repeat y1))))

(defn- calc-diagonal-line [[x1 y1] [x2 y2]]
  (cond
    (or (and (< x1 x2) (> y1 y2))
        (and (> x1 x2) (< y1 y2))) (map vector
                                        (range (min x1 x2) (inc (max x1 x2)))
                                        (range (max y1 y2) (dec (min y1 y2)) -1))
    (or (and (< x1 x2) (< y1 y2))
        (and (> x1 x2) (> y1 y2))) (map vector
                                        (range (min x1 x2) (inc (max x1 x2)))
                                        (range (min y1 y2) (inc (max y1 y2))))))

(defn- calc-mixed-line [point-1 point-2]
  (or (calc-straight-line point-1 point-2)
      (calc-diagonal-line point-1 point-2)))

(defn- draw-line [vent-map points calc-fun]
  (->> points
       (apply calc-fun)
       (reduce update-vent-map vent-map)))

(defn- count-overlaps [lines calc-fun]
  (->> lines
       (reduce #(draw-line %1 %2 calc-fun) {})
       (filter #(> (val %) 1))
       (count)))

(defn part-1
  "At how many points do at least two lines overlap?"
  [lines]
  (count-overlaps lines calc-straight-line))

(defn part-2
  "At how many points do at least two lines overlap?"
  [lines]
  (count-overlaps lines calc-mixed-line))

;; Puzzle: https://adventofcode.com/2021/day/5

(def test-input (parse-input "resources/tests/d5.txt"))
(def input (parse-input "resources/puzzles/d5.txt"))

(= (part-1 test-input) 5)
(time (part-1 input))

(= (part-2 test-input) 12)
(time (part-2 input))
