(ns aoc-2021.d20 (:require
                  [clojure.string :as str]
                  [aoc-2021.core :refer [iterate-matrix matrix-to-map bin-to-int]]))

(defn- parse-input [path]
  (let [lines        (->> path
                          (slurp)
                          (str/split-lines)
                          (remove empty?))
        algorithm    (first lines)
        image-matrix (->> lines
                          (rest)
                          (vec))]
    [algorithm image-matrix]))

(defn- point-sector [[row coll]]
  [[(dec row) (dec coll)] [(dec row) coll] [(dec row) (inc coll)]
   [row (dec coll)]       [row coll]       [row (inc coll)]
   [(inc row) (dec coll)] [(inc row) coll] [(inc row) (inc coll)]])

(defn- iterate-space [space-row space-coll]
  (for [row  (apply range space-row)
        coll (apply range space-coll)]
    [row coll]))

(defn- replace-point [image-map algorithm step point]
  (let [default (if (and (= (get algorithm 0) \#) (= (mod step 2) 0)) \# \.)]
    (->> point
         (point-sector)
         (map #(get image-map % default))
         (map #(if (= \# %) 1 0))
         (apply str)
         (bin-to-int)
         (get algorithm))))

(defn- apply-enhancement-step [[image-map algorithm space-row space-coll] step]
  (let [image-map (->> (iterate-space space-row space-coll)
                       (pmap #(vector % (replace-point image-map algorithm step %)))
                       (into {}))]
    [image-map
     algorithm
     [(dec (first space-row)) (inc (last space-row))]
     [(dec (first space-coll)) (inc (last space-coll))]]))

(defn- enhance-image [image-matrix algorithm steps]
  (let [space-row  [-1, (inc (count image-matrix))]
        space-coll [-1, (inc (count (first image-matrix)))]
        image-map  (matrix-to-map image-matrix)]
    (->> (range 1 (inc steps))
         (reduce apply-enhancement-step [image-map algorithm space-row space-coll])
         (first)
         (filter #(= \# (last %)))
         (count))))

(defn part-1
  "How many pixels are lit in the resulting image?"
  [[algorithm image-matrix]]
  (enhance-image image-matrix algorithm 2))

(defn part-2
  "How many pixels are lit in the resulting image?"
  [[algorithm image-matrix]]
  (enhance-image image-matrix algorithm 50))

;; Puzzle: https://adventofcode.com/2021/day/20

(def test-input (parse-input "resources/tests/d20.txt"))
(def input (parse-input "resources/puzzles/d20.txt"))

(= (part-1 test-input) 35)
(time (part-1 input))

(= (part-2 test-input) 3351)
(time (part-2 input))
