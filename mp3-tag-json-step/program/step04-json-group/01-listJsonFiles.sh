if [ $# -eq 0 ]; then
    echo "Usage:"
    echo "$0 [mp3_directory]"
    exit 1
fi

find $1 -name "*.json" -printf "%T@ %Tc %p\n" | sort -nr | sed 's/^.*EDT\ //' | sed 's/^.*EST\ //'