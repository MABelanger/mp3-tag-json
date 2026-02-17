#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROJECT_DIR=$(echo $SCRIPT_DIR | sed -n 's/\(.*\)\/mp3-tag-json-step.*/\1/p')
PROGRAM_DIR=$(echo "$SCRIPT_DIR" | sed -n 's/\(.*\)\/program.*/\1/p')

echo $PROGRAM_DIR
DATA_DIR="$PROJECT_DIR/data"
TMP_DIR=$(echo $PROGRAM_DIR/program/tmp-step)

STEP2_TMP_FILES_KEEP_PATH="$TMP_DIR/step2_keep.m3u"


lsof -F n +D "$DATA_DIR" | grep "\.mp3" | grep '^n/' | cut -c2- | head -n 1 >> $STEP2_TMP_FILES_KEEP_PATH