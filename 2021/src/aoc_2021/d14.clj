(ns aoc-2021.d14 (:require
                  [clojure.string :as str]
                  [aoc-2021.core, :as core]))

(defn- parse-input [path]
  (let [lines     (->> path
                       (slurp)
                       (str/split-lines))
        parts     (partition-by empty? lines)
        template  (->> parts
                       (first)
                       (first)
                       (map str))
        rules     (->> parts
                       (last)
                       (map #(str/split % #" -> "))
                       (into {}))]
    [template rules]))

(def polymerization
  (memoize (fn [rules pair]
             (let [polymer (rules pair)]
               [(str (first pair) polymer)
                (str polymer (second pair))]))))

(defn- init-pairs [template]
  (->> template
       (partition 2 1)
       (map #(apply str %))
       (frequencies)))

(defn- update-pairs [rules pairs [pair cnt]]
  (let [[new-pair-1 new-pair-2] (polymerization rules pair)]
    (-> pairs
        (update pair #(- % cnt))
        (update new-pair-1 (fnil #(+ cnt %) 0))
        (update new-pair-2 (fnil #(+ cnt %) 0)))))

(defn- update-singles [rules singles [pair cnt]]
  (update singles (rules pair) (fnil #(+ cnt %) 0)))

(defn- apply-step [[rules pairs singles] _]
  (reduce (fn [[rules pairs singles] pair-freq]
            [rules
             (update-pairs rules pairs pair-freq)
             (update-singles rules singles pair-freq)])
          [rules pairs singles]
          pairs))

(defn- apply-steps [template rules step-cnt]
  (->> (range step-cnt)
       (reduce apply-step [rules
                           (init-pairs template)
                           (frequencies template)])
       (last)))

(defn- get-quantity [singles]
  (let [vals (vals singles)]
    (- (apply max vals) (apply min vals))))

(defn part-1
  "What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?"
  [[template rules]]
  (get-quantity (apply-steps template rules 10)))

(defn part-2
  "What do you get if you take the quantity of the most common element and subtract the quantity of the least common element?"
  [[template rules]]
  (get-quantity (apply-steps template rules 40)))

;; Puzzle: https://adventofcode.com/2021/day/14

(def test-input (parse-input "resources/tests/d14.txt"))
(def input (parse-input "resources/puzzles/d14.txt"))

(= (part-1 test-input) 1588)
(time (part-1 input))

(= (part-2 test-input) 2188189693529)
(time (part-2 input))

