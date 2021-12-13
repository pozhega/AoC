(ns aoc-2021.d13 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (let [lines (->> path
                   (slurp)
                   (str/split-lines))
        parts (partition-by empty? lines)
        dots  (->> (first parts)
                   (map #(str/split % #","))
                   (mapv (partial mapv #(Integer/parseInt %)))
                   (set))
        folds (->> (last parts)
                   (map #(str/split % #"="))
                   (mapv #(vector
                          (last (first %))
                          (Integer/parseInt (last %)))))]
    [dots folds]))

(defn- translate-dot [[dot-x dot-y] axis val]
  (cond
    (and (= axis \x) (> dot-x val)) [(- val (- dot-x val)) dot-y]
    (and (= axis \y) (> dot-y val)) [dot-x (- val (- dot-y val))]
    :else [dot-x dot-y]))

(defn- apply-fold [dots [axis val]]
  (->> dots
       (map #(translate-dot % axis val))
       (remove nil?)
       (set)))

(defn part-1
  "How many dots are visible after completing just the first fold instruction on your transparent paper?"
  [[dots folds]]
  (->> (take 1 folds)
       (reduce apply-fold dots)
       (count)))

(defn part-2
  "What code do you use to activate the infrared thermal imaging camera system?"
  [[dots folds]]
  (->> folds
       (reduce apply-fold dots)
       (map #(apply list %))))

;; Puzzle: https://adventofcode.com/2021/day/13

(def test-input (parse-input "resources/tests/d13.txt"))
(def input (parse-input "resources/puzzles/d13.txt"))

(= (part-1 test-input) 17)
(time (part-1 input))

(time (part-2 input))
