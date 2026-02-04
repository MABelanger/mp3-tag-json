IFS=$'\n'
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ $# -ne 1 ]]; then
  echo "Error: This script requires at least 2 arguments."
  echo "Usage: $0 <all.lst>"
  exit 1
fi

do_question() {
  local file=$1
  ffplay $file 2>/dev/null &
  PID_OF_FFPLAY=$!
  #sleep .5;
  #wmctrl -a "dj-project"
  KEEP_OR_LEFT=$($SCRIPT_DIR/keepLeft.mod)
  if [[ "$KEEP_OR_LEFT" == "keep" ]]; then
      echo "$file" 
  fi
  kill $PID_OF_FFPLAY
}

ALL_LST=$1
DEFAULT_START_LINE="1"
declare -i START_LINE
# 1. Ask the user a question and save their input
read -e -p "Start at line: " -i $DEFAULT_START_LINE START_LINE
CURRENT_LINE=$DEFAULT_START_LINE

for file in $(cat $ALL_LST); do
    if (( CURRENT_LINE >= START_LINE )); then
      do_question "$file"
    fi
    ((CURRENT_LINE++))
done
