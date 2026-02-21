#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROJECT_DIR=$(echo $SCRIPT_DIR | sed -n 's/\(.*\)\/mp3-tag-json-step.*/\1/p')
PROGRAM_DIR=$(echo "$SCRIPT_DIR" | sed -n 's/\(.*\)\/program.*/\1/p')
PREFIX_NAME=''

echo $PROGRAM_DIR
DATA_DIR="$PROJECT_DIR/data"
TMP_DIR=$(echo $PROGRAM_DIR/program/tmp-step)

if [ -n "$1" ]; then
  PREFIX_NAME=$(echo "_$1")
fi

STEP2_TMP_FILES_KEEP_PATH="$TMP_DIR/step2_keep$PREFIX_NAME.m3u"
STEP2_TMP_LOG="$TMP_DIR/step2_keep_log.log"


lsof -F n -c vlc | grep "\.mp3" | grep '^n/' | cut -c2- | head -n 1 >> $STEP2_TMP_FILES_KEEP_PATH

# only for log
NUMBER_OF_LINES=$(cat $STEP2_TMP_FILES_KEEP_PATH | wc -l) 
echo "$STEP2_TMP_FILES_KEEP_PATH: $NUMBER_OF_LINES" >> $STEP2_TMP_LOG