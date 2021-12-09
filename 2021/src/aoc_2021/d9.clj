(ns aoc-2021.d9 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map vec)
       (mapv (partial mapv #(Integer/parseInt (str %))))))

(defn- adjacent-positions [[row coll]]
  [[(dec row) coll]
   [row (dec coll)] [row (inc coll)]
   [(inc row) coll]])

(defn- find-adjacents-vals [heightmap pos]
  (->> (adjacent-positions pos)
       (map (partial get-in heightmap))
       (remove nil?)))

(defn- is-low-point? [heightmap pos]
  (< (get-in heightmap pos)
     (apply min (find-adjacents-vals heightmap pos))))

(defn- iterate-heightmap [heightmap]
  (for [row  (range (count heightmap))
        coll (range (count (first heightmap)))]
    [row coll]))

(defn- discover-basin [heightmap basin pos]
  (if (or (basin pos)
          (contains? #{9 nil} (get-in heightmap pos)))
    basin
    (reduce #(discover-basin heightmap %1 %2)
            (conj basin pos)
            (adjacent-positions pos))))

(defn part-1
  "What is the sum of the risk levels of all low points on your heightmap?"
  [heightmap]
  (->> heightmap
       (iterate-heightmap)
       (filter #(is-low-point? heightmap %))
       (map (partial get-in heightmap))
       (map inc)
       (reduce +)))

(defn part-2
  "What do you get if you multiply together the sizes of the three largest basins?"
  [heightmap]
  (->> heightmap
       (iterate-heightmap)
       (filter #(is-low-point? heightmap %))
       (map #(discover-basin heightmap #{} %))
       (map count)
       (sort)
       (take-last 3)
       (reduce *)))

;; Puzzle: https://adventofcode.com/2021/day/9

(def test-input-1 (parse-input "resources/tests/d9_1.txt"))
(def test-input-2 (parse-input "resources/tests/d9_2.txt"))
(def input (parse-input "resources/puzzles/d9.txt"))

(= (part-1 test-input-1) 15)
(time (part-1 input))

(= (part-2 test-input-1) 1134)
(= (part-2 test-input-2) 13)
(time (part-2 input))
