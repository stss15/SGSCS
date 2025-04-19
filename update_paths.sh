#!/bin/bash

# Script to update file paths in HTML files throughout the codebase
# to match the new organized directory structure

echo "Updating paths in HTML files..."

# Skip files with template placeholders
echo "Skipping files with template placeholders..."
find . -type f -name "*.html" -exec grep -l "{{base_path}}" {} \; > skip_files.txt
find . -type f -name "*.html" -exec grep -l "{{base_head}}" {} \; >> skip_files.txt
find . -type f -name "*.html" -exec grep -l "{{base_scripts}}" {} \; >> skip_files.txt

# Process files without template placeholders
echo "Processing files without template placeholders..."

# Global Styles paths
find . -type f -name "*.html" -not -path "*/\.*" | grep -v -f skip_files.txt | xargs -I{} sed -i '' \
    -e 's|styles/main.css|styles/global/main.css|g' \
    -e 's|styles/index_styles.css|styles/global/index_styles.css|g' \
    -e 's|styles/hamburger-menu.css|styles/global/hamburger-menu.css|g' \
    {} 

# Global Scripts paths
find . -type f -name "*.html" -not -path "*/\.*" | grep -v -f skip_files.txt | xargs -I{} sed -i '' \
    -e 's|scripts/main.js|scripts/global/main.js|g' \
    -e 's|scripts/utils.js|scripts/global/utils.js|g' \
    -e 's|scripts/include.js|scripts/global/include.js|g' \
    -e 's|scripts/index_animations.js|scripts/global/index_animations.js|g' \
    -e 's|scripts/hamburger-menu.js|scripts/global/hamburger-menu.js|g' \
    {} 

# KS3 Common Styles paths
find . -type f -name "*.html" -not -path "*/\.*" | grep -v -f skip_files.txt | xargs -I{} sed -i '' \
    -e 's|styles/ks3_theme.css|styles/ks3/ks3_theme.css|g' \
    -e 's|styles/ks3_lessons_layout.css|styles/ks3/ks3_lessons_layout.css|g' \
    -e 's|styles/ks3_topic_overview.css|styles/ks3/ks3_topic_overview.css|g' \
    -e 's|styles/ks3_accordion.css|styles/ks3/ks3_accordion.css|g' \
    -e 's|styles/landing_pages.css|styles/ks3/landing_pages.css|g' \
    -e 's|styles/foundations_page.css|styles/ks3/foundations_page.css|g' \
    {} 

# KS3 Common Scripts paths
find . -type f -name "*.html" -not -path "*/\.*" | grep -v -f skip_files.txt | xargs -I{} sed -i '' \
    -e 's|scripts/ks3_accordion.js|scripts/ks3/ks3_accordion.js|g' \
    -e 's|scripts/ks3_animations.js|scripts/ks3/ks3_animations.js|g' \
    -e 's|scripts/foundations_view.js|scripts/ks3/foundations_view.js|g' \
    -e 's|scripts/ks3-menu-content.js|scripts/ks3/ks3-menu-content.js|g' \
    {} 

# Year 7 Specific Styles
find . -type f -name "*.html" -not -path "*/\.*" | grep -v -f skip_files.txt | xargs -I{} sed -i '' \
    -e 's|styles/y7_t6_content.css|styles/ks3/year7/y7_t6_content.css|g' \
    {} 

# Year 7 Specific Scripts
find . -type f -name "*.html" -not -path "*/\.*" | grep -v -f skip_files.txt | xargs -I{} sed -i '' \
    -e 's|scripts/y7_t6_content_interactives.js|scripts/ks3/year7/y7_t6_content_interactives.js|g' \
    {} 

# Handle JavaScript imports if any
find . -type f -name "*.js" -not -path "*/\.*" | xargs -I{} sed -i '' \
    -e 's|from "./utils"|from "./global/utils"|g' \
    -e 's|from "./main"|from "./global/main"|g' \
    -e 's|from "./include"|from "./global/include"|g' \
    {} 

# Clean up
rm skip_files.txt

echo "Path updates complete. You may need to verify complex cases manually."
echo "Recommended: Run 'git diff' to check the changes before committing." 