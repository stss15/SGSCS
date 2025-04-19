# SGSCS Asset Structure

This document outlines the organization and purpose of assets (CSS, JavaScript, images, etc.) in the SGSCS Curriculum Website project.

## Directory Structure

```
SGSCS/
├── styles/
│   ├── global/
│   │   ├── main.css             # Core styles used across all pages
│   │   ├── index_styles.css     # Styles specific to the main landing page
│   │   ├── landing_pages.css    # Shared styles for year group landing pages
│   │   └── foundations_page.css # Styles for foundation concept pages
│   ├── ks3/
│   │   ├── ks3_theme.css           # KS3-specific theme and styling
│   │   ├── ks3_lessons_layout.css  # Layout for KS3 lesson pages
│   │   ├── ks3_topic_overview.css  # Styles for KS3 term overview pages
│   │   ├── ks3_accordion.css       # KS3 accordion component styles
│   │   └── year7/                  # Year-specific styles
│   │       └── y7_t6_content.css   # Example term-specific styles
│   ├── ks4/
│   │   ├── ks4_theme.css           # KS4-specific theme and styling
│   │   └── year10/                 # Year-specific styles
│   └── ks5/
│       ├── ks5_theme.css           # KS5-specific theme and styling
│       └── year12/                 # Year-specific styles
├── scripts/
│   ├── global/
│   │   ├── main.js             # Core JavaScript functionality
│   │   ├── utils.js            # Shared utility functions
│   │   ├── include.js          # Template inclusion system
│   │   ├── hamburger-menu.js   # Navigation menu functionality
│   │   └── foundations_view.js # Foundation concepts page logic
│   ├── ks3/
│   │   ├── ks3_accordion.js           # KS3 accordion functionality
│   │   ├── ks3_animations.js          # KS3-specific animations
│   │   └── year7/                     # Year-specific scripts
│   │       └── y7_t6_interactives.js  # Example term-specific interactives
│   ├── ks4/
│   │   ├── ks4_content_interactives.js # KS4-specific interactive elements
│   │   └── year10/                     # Year-specific scripts
│   └── ks5/
│       ├── ks5_content_interactives.js # KS5-specific interactive elements
│       └── year12/                     # Year-specific scripts
└── assets/
    ├── global/                # Images and media used across all sections
    │   ├── icons/            # UI icons and symbols
    │   ├── backgrounds/      # Background images and patterns
    │   └── logos/           # School and project logos
    ├── ks3/                  # KS3-specific images and media
    │   ├── shared/          # Assets used across multiple KS3 years
    │   └── year7/           # Year 7-specific assets
    │       └── term1/       # Term-specific assets
    ├── ks4/                  # KS4-specific images and media
    │   ├── shared/          # Assets used across multiple KS4 years
    │   └── year10/          # Year 10-specific assets
    └── ks5/                  # KS5-specific images and media
        ├── shared/          # Assets used across multiple KS5 years
        └── year12/          # Year 12-specific assets
```

## Asset Categories and Usage

### 1. Stylesheets (`styles/`)

#### 1.1 Global Styles (`styles/global/`)
* `main.css`: Core styles used across all pages. Includes:
  - Base element styling
  - Common components (buttons, cards, etc.)
  - Layout utilities
  - Dark/light theme variables
* `index_styles.css`: Specific to the main landing page
* `landing_pages.css`: Shared styles for year group landing pages
* `foundations_page.css`: Styles for foundation concept pages

#### 1.2 Key Stage Specific Styles (`styles/ks3/`, `styles/ks4/`, `styles/ks5/`)
* `ksX_theme.css`: Theme file for each key stage, including:
  - Color schemes
  - Typography
  - Component variations
* Year-specific styles organized in subdirectories (e.g., `styles/ks3/year7/`)
* Term-specific styles when needed (e.g., `styles/ks3/year7/y7_t6_content.css`)

### 2. JavaScript (`scripts/`)

#### 2.1 Global Scripts (`scripts/global/`)
* `main.js`: Core functionality used across the site
* `utils.js`: Shared utility functions
* `include.js`: Template inclusion system
* `hamburger-menu.js`: Navigation menu functionality
* `foundations_view.js`: Logic for foundation concepts pages

#### 2.2 Key Stage Specific Scripts (`scripts/ks3/`, `scripts/ks4/`, `scripts/ks5/`)
* Key stage specific functionality (e.g., `ks3_accordion.js`, `ks3_animations.js`)
* Year and term-specific interactives in subdirectories
* Content-specific scripts for interactive elements

### 3. Media Assets (`assets/`)

#### 3.1 Global Assets (`assets/global/`)
* Icons, logos, and shared media
* Background images and patterns
* UI elements used across the site

#### 3.2 Key Stage Specific Assets (`assets/ks3/`, `assets/ks4/`, `assets/ks5/`)
* Organized by key stage, year, and term
* Includes:
  - Lesson-specific images
  - Interactive media
  - Topic illustrations
  - Supporting diagrams and graphics

## Best Practices

### 1. File Organization
* Keep files in appropriate directories based on their scope
* Use clear, descriptive filenames
* Group related files together
* Create subdirectories for specific years/terms when needed

### 2. Asset Usage
* Use global assets for shared elements
* Keep key stage-specific assets in their respective directories
* Organize year and term-specific assets in appropriate subdirectories
* Use consistent naming conventions

### 3. Performance Considerations
* Optimize images before adding to the repository
* Use appropriate image formats (SVG for icons, WebP/JPEG for photos)
* Consider lazy loading for images
* Minimize CSS and JavaScript files for production

### 4. Maintenance
* Regularly review and remove unused assets
* Update documentation when adding new asset categories
* Follow established naming conventions
* Keep file structure organized and clean

### 5. Version Control
* Include version numbers in filenames when necessary
* Document significant changes in commit messages
* Keep track of asset dependencies

## Notes

* All paths in HTML files should be relative to the file location
* Use the `{{base_path}}` variable in templates for consistent asset references
* Consider browser compatibility when adding new asset types
* Follow accessibility guidelines for images and media
* Keep file sizes reasonable for web delivery 