(ns aoc-2021.d16)

(declare parse-next-packet parse-n-packets parse-n-bits parse-literal-packet parse-operation-packet)

(defn- parse-input [path] (slurp path))

(defn- take-while+
  [pred coll]
  (lazy-seq
   (when-let [[f & r] (seq coll)]
     (if (pred f)
       (cons f (take-while+ pred r))
       [f]))))

(def hex-bin-map {\0 "0000"
                  \1 "0001"
                  \2 "0010"
                  \3 "0011"
                  \4 "0100"
                  \5 "0101"
                  \6 "0110"
                  \7 "0111"
                  \8 "1000"
                  \9 "1001"
                  \A "1010"
                  \B "1011"
                  \C "1100"
                  \D "1101"
                  \E "1110"
                  \F "1111"})

(defn- hex-to-bin [hex]
  (->> hex
       (mapcat hex-bin-map)
       (apply vector)))

(defn- bin-to-int [binary]
  (Long/parseLong (apply str binary) 2))

(def operation-map {0 +
                    1 *
                    2 min
                    3 max
                    5 (comp #(if % 1 0) >)
                    6 (comp #(if % 1 0) <)
                    7 (comp #(if % 1 0) =)})

(defn- parse-literal-packet [bin version]
  (let [num-bin     (->> bin
                         (partition 5)
                         (take-while+ #(= (first %) \1)))
        num         (->> num-bin
                         (map rest)
                         (flatten)
                         (bin-to-int))
        num-bit-len (* 5 (count num-bin))
        bin         (subvec bin num-bit-len)]
    [bin {:version version
          :len     (+ 3 3 num-bit-len)
          :num     num}]))

(defn- parse-operation-packet [[len-type & bin] version id]
  (if (= len-type \1)

    (let [packet-num    (bin-to-int (take 11 bin))
          bin           (subvec (vec bin) 11)
          [bin packets] (parse-n-packets bin packet-num)]
      [bin {:version   version
            :operation (operation-map id)
            :len       (+ 3 3 1 11 (reduce + (map :len packets)))
            :packets   packets}])

    (let [bit-len       (bin-to-int (take 15 bin))
          bin           (subvec (vec bin) 15)
          [bin packets] (parse-n-bits bin bit-len)]
      [bin {:version   version
            :operation (operation-map id)
            :len       (+ 3 3 1 15 (reduce + (map :len packets)))
            :packets   packets}])))

(defn- parse-n-bits [bin n]
  (reduce (fn [[bin packets n] _]
            (let [[bin packet] (parse-next-packet bin)
                  n            (- n (packet :len))]
              (if (zero? n)
                (reduced [bin (conj packets packet)])
                [bin (conj packets packet) n])))
          [bin [] n]
          (iterate inc 0)))

(defn- parse-n-packets [bin n]
  (reduce (fn [[bin packets] _]
            (let [[bin packet] (parse-next-packet bin)]
              [bin (conj packets packet)]))
          [bin []]
          (range n)))

(defn- parse-next-packet [bin]
  (let [version (bin-to-int (take 3 bin))
        id      (bin-to-int (subvec bin 3 6))
        bin     (subvec bin 6)]
    (if (= id 4)
      (parse-literal-packet bin version)
      (parse-operation-packet bin version id))))

(defn- count-versions [packet]
  (if-not (packet :packets)
    (packet :version)
    (+ (packet :version) (reduce + (map count-versions (packet :packets))))))

(defn- evaluate-expression [packet]
  (if-not (packet :packets)
    (packet :num)
    (apply (packet :operation) (map evaluate-expression (packet :packets)))))

(defn part-1
  "What do you get if you add up the version numbers in all packets?"
  [hex]
  (->> hex
       (hex-to-bin)
       (parse-next-packet)
       (last)
       (count-versions)))

(defn part-2
  "What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?"
  [hex]
  (->> hex
       (hex-to-bin)
       (parse-next-packet)
       (last)
       (evaluate-expression)))


;; Puzzle: https://adventofcode.com/2021/day/16

(def test-input (parse-input "resources/tests/d16_1.txt"))
(def input (parse-input "resources/puzzles/d16.txt"))

(= (part-1 test-input) 31)
(time (part-1 input))

(= (part-2 test-input) 31)
(time (part-2 input))
