#!/bin/bash

# Function to prompt for Yes/No confirmation
yes_or_no() {
    while true; do
        read -p "$* [k/l]: " yn
        case $yn in
            [Kk]* ) return 0;; # Return success
            [Ll]* ) return 1;; # Return failure
            * ) echo "Please answer k or l.">&2;;
        esac
    done
}

# Example usage:
if yes_or_no "Keep or Left?"; then
    echo "keep"
else
    echo "left"
fi
