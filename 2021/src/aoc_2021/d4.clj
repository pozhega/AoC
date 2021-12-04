(ns aoc-2021.d4 (:require
                 [clojure.string :as str]))

(defn- parse-input [path]
  (let [lines   (str/split-lines (slurp path))
        numbers (->> (str/split (first lines) #",")
                     (map #(Integer/parseInt %)))
        boards  (->> (nthrest lines 2)
                     (remove empty?)
                     (map #(str/split % #"\s+"))
                     (map (partial remove empty?))
                     (map (partial map #(Integer/parseInt %)))
                     (partition 5))]
    [numbers boards]))

(defn- board-colls [board]
  (->> board
       (apply interleave)
       (partition 5)))

(defn- winning-board? [board]
  (or (some (partial every? true?) board)
      (some (partial every? true?) (board-colls board))))

(defn- mark-board [board number]
  (map (partial map #(if (= number %) true %)) board))

(defn- sum-unmarked [board]
  (->> board
       (flatten)
       (filter integer?)
       (reduce +)))

(defn- board-score [board number]
  (* (sum-unmarked board) number))

(defn part-1
  "What will your final score be if you choose that board?"
  [[numbers boards]]
  (reduce (fn [boards number]
            (let [boards (map #(mark-board % number) boards)
                  winner (first (filter winning-board? boards))]
              (if winner
                (reduced (board-score winner number))
                boards)))
          boards
          numbers))

(defn part-2
  "Once it wins, what would its final score be?"
  [[numbers boards]]
  (->> numbers
       (reduce (fn [[boards scores] number]
                 (let [boards (map #(mark-board % number) boards)
                       winners (filter winning-board? boards)
                       winning-scores (map #(board-score % number) winners)
                       boards (remove (set winners) boards)]
                   [boards (concat scores winning-scores)]))
               [boards []])
       (last)
       (last)))

;; Puzzle: https://adventofcode.com/2021/day/4

(def test-input (parse-input "resources/tests/d4.txt"))
(def input (parse-input "resources/puzzles/d4.txt"))

(= (part-1 test-input) 4512)
(part-1 input)

(= (part-2 test-input) 1924)
(part-2 input)
