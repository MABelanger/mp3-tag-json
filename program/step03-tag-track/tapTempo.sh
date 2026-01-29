#!/bin/bash
# SPDX-License-Identifier: WTFPL
# Copyright © 2018 Neil "Superna" Armstrong
# This work is free. You can redistribute it and/or modify it under the
# terms of the Do What The Fuck You Want To Public License, Version 2,
# as published by Sam Hocevar. See the COPYING file or http://www.wtfpl.net/ 
# for more details.

NB_COUNT=3

echo "Please press the Enter key $NB_COUNT times to init and $NB_COUNT times to proceed the calc BPM">&2

for i in $(seq 1 $NB_COUNT); do
    read
    echo "Press Enter (Count/init: $i/$NB_COUNT)">&2
    # Read a line of input, the input itself is ignored
done

PREV="$(date +%s%N | cut -b1-13)"
TAPS="0"
COUNT="0"

for i in $(seq 1 $NB_COUNT); do
        read
        echo "Press Enter (Count/real: $i/$NB_COUNT)">&2
	CUR="$(date +%s%N | cut -b1-13)"
	TAPS="$TAPS + $(($CUR-$PREV))"
	PREV=$CUR
	COUNT="$(($COUNT + 1))"
done

echo "">&2
BPM=$((60000 / $(($(($TAPS + 0)) / $COUNT))))
echo "BPM: $BPM">&2
echo $BPM
