(ns aoc-2021.d12 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map #(str/split % #"-"))
       (reduce (fn [map [a b]]
                 (->> map
                      (merge-with (comp vec concat) {a [b]})
                      (merge-with (comp vec concat) {b [a]})))
               {})))

(defn small-cave? [cave]
  (= cave (str/lower-case cave)))

(defn- small-cave-duplicate? [path cave]
  (and (small-cave? cave) (some #{cave} path)))

(defn- path-with-duplicate? [path]
  (->> path
       (filter small-cave?)
       (frequencies)
       (vals)
       (some #(= 2 %))))

(defn- find-paths [cave-system condition curr-path]
  (let [curr-cave (last curr-path)]
    (if (= curr-cave "end")
      curr-path
      (->> (cave-system curr-cave)
           (remove #{"start"})
           (remove #(condition curr-path %))
           (map #(find-paths cave-system condition (conj curr-path %)))))))

(defn- count-paths [cave-system condition]
  (->> (find-paths cave-system condition ["start"])
       (flatten)
       (filter #(= "start" %))
       (count)))

(defn part-1
  "How many paths through this cave system are there that visit small caves at most once?"
  [cave-system]
  (count-paths cave-system small-cave-duplicate?))

(defn part-2
  "How many paths through this cave system are there that visit small caves at most once?"
  [cave-system]
  (count-paths cave-system
               #(and (small-cave-duplicate? %1 %2)
                     (path-with-duplicate? %1))))

;; Puzzle: https://adventofcode.com/2021/day/12

(def test-input-1 (parse-input "resources/tests/d12_1.txt"))
(def test-input-2 (parse-input "resources/tests/d12_2.txt"))
(def test-input-3 (parse-input "resources/tests/d12_3.txt"))
(def input (parse-input "resources/puzzles/d12.txt"))

(= (part-1 test-input-1) 10)
(= (part-1 test-input-2) 19)
(= (part-1 test-input-3) 226)
(time (part-1 input))

(= (part-2 test-input-1) 36)
(= (part-2 test-input-2) 103)
(= (part-2 test-input-3) 3509)
(time (part-2 input))
