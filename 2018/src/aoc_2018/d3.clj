(ns aoc-2018.d3 (:require
                 [clojure.string :as str]
                 [clojure.set]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map (fn [line]
              (->> line
                   (re-matcher #"#(\d+) @ (\d+),(\d+): (\d+)x(\d+)")
                   (re-find)
                   (rest)
                   (map #(Integer/parseInt %))
                   (vec))))))


(defn- generate-fabric []
  (vec (repeat 1000 (vec (repeat 1000 nil)))))

(defn- fields-from-claim [[_ left top width height]]
  (for [row (range top (+ top height))
        col (range left (+ left width))]
    [row col]))

(defn- update-fabric-fields [fabric fields id]
  (reduce (fn [fabric field] (update-in fabric field #(if (nil? %) id false)))
          fabric
          fields))

(defn- apply-claims [fabric claims]
  (reduce #(update-fabric-fields %1 (fields-from-claim %2) (first %2))
          fabric
          claims))

(defn- count-overlaps [fabric]
  (->> fabric
       (filter false?)
       (count)))

(defn- no-overlap? [fabric-freqs [id _ _ width height]]
  (= (* width height) (fabric-freqs id)))

(defn part-1
  "How many square inches of fabric are within two or more claims?"
  [claims]
  (-> (generate-fabric)
      (apply-claims claims)
      (flatten)
      (count-overlaps)))

(defn part-2
  "What is the ID of the only claim that doesn't overlap?"
  [claims]
  (let [fabric-freqs (-> (generate-fabric)
                         (apply-claims claims)
                         (flatten)
                         (frequencies))]
    (->> claims
         (some #(if (no-overlap? fabric-freqs %) %))
         (first))))

;; Puzzle: https://adventofcode.com/2018/day/3

(def test-input (parse-input "resources/tests/d3.txt"))
(def input (parse-input "resources/puzzles/d3.txt"))

(= (part-1 test-input) 4)
(part-1 input)

(= (part-2 test-input) 3)
(part-2 input)
