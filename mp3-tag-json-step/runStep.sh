#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

STEP1_MP3_PATH='../data/mp3'
STEP1_TMP_DIR="./program/tmp-step"
STEP1_TMP_ALL_FILES_PATH="$STEP1_TMP_DIR/step1_all.list"
STEP1_FILE_FILTER=""
STEP2_TMP_FILES_KEEP_PATH="$STEP1_TMP_DIR/step2_keep.list"

# Define the menu options in an array
OPTIONS=("Step 1: Create a all.list" "Step 2: Create a keep.list" "Step 3: Tag mp3" "Quit")

# Set the prompt string (PS3 is the built-in variable for the select prompt)
PS3="Please enter your choice (1-3): "

# Start the select loop
select opt in "${OPTIONS[@]}"
do
    case $opt in
        "Step 1: Create a all.list")
            echo "    Execute step 1..." >&2;
            ./program/step01-find/listAllReverse.sh $STEP1_MP3_PATH "$STEP1_FILE_FILTER" > $STEP1_TMP_ALL_FILES_PATH
            echo "    Done step 1" >&2;
            break # Exit the select loop
            ;;
        "Step 2: Create a keep.list")
            echo "    Execute step 2..." >&2;
            ./program/step02-keep-or-left/keepList.sh $STEP1_TMP_ALL_FILES_PATH > $STEP2_TMP_FILES_KEEP_PATH
            echo "    Done step 2" >&2;
            break # Exit the select loop
            ;;
        "Step 3: Tag mp3")
            echo "    Execute step 3..." >&2;
            ./program/step03-tag-track/tagList.sh $STEP2_TMP_FILES_KEEP_PATH
            echo "    Done step 3" >&2;
            break # Exit the select loop
            ;;
        "Quit")
            echo "Exiting script. Goodbye!"
            break # Exit the select loop
            ;;
        *)
            echo "Invalid option: $REPLY. Please select a valid number from the menu."
            ;;
    esac
done







