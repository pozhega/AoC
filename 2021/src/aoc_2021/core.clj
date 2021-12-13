(ns aoc-2021.core
  (:gen-class))

(defn- print-and-return [message val]
  #(do (println message ":" val) val))

