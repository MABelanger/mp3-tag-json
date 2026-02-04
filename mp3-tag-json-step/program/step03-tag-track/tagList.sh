IFS=$'\n'
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )


if [[ $# -ne 1 ]]; then
  echo "Error: This script requires at least 2 arguments."
  echo "Usage: $0 <keep.list>"
  exit 1
fi

TMP_FILES_KEEP_PATH=$1

for file in $(cat $TMP_FILES_KEEP_PATH); do
    echo "doing $file"
    ffplay $file 2>/dev/null &
    MD5_SUM=$(md5sum $file | awk '{print $1}')
    BPM="+-$($SCRIPT_DIR/tapTempo.sh)"
    DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -sexagesimal $file | cut -c 3-7)
    python3 $SCRIPT_DIR/tag_track.py $MD5_SUM $DURATION $BPM | tee $file.json
    killall ffplay
    echo "$file">DONE_TAG_LIST
    echo "-------------"
done
