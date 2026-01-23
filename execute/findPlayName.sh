#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ $# -ne 2 ]]; then
  echo "Error: This script requires at least 2 arguments." >&2;
  echo "Usage: $0 <mp3_path> <"name to find">" >&2;
  exit 1
fi

TPM_FILE_PATH="/tmp/nameTmp.list"

echo "put nameTmp.list into : $TPM_FILE_PATH" >&2;
$SCRIPT_DIR/../step01-find/listAllReverse.sh $1 "$2" >$TPM_FILE_PATH
$SCRIPT_DIR/../step02-keep-or-left/keepList.sh $TPM_FILE_PATH 
