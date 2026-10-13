#!/bin/bash

echo "" > tmp/test_log.txt

find . -name "*.ant" -type f ! -path "./lib/*" | sort | while read -r file; do
	echo -e "\nCompiling File $file"
	antbyte "$file" -j > "$file".json 2>> tmp/test_log.txt
done
