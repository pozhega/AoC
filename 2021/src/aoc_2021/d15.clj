(ns aoc-2021.d15
  (:require
   [clojure.string :as str]
   [clojure.data.priority-map :refer [priority-map]]
   [aoc-2021.core :refer [cross-neighbours iterate-matrix]]))

(def inf Double/POSITIVE_INFINITY)

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (mapv (partial mapv #(Integer/parseInt (str %))))))

(defn- get-end-node [cave]
  [(dec (count cave)) (dec (count (first cave)))])

(defn- create-graph [cave]
  (reduce (fn [graph node]
            (assoc graph node (->> (cross-neighbours cave node)
                                   (map #(vector % (get-in cave %)))
                                   (into {}))))
          {}
          (iterate-matrix cave)))

(defn- create-costs [graph start]
  (as-> (keys graph) costs
    (zipmap costs (repeat inf))
    (assoc costs start 0)
    (into (priority-map) costs)))

(defn- update-costs
  [graph costs node]
  (let [node-cost (costs node)]
    (reduce-kv
     (fn [costs neighbour neighbour-cost]
       (if (costs neighbour)
         (update costs neighbour #(min % (+ node-cost neighbour-cost)))
         costs))
     (dissoc costs node)
     (graph node))))

(defn- dijkstra [graph start end]
  (loop [costs (create-costs graph start)
         node  start]
    (cond
      (= node end)   (costs node)
      (empty? costs) nil
      :else          (let [costs (update-costs graph costs node)
                           node  (key (peek costs))]
                       (recur costs node)))))

(defn- expand-cave [cave]
  (->> (reduce (fn [expanded-cave _]
                 (apply conj
                        expanded-cave
                        (mapv (partial mapv #(if (= % 9) 1 (inc %)))
                              (take-last (count cave) expanded-cave))))
               cave
               (range 4))
       (mapv (fn [row]
               (reduce (fn [new-row _]
                         (apply conj
                                new-row
                                (map #(if (= % 9) 1 (inc %))
                                     (take-last (count row) new-row))))
                       row
                       (range 4))))))

(defn part-1
  "What is the lowest total risk of any path from the top left to the bottom right?"
  [cave]
  (let [graph (create-graph cave)
        start [0 0]
        end   (get-end-node cave)]
    (dijkstra graph start end)))

(defn part-2
  "What is the lowest total risk of any path from the top left to the bottom right?"
  [cave]
  (let [cave  (expand-cave cave)
        graph (create-graph cave)
        start [0 0]
        end   (get-end-node cave)]
    (dijkstra graph start end)))

;; Puzzle: https://adventofcode.com/2021/day/15

(def test-input (parse-input "resources/tests/d15.txt"))
(def input (parse-input "resources/puzzles/d15.txt"))

(= (part-1 test-input) 40)
(time (part-1 input))

(= (part-2 test-input) 315)
(time (part-2 input))
