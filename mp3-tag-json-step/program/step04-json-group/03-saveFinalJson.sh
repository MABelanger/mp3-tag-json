if [ $# -eq 0 ]; then
    echo "Usage:"
    echo "$0 <buildJson.tmp> <final.json>"
    exit 1
fi

sed '$c]' $1