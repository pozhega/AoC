(ns aoc-2021.d21 (:require
                  [clojure.string :as str]
                  [clojure.math.combinatorics :as combo]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map (fn [line] (->> (str/split line #": ")
                            (last)
                            (Integer/parseInt))))))

(defn- roll-deterministic-dice [n]
  (->> (range 1 101)
       (cycle)
       (drop n)
       (take 3)))

(defn- move-player-by [current n]
  (->> (range 1 11)
       (cycle)
       (take (+ current n))
       (last)))

(defn- update-scores [p1-score p2-score p1-pos p2-pos rolls turn]
  (if (zero? (mod turn 2))
    (let [p2-pos (move-player-by p2-pos (apply + rolls))]
      [p1-score (+ p2-score p2-pos) p1-pos p2-pos])

    (let [p1-pos (move-player-by p1-pos (apply + rolls))]
      [(+ p1-score p1-pos) p2-score p1-pos p2-pos])))

(defn play [p1-pos p2-pos]
  (loop [p1-score 0      p2-score 0
         p1-pos   p1-pos p2-pos   p2-pos
         dice     0      turn     1]
    (let [rolls
          (roll-deterministic-dice dice)

          [p1-score p2-score p1-pos p2-pos]
          (update-scores p1-score p2-score p1-pos p2-pos rolls turn)]
      (cond
        (>= p1-score 1000) (* p2-score (* turn 3))
        (>= p2-score 1000) (* p1-score (* turn 3))
        :else (recur p1-score     p2-score
                     p1-pos       p2-pos
                     (last rolls) (inc turn))))))

(def quantum-play
  (memoize (fn [p1-score p2-score
                p1-pos   p2-pos
                turn]
             (cond
               (>= p1-score 21) [1 0]
               (>= p2-score 21) [0 1]

               :else
               (apply map
                      +
                      (map #(apply quantum-play (concat
                                                 (update-scores p1-score p2-score p1-pos p2-pos % turn)
                                                 [(inc turn)]))
                           (combo/selections [1 2 3] 3)))))))

(defn part-1
  "What do you get if you multiply the score of the losing player by the number of times the die was rolled during the game?"
  [[p1-pos p2-pos]]
  (play p1-pos p2-pos))

(defn part-2
  "Find the player that wins in more universes; in how many universes does that player win?"
  [[p1-pos p2-pos]]
  (apply max (quantum-play 0 0 p1-pos p2-pos 1)))

;; Puzzle: https://adventofcode.com/2021/day/21

(def test-input (parse-input "resources/tests/d21.txt"))
(def input (parse-input "resources/puzzles/d21.txt"))

(= (part-1 test-input) 739785)
(time (part-1 input))

(= (part-2 test-input) 444356092776315)
(time (part-2 input))
