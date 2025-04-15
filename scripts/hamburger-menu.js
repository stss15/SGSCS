/**
 * Hamburger Menu Functionality for KS3 curriculum site
 * Reads lesson data from data/ks3_lessons.js
 * Uses utility functions from utils.js (except for local extractYearAndTerm)
 */

// Initialization flag (global)
let hamburgerMenuInitialized = false;
let retryCount = 0;
const MAX_RETRIES = 3;

// When DOM is loaded, check if menu exists and set up if needed
document.addEventListener('DOMContentLoaded', () => {
    console.log('DEBUG Hamburger: DOMContentLoaded');
    if (hamburgerMenuInitialized) {
        console.log('DEBUG Hamburger: Already initialized, skipping setup in DOMContentLoaded.');
        return;
    }
    // Attempt setup immediately in case include.js hasn't run yet or isn't used for this element
    attemptHamburgerSetup();
});

/**
 * Called from include.js after the hamburger-menu component is potentially loaded.
 */
window.handleHamburgerMenuInclude = function() {
    console.log('DEBUG Hamburger: include handler called.');
    if (hamburgerMenuInitialized) {
        console.log('DEBUG Hamburger: Already initialized, skipping setup in include handler.');
        return;
    }
    // Wait a very short time for the DOM to update after include.js inserts content
    setTimeout(attemptHamburgerSetup, 50); // Reduced delay
};

/**
 * Attempts to find menu elements and initialize if found and not already initialized.
 */
function attemptHamburgerSetup() {
    if (hamburgerMenuInitialized) return; // Don't run if already done

    const hamburgerMenu = document.getElementById('hamburger-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');

    if (hamburgerMenu && hamburgerBtn) {
        console.log('DEBUG Hamburger: Elements found, initializing.');
        
        // Check if we need to populate with lesson data or if it already exists
        if (typeof window.ks3TermLessons !== 'undefined') {
            console.log('DEBUG Hamburger: Lesson data already exists, proceeding with initialization.');
            setupHamburgerMenuInteraction(hamburgerBtn, hamburgerMenu);
            populateHamburgerMenu(); // Populate with data
            adjustHamburgerPosition(); // Adjust position based on header/footer
            window.addEventListener('resize', adjustHamburgerPosition); // Adjust on resize
            hamburgerMenuInitialized = true;
        } else {
            // Ensure lesson data is loaded first
            ensureLessonDataLoaded(() => {
                setupHamburgerMenuInteraction(hamburgerBtn, hamburgerMenu);
                populateHamburgerMenu(); // Populate with data
                adjustHamburgerPosition(); // Adjust position based on header/footer
                window.addEventListener('resize', adjustHamburgerPosition); // Adjust on resize
                hamburgerMenuInitialized = true;
            });
        }
    } else {
        // This might be logged if the element isn't included on the page
        // console.log('DEBUG Hamburger: Elements not found during attemptHamburgerSetup.');
    }
}

/**
 * Ensures lesson data is loaded before proceeding
 * @param {function} callback - Function to call once data is loaded
 */
function ensureLessonDataLoaded(callback) {
    // Check if lesson data is already loaded
    if (typeof window.ks3TermLessons !== 'undefined') {
        console.log('DEBUG Hamburger: Lesson data already loaded');
        callback();
        return;
    }

    console.log('DEBUG Hamburger: Lesson data not found, attempting to load');
    
    // Try to use a hardcoded definition if the script fails to load
    const useHardcodedData = () => {
        console.log('DEBUG Hamburger: Using hardcoded lesson data as fallback');
        
        // Basic placeholder data for Year 7 Term 6
        window.ks3TermLessons = {
            'year7': {
                'Year7_Term6': [
                    { title: 'Decoding Binary Numbers', href: 'Y7_T6_L1.html' },
                    { title: 'Hex Power! The Binary Shortcut', href: 'Y7_T6_L2.html' },
                    { title: 'Binary Addition', href: 'Y7_T6_L3.html' },
                    { title: 'The Secret Life of Letters & Symbols', href: 'Y7_T6_L4.html' },
                    { title: 'Pixel Power! Painting with Binary', href: 'Y7_T6_L5.html' },
                    { title: 'Binary Beats: How Computers Hear Sound', href: 'Y7_T6_L6.html' }
                ]
            }
        };
        callback();
    };
    
    // First try an absolute path
    const absoluteUrl = '/data/ks3_lessons.js';
    console.log(`DEBUG Hamburger: Trying absolute path: ${absoluteUrl}`);
    
    // Try to load the lesson data script
    const script = document.createElement('script');
    script.src = absoluteUrl;
    
    script.onload = () => {
        console.log('DEBUG Hamburger: Successfully loaded ks3_lessons.js');
        // Give a small delay for the script to execute
        setTimeout(() => {
            if (typeof window.ks3TermLessons !== 'undefined') {
                console.log('DEBUG Hamburger: Lesson data available after load');
                callback();
            } else {
                console.warn('DEBUG Hamburger: Lesson data still not available after script load');
                tryRelativePath();
            }
        }, 100);
    };
    
    script.onerror = () => {
        console.error(`DEBUG Hamburger: Failed to load ks3_lessons.js from absolute path: ${absoluteUrl}`);
        tryRelativePath();
    };
    
    document.head.appendChild(script);
    
    // Fallback to relative path if absolute path fails
    function tryRelativePath() {
        // Try using getBasePath first
        const basePath = typeof getBasePath === 'function' ? getBasePath() : '../'.repeat(window.location.pathname.split('/').filter(p => p && !p.endsWith('.html')).length);
        const relativeUrl = `${basePath}data/ks3_lessons.js`;
        console.log(`DEBUG Hamburger: Trying relative path: ${relativeUrl}`);
        
        const relativeScript = document.createElement('script');
        relativeScript.src = relativeUrl;
        
        relativeScript.onload = () => {
            console.log(`DEBUG Hamburger: Successfully loaded ks3_lessons.js from: ${relativeUrl}`);
            setTimeout(() => {
                if (typeof window.ks3TermLessons !== 'undefined') {
                    console.log('DEBUG Hamburger: Lesson data available after relative path load');
                    callback();
                } else {
                    console.warn('DEBUG Hamburger: Lesson data still not available after relative path load');
                    retryOrUseHardcoded();
                }
            }, 100);
        };
        
        relativeScript.onerror = () => {
            console.error(`DEBUG Hamburger: Failed to load ks3_lessons.js from relative path: ${relativeUrl}`);
            retryOrUseHardcoded();
        };
        
        document.head.appendChild(relativeScript);
    }
    
    // Either retry or use hardcoded data
    function retryOrUseHardcoded() {
        retryCount++;
        if (retryCount < MAX_RETRIES) {
            console.log(`DEBUG Hamburger: Retrying lesson data load (${retryCount}/${MAX_RETRIES})`);
            setTimeout(() => ensureLessonDataLoaded(callback), 300);
        } else {
            console.error('DEBUG Hamburger: Max retries reached. Using hardcoded data.');
            useHardcodedData();
        }
    }
}

/**
 * Sets up the click listeners for the hamburger button and menu links.
 */
function setupHamburgerMenuInteraction(hamburgerBtn, hamburgerMenu) {
    console.log('DEBUG Hamburger: Setting up interaction listeners.');

    // --- Toggle Menu Open/Closed ---
    hamburgerBtn.removeEventListener('click', toggleHamburgerMenu); // Remove old listener first
    hamburgerBtn.addEventListener('click', toggleHamburgerMenu);

    function toggleHamburgerMenu() {
        const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
        hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));

        if (isExpanded) {
            // Menu is being closed - set aria-hidden and handle focus properly
            hamburgerMenu.setAttribute('aria-hidden', 'true');

            // Find any focused element within the menu and blur it
            if (document.activeElement && hamburgerMenu.contains(document.activeElement)) {
                document.activeElement.blur();
            }

            // Optionally move focus back to the button
            hamburgerBtn.focus();
        } else {
            // Menu is being opened
            hamburgerMenu.setAttribute('aria-hidden', 'false');
        }

        hamburgerBtn.classList.toggle('open');
        hamburgerMenu.classList.toggle('open');
        document.body.classList.toggle('hamburger-open'); // For potential content push/styling
        console.log(`DEBUG Hamburger: Toggled. Expanded: ${!isExpanded}`);
    }

    // --- Submenu Toggles ---
    const submenuToggles = hamburgerMenu.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(toggle => {
        // Prevent adding multiple listeners if setup runs more than once
        if (toggle.dataset.listenerAttached === 'true') return;

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!isExpanded));
            const submenu = this.nextElementSibling; // Assumes submenu is the direct next sibling
            const indicator = this.querySelector('.toggle-indicator');

            if (submenu && submenu.classList.contains('lesson-submenu')) {
                submenu.classList.toggle('expanded');
                if (indicator) indicator.textContent = isExpanded ? '▼' : '▲';
            }
        });
        toggle.dataset.listenerAttached = 'true'; // Mark as having a listener
    });

    // --- Close Menu on Link Click (Mobile - Optional) ---
    const menuLinks = hamburgerMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        if (link.dataset.listenerAttached === 'true') return;
        link.addEventListener('click', function() {
            // Always close menu when a link is clicked
            hamburgerBtn.click(); // Simulate a click on the toggle button to close
        });
        link.dataset.listenerAttached = 'true';
    });
}

/**
 * Populate hamburger menu with dynamic links based on context and lesson data from data/ks3_lessons.js.
 */
function populateHamburgerMenu() {
    console.log('DEBUG Hamburger: Populating menu...');
    const lessonSubmenu = document.querySelector('.hamburger-menu .lesson-submenu');
    const overviewLink = document.getElementById('menu-overview-link');
    const contentLink = document.getElementById('menu-content-link');
    const homeworkLink = document.getElementById('menu-homework-link');
    const resourcesLink = document.getElementById('menu-resources-link');

    if (!lessonSubmenu || !overviewLink || !contentLink || !homeworkLink || !resourcesLink) {
        console.warn('DEBUG Hamburger: One or more menu link elements not found. Cannot populate.');
        return;
    }

    // Check if ks3TermLessons data exists (should be global from data/ks3_lessons.js)
    if (typeof window.ks3TermLessons === 'undefined') {
        console.error('DEBUG Hamburger: ks3TermLessons is not defined! Check if data/ks3_lessons.js is loaded before this script.');
        lessonSubmenu.innerHTML = '<li>Failed to load lesson data</li>';
        return;
    }

    // Get current year and term using the local implementation
    const yearTerm = extractYearAndTerm(); // Use the local function defined below
    console.log('DEBUG Hamburger: Year and term from local function:', yearTerm);

    if (!yearTerm) {
        console.warn('DEBUG Hamburger: Could not determine year and term, using default links');

        // Provide default paths as fallback
        const basePath = getBasePath();
        overviewLink.href = `${basePath}index.html`; 
        contentLink.href = `${basePath}index.html`;
        homeworkLink.href = `${basePath}index.html`;
        resourcesLink.href = `${basePath}index.html`;

        lessonSubmenu.innerHTML = '<li><a href="#">Could not detect current section</a></li>';
        return;
    }

    const { year, term } = yearTerm;
    console.log(`DEBUG Hamburger: Determined year: ${year}, term: ${term}`);

    // If we're missing data for this year/term specifically, add a minimal entry if needed
    if (!window.ks3TermLessons[year]) {
        window.ks3TermLessons[year] = {};
    }
    
    // Add placeholder entry if needed for this term
    if (!window.ks3TermLessons[year][term]) {
        console.log(`DEBUG Hamburger: Creating placeholder lesson data for ${year}/${term}`);
        
        // Create generic lesson structure for this year/term
        window.ks3TermLessons[year][term] = [];
        for (let i = 1; i <= 6; i++) {
            const shortTerm = term.match(/Year(\d+)_Term(\d+)/i) 
                ? `Y${term.match(/Year(\d+)_Term(\d+)/i)[1]}_T${term.match(/Year(\d+)_Term(\d+)/i)[2]}`
                : term;
                
            window.ks3TermLessons[year][term].push({
                title: `Lesson ${i}`,
                href: `${shortTerm}_L${i}.html`
            });
        }
    }

    const lessons = window.ks3TermLessons[year][term];
    if (!Array.isArray(lessons)) {
        console.error(`DEBUG Hamburger: Lesson data for ${year}/${term} is not an array.`);
        lessonSubmenu.innerHTML = '<li>Error loading lesson data format</li>';
        return;
    }

    // Convert full term name (e.g., Year7_Term6) to short prefix (e.g., Y7_T6)
    let shortFilePrefix = '';
    const termMatch = term.match(/Year(\d+)_Term(\d+)/i);
    if (termMatch) {
        shortFilePrefix = `Y${termMatch[1]}_T${termMatch[2]}`;
        console.log(`DEBUG Hamburger: Converted ${term} to short prefix: ${shortFilePrefix}`);
    } else if (term.match(/Paper(\d+)/i)) {
        const paperNum = term.match(/Paper(\d+)/i)[1];
        shortFilePrefix = `P${paperNum}`;
        console.log(`DEBUG Hamburger: Using GCSE paper prefix: ${shortFilePrefix}`);
    } else {
        console.warn(`DEBUG Hamburger: Could not create short prefix for term: ${term}`);
        shortFilePrefix = term; // Use the original term as a fallback
    }

    const currentFilename = window.location.pathname.split('/').pop();
    const currentLessonNum = typeof window.getCurrentLessonNumber === 'function' ? 
                             window.getCurrentLessonNumber() : 
                             getCurrentLessonNumber(); // Use local function as fallback

    // Construct the base path for this specific term's directory
    const basePath = getBasePath();
    // Fix: Don't add ks3/ if we're already in a ks3 path
    const termDirectoryPath = constructTermPath(basePath, year, term);
    console.log(`DEBUG Hamburger: Using term directory path: ${termDirectoryPath}`);

    // --- Populate Main Term Links ---
    const filePrefix = shortFilePrefix; // Use the newly created short prefix
    overviewLink.href = `${termDirectoryPath}${filePrefix}_Overview.html`;
    contentLink.href = `${termDirectoryPath}${filePrefix}_Content.html`;
    homeworkLink.href = `${termDirectoryPath}${filePrefix}_Homework.html`;
    resourcesLink.href = `${termDirectoryPath}${filePrefix}_Independent_Study.html`;

    // Highlight active main link
    [overviewLink, contentLink, homeworkLink, resourcesLink].forEach(link => {
        const linkFilename = link.getAttribute('href').split('/').pop();
        if (linkFilename === currentFilename) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Populate Lesson Submenu ---
    lessonSubmenu.innerHTML = ''; // Clear existing/placeholder content

    // Handle the case where we don't have lesson data for this section (e.g., KS4)
    if (year === 'ks4') {
        lessonSubmenu.innerHTML = '<li>KS4 Lesson links not yet implemented here</li>'; // Placeholder
        return;
    }

    // Normal KS3 menu population
    lessons.forEach((lesson, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        // Ensure we're using the full URL path, not just the filename
        const lessonFilename = lesson.href.includes('/') ? lesson.href : `${termDirectoryPath}${lesson.href}`;
        link.href = lessonFilename;
        link.textContent = lesson.title || `Lesson ${index + 1}`;

        // Add 'active' class if the current page matches this lesson
        if (currentFilename === lesson.href.split('/').pop()) {
            link.classList.add('active');
        }

        listItem.appendChild(link);
        lessonSubmenu.appendChild(listItem);
    });

    console.log(`DEBUG Hamburger: Successfully populated menu for ${year}/${term} with ${lessons.length} lessons.`);
}

/**
 * Constructs the path to a specific year/term folder
 * @param {string} basePath - The relative path to site root
 * @param {string} year - The year (e.g., "year7")
 * @param {string} term - The term (e.g., "Year7_Term6")
 * @returns {string} - Properly constructed path to the term directory
 */
function constructTermPath(basePath, year, term) {
    // Check if we're already in a KS3 path to avoid duplication
    const currentPath = window.location.pathname.toLowerCase();
    const inKs3Path = currentPath.includes('/ks3/');

    if (inKs3Path) {
        // If we're already in a KS3 path, use path directly to the year/term
        // Determine if our current directory is already the target directory
        const isInTargetDir = currentPath.includes(`/ks3/${year}/${term}/`.toLowerCase());
        if (isInTargetDir) {
            return './'; // We're already in the right directory
        }
        
        // Otherwise construct relative path based on basePath
        return `${basePath}${year}/${term}/`;
    } else {
        // If we're not in a KS3 path, use the full path including ks3
        return `${basePath}ks3/${year}/${term}/`;
    }
}

/**
 * Extracts the current year and term from the URL path.
 * Uses a local implementation to avoid potential recursion issues with utils.js.
 * @returns {object|null} An object { year: string, term: string } or null if not found.
 */
function extractYearAndTerm() {
    const path = window.location.pathname;
    console.log('DEBUG Hamburger: Local extracting year and term from path:', path);

    // Standard path: /ks3/yearX/YearX_TermY/...
    // Example: /ks3/year7/Year7_Term6/Y7_T6_Overview.html
    const standardMatch = path.match(/\/ks3\/(year\d+)\/(Year\d+_Term\d+)\//i);
    if (standardMatch) {
        console.log('DEBUG Hamburger: Matched standard path');
        return {
            year: standardMatch[1].toLowerCase(), // "year7"
            term: standardMatch[2] // "Year7_Term6"
        };
    }

    // Check for GCSE content (Paper 1/2)
    // Example: /ks4/paper1_computer_systems/index.html
    const gcseMatch = path.match(/\/ks4\/(paper\d+)_/i);
    if (gcseMatch) {
         console.log('DEBUG Hamburger: Matched GCSE path');
        return {
            year: 'ks4',
            term: `Paper${gcseMatch[1]}` // "Paper1"
        };
    }

    // Fallback for direct file access or slightly different paths using filename convention
    // Example: /somewhere/Y7_T6_L1.html
    const fileMatch = path.match(/[\/]([Yy](\d+)[_]?)[Tt](\d+)_/i);
    if (fileMatch) {
        console.log('DEBUG Hamburger: Matched file naming convention');
        return {
            year: `year${fileMatch[2]}`, // "year7"
            term: `Year${fileMatch[2]}_Term${fileMatch[3]}` // "Year7_Term6"
        };
    }

    // Last fallback - try extracting from folder structure again (might be redundant but safe)
    // Example: /ks3/year7/Year7_Term6/some_other_file.html
    const folderMatch = path.match(/\/ks3\/year(\d+)\/Year\d+_Term(\d+)\//i);
    if (folderMatch) {
         console.log('DEBUG Hamburger: Matched folder structure fallback');
        return {
            year: `year${folderMatch[1]}`, // "year7"
            term: `Year${folderMatch[1]}_Term${folderMatch[2]}` // "Year7_Term6"
        };
    }

    console.warn('Hamburger: Could not extract year and term from URL:', path);
    return null; // Return null if no pattern matches
}

/**
 * Get the lesson number from the current URL
 * Local implementation as fallback if utils.js is not loaded
 */
function getCurrentLessonNumber() {
    const path = window.location.pathname;
    const lessonMatch = path.match(/_L(\d+)\.html$/i);
    return lessonMatch ? parseInt(lessonMatch[1]) : null;
}

/**
 * Get base path to root from current location.
 * Needed for constructing relative paths correctly.
 * @returns {string} Relative path like "../", "../../", etc.
 */
function getBasePath() {
    // Check for a base tag in the document head
    const baseTag = document.querySelector('base[href]');
    if (baseTag) {
        const baseHref = baseTag.getAttribute('href');
        console.log(`DEBUG Hamburger: Found base tag with href: ${baseHref}`);
        return baseHref;
    }
    
    const path = window.location.pathname;
    
    // Check if we're on GitHub Pages or your desired domain
    const isGitHubPages = window.location.hostname.includes('github.io');
    const repoName = 'SGSCS'; // Your GitHub repository name
    
    // If we're on GitHub Pages and the path includes the repo name
    if (isGitHubPages && path.includes(`/${repoName}/`)) {
        // For GitHub Pages, we need to use relative paths starting from the repo name
        const pathAfterRepo = path.split(`/${repoName}/`)[1] || '';
        const segments = pathAfterRepo.split('/').filter(p => p && !p.endsWith('.html')).length;
        return '../'.repeat(segments);
    } else {
        // Original calculation for non-GitHub Pages deployment
        // Ensure the path starts with a slash for consistent splitting
        const normPath = path.startsWith('/') ? path : '/' + path;
        // Split by '/', filter out empty strings and the filename itself if present.
        const depth = normPath.split('/').filter(p => p && !p.includes('.html')).length - 1; // -1 because root is depth 0

        if (depth <= 0) {
            return './'; // Already at root or invalid depth
        }
        return '../'.repeat(depth);
    }
}

/**
 * Adjusts hamburger menu position to avoid overlap with fixed header/footer.
 */
function adjustHamburgerPosition() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    if (!hamburgerMenu) return;

    const header = document.querySelector('.main-header'); // Ensure this selector matches your header
    const headerHeight = header ? header.offsetHeight : 0;
    hamburgerMenu.style.top = `${headerHeight}px`;

    // Adjust height to account for header and potential footer
    const viewportHeight = window.innerHeight;
    hamburgerMenu.style.height = `calc(100vh - ${headerHeight}px)`; // Use calc for viewport height minus header
}