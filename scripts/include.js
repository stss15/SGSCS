/**
 * Include HTML templates functionality
 * Allows for modular website structure with separate header, footer, side menu, etc.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: include.js - DOMContentLoaded");

    // --- Configuration ---
    const templatesFolderPath = 'templates/'; // Primary path for components relative to root
    const includesFolderPath = 'includes/';   // Alternative path for components
    
    // Flag to prevent multiple simultaneous component loading attempts
    let componentsBeingLoaded = false;

    // --- Functions ---

    /**
     * Calculates the relative path from the current page to the site root.
     * Enhanced to work with GitHub Pages deployments
     */
    function getBasePath() {
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
            const depth = path.split('/').filter(p => p && !p.endsWith('.html')).length;
            if (path === '/' || path.endsWith('/index.html')) {
                return './'; // Root or index.html at root
            } else {
                return '../'.repeat(depth);
            }
        }
    }

    /**
     * Fetches HTML content from a specified URL relative to the document's location.
     * @param {string} relativeUrl - The relative URL of the component (e.g., '../../templates/header.html').
     * @returns {Promise<string>} A promise that resolves with the HTML text or rejects on error.
     */
    async function fetchHtml(relativeUrl) {
        // Construct an absolute URL based on the current document's location
        const absoluteUrl = new URL(relativeUrl, document.location.href).href;
        console.log(`DEBUG: Attempting to fetch: ${absoluteUrl} (from relative: ${relativeUrl})`);
        try {
            const response = await fetch(absoluteUrl);
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`Component not found (404): ${absoluteUrl}`);
                } else {
                    console.error(`HTTP error! Status: ${response.status} for ${absoluteUrl}`);
                }
                return null;
            }
            return await response.text();
        } catch (error) {
            console.error(`Error fetching ${absoluteUrl}:`, error);
            return null; // Return null on error
        }
    }

    /**
     * Fetches HTML, replaces placeholders, and processes includes.
     * @param {string} relativeUrl - The relative URL of the component.
     * @param {string} basePath - The relative path to the root for placeholder replacement.
     * @returns {Promise<string>} A promise that resolves with the processed HTML text or rejects on error.
     */
    async function fetchAndProcessHtml(relativeUrl, basePath) {
        try {
            let html = await fetchHtml(relativeUrl); // Use the corrected fetchHtml
            if (html === null) {
                throw new Error(`HTML content was null for ${relativeUrl}`);
            }
            // Replace the placeholder with the calculated base path
            html = html.replace(/\[RELATIVE_PATH_TO_ROOT\]/g, basePath);
            console.log(`DEBUG: Processed HTML for ${relativeUrl}, replaced placeholders with: ${basePath}`);
            return html;
        } catch (error) {
            console.error(`Error fetching or processing ${relativeUrl}:`, error);
            return ''; // Return empty string on error to avoid breaking Promise.all
        }
    }

    /**
     * Main function to include HTML components
     */
    async function includeComponents() {
        if (componentsBeingLoaded) {
            console.log('Already in the process of loading components.');
            return Promise.resolve(); // Return a resolved promise if already loading
        }

        componentsBeingLoaded = true;
        console.log('Including components...');

        // Calculate relative path to root based on current URL
        const basePath = getBasePath();
        console.log('DEBUG: Calculated base path:', basePath);

        // Find all placeholders
        const componentsToLoad = [];
        const promises = [];

        // Check for hamburger menu
        const hasHamburgerMenu = document.querySelector('body').dataset.hasHamburger === 'true';
        if (hasHamburgerMenu) {
            console.log('DEBUG: Page needs a hamburger menu.');
            componentsToLoad.push('hamburger-menu');
        }

        // Find all placeholders for header, footer etc.
        document.querySelectorAll('[data-include]').forEach(placeholder => {
            const component = placeholder.getAttribute('data-include');
            componentsToLoad.push(component);
        });

        // Process each component
        componentsToLoad.forEach(component => {
            const placeholder = document.querySelector(`[data-include="${component}"]`) || (component === 'hamburger-menu' ? document.createElement('div') : null);
            if (!placeholder && component !== 'hamburger-menu') {
                console.warn(`Placeholder for ${component} not found.`);
                return;
            }

            // Set paths to try, checking includes/ first for header and footer
            let pathsToTry;
            if (component === 'header' || component === 'footer') {
                // Check includes/ first for header and footer to avoid 404 errors
                pathsToTry = [
                    `${basePath}${includesFolderPath}${component}.html`,
                    `${basePath}${templatesFolderPath}${component}.html`
                ];
            } else {
                // Original order for other components
                pathsToTry = [
                    `${basePath}${templatesFolderPath}${component}.html`,
                    `${basePath}${includesFolderPath}${component}.html`
                ];
            }

            console.log(`DEBUG: Will try paths: ${pathsToTry.join(', ')} for ${component}`);
            
            // Create a promise that tries each path in sequence
            const promise = (async () => {
                let html = '';
                
                // Try each path until we get content
                for (const path of pathsToTry) {
                    console.log(`DEBUG: Trying to load ${component} from ${path}`);
                    html = await fetchAndProcessHtml(path, basePath);
                    if (html) {
                        console.log(`DEBUG: Successfully loaded ${component} from ${path}`);
                        break;
                    }
                }
                
                if (html) {
                    if (component === 'hamburger-menu') {
                        // For hamburger menu, append directly to the body
                        const tempContainer = document.createElement('div');
                        tempContainer.innerHTML = html;
                        // Insert at the beginning of the body, preserving order of elements
                        Array.from(tempContainer.children).reverse().forEach(node => {
                            document.body.insertBefore(node, document.body.firstChild);
                        });
                        console.log(`DEBUG: Appended processed ${component} HTML to document body.`);
                    } else if (placeholder) {
                        // Original logic for components with data-include placeholders
                        placeholder.innerHTML = html;
                        console.log(`DEBUG: Inserted processed ${component} HTML into placeholder.`);
                        placeholder.removeAttribute('data-include'); // Clean up attribute
                    }
                } else {
                    console.error(`Failed to load or process ${component} from any of the paths. Placeholder(s) will remain empty.`);
                }
            })();
            
            promises.push(promise);
        });

        // --- Wait for all includes and then initialize dependent scripts ---
        try {
             await Promise.all(promises);
             console.log('DEBUG: All HTML includes processed.');

             // NOW it's safe to initialize scripts that depend on the included content
             console.log('DEBUG: Initializing scripts dependent on included HTML...');

             if (typeof setupMobileNavToggle === 'function') {
                console.log("DEBUG: Calling setupMobileNavToggle()");
                setupMobileNavToggle();
             } else { console.warn("DEBUG: setupMobileNavToggle function not found."); }

             if (typeof setActiveNavLink === 'function') {
                console.log("DEBUG: Calling setActiveNavLink()");
                setActiveNavLink();
             } else { console.warn("DEBUG: setActiveNavLink function not found."); }

             if (typeof window.handleHamburgerMenuInclude === 'function') {
                // Check if it was already called during insertion (safer to call again or ensure idempotency)
                 console.log("DEBUG: Calling window.handleHamburgerMenuInclude() post-includes");
                 window.handleHamburgerMenuInclude();
             }

             if (typeof setupSideMenuToggle === 'function') {
                console.log("DEBUG: Calling setupSideMenuToggle()");
                 setupSideMenuToggle();
             } else { console.warn("DEBUG: setupSideMenuToggle function not found."); }

             // Add other initialization functions here if they depend on included HTML

             componentsBeingLoaded = false; // Reset the loading flag
             return Promise.resolve(); // Signal that includes and dependent initializations are done

        } catch (error) {
             console.error('Error during Promise.all or dependent script initialization:', error);
             componentsBeingLoaded = false; // Reset the loading flag
             return Promise.reject(error); // Reject the main promise if anything critical failed
        }
    }

    // --- Run Inclusion ---
    const includesPromise = includeComponents();

    // Expose the promise for other scripts that might need to wait *independently*
    window.processIncludes = () => includesPromise;

     // Optional: Handle potential errors globally
     includesPromise.catch(error => {
         console.error("CRITICAL: Failed to complete component inclusion and initialization.", error);
     });
});