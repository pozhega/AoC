(ns aoc-2021.d3 (:require
                 [clojure.string :as str]))

(defn- parse-input [path] (str/split-lines (slurp path)))

(defn- bin-to-int [binary] (Integer/parseInt (apply str binary) 2))

(defn- flip-bit [bit] (if (= \1 bit) \0 \1))

(defn- flip-bits [binary]
  (->> binary
       (map flip-bit)
       (apply str)))

(defn- most-common-bit [binaries pos]
  (let [{ones \1 zeros \0} (->> binaries
                                (map #(nth % pos))
                                (frequencies)
                                (merge {\0 0, \1 0}))]
    (if (>= ones zeros) \1 \0)))

(defn- least-common-bit [binaries pos]
  (-> binaries
      (most-common-bit pos)
      (flip-bit)))

(defn- calc-gamma-rate [binaries]
  (->> (count (first binaries))
       (range)
       (map (partial most-common-bit binaries))))

(defn- calc-gas-rating [binaries common-bit-fun]
  (reduce (fn [binaries pos]
            (if (= 1 (count binaries))
              (reduced binaries)
              (filter #(= (nth % pos) (common-bit-fun binaries pos)) binaries)))
          binaries
          (iterate inc 0)))

(defn part-1
  "What is the power consumption of the submarine?"
  [binaries]
  (let [gamma-rate   (calc-gamma-rate binaries)
        epsilon-rate (flip-bits gamma-rate)]
    (* (bin-to-int gamma-rate) (bin-to-int epsilon-rate))))

(defn part-2
  "What is the life support rating of the submarine?"
  [binaries]
  (let [o2-rating  (calc-gas-rating binaries most-common-bit)
        co2-rating (calc-gas-rating binaries least-common-bit)]
    (* (bin-to-int o2-rating) (bin-to-int co2-rating))))

;; Puzzle: https://adventofcode.com/2021/day/3

(def test-input (parse-input "resources/tests/d3.txt"))
(def input (parse-input "resources/puzzles/d3.txt"))

(= (part-1 test-input) 198)
(part-1 input)

(= (part-2 test-input) 230)
(part-2 input)
