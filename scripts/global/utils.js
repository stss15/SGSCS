// Utility functions shared across the application

console.log("utils.js loaded");

/**
 * Converts a decimal number (0-255) to an 8-bit binary string.
 * Handles potential edge cases or errors by returning "Invalid".
 * @param {number} decimal The decimal number to convert.
 * @returns {string} The 8-bit binary string or "Invalid".
 */
function decToBinary8Bit(decimal) {
    if (decimal < 0 || decimal > 255 || isNaN(decimal)) {
        console.error("decToBinary8Bit: Input must be a number between 0 and 255.");
        return "Invalid"; 
    }
    // toString(2) handles the conversion, padStart ensures 8 bits.
    return decimal.toString(2).padStart(8, '0');
}

/**
 * Extracts the key stage year (e.g., 'year7') and term (e.g., 'Year7_Term1' or 'Landing_Page')
 * from the current page URL path.
 * @returns {{year: string, term: string} | null} Object containing year and term, or null if not found.
 */
function extractYearAndTerm() {
    const path = window.location.pathname;
    console.log('DEBUG Utils: Extracting year and term from path:', path);
    
    // Standard path: /ks3/yearX/YearX_TermY/...
    const standardMatch = path.match(/\/ks3\/(year\d+)\/(Year\d+_Term\d+|Landing_Page)\//i);
    if (standardMatch) {
        console.log('DEBUG Utils: Matched standard path:', standardMatch);
        return {
            year: standardMatch[1].toLowerCase(),
            term: standardMatch[2]
        };
    } else {
        console.log('DEBUG Utils: No match for standard path pattern');
    }
    
    // Check for GCSE content (Paper 1/2)
    const gcseMatch = path.match(/\/ks4\/paper(\d+)_/i);
    if (gcseMatch) {
        console.log('DEBUG Utils: Matched GCSE path:', gcseMatch);
        return {
            year: 'ks4',
            term: `Paper${gcseMatch[1]}`
        };
    } else {
        console.log('DEBUG Utils: No match for GCSE path pattern');
    }
    
    // Fallback for direct file access or slightly different paths (e.g., Y7_T1_L1.html)
    const fileMatch = path.match(/[\/]([Yy](\d+)[_]?)[Tt](\d+)_/i); 
    if (fileMatch) {
        console.log('DEBUG Utils: Matched filename pattern:', fileMatch);
        return {
            year: `year${fileMatch[2]}`, 
            term: `Year${fileMatch[2]}_Term${fileMatch[3]}`
        };
    } else {
        console.log('DEBUG Utils: No match for filename pattern');
    }
    
    // Last fallback - try extracting from folder structure
    // Example: /ks3/year7/Year7_Term6/Y7_T6_Overview.html
    const folderMatch = path.match(/\/ks3\/year(\d+)\/Year\d+_Term(\d+)\//i);
    if (folderMatch) {
        console.log('DEBUG Utils: Matched folder structure:', folderMatch);
        return {
            year: `year${folderMatch[1]}`,
            term: `Year${folderMatch[1]}_Term${folderMatch[2]}`
        };
    } else {
        console.log('DEBUG Utils: No match for folder structure pattern');
    }
    
    console.warn('Utils: Could not extract year and term from URL:', path);
    return null;
}

/**
 * Gets the current lesson number from the filename (e.g., Y7_T1_L1.html -> 1).
 * @returns {number | null} The lesson number or null if not found.
 */
function getCurrentLessonNumber() {
    const path = window.location.pathname;
    // Matches _L followed by one or more digits, right before .html
    const lessonMatch = path.match(/_L(\d+)\.html$/i);
    return lessonMatch ? parseInt(lessonMatch[1]) : null;
}

// Add other utility functions below... 