(ns aoc-2018.d2 (:require
                 [clojure.string :as str]
                 [clojure.set]))

(defn- parse-input [path] (str/split-lines (slurp path)))

(defn- count-ids-metrics [ids]
  (reduce (fn [[twos threes] id]
            (cond
              (and (id 2) (id 3)) [(inc twos) (inc threes)]
              (id 2) [(inc twos) threes]
              (id 3) [twos (inc threes)]
              :else [twos threes]))
          [0 0]
          ids))

(defn- index-ids [ids]
  (->> ids
       (map #(map-indexed vector %))
       (map #(apply hash-set %))))

(defn- find-similar-ids [indexed-ids]
  (->> (for [x indexed-ids
             y indexed-ids
             :let [diff (set/difference x y)]
             :when (= (count diff) 1)]
         (set/difference x diff))
       (take 1)
       (first)
       (map vec)
       (sort-by first)
       (map second)
       (apply str)))

(defn part-1
  "What is the checksum for your list of box IDs?"
  [ids]
  (->> ids
       (map (comp set vals frequencies))
       (count-ids-metrics)
       (apply *)))


(defn part-2
  "What letters are common between the two correct box IDs?"
  [ids]
  (->> ids
       (index-ids)
       (find-similar-ids)))

;; Puzzle: https://adventofcode.com/2018/day/2

(def test-input-1 (parse-input "resources/tests/d2_1.txt"))
(def test-input-2 (parse-input "resources/tests/d2_2.txt"))
(def input (parse-input "resources/puzzles/d2.txt"))

(= (part-1 test-input-1) 12)
(part-1 input)

(= (part-2 test-input-2) "fgij")
(part-2 input)
