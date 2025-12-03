#! /bin/sh
echo "=== Day $@ ==="
time -f "Time: %E" pypy3 d"$@".py


