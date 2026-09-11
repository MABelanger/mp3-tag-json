#!/bin/bash

# Target directory (defaults to current directory if no argument is passed)
TARGET_DIR="${1:-.}"

# Find all .mp3 files recursively (case-insensitive)
find "$TARGET_DIR" -type f -iname "*.mp3" -print0 | while IFS= read -r -d '' mp3_file; do
    
    # Define the new json filename (e.g., path/to/mysound.mp3.json)
    json_file="${mp3_file}.json"
    
    # Generate random numbers from 1 to 3 for each property
    expention=$((RANDOM % 3 + 1))
    festive=$((RANDOM % 3 + 1))
    contact=$((RANDOM % 3 + 1))
    rythmic=$((RANDOM % 3 + 1))
    bass=$((RANDOM % 3 + 1))
    curve=$((RANDOM % 3 + 1))

    instrument=$((RANDOM % 10 + 1))
    
    # Write the randomized JSON data into the file
    cat << EOF > "$json_file"
{
  "expention": $expention,
  "festive": $festive,
  "contact": $contact,
  "rythmic": $rythmic,
  "bass": $bass,
  "curve": $curve,
  "bpm": 97,
  "notes": "",
  "instruments": [
    "#i$instrument"
  ],
  "cues": [
    "#c1",
    "#c2"
  ]
}
EOF

    echo "Created with random data: $json_file"
done

echo "Done! All randomized JSON files have been generated."
