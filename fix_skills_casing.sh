#!/bin/bash

# Find all HTML files in the ks3 directory and its subdirectories
find ks3 -type f -name "*.html" -exec sed -i '' 's/assets\/images\/skills\//assets\/images\/Skills\//g' {} +

echo "Updated all image paths from 'skills' to 'Skills'" 