#! /bin/sh
mypy d"$@".py && pypy3 d"$@".py
