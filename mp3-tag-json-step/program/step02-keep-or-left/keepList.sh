IFS=$'\n'
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ $# -ne 1 ]]; then
  echo "Error: This script requires at least 2 arguments."
  echo "Usage: $0 <all.lst>"
  exit 1
fi

ALL_LST=$1

declare -i START_LINE
# 1. Ask the user a question and save their input
read -p "Start at line: " START_LINE

CURRENT_LINE=0

do_question() {
  local file=$1
  ffplay $file 2>/dev/null &
  #sleep .5;
  #wmctrl -a "dj-project"
  KEEP_OR_LEFT=$($SCRIPT_DIR/keepLeft.mod)
  if [[ "$KEEP_OR_LEFT" == "keep" ]]; then
      echo "$file" 
  fi
  killall ffplay
}
for file in $(cat $ALL_LST); do
    ((CURRENT_LINE++))
    if (( CURRENT_LINE > 1 )); then
      do_question "$file"
    fi
done
