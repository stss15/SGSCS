#!/bin/bash

# This script finds and fixes absolute paths in HTML files
# It converts paths like /assets/, /scripts/, etc. to relative paths

# Function to determine the relative path based on file location
function get_relative_prefix() {
    local file_path=$1
    local depth=$(echo "$file_path" | tr -cd '/' | wc -c)
    
    # Adjust because we're counting from project root
    local rel_path=""
    for ((i=1; i<depth; i++)); do
        rel_path="../$rel_path"
    done
    
    echo "$rel_path"
}

# Find all HTML files in the project
find . -name "*.html" -type f | while read -r file; do
    echo "Processing file: $file"
    relative_prefix=$(get_relative_prefix "$file")
    
    # Replace absolute paths with relative paths
    # 1. Fix paths like src="/assets/..." or href="/assets/..."
    sed -i.bak -E "s#(src|href)=\"/assets/#\1=\"${relative_prefix}assets/#g" "$file"
    
    # 2. Fix paths like src="/scripts/..." or href="/scripts/..."
    sed -i.bak -E "s#(src|href)=\"/scripts/#\1=\"${relative_prefix}scripts/#g" "$file"
    
    # 3. Fix paths like src="/styles/..." or href="/styles/..."
    sed -i.bak -E "s#(src|href)=\"/styles/#\1=\"${relative_prefix}styles/#g" "$file"
    
    # 4. Fix paths like src="/data/..." or href="/data/..."
    sed -i.bak -E "s#(src|href)=\"/data/#\1=\"${relative_prefix}data/#g" "$file"
    
    # 5. Fix paths like src="/includes/..." or href="/includes/..."
    sed -i.bak -E "s#(src|href)=\"/includes/#\1=\"${relative_prefix}includes/#g" "$file"
    
    # 6. Fix paths like src="/templates/..." or href="/templates/..."
    sed -i.bak -E "s#(src|href)=\"/templates/#\1=\"${relative_prefix}templates/#g" "$file"
    
    # 7. Fix paths beginning with /SGSCS/
    sed -i.bak -E "s#(src|href)=\"/SGSCS/#\1=\"${relative_prefix}#g" "$file"
    
    # 8. Remove the backup file
    rm -f "${file}.bak"
    
    echo "Fixed paths in file: $file"
done

echo "Path fixing completed!" 