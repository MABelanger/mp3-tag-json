SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

while true; do
    python3 $SCRIPT_DIR/server.py $1
    echo "Restarting script..."
    sleep 1
done