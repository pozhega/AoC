#! /bin/sh
mypy d"$@".py && time -f "Total time: %E" pypy3 d"$@".py


