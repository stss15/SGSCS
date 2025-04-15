/**
 * Core JavaScript for CS Curriculum Site
 * Handles essential navigation functionality.
 * NOTE: These setup functions should be called by include.js after header/nav content is loaded.
 */

console.log("DEBUG: main.js parsed");

// Function to setup side menu toggle
function setupSideMenuToggle() {
    console.log('Setting up side menu toggle...');
    
    // Log deprecation warning
    console.warn('DEPRECATED: The side-menu component is deprecated and being replaced by the hamburger menu. This function will be removed in a future version.');
    
    // Check if current page has a side menu
    if (document.body.getAttribute('data-has-sidemenu') !== 'true') {
        console.log('This page does not have a side menu.');
        return;
    }
    
    // Side menu may not be present in newer versions of the site
    const sideMenu = document.getElementById('side-menu');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (!sideMenu || !menuToggle) {
        console.warn('Side menu elements not found, likely due to migration to hamburger menu');
        return;
    }
    
    // Toggle menu open/closed state
    menuToggle.addEventListener('click', function() {
        console.log('Menu toggle clicked');
        sideMenu.classList.toggle('open');
        
        // Update aria-expanded state
        const isExpanded = sideMenu.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Save state in localStorage for persistence
        localStorage.setItem('sideMenuOpen', isExpanded);
        
        console.log('Side menu is now ' + (isExpanded ? 'open' : 'closed'));
    });
    
    // Close menu when clicking on links (for mobile)
    const menuLinks = sideMenu.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only automatically close on mobile
            if (window.innerWidth <= 768) {
                sideMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Restore menu state from localStorage
    const savedState = localStorage.getItem('sideMenuOpen');
    if (savedState === 'true') {
        sideMenu.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
    }
}

// Function to setup mobile navigation toggle
function setupMobileNavToggle() {
    console.log("DEBUG: Setting up mobile nav toggle");
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav'); // Select main nav container
    
    if (menuToggle && mainNav) {
        const mainNavUl = mainNav.querySelector('ul'); // Find UL within the nav
        if (!mainNavUl) {
            console.error("DEBUG ERROR: Main navigation list (.main-nav ul) not found within .main-nav.");
            return;
        }
  
        console.log("DEBUG: Attaching click listener to menu toggle.");
        if (!menuToggle.dataset.listenerAttached) {
            menuToggle.addEventListener('click', (event) => {
                event.stopPropagation(); 
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', String(!isExpanded));
                mainNavUl.classList.toggle('active'); 
                document.body.classList.toggle('no-scroll', !isExpanded); 
                console.log(`DEBUG: Menu toggled. Expanded: ${!isExpanded}`);
            });
  
            // Close menu if clicking outside of it
            document.addEventListener('click', (event) => {
                if (mainNavUl.classList.contains('active') && !mainNavUl.contains(event.target) && !menuToggle.contains(event.target)) {
                    console.log("DEBUG: Click outside menu detected, closing.");
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNavUl.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
            menuToggle.dataset.listenerAttached = 'true';
        } else {
            console.log("DEBUG: Listener already attached to menu toggle.");
        }
    } else {
        // Suppress errors if header isn't loaded yet; if placeholder is gone but header is missing, log errors.
        if (document.querySelector('[data-include="header"]')) {
            // Still waiting for include.js to load header
        } else if (!document.querySelector('.main-header')) {
            if (!menuToggle) console.error("DEBUG ERROR: Mobile menu toggle button (.menu-toggle) not found after includes.");
            if (!mainNav) console.error("DEBUG ERROR: Main nav container (.main-nav) not found after includes.");
        }
    }
}

/**
 * Sets the active navigation link based on the current URL path.
 * Also highlights parent nav items (e.g. KS3 section when in a Year page).
 */
function setActiveNavLink() {
    console.log('DEBUG: Setting active navigation link');
    
    const navLinks = document.querySelectorAll('nav.main-nav a');
    if (!navLinks.length) {
        console.log('DEBUG: No navigation links found.');
                            return;
                        }

    // Get the current path and normalize it
    let currentPath = window.location.pathname;
    // Remove trailing slash and normalize
    currentPath = currentPath.replace(/\/+$/, '');

    // Handle index.html
    if (currentPath.endsWith('/index.html')) {
        currentPath = currentPath.replace('/index.html', '');
    }

    // For root path
    if (currentPath === '') currentPath = '/';

    // Special case for term pages - match both exact path and the corresponding landing page
    const termMatch = currentPath.match(/\/(ks\d+)\/(year\d+)\/(Year\d+_Term\d+)/i);
    const isTermPage = !!termMatch;

    console.log(`DEBUG: Current Path: ${window.location.pathname} (Normalized: ${currentPath})`);
    console.log(`DEBUG: Found ${navLinks.length} nav links.`);

    let bestMatch = null;
    let bestMatchLink = null;
    let bestMatchLength = 0;

    // First pass: find exact matches and longest partial matches
    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        
        // Skip links with no href or with hash only
        if (!href || href === '#') return;
        
        // Get path from href (remove protocol, domain, hash, query)
        let linkPath = href;
        if (href.includes('://')) {
            linkPath = new URL(href).pathname;
        } else if (href.includes('#')) {
            linkPath = href.split('#')[0];
        } else if (href.includes('?')) {
            linkPath = href.split('?')[0];
        }
        
        // Normalize link path similar to current path
        linkPath = linkPath.replace(/\/+$/, '');
        if (linkPath.endsWith('/index.html')) {
            linkPath = linkPath.replace('/index.html', '');
        }
        
        // For root path
        if (linkPath === '') linkPath = '/';

        // Check for year landing page links when on a term page
        if (isTermPage) {
            const ks = termMatch[1].toLowerCase();  // e.g., 'ks3'
            const year = termMatch[2].toLowerCase(); // e.g., 'year7'
            
            // If this is a link to the correct year landing page, it's a good match
            if (linkPath.includes(`/${ks}/${year}/Landing_Page`) || 
                linkPath.includes(`/${ks}/${year}/index.html`)) {
                console.log(`DEBUG: Found year landing match: ${linkPath}`);
                if (linkPath.length > bestMatchLength) {
                    bestMatch = linkPath;
                    bestMatchLink = link;
                    bestMatchLength = linkPath.length;
                }
            }
        }
        
        // Exact match
        if (linkPath === currentPath) {
            console.log(`DEBUG: Exact match found for ${linkPath}`);
            bestMatch = linkPath;
            bestMatchLink = link;
            bestMatchLength = linkPath.length;
        }
        // Longest partial match (current path starts with link path)
        // This helps match section links (e.g., /ks3/ should be active when in /ks3/year7/)
        else if (currentPath.startsWith(linkPath + '/') && linkPath.length > bestMatchLength) {
            console.log(`DEBUG: Partial match found for ${linkPath}`);
            bestMatch = linkPath;
            bestMatchLink = link;
            bestMatchLength = linkPath.length;
        }
    });

    // Apply the best match if found
    if (bestMatchLink) {
        console.log(`DEBUG: Setting active class on link with path: ${bestMatch}`);
        bestMatchLink.classList.add('active');
        
        // Check if this link is inside a dropdown and activate its parent
        const parentDropdown = bestMatchLink.closest('.dropdown');
        if (parentDropdown) {
            const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.classList.add('active');
            }
        }
    } else {
        console.log('DEBUG: No active link identified based on path.');
    }
}

// NOTE: We no longer need to call these functions here.
// include.js now handles calling them after components are loaded.
// The functions are left available for direct calling if needed for debugging.

// This section is REMOVED or COMMENTED OUT since include.js now handles the initialization
/* 
if (typeof includeComponents === 'function') {
    includeComponents().then(() => {
        setupMobileNavToggle();
        setActiveNavLink();
        setupSideMenuToggle();
    });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        setupMobileNavToggle();
        setActiveNavLink();
        setupSideMenuToggle();
    });
}
*/

// This section is REMOVED or COMMENTED OUT since include.js now handles the initialization
/*
document.addEventListener('DOMContentLoaded', function() {
    // Existing JS functionality...
    
    // Wait for includes to be processed, then initialize side menu
    if (typeof processIncludes === 'function') {
        // If includes.js is loaded and function exists
        const includesPromise = processIncludes();
        if (includesPromise && includesPromise.then) {
            includesPromise.then(() => {
                setupSideMenuToggle();
            });
        } else {
            // If processIncludes doesn't return a promise
            setTimeout(setupSideMenuToggle, 100);
        }
    } else {
        // If includes.js is not being used
        setupSideMenuToggle();
    }
});
*/

// We'll only initialize non-include dependent functionality on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DEBUG: main.js DOMContentLoaded - Initial setup (non-include dependent).");
    // Any logic that DOES NOT depend on header/footer/hamburger being present can go here
    
    // For example: theme handling, analytics, or other page-wide utilities
});