(ns aoc-2021.d17 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (re-matcher #"target area: x=(\d+)\.\.(\d+), y=(-\d+)\.\.(-\d+)")
       (re-find)
       (rest)
       (map #(Integer/parseInt %))
       (partition 2)))

(defn- in-target? [[x y] [[x1 x2] [y1 y2]]]
  (and (<= x1 x x2) (<= y1 y y2)))

(defn- over-target? [[x y] [[_ x2] [y1 _]]]
  (or (> x x2) (< y y1)))

(defn- apply-probe-step [probe velocities]
  (map + probe velocities))

(defn- apply-velocity-step [[x-vel y-vel]]
  [(cond
     (neg? x-vel) (inc x-vel)
     (pos? x-vel) (dec x-vel)
     :else        0)
   (dec y-vel)])

(defn- velocities-candidates [[x-target y-target]]
  (let [min-y (apply min y-target)]
    (for [x (range (reduce + x-target))
          y (range min-y (- min-y))]
      [x y])))

(defn- trajectory-max [target velocities]
  (loop [velocities velocities
         probe      [0 0]
         max-y      0]
    (let [probe      (apply-probe-step probe velocities)
          velocities (apply-velocity-step velocities)]
      (cond
        (over-target? probe target) nil
        (in-target?   probe target) max-y
        :else        (recur velocities probe (max max-y (last probe)))))))

(defn- find-max-trajectories [target]
  (->> target
       (velocities-candidates)
       (map (partial trajectory-max target))
       (remove nil?)))

(defn part-1
  "What is the highest y position it reaches on this trajectory?"
  [target]
  (->> target
       (find-max-trajectories)
       (apply max)))

(defn part-2
  "How many distinct initial velocity values cause the probe to be within the target area after any step?"
  [target]
  (->> target
       (find-max-trajectories)
       (count)))

;; Puzzle: https://adventofcode.com/2021/day/17

(def test-input (parse-input "resources/tests/d17.txt"))
(def input (parse-input "resources/puzzles/d17.txt"))

(= (part-1 test-input) 45)
(time (part-1 input))

(= (part-2 test-input) 112)
(time (part-2 input))
