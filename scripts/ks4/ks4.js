/**
 * KS4 IGCSE Computer Science JavaScript
 * 
 * Combined JavaScript functionality for KS4 pages - Modern Edition
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current page in navigation
    highlightCurrentPage();
    
    // Initialize the accordion functionality
    initAccordion();
    
    // Auto-expand the first topic in the accordion
    const firstTopic = document.querySelector('.ks4-topic-header');
    if (firstTopic) {
        firstTopic.classList.add('open');
        const firstTopicList = firstTopic.nextElementSibling;
        if (firstTopicList) {
            firstTopicList.classList.remove('collapsed');
        }
    }
    
    // Initialize smooth scrolling for navigation links
    initSmoothScroll();
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

function initAccordion() {
    const topicHeaders = document.querySelectorAll('.ks4-topic-header');
    
    // First, ensure all subtopic lists are initially collapsed except the first one
    document.querySelectorAll('.ks4-subtopic-list').forEach((list, index) => {
        if (index !== 0) { // Skip the first one
            list.classList.add('collapsed');
        }
    });
    
    topicHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            // Toggle the open class for the header
            this.classList.toggle('open');
            
            // Toggle the collapsed class for the content
            content.classList.toggle('collapsed');
        });
    });
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.ks4-nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Add active class to the clicked link and remove from others
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
                
                // Calculate offset to account for sticky header
                const navHeight = document.querySelector('.ks4-sticky-nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight the current section in the navigation
    window.addEventListener('scroll', function() {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.ks4-sticky-nav').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 20; // 20px offset for better UX
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });
} 