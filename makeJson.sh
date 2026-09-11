#!/bin/bash

# Target directory (defaults to current directory if no argument is passed)
TARGET_DIR="${1:-.}"

# Find all .mp3 files recursively (case-insensitive)
find "$TARGET_DIR" -type f -iname "*.mp3" -print0 | while IFS= read -r -d '' mp3_file; do
    
    # Define the new json filename (e.g., path/to/mysound.mp3.json)
    json_file="${mp3_file}.json"
    
    # Create the empty json file (or updates its timestamp if it exists)
    touch "$json_file"
    
    echo "Created: $json_file"
done

echo "Done! All JSON files have been generated."

