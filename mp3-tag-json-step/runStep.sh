#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

DATA_PATH="$SCRIPT_DIR/../data"
STEP1_MP3_PATH="$DATA_PATH/mp3"
STEP1_TMP_DIR="$SCRIPT_DIR/program/tmp-step"
STEP1_TMP_ALL_FILES_PATH="$STEP1_TMP_DIR/step1_all.list"
STEP1_FILE_FILTER=""
STEP2_TMP_FILES_KEEP_PATH="$STEP1_TMP_DIR/step2_keep.list"
STEP4_TMP_FILES_JSON_FILES="$STEP1_TMP_DIR/step4_01_jsonFiles.list"
STEP4_TMP_BUILD_JSON_TMP="$STEP1_TMP_DIR/step4_02_buildJson.json.tmp"
STEP4_FINAL_JSON="$DATA_PATH/mp3-tag.json"

# Define the menu options in an array
OPTIONS=("Step 1: Create a all.list" "Step 2: Create a keep.list" "Step 3: Tag mp3" "Step 4: Create dj-project-list.json" "Step 5: Run http server" "Quit")

# Set the prompt string (PS3 is the built-in variable for the select prompt)
PS3="Please enter your choice (1-3): "

# Start the select loop
select opt in "${OPTIONS[@]}"
do
    case $opt in
        "Step 1: Create a all.list")
            echo "    Execute step 1..." >&2;
            $SCRIPT_DIR/program/step01-find/listAllReverse.sh $STEP1_MP3_PATH "$STEP1_FILE_FILTER" > $STEP1_TMP_ALL_FILES_PATH
            echo "    Done step 1" >&2;
            break # Exit the select loop
            ;;
        "Step 2: Create a keep.list")
            echo "    Execute step 2..." >&2;
            $SCRIPT_DIR/program/step02-keep-or-left/keepList.sh $STEP1_TMP_ALL_FILES_PATH > $STEP2_TMP_FILES_KEEP_PATH
            echo "    Done step 2" >&2;
            break # Exit the select loop
            ;;
        "Step 3: Tag mp3")
            echo "    Execute step 3..." >&2;
            $SCRIPT_DIR/program/step03-tag-track/tagList.sh $STEP2_TMP_FILES_KEEP_PATH $DATA_PATH
            echo "    Done step 3" >&2;
            exit 0;
            ;;
        "Step 4: Create dj-project-list.json")
            echo "    Execute step 4..." >&2;
            $SCRIPT_DIR/program/step04-json-group/01-listJsonFiles.sh $STEP1_MP3_PATH > $STEP4_TMP_FILES_JSON_FILES
            $SCRIPT_DIR/program/step04-json-group/02-buildJsonBd.sh $STEP4_TMP_FILES_JSON_FILES > $STEP4_TMP_BUILD_JSON_TMP
            $SCRIPT_DIR/program/step04-json-group/03-saveFinalJson.sh $STEP4_TMP_BUILD_JSON_TMP > $STEP4_FINAL_JSON
            echo "    Done step 4" >&2;
            exit 0;
            ;;
        "Step 5: Run http server")
            echo "    Execute step 5..." >&2;
            $SCRIPT_DIR/program/step05-http-server/01-server.sh $DATA_PATH
            echo "    Done step 5" >&2;
            exit 0;
            ;;
        "Quit")
            echo "Exiting script. Goodbye!"
            exit 0;
            ;;
        *)
            echo "Invalid option: $REPLY. Please select a valid number from the menu."
            ;;
    esac
done

# exit 1 when step is complete
exit 1;







