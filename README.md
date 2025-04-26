# St. George's School Computer Science Website (SGSCS)

[![St. George's School Düsseldorf](https://img.shields.io/badge/St.%20George's-CS%20Resources-blue)]()

## 📖 Overview

The St. George's School Computer Science (SGSCS) website provides comprehensive learning resources for computer science education across Key Stage 3 (Years 7-9), Key Stage 4 (IGCSE - Years 10-11), and Key Stage 5 (IB - Years 12-13). The site features a structured, organized approach to computer science education with resources tailored to each stage of the curriculum.

Designed as a static website using HTML, CSS, and JavaScript, this resource hub offers:
- Interactive lessons
- Topic overviews
- Homework assignments
- Independent study materials
- Reference documents

## 🎮 Features

- **Engaging Interface**: Game-inspired design with interactive elements to make learning more enjoyable
- **Structured Content**: Resources organized by Key Stage, year group, and term
- **Responsive Design**: Mobile-friendly layout with hamburger menu for smaller screens
- **Interactive Components**: Accordions, animations, and interactive elements to enhance learning
- **Comprehensive Coverage**: Complete curriculum resources from Years 7 through 13

## 🏗️ Project Structure

```
SGSCS/
├── index.html                 # Main landing page with game-inspired navigation
├── ks3/                       # Key Stage 3 Resources (Years 7-9)
│   ├── year7/
│   │   ├── Landing_Page/
│   │   └── Year7_TermX/       # Resources per term
│   ├── year8/
│   │   ├── Landing_Page/
│   │   └── Year8_TermX/
│   ├── year9/
│   │   ├── Landing_Page/
│   │   └── Year9_TermX/
│   └── Concepts/              # Foundational concepts for KS3
├── ks4/                       # Key Stage 4 Resources (IGCSE - Years 10-11)
│   ├── IGCSE_Landing.html     # Main landing page for KS4
│   ├── overview_year10.html
│   ├── overview_year11.html
│   ├── paper1_computer_systems/ # IGCSE Paper 1 topics
│   ├── paper2_algorithms_programming_logic/ # IGCSE Paper 2 topics
│   └── Python/                # Python specific resources
├── ks5/                       # Key Stage 5 Resources (IB - Years 12-13)
│   ├── index.html             # Main landing page for KS5
│   ├── overview_sl_year12.html
│   ├── overview_sl_year13.html
│   ├── overview_hl_year12.html
│   ├── overview_hl_year13.html
│   ├── common_topics/         # Topics common to SL and HL
│   └── hl_only_topics/        # Topics specific to HL
├── includes/                  # Reusable HTML snippets (header, footer)
│   ├── header.html
│   └── footer.html
├── templates/                 # Base HTML templates
│   ├── base.html
│   └── hamburger-menu.html
├── styles/                    # CSS stylesheets
│   ├── global/                # Styles applied across the site
│   ├── ks3/                   # Styles specific to KS3
│   └── ks4/                   # Styles specific to KS4
├── scripts/                   # JavaScript files
│   ├── global/                # Scripts used across the site
│   ├── ks3/                   # Scripts specific to KS3
│   └── ks4/                   # Scripts specific to KS4
├── data/                      # Data files (e.g., lesson metadata)
│   └── ks3_lessons.js
├── assets/                    # Static assets (images, documents, sounds)
│   ├── images/
│   ├── docs/
│   └── sound/
├── *.sh                       # Utility shell scripts
└── ASSET_STRUCTURE.md         # Document outlining asset structure
```

## 📚 Content Structure

### Key Stage 3 (Years 7-9)
Each year is organized into terms with a consistent structure:
- Landing page for each year
- Term overview page
- Lesson pages
- Homework assignments
- Independent study resources

**Detailed Structure:**
* Each year has a `Landing_Page/YearX_Landing.html` acting as the entry point
* Content is divided into terms (`YearX_TermY/`)
* Each term folder typically contains:
  * `Yx_Ty_Overview.html`: Overview of the term's topics
  * `Yx_Ty_Content.html`: Main content page linking to individual lessons
  * `Yx_Ty_Lx.html`: Individual lesson pages (e.g., `Y7_T1_L1.html`)
  * `Yx_Ty_Homework.html`: Homework assignments
  * `Yx_Ty_Independent_Study.html`: Resources for independent study
* A separate `Concepts/Foundations.html` page exists for foundational KS3 concepts

### Key Stage 4 (IGCSE - Years 10-11)
Organized according to the Cambridge IGCSE Computer Science syllabus:
- Paper 1: Computer Systems
- Paper 2: Algorithms, Programming & Logic
- Python programming resources

**Detailed Structure:**
* `IGCSE_Landing.html`: Main entry point for KS4
* `overview_year10.html` / `overview_year11.html`: Year-specific overviews
* Content is divided based on IGCSE papers:
  * `paper1_computer_systems/`: Contains `index.html` and topic pages (e.g., `1_data_representation.html`)
  * `paper2_algorithms_programming_logic/`: Contains `index.html` and topic pages (e.g., `7_algorithm_design.html`)
* A dedicated `Python/` folder with Python-specific resources (e.g., `basics.html`)

### Key Stage 5 (IB - Years 12-13)
Follows the IB Computer Science curriculum:
- Standard Level (SL) resources
- Higher Level (HL) resources
- Common topics
- HL-specific topics

**Detailed Structure:**
* `index.html`: Main landing page for KS5
* Year-specific overviews for SL and HL (`overview_sl_year12.html`, `overview_hl_year13.html`, etc.)
* Content is divided into:
  * `common_topics/`: Resources for both SL and HL
  * `hl_only_topics/`: Resources specific to HL
* *Note: This section is still under development*

## 🔍 Key Files

### Index Page (`index.html`)
* **Purpose:** Main entry point to the entire SGSCS resource site
* **Functionality:** Provides navigation links to KS3, KS4, and KS5 sections
* **Technology:**
  * Styles: `styles/global/main.css`, `styles/global/index_styles.css`
  * Scripts: `scripts/global/index_animations.js`, `scripts/global/main.js`
  * Uses `scripts/global/include.js` for header/footer injection

## 🎨 Styling & Theming

The website uses a layered approach to CSS:

1. **Global Styles**: Core styling applied across the entire site
   - `main.css`: Base typography, layout, colors, and variables
   - `hamburger-menu.css`: Mobile navigation styling
   - `landing_pages.css`: Styling for main landing pages
   - `index_styles.css`: Game-inspired styles for the main index page
   - `foundations_page.css`: Styles for the KS3 Concepts page

2. **Key Stage Specific Styles**: Custom theming for each educational level
   - `ks3_theme.css`: KS3-specific styling
   - `ks3_lessons_layout.css`: Layout for KS3 lesson pages
   - `ks3_accordion.css`: Styles for collapsible content sections in KS3
   - `ks3_topic_overview.css`: Styling for topic overview pages
   - `ks4.css`: IGCSE-specific styling
   - Some pages have unique styles (e.g., `styles/ks3/year7/y7_t6_content.css`)

## 🛠️ JavaScript Functionality

1. **Core Functionality**:
   - `include.js`: Injects common elements like headers and footers
   - `hamburger-menu.js`: Handles mobile navigation
   - `main.js`: Common utility functions

2. **Interactive Elements**:
   - `index_animations.js`: Game-like animations for main page
   - `ks3_accordion.js`: Collapsible content sections
   - `ks3_animations.js`: Animations used within KS3 pages
   - `utils.js`: Utility functions used by other scripts
   - `foundations_view.js`: Scripting for the `Foundations.html` page
   - Lesson-specific interactives (e.g., `scripts/ks3/year7/y7_t6_content_interactives.js`)

3. **Data Management**:
   - `ks3_lessons.js`: Structured data for KS3 lessons, used to dynamically generate navigation or content lists

## 📁 Includes & Templates

- **`includes/`**: Contains reusable HTML snippets injected into pages via `scripts/global/include.js`:
  - `header.html`: Common header across pages
  - `footer.html`: Common footer across pages

- **`templates/`**: Contains structural templates:
  - `base.html`: Base HTML structure for pages
  - `hamburger-menu.html`: Mobile navigation structure, loaded by `include.js` or `hamburger-menu.js`

## 📦 Assets & Data

- **`assets/`**: Stores static files:
  - `images/`: Graphics, icons, and other visual elements
  - `docs/`: PDF files (e.g., `Cambridge_IGCSE_Syllabus-202.pdf`)
  - `sound/`: Audio files for interactive elements

- **`data/`**: Holds JavaScript data structures:
  - `ks3_lessons.js`: Contains metadata about lessons (structure, titles, paths) for dynamic generation

## 🔧 Development & Maintenance

### Utility Scripts
The repository includes several shell scripts to maintain the codebase:
- `fix_absolute_paths.sh`: Converts absolute paths to relative paths
- `update_paths.sh`: Updates path references throughout the codebase
- `cleanup_old_files.sh`: Removes outdated or temporary files

### Adding New Content
To add new content:
1. Follow the established directory structure
2. Use the appropriate templates
3. Link from the relevant landing or overview page
4. Update navigation as needed

## 🚀 Getting Started

### Prerequisites
- Web server (Apache, Nginx, etc.) or local development server
- Modern web browser

### Setup
1. Clone the repository to your web server or local environment
2. If using Apache, the `.htaccess` file is included for proper URL handling
3. No build steps required - this is a static HTML website

### Local Development
1. Clone the repository
2. Use a local development server like Python's `http.server`:
   ```
   python -m http.server
   ```
3. Access the site at http://localhost:8000

## 🤝 Contributing

Contributions to improve the SGSCS website are welcome. Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is designed specifically for St. George's School Düsseldorf and is not offered under an open-source license. All rights reserved.

## 👤 Contact

Mr. Stewart - Head of Science  
St. George's School Düsseldorf

## Acknowledgements

© 2025 Mr Stewart, Head of Science - St. George's School Düsseldorf 