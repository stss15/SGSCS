/**
 * KS4 IGCSE Computer Science JavaScript
 * 
 * Combined JavaScript functionality for KS4 pages - Modern Edition
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current page in navigation
    highlightCurrentPage();
    
    // Set up accordion for topic headers
    initTopicAccordions();
    
    // Add smooth transitions for subtopic links
    initSubtopicInteractions();
});

/**
 * Highlights the current page in the navigation
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== '#') {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize accordion functionality for topic headers
 */
function initTopicAccordions() {
    // grab every topic block
    const topics = document.querySelectorAll('.ks4-topic');

    topics.forEach(topic => {
        const headerEl = topic.querySelector('.ks4-topic-header');
        const listEl = topic.querySelector('.ks4-subtopic-list');

        // start collapsed
        listEl.classList.add('collapsed');
        
        headerEl.addEventListener('click', () => {
            // close every other list
            document.querySelectorAll('.ks4-topic-header').forEach(header => {
                if (header !== headerEl) {
                    header.classList.remove('open');
                    const topicEl = header.closest('.ks4-topic');
                    const subtopicList = topicEl.querySelector('.ks4-subtopic-list');
                    subtopicList.classList.add('collapsed');
                }
            });
            
            // toggle this one
            headerEl.classList.toggle('open');
            listEl.classList.toggle('collapsed');
        });
    });
    
    // Expand the first topic by default for better UX
    if (topics.length > 0) {
        const firstTopic = topics[0];
        const firstHeader = firstTopic.querySelector('.ks4-topic-header');
        const firstList = firstTopic.querySelector('.ks4-subtopic-list');
        
        firstHeader.classList.add('open');
        firstList.classList.remove('collapsed');
    }
}

/**
 * Initialize interactions for subtopic links
 */
function initSubtopicInteractions() {
    const subtopicLinks = document.querySelectorAll('.ks4-subtopic-link');
    
    subtopicLinks.forEach(link => {
        // Add subtle hover effect
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        // Add click effect
        link.addEventListener('click', function() {
            // Simple click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
} 