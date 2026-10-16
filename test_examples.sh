#!/bin/bash

find . -name "*.ant" -type f ! -path "./lib/*" | sort | while read -r file; do
	antbyte "$file" -c "fps=50;dur=5;loop_delay=1000;loop=0;" 2>> tmp/test_log.txt
	sleep 1
done
