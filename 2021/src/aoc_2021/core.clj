(ns aoc-2021.core
  (:gen-class))

(defn print-and-return
  ([val]         (println val) val)
  ([message val] (println message ":" val) val))

(defn cross-neighbours [matrix [row coll]]
  (->> [[(dec row) coll]
        [row (dec coll)] [row (inc coll)]
        [(inc row) coll]]
       (filter (partial get-in matrix))))

(defn star-neighbours [matrix [row coll]]
  (->> [[(dec row) (dec coll)] [(dec row) coll] [(dec row) (inc coll)]
        [row (dec coll)] [row (inc coll)]
        [(inc row) (dec coll)] [(inc row) coll] [(inc row) (inc coll)]]
       (filter (partial get-in matrix))))

(defn iterate-matrix [matrix]
  (for [row  (range (count matrix))
        coll (range (count (first matrix)))]
    [row coll]))
