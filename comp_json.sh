#!/bin/bash

find . -name "*.ant" -type f ! -path "./lib/*" | sort | while read -r file; do
	antbyte "$file" -j > "$file".json # 2>> tmp/test_log.txt
done
