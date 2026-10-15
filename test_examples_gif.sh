#!/bin/bash

find . -name "*.ant" -type f ! -path "./lib/*" | sort | while read -r file; do
	antbyte "$file" -r gif 2>> tmp/test_log.txt
done
