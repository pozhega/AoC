(ns aoc-2021.d11 (:require
                  [clojure.string :as str]
                  [aoc-2021.core :refer [star-neighbours]]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map vec)
       (mapv (partial mapv #(Integer/parseInt (str %))))))

(def octopus-map-fields
  (for [row (range 10) coll (range 10)] [row coll]))

(def steps (range 100))

(def infinite-steps (iterate inc 1))

(defn- detect-flash [octopus-map pos]
  (let [val (get-in octopus-map pos)]
    (case val
      9 (reduce detect-flash
                (assoc-in octopus-map pos nil)
                (star-neighbours octopus-map pos))
      nil octopus-map
      (update-in octopus-map pos inc))))

(defn- apply-step [octopus-map]
  (reduce detect-flash octopus-map octopus-map-fields))

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
                  [octopus-map 0]
                  steps)))

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
          octopus-map
          infinite-steps))

;; Puzzle: https://adventofcode.com/2021/day/11

(def test-input (parse-input "resources/tests/d11.txt"))
(def input (parse-input "resources/puzzles/d11.txt"))

(= (part-1 test-input) 1656)
(time (part-1 input))

(= (part-2 test-input) 195)
(time (part-2 input))
