while true; do
    echo "(type 'q' to quit) or (enter to continue):"
    read -p "> " input_key
    if [ "$input_key" == "q" ]; then
        echo "Goodbye!"
        break # Exit the loop
    fi
    ./mp3-tag-json-step/runStep.sh
done