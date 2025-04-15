// Helper function to check if we're on the index page
function isIndexPage() {
  const path = window.location.pathname;
  // More robust check for root or index.html at root
  return path === '/' || path === '/index.html' || path.endsWith('/index.html') && path.split('/').filter(Boolean).length === 1;
}

// Helper function to check if we're on a KS3 page with level start screen
function hasLevelStartScreen() {
  return document.querySelector('.level-start-screen') !== null;
}

// Helper function to check if we're on a topic overview page (Khan-style)
function isTopicOverviewPage() {
  // Check for a unique container or combination of elements typical for these pages
  return document.querySelector('.topic-container .lessons-section') !== null;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("DEBUG: ks3_animations.js - DOMContentLoaded");
  // Skip all animations on index page - it has its own animations script
  if (isIndexPage()) {
    console.log('DEBUG: Skipping KS3 animations on index page');
    return;
  }

  // --- Intersection Observer for Scroll Animations (KS3 Theme) ---
  // Targets common containers that should fade in on scroll
  const animatedElements = document.querySelectorAll('.activity-section, .card, .lesson-nav, .zelda-hero-banner, .master-challenge, .term-card, .topic-overview, .lessons-section, .challenge-level');

  if (animatedElements.length > 0) {
    // console.log('DEBUG: Setting up scroll animations for', animatedElements.length, 'elements');
    const observerOptions = {
      root: null, // relative to viewport
      rootMargin: '0px',
      threshold: 0.1  // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
      // Check if the element doesn't already have the base class
      if (!el.classList.contains('fade-in-element')) {
          el.classList.add('fade-in-element'); // Add base class for styling
      }
      observer.observe(el);
    });
  } else {
     console.log("DEBUG: No elements found for scroll animation setup.");
  }

  // --- Level Start Screen Animation Logic (KS3 Theme) ---
  if (hasLevelStartScreen()) {
    setupLevelStartScreen();
  } else {
    // If level start screen elements aren't present, ensure main content is visible immediately
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.visibility = 'visible';
    document.body.style.overflow = '';
    // console.log("DEBUG: No level start screen found.");
  }

  // --- Topic Overview Functionality ---
  if (isTopicOverviewPage()) {
    initTopicOverview();
  } else {
    // console.log("DEBUG: Not a topic overview page.");
  }
});

// Setup Level Start Screen animations
function setupLevelStartScreen() {
  const levelStartScreen = document.querySelector('.level-start-screen');
  const titleContainer = document.querySelector('.level-start-screen .level-title-container');
  const objectivesList = document.querySelector('.level-objectives ul');
  const conceptsList = document.querySelector('.level-concepts ul');
  const contentArea = document.querySelector('.level-content-area');
  const mainContent = document.querySelector('main'); // To hide main content initially
  const scrollArrow = document.querySelector('.level-start-screen .scroll-down-arrow'); // Find arrow

  if (!levelStartScreen || !titleContainer || !objectivesList || !conceptsList || !contentArea || !mainContent) {
    console.warn('DEBUG WARN: Missing elements for level start screen animation. Forcing content display.');
    if (mainContent) mainContent.style.visibility = 'visible';
    document.body.style.overflow = '';
    return;
  }

  console.log('DEBUG: Setting up level start screen animation');

  const objectiveItems = objectivesList.querySelectorAll('li');
  const conceptItems = conceptsList.querySelectorAll('li');
  const itemDelay = 150; // ms delay between each item appearing (slightly faster)
  const titleAnimationDuration = 1500; // ms - match CSS animation-duration if specified
  const contentFadeInDelay = titleAnimationDuration - 500; // Start fading content slightly before title finishes settling
  const headingAnimationDelay = contentFadeInDelay + 300; // Delay for headings after content area starts fading in
  const arrowFadeInDelay = headingAnimationDelay + (Math.max(objectiveItems.length, conceptItems.length) * itemDelay); // Delay for arrow

  // Hide main content initially and prevent scrolling
  mainContent.style.visibility = 'hidden';
  document.body.style.overflow = 'hidden';

  // --- Trigger Animations with Classes ---
  // 1. Trigger Title animation
  if (titleContainer) titleContainer.classList.add('animation-complete'); // Use the class defined in ks3_theme.css

  // 2. Trigger Content Area fade-in
  setTimeout(() => {
    if (levelStartScreen) levelStartScreen.classList.add('content-visible');
  }, contentFadeInDelay);

  // 3. Stagger Objective Items Animation
  objectiveItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, headingAnimationDelay + (index * itemDelay));
  });

  // 4. Stagger Concept Items Animation
  conceptItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, headingAnimationDelay + (index * itemDelay)); // Can start simultaneously with objectives
  });

  // 5. Fade in Scroll Arrow
   if(scrollArrow) {
        setTimeout(() => {
            scrollArrow.classList.add('visible');
        }, arrowFadeInDelay);
   }


  // --- Cleanup and Interaction ---
  const animationEndTime = arrowFadeInDelay + 1000; // Total estimated time + buffer

  // Function to hide the screen and cleanup
  const hideLevelStartScreen = (skipped = false) => {
    if (!levelStartScreen.classList.contains('hidden')) { // Prevent multiple calls
      console.log(`DEBUG: Hiding level start screen. Skipped: ${skipped}`);
      levelStartScreen.classList.add('hidden'); // Trigger fade-out
      if(skipped) levelStartScreen.style.transition = 'opacity 0.3s ease-out'; // Faster fade if skipped

      // Use setTimeout to ensure fade-out completes before restoring visibility/scroll
      setTimeout(() => {
        mainContent.style.visibility = 'visible';
        document.body.style.overflow = '';
      }, skipped ? 300 : 800); // Match transition duration in CSS or use faster skip time

      // Remove event listeners
      document.removeEventListener('click', skipAnimation);
      document.removeEventListener('keypress', skipAnimation);
      clearTimeout(autoHideTimeout); // Clear the automatic hide timer
    }
  };

  // Automatically hide after animations complete
  const autoHideTimeout = setTimeout(() => hideLevelStartScreen(false), animationEndTime);

  // Skip animation on click/keypress
  const skipAnimation = () => {
     console.log("DEBUG: Skipping animation.");
     // Force all elements to final state using classes
     if (titleContainer) titleContainer.classList.add('animation-complete');
     if (levelStartScreen) levelStartScreen.classList.add('content-visible', 'animation-skipped'); // Use skip class for instant styles if defined
     objectiveItems.forEach(item => item.classList.add('visible'));
     conceptItems.forEach(item => item.classList.add('visible'));
     if (scrollArrow) scrollArrow.classList.add('visible');

     // Hide and cleanup immediately (with short fade)
     hideLevelStartScreen(true);
  };

  // Add skip listeners immediately
  document.addEventListener('click', skipAnimation, { once: true });
  document.addEventListener('keypress', skipAnimation, { once: true });
}


// Initialize Topic Overview Functionality (Khan Style Pages)
function initTopicOverview() {
  console.log('DEBUG: Initializing topic overview functionality');
  setupLessonCardHover();
  updateTopicProgress();
  trackLessonClicks();
}

// Setup hover effect for lesson cards using CSS classes/attributes
function setupLessonCardHover() {
  const lessonCards = document.querySelectorAll('.lesson-card');
  lessonCards.forEach((card, index) => {
    card.classList.add('hover-enabled'); // Base class to enable hover styles
    // Optional: Add slight rotation variation via data attribute for CSS
    const rotation = (index % 2 === 0) ? '0.5' : '-0.5';
    card.dataset.hoverRotation = rotation;
  });
}

// Update progress bar and text based on localStorage
function updateTopicProgress() {
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  const lessons = document.querySelectorAll('.lesson-card'); // Select cards

  if (!progressFill || !progressText || lessons.length === 0) {
    // console.log("DEBUG: Progress bar/text or lessons not found. Cannot update progress.");
    return;
  }

  let completedCount = 0;
  const topicKeyPrefix = getTopicStorageKeyPrefix(); // Generate prefix like 'ks3_year7_term6_'

  lessons.forEach((lessonCard) => {
    const link = lessonCard.querySelector('a');
    if (link) {
      const lessonFileName = link.getAttribute('href').split('/').pop(); // Get 'Y7_T6_L1_Why_Binary.html'
      const lessonStorageKey = `${topicKeyPrefix}${lessonFileName}_completed`;
      const lessonOpenedKey = `${topicKeyPrefix}${lessonFileName}_opened`;

      try {
        if (localStorage.getItem(lessonStorageKey) === 'true') {
          completedCount++;
          lessonCard.classList.remove('started'); // Remove 'started' if completed
          lessonCard.classList.add('completed');
        } else if (localStorage.getItem(lessonOpenedKey) === 'true') {
           lessonCard.classList.add('started');
        } else {
            lessonCard.classList.remove('started', 'completed'); // Ensure clean slate
        }
      } catch (e) {
        console.warn(`Storage access error for ${lessonFileName}:`, e);
      }
    }
  });

  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  progressFill.style.width = `${progressPercentage}%`;
  progressText.textContent = `${completedCount} / ${totalLessons} Lessons (${progressPercentage}%) Complete`;
  console.log(`DEBUG: Progress updated - ${completedCount}/${totalLessons} (${progressPercentage}%)`);
}

// Track clicks on lesson links to mark them as 'opened'/'started'
function trackLessonClicks() {
  const lessonLinks = document.querySelectorAll('.lesson-card a');
  const topicKeyPrefix = getTopicStorageKeyPrefix();

  lessonLinks.forEach(link => {
    link.addEventListener('click', () => {
      const lessonFileName = link.getAttribute('href').split('/').pop();
      const lessonOpenedKey = `${topicKeyPrefix}${lessonFileName}_opened`;
      const lessonCompletedKey = `${topicKeyPrefix}${lessonFileName}_completed`;

      try {
         // Only mark as opened if not already completed
         if (localStorage.getItem(lessonCompletedKey) !== 'true') {
            localStorage.setItem(lessonOpenedKey, 'true');
            // Optionally update UI immediately if needed, though overview page usually reloads
            const card = link.closest('.lesson-card');
             if(card && !card.classList.contains('completed')) {
                 card.classList.add('started');
             }
         }
         console.log(`DEBUG: Marked lesson ${lessonFileName} as opened.`);
      } catch (e) {
        console.warn(`Storage access error for ${lessonFileName}:`, e);
      }
      // Allow navigation to proceed
    });
  });
}

// Helper to generate a unique key prefix for the current topic page based on URL
function getTopicStorageKeyPrefix() {
    const pathParts = window.location.pathname.split('/').filter(part => part && !part.endsWith('.html'));
    // Example: /ks3/year7/Year7_Term6/Y7_T6_Overview.html -> ['ks3', 'year7', 'Year7_Term6']
    if (pathParts.length >= 3) {
        // Take the last 3 significant parts (ksX, yearY, TermZ)
        return `${pathParts.slice(-3).join('_')}_`; // e.g., "ks3_year7_Year7_Term6_"
    }
    // Fallback if URL structure is different
    console.warn("Could not determine standard topic prefix from URL:", window.location.pathname);
    return 'unknown_topic_';

}