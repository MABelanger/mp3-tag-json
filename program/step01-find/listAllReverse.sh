if [ $# -eq 0 ]; then
    echo "Usage:"
    echo "$0 [mp3_directory] <find_pattern>"
    exit 1
fi

find $1 -name "*$2*.mp3" -printf "%T@ %Tc %p\n" | sort -nr | sed 's/^.*EDT\ //' | sed 's/^.*EST\ //' 
