(ns aoc-2021.d22 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map (fn [line]
              (let [[state & vals] (->> line
                                        (re-matcher #"(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)")
                                        (re-find)
                                        (rest))
                    vals           (map #(Integer/parseInt %) vals)]
                [state vals])))))

(defn- iterate-cubes [x1 x2 y1 y2 z1 z2]
  (for [x (range x1 (inc x2))
        y (range y1 (inc y2))
        z (range z1 (inc z2))]
    [x y z]))

(defn part-1
  "How many cubes are on?"
  [steps]
  (->> steps
       (reduce (fn [cubes [state [x1 x2 y1 y2 z1 z2]]]
                 (reduce (fn [cubes pos]
                           (if (= state "on")
                             (conj cubes pos)
                             (disj cubes pos)))
                         cubes
                         (iterate-cubes x1 x2 y1 y2 z1 z2)))
               #{})
       (count)))

;; Puzzle: https://adventofcode.com/2021/day/22

(def test-input (parse-input "resources/tests/d22.txt"))
(def input (parse-input "resources/puzzles/d22.txt"))

(= (part-1 test-input) 590784)
(time (part-1 input))
