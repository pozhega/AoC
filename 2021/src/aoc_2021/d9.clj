(ns aoc-2021.d9 (:require
                 [clojure.string :as str]
                 [aoc-2021.core :refer [cross-neighbours iterate-matrix]]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map vec)
       (mapv (partial mapv #(Integer/parseInt (str %))))))

(defn- is-low-point? [heightmap pos]
  (< (get-in heightmap pos)
     (apply min (map #(get-in heightmap %) (cross-neighbours heightmap pos)))))

(defn- discover-basin [heightmap basin pos]
  (if (or (basin pos)
          (contains? #{9 nil} (get-in heightmap pos)))
    basin
    (reduce #(discover-basin heightmap %1 %2)
            (conj basin pos)
            (cross-neighbours heightmap pos))))

(defn part-1
  "What is the sum of the risk levels of all low points on your heightmap?"
  [heightmap]
  (->> heightmap
       (iterate-matrix)
       (filter #(is-low-point? heightmap %))
       (map (partial get-in heightmap))
       (map inc)
       (reduce +)))

(defn part-2
  "What do you get if you multiply together the sizes of the three largest basins?"
  [heightmap]
  (->> heightmap
       (iterate-matrix)
       (filter #(is-low-point? heightmap %))
       (map #(discover-basin heightmap #{} %))
       (map count)
       (take-last 3)
       (reduce *)))

;; Puzzle: https://adventofcode.com/2021/day/9

(def test-input-1 (parse-input "resources/tests/d9.txt"))
(def input (parse-input "resources/puzzles/d9.txt"))

(= (part-1 test-input-1) 15)
(time (part-1 input))

(= (part-2 test-input-1) 1134)
(time (part-2 input))
