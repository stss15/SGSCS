#!/bin/bash

# This script removes the original CSS and JS files that have been copied to the new directory structure
# Run this only after verifying that the new structure works correctly

echo "Removing original CSS files that have been moved to the new directory structure..."

# Global Styles
rm -f styles/main.css
rm -f styles/index_styles.css

# Global Scripts
rm -f scripts/main.js
rm -f scripts/utils.js
rm -f scripts/include.js
rm -f scripts/index_animations.js

# KS3 Common Styles
rm -f styles/ks3_theme.css
rm -f styles/ks3_lessons_layout.css
rm -f styles/ks3_topic_overview.css
rm -f styles/ks3_accordion.css
rm -f styles/landing_pages.css
rm -f styles/foundations_page.css
rm -f styles/hamburger-menu.css

# KS3 Common Scripts
rm -f scripts/ks3_accordion.js
rm -f scripts/ks3_animations.js
rm -f scripts/foundations_view.js
rm -f scripts/hamburger-menu.js

# Year 7 Specific Files
rm -f styles/y7_t6_content.css
rm -f scripts/y7_t6_content_interactives.js

echo "Cleanup complete!"
echo "IMPORTANT: Verify your site functions correctly before committing these changes!" 