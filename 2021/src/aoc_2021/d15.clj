(ns aoc-2021.d15 (:require
                  [clojure.string :as str]
                  [clojure.data.priority-map :as priority-map]))

(defn- parse-input [path]
  (->> path
       (slurp)
       (str/split-lines)
       (mapv (partial mapv #(Integer/parseInt (str %))))))

(defn- neighbours [cave [row coll]]
  (->> [[(dec row) coll]
        [row (dec coll)]
        [row (inc coll)]
        [(inc row) coll]]
       (filter (partial get-in cave))))

(defn- iterate-cave [cave]
  (for [row  (range (count cave))
        coll (range (count (first cave)))]
    [row coll]))

(defn- get-end-node [cave]
  [(dec (count cave)) (dec (count (first cave)))])

(defn- create-graph [cave]
  (reduce (fn [graph node]
            (assoc graph node (->> (neighbours cave node)
                                   (map #(vector % (get-in cave %)))
                                   (into {}))))
          {}
          (iterate-cave cave)))

(def ^:private inf Double/POSITIVE_INFINITY)

(defn update-costs
  [graph costs unvisited node]
  (let [node-cost (costs node)]
    (reduce-kv
     (fn [[costs unvisited] neighbour neighbour-cost]
       (if (unvisited neighbour)
         [(update-in costs [neighbour] min (+ node-cost neighbour-cost))
          (update-in unvisited [neighbour] min (+ node-cost neighbour-cost))]
         [costs unvisited]))
     [costs unvisited]
     (graph node))))

(defn dijkstra [graph start end]
  (loop [costs     (assoc (zipmap (keys graph) (repeat inf)) start 0)
         node      start
         unvisited (into (priority-map/priority-map) (dissoc costs start))]
    (cond
      (= node end)      (costs node)
      (empty? unvisited) nil
      :else              (let [[costs unvisited] (update-costs graph costs unvisited node)
                               node              (key (peek unvisited))
                               unvisited         (pop unvisited)]
                           (recur costs node unvisited)))))

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
