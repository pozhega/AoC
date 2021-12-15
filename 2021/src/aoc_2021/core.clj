(ns aoc-2021.core
  (:gen-class))

(defn print-and-return [message val]
  #(do (println message ":" val) val))

(defn adjacent-positions [matrix [row coll]]
  (for [adj-row  (range (dec row) (+ row 2))
        adj-coll (range (dec coll) (+ coll 2))
        :when (and (get-in matrix [adj-row adj-coll])
                   (not= [row coll] [adj-row adj-coll]))]
    [adj-row adj-coll]))
