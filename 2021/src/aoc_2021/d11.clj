(ns aoc-2021.d11 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map vec)
       (mapv (partial mapv #(Integer/parseInt (str %))))))

(defn- adjacent-positions [octopus-map [row coll]]
  (for [adj-row  (range (dec row) (+ row 2))
        adj-coll (range (dec coll) (+ coll 2))
        :when (and (get-in octopus-map [adj-row adj-coll])
                   (not= [row coll] [adj-row adj-coll]))]
    [adj-row adj-coll]))

(defn- iterate-octopus-map [octopus-map]
  (for [row  (range (count octopus-map))
        coll (range (count (first octopus-map)))]
    [row coll]))

(defn- detect-flash [octopus-map pos]
  (let [val (get-in octopus-map pos)]
    (case val
      9 (reduce detect-flash
                (assoc-in octopus-map pos nil)
                (adjacent-positions octopus-map pos))
      nil octopus-map
      (update-in octopus-map pos inc))))

(defn- apply-step [octopus-map]
  (reduce detect-flash
          octopus-map
          (iterate-octopus-map octopus-map)))

(defn- count-flashes [octopus-map]
  (->> octopus-map
       (flatten)
       (filter nil?)
       (count)))

(defn- reset-flashes [octopus-map]
  (mapv (fn [row] (mapv #(if % % 0) row)) octopus-map))

(defn part-1
  "How many total flashes are there after 100 steps?"
  [octopus-map]
  (second (reduce (fn [[octopus-map flash-cnt] _]
                    (let [octopus-map (apply-step octopus-map)
                          flash-cnt   (+ flash-cnt (count-flashes octopus-map))
                          octopus-map (reset-flashes octopus-map)]
                      [octopus-map flash-cnt]))
                  [octopus-map 0] (range 100))))

(defn part-2
  "What is the first step during which all octopuses flash?"
  [octopus-map]
  (reduce (fn [octopus-map step]
            (let [octopus-map (apply-step octopus-map)
                  octopus-cnt (- 100 (count-flashes octopus-map))
                  octopus-map (reset-flashes octopus-map)]
              (if (zero? octopus-cnt)
                (reduced step)
                octopus-map)))
          octopus-map (iterate inc 1)))

;; Puzzle: https://adventofcode.com/2021/day/11

(def test-input-1 (parse-input "resources/tests/d11_1.txt"))
(def test-input-2 (parse-input "resources/tests/d11_2.txt"))
(def input (parse-input "resources/puzzles/d11.txt"))

(= (part-1 test-input-1) 1656)
(time (part-1 input))

(= (part-2 test-input-1) 195)
(time (part-2 input))
