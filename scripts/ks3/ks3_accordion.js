/**
 * KS3 Accordion Functionality
 * Handles expanding and collapsing accordion items.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG Accordion: Initializing KS3 Accordion");

    const accordionHeaders = document.querySelectorAll('.ks3-accordion-header');

    if (accordionHeaders.length === 0) {
        console.log("DEBUG Accordion: No accordion headers found.");
        return;
    }

    accordionHeaders.forEach(header => {
        // Ensure listener isn't added multiple times if script runs unexpectedly again
        if (header.dataset.listenerAttached === 'true') return;

        header.addEventListener('click', () => {
            console.log("DEBUG Accordion: Header clicked");
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Toggle the current item
            header.classList.toggle('active');
            header.setAttribute('aria-expanded', String(!isExpanded));
            accordionContent.classList.toggle('expanded');

            if (!isExpanded) {
                // Expand: Set max-height to content's scroll height
                // Use setTimeout to allow CSS transition to work after adding 'expanded' class
                setTimeout(() => {
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                }, 0);
                 console.log("DEBUG Accordion: Expanding - Max height set to", accordionContent.scrollHeight);
            } else {
                // Collapse: Reset max-height to 0
                accordionContent.style.maxHeight = '0px';
                 console.log("DEBUG Accordion: Collapsing");
            }

            // --- Optional: Close other accordion items ---
            // Uncomment the block below if you want only one item open at a time

            /*
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    const otherContent = otherHeader.nextElementSibling;
                    if (otherHeader.classList.contains('active')) {
                        otherHeader.classList.remove('active');
                        otherHeader.setAttribute('aria-expanded', 'false');
                        otherContent.classList.remove('expanded');
                        otherContent.style.maxHeight = '0px';
                        console.log("DEBUG Accordion: Closing other item");
                    }
                }
            });
            */
            // --- End Optional Block ---

        });
        header.dataset.listenerAttached = 'true'; // Mark as listener added

         // Initialize: Ensure content panel has max-height 0 if not already expanded
         const initialContent = header.nextElementSibling;
         if (!initialContent.classList.contains('expanded')) {
             initialContent.style.maxHeight = '0px';
         }
    });

    console.log(`DEBUG Accordion: Setup complete for ${accordionHeaders.length} items.`);
});

// Ensure proper height recalculation on window resize if needed
// (Often necessary if content inside accordion changes size dynamically)
window.addEventListener('resize', () => {
    const expandedContents = document.querySelectorAll('.ks3-accordion-content.expanded');
    expandedContents.forEach(content => {
        // Recalculate scrollHeight and set max-height again
        // Use requestAnimationFrame to ensure layout is stable
        requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    });
});