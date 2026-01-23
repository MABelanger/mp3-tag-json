IFS=$'\n'
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )


if [[ $# -ne 1 ]]; then
  echo "Error: This script requires at least 2 arguments."
  echo "Usage: $0 <all.lst>"
  exit 1
fi

ALL_LST=$1
KEEP_LST=$2

for file in $(cat $ALL_LST); do
    ffplay $file 2>/dev/null &
    #sleep .5;
    #wmctrl -a "dj-project"
    KEEP_OR_LEFT=$($SCRIPT_DIR/keepLeft.mod)
    if [[ "$KEEP_OR_LEFT" == "keep" ]]; then
        echo "$file" 
    fi
    killall ffplay
done
