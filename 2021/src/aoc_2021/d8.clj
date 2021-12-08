(ns aoc-2021.d8 (:require
                 [clojure.string :as str]
                 [clojure.math.combinatorics :as combo]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (map #(str/split % #" \| "))
       (map (fn [segment]
              (map #(str/split % #" ") segment)))))

(defn replace-chars [string chars]
  (str/replace string (re-pattern (str "[" chars "]")) "x"))

(defn- decode-naive-signal [signal]
  (case (count signal) 2 1, 3 7, 4 4, 7 8, nil))

(def one #"[^x]xx[^x][^x][^x][^x]")
(def two #"xx[^x]xx[^x]x")
(def three #"xxxx[^x][^x]x")
(def four #"[^x]xx[^x][^x]xx")
(def five #"x[^x]xx[^x]xx")
(def six #"x[^x]xxxxx")
(def seven #"xxx[^x][^x][^x][^x]")
(def eight #"xxxxxxx")
(def nine #"xxxx[^x]xx")
(def zero #"xxxxxx[^x]")

(defn- mask-to-number [mask]
  (condp re-matches mask
    one  1, two  2, three 3, four  4
    five 5, six  6, seven 7, eight 8
    nine 9, zero 0, nil))

(defn- map-mask-numbers [signals masks]
  (map #(vector (first %) (mask-to-number (second %)))
       (map vector signals masks)))

(defn- mask-signals [signals setting]
  (map #(replace-chars setting %) signals))

(defn- valid-mapping? [masked-numbers]
  (every? second masked-numbers))

(defn- is-permutation [string pool]
  (when (= (count string) (count pool))
    (every? #(str/includes? string (str %)) pool)))

(defn- decode-signals [signals]
  (some #(let [setting    (apply str (vec %))
               masks      (mask-signals signals setting)
               signal-map (map-mask-numbers signals masks)]
           (when (valid-mapping? signal-map) signal-map))
        (combo/permutations "abcdefg")))

(defn- assoc-output-nums [[signal-map outputs]]
  (map #(some (fn [[signal num]]
                (when (is-permutation signal %) num))
              signal-map)
       outputs))

(defn part-1
  "In the output values, how many times do digits 1, 4, 7, or 8 appear?"
  [input]
  (->> input
       (map second)
       (flatten)
       (map decode-naive-signal)
       (filter int?)
       (count)))

(defn part-2
  "What do you get if you add up all of the output values?"
  [input]
  (let [signals       (map first input)
        outputs       (map second input)
        signal-map    (pmap decode-signals signals)
        mapped-output (map vector signal-map outputs)]
    (->> mapped-output
         (map assoc-output-nums)
         (map (partial apply str))
         (map #(Integer/parseInt %))
         (reduce +))))

;; Puzzle: https://adventofcode.com/2021/day/8

(def test-input-1 (parse-input "resources/tests/d8_1.txt"))
(def test-input-2 (parse-input "resources/tests/d8_2.txt"))
(def input (parse-input "resources/puzzles/d8.txt"))

(= (part-1 test-input-1) 26)
(time (part-1 input))

(= (part-2 test-input-1) 61229)
(= (part-2 test-input-2) 5353)
(time (part-2 input))
