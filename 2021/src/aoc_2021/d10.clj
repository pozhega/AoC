(ns aoc-2021.d10 (:require
                  [clojure.string :as str]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)))

(defn- middle-element [vector]
  (nth vector (quot (count vector) 2)))

(def openning-chars #{\(, \[, \{, \<})

(def matching-chars-map {\) \(, \] \[, \} \{, \> \<
                         \( \), \[ \], \{ \}, \< \>})

(def char-points-1 {\) 3, \] 57, \} 1197, \> 25137})

(def char-points-2 {\) 1, \] 2, \} 3, \> 4})

(defn- validate-line [line]
  (reduce (fn [open-stack char]
            (if (openning-chars char)
              (conj open-stack char)
              (if (not= (matching-chars-map char)
                        (last open-stack))
                (reduced char)
                (vec (butlast open-stack)))))
          (vector)
          line))

(defn- score-incomplete-line [line]
  (->> line
       (map matching-chars-map)
       (reverse)
       (reduce #(+ (* %1 5) (char-points-2 %2)) 0)))

(defn part-1
  "What is the total syntax error score for those errors?"
  [lines]
  (->> lines
       (map validate-line)
       (filter char?)
       (map char-points-1)
       (reduce +)))

(defn part-2
  "What is the middle score?"
  [lines]
  (->> lines
       (map validate-line)
       (filter vector?)
       (map score-incomplete-line)
       (sort)
       (middle-element)))(def ^:private inf Double/POSITIVE_INFINITY)

(defn update-costs
  "Returns costs updated with any shorter paths found to curr's unvisisted
  neighbors by using curr's shortest path"
  [g costs unvisited curr]
  (let [curr-cost (get costs curr)]
    (reduce-kv
     (fn [c nbr nbr-cost]
       (if (unvisited nbr)
         (update-in c [nbr] min (+ curr-cost nbr-cost))
         c))
     costs
     (get g curr))))

(defn dijkstra
  "Returns a map of nodes to minimum cost from src using Dijkstra algorithm.
  Graph is a map of nodes to map of neighboring nodes and associated cost.
  Optionally, specify destination node to return once cost is known"
  ([g src]
   (dijkstra g src nil))
  ([g src dst]
   (loop [costs (assoc (zipmap (keys g) (repeat inf)) src 0)
          curr src
          unvisited (disj (apply hash-set (keys g)) src)]
     (cond
       (= curr dst)
       (select-keys costs [dst])

       (or (empty? unvisited) (= inf (get costs curr)))
       costs

       :else
       (let [next-costs (update-costs g costs unvisited curr)
             next-node (apply min-key next-costs unvisited)]
         (recur next-costs next-node (disj unvisited next-node)))))))


;; Puzzle: https://adventofcode.com/2021/day/10

(def test-input (parse-input "resources/tests/d10.txt"))
(def input (parse-input "resources/puzzles/d10.txt"))

(= (part-1 test-input) 26397)
(time (part-1 input))

(= (part-2 test-input) 288957)
(time (part-2 input))
