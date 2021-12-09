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
   [row (dec coll)]
   [row (inc coll)]
   [(inc row) coll]])

(defn- find-adjacents-vals [heightmap [row coll]]
  (->> (adjacent-positions [row coll])
       (map (partial get-in heightmap))
       (remove nil?)))

(defn- is-low-point? [heightmap pos]
  (< (get-in heightmap pos)
     (apply min (find-adjacents-vals heightmap pos))))

(defn- iterate-heightmap [heightmap]
  (for [row  (range 0 (count heightmap))
        coll (range 0 (count (first heightmap)))]
    [row coll]))

(defn- discover [heightmap seen [row coll]]
  (if (or
       (seen [row coll])
       (= 9 (get-in heightmap [row coll]))
       (nil? (get-in heightmap [row coll])))
    seen
    (reduce (partial discover heightmap)
            (conj seen [row coll])
            (adjacent-positions [row coll]))))

(defn part-1
  "What is the sum of the risk levels of all low points on your heightmap?"
  [heightmap]
  (->> heightmap
       (iterate-heightmap)
       (filter (partial is-low-point? heightmap))
       (map (partial get-in heightmap))
       (map inc)
       (reduce +)))

(defn part-2
  "What do you get if you multiply together the sizes of the three largest basins?"
  [heightmap]
  (->> heightmap
       (iterate-heightmap)
       (filter (partial is-low-point? heightmap))
       (map #(discover heightmap #{} %))
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
