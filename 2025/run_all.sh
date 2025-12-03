#!/bin/bash

start_time=$(date +%s.%N)

for i in {1..12}; do
    if [ -f "d${i}.py" ]; then
        echo "=== Day $i ==="
        /usr/bin/time -f "Time: %E" pypy3 "d${i}.py"
        echo ""
    fi
done

end_time=$(date +%s.%N)
total_time=$(echo "$end_time - $start_time" | bc)
printf "Total time: %.3f seconds\n" "$total_time"
