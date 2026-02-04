if [ $# -eq 0 ]; then
    echo "Usage:"
    echo "$0 <jsonFiles.list>"
    exit 1
fi

echo "["
while IFS= read -r line; do
    cat "$line"
    echo -n ","
done < "$1"
echo "]"