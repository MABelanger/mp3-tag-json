IFS=$'\n'
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
SPACE_TAB="        "

if [[ $# -ne 2 ]]; then
  echo "Error: This script requires at least 2 arguments."
  echo "Usage: $0 <keep.list> <dataPath>"
  exit 1
fi

TMP_FILES_KEEP_PATH=$1
DATA_PATH=$2

do_question_tag() {
  local file=$1
  local dataPath=$2
  RELATIVE_PATH=".$(echo "$file" | sed "s#$dataPath##g")"
  BASE_FILE=$(basename "$file")

  echo "$SPACE_TAB Doing: \"$BASE_FILE\""
  ffplay $file 2>/dev/null &
  PID_OF_FFPLAY=$!
  MD5_SUM=$(md5sum $file | awk '{print $1}')
  BPM="+-$($SCRIPT_DIR/tapTempo.sh)"
  DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -sexagesimal $file | cut -c 3-7)
  python3 $SCRIPT_DIR/tag_track.py $RELATIVE_PATH $MD5_SUM $DURATION $BPM | tee $file.json
  kill $PID_OF_FFPLAY
  echo "-------------"
}



for file in $(cat $TMP_FILES_KEEP_PATH); do
    FILE_JSON=$file.json
    if [ ! -f "$FILE_JSON" ]; then
      do_question_tag "$file" "$DATA_PATH"
    else
      BASE_FILE_JSON=$(basename "$FILE_JSON")
      echo "$SPACE_TAB File : \"$BASE_FILE_JSON\" exists -> Skipping"
    fi
done
