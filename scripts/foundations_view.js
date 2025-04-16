/**
 * JavaScript for the KS3 Foundations View (Concepts & Skills)
 */
document.addEventListener("DOMContentLoaded", () => {
    // --- Elements ---
    const conceptsView = document.getElementById('concepts-view');
    const skillsView = document.getElementById('skills-view');
    const showSkillsBtn = document.getElementById('show-skills');
    const showConceptsBtn = document.getElementById('show-concepts');
    const conceptDisplayArea = document.getElementById('concept-display-area');
    const conceptContentArea = conceptDisplayArea?.querySelector('.concept-content'); // Area for slides
    const playerArea = document.querySelector('#skills-view .player-character-area'); // Area for skill character/desc

    // Check if necessary containers exist on the page
    const isConceptsPage = conceptsView && skillsView && conceptContentArea && playerArea && showSkillsBtn && showConceptsBtn;
    if (!isConceptsPage) {
        // console.log("DEBUG: Not the Foundations View page, skipping Foundations JS setup.");
        return; // Don't run any of this script if the core elements aren't found
    }
    console.log("DEBUG: Foundations View page detected. Initializing JS.");


    // --- Data ---
    const concepts = [
        { name: "Form", character: "Formius the Structurer", definition: "Refers to a structured interface or document used to collect, display, or process data from users. It serves as a bridge between the user and the system, enabling interaction through input fields, buttons, checkboxes, radio buttons, dropdowns, and other controls. Forms are fundamental in web development, software applications, and database management systems.", personification: "From the digital realm, Formius uses his enchanted feather to craft clear, interactive portals between users and technology. He turns abstract ideas into accessible forms, making complex systems easy to navigate.", img: "Form.png" },
        { name: "Adaptation", character: "Adaptus the Evolving", definition: "The process of refining solutions through repeated cycles of development and testing, enabling improvement and efficiency in algorithms, programming, and digital system design.", personification: "Adaptus embodies change and steady improvement. With human insight fused with mechanical precision, he refines challenges into better solutions through constant evolution.", img: "Adaptation.png" },
        { name: "Function", character: "Functia the Purposeful", definition: "The rationale behind designing and implementing digital systems or writing code, ensuring solutions align with user needs and address specific challenges effectively.", personification: "Guiding the way through the digital wilds, Functia charts every step with clear intent. Her decisions ensure that every code sequence meets real needs and achieves practical goals.", img: "Function.png" },
        { name: "Logic", character: "Logos the Wise", definition: "The principles of reasoning used in algorithms and programming, forming the basis for creating reliable, efficient digital solutions.", personification: "In the quiet hours of thought, Logos unravels the hidden patterns behind problems. His clear and steady reasoning transforms complex puzzles into simple, reliable truths.", img: "Logic.png" },
        { name: "Procedure", character: "Ordo Whiskerquill", definition: "A sequence of steps or instructions for performing tasks, critical in programming for creating structured and organized code.", personification: "Ordo is the keeper of order, carefully noting each step required to complete a task. His disciplined approach ensures that every instruction is followed with precision.", img: "Procedure.png" },
        { name: "Process", character: "Proceus the Steadfast", definition: "A program that is actively running on a computer. It carries out tasks by following a set of instructions, using the computer's memory and resources while it runs.", personification: "On the front lines of active tasks, Proceus leads operations with unwavering strength. He ensures that every procedure runs smoothly and reliably, powering forward with determined precision.", img: "Process.png" },
        { name: "Data", character: "Daton Cipherclad", definition: "Raw information in various forms (such as numbers, text, images) that can be collected, stored, and processed to produce meaningful outputs.", personification: "Daton gathers raw information and turns it into valuable insight. Merging human intuition with mechanical analysis, he reveals the stories hidden within streams of data.", img: "Data.png" },
        { name: "Innovation", character: "Innovus Sparkwhistle", definition: "The creation and implementation of new ideas, products, or techniques in technology, driving advancements and problem-solving in Computer Science.", personification: "Ever curious and daring, Innovus experiments with new ideas to break boundaries. His fresh perspective ignites creative breakthroughs that reshape the digital landscape.", img: "Innovation.png" }
    ];

    const skillDescriptions = {
        'Programming': { title: 'Programming', description: 'Developing the ability to design, write, test, and refine code to solve tasks or create systems, integrating planning and structured design to ensure efficiency and clarity.' },
        'DataHandling': { title: 'Data Handling', description: 'Learning to collect, organise, analyse, and interpret data, presenting findings in meaningful ways to inform decision-making and problem-solving.' },
        'DigitalLiteracy': { title: 'Digital Literacy', description: 'Building skills to navigate, evaluate, and create digital content responsibly, fostering effective communication, ethical digital practices, and a strong foundation in online safety.' },
        'ComputationalThinking': { title: 'Computational Thinking', description: 'Approaching problems using algorithmic and logical reasoning, breaking down tasks into manageable parts, iterating on solutions, and applying abstraction and pattern recognition to develop creative and efficient outcomes.' },
        'Creativity': { title: 'Creativity', description: 'Exploring how creativity intersects with digital technologies, encouraging innovative thinking in coding, problem-solving, and content creation.' }
    };

    // --- State ---
    let currentConceptIndex = 0;
    let isTransitioning = false;
    let playerImageElement; // Will hold the <img> element for skills view

    // --- Paths (Determine dynamically based on expected location of Foundations.html) ---
    // Get the base path using the same method as other scripts
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
            // Regular path calculation
            const depth = path.split('/').filter(p => p && !p.endsWith('.html')).length;
            if (path === '/' || path.endsWith('/index.html')) {
                return './'; // Root or index.html at root
            } else {
                return '../'.repeat(depth);
            }
        }
    }
    
    // Calculate the base path 
    const basePath = getBasePath();
    console.log("DEBUG Foundations: Using base path: " + basePath);
    
    const imagePathBase = `${basePath}assets/images/concepts/`;
    const skillImageBase = `${basePath}assets/images/Skills/`;
    const placeholderImagePath = `${basePath}assets/images/placeholder_concept.png`; // Placeholder if concept image fails
    const defaultSkillImage = "Hero.png";

    // --- Functions ---

    // Function to switch between Concepts and Skills views
    function toggleView(viewToShow) {
        if (viewToShow === 'skills') {
            conceptsView.style.display = 'none';
            skillsView.style.display = 'flex'; // Use flex for skills view layout
             // Ensure player area is initialized when switching TO skills view
             if (!playerImageElement) {
                 initializePlayerArea();
                 // Re-attach skill button listeners after initializing player area
                 attachSkillButtonListeners();
            }
        } else { // Switching to concepts
            skillsView.style.display = 'none';
            conceptsView.style.display = 'flex'; // Use flex for concepts view layout
             // Ensure slides are initialized and first slide is active
             if (conceptContentArea.children.length === 0) {
                 createConceptSlides();
             }
            setActiveSlide(currentConceptIndex); // Ensure correct slide is visible
        }
    }

    // --- Concepts View Functions ---

    function createNavArrows() {
        if (!conceptContentArea) return;
        // Remove any existing arrows first
        conceptContentArea.querySelectorAll('.nav-arrow').forEach(arrow => arrow.remove());

        const leftArrow = document.createElement('div');
        leftArrow.classList.add('nav-arrow', 'left-arrow');
        leftArrow.innerHTML = '◀'; // Use HTML entity
        leftArrow.setAttribute('aria-label', 'Previous Concept');
        leftArrow.addEventListener('click', () => changeConcept(-1));

        const rightArrow = document.createElement('div');
        rightArrow.classList.add('nav-arrow', 'right-arrow');
        rightArrow.innerHTML = '▶'; // Use HTML entity
        rightArrow.setAttribute('aria-label', 'Next Concept');
        rightArrow.addEventListener('click', () => changeConcept(1));

        // Append arrows to the display area, not the content area, for better positioning
        conceptDisplayArea.appendChild(leftArrow);
        conceptDisplayArea.appendChild(rightArrow);
    }

    function createConceptSlides() {
        if (!conceptContentArea) { console.error("Concept content area not found."); return; }
        conceptContentArea.innerHTML = ''; // Clear existing slides

        concepts.forEach((concept, index) => {
            const slide = document.createElement('div');
            slide.classList.add('concept-slide');
            slide.dataset.index = index;
            slide.style.opacity = '0'; // Start hidden for fade-in
            slide.style.display = 'none'; // Use display none initially

            // Left Column (Image)
            const leftCol = document.createElement('div');
            leftCol.classList.add('slide-column', 'left');
            const img = document.createElement('img');
            img.classList.add('character-image');
            img.src = imagePathBase + concept.img;
            img.alt = concept.character || concept.name;
            img.onerror = function() { this.src = placeholderImagePath; this.onerror = null; }; // Fallback image
            leftCol.appendChild(img);

            // Right Column (Text)
            const rightCol = document.createElement('div');
            rightCol.classList.add('slide-column', 'right');
            const container = document.createElement('div');
            container.classList.add('concept-container'); // Container for scrollable text

            // Character Section
            const characterSection = document.createElement('div');
            characterSection.classList.add('character-section');
            const charName = document.createElement('div');
            charName.classList.add('character-name');
            charName.textContent = concept.character;
            const charLore = document.createElement('div');
            charLore.classList.add('character-lore');
            charLore.textContent = concept.personification;
            characterSection.appendChild(charName);
            characterSection.appendChild(charLore);

            // Concept Section
            const conceptSection = document.createElement('div');
            conceptSection.classList.add('concept-section');
            const conceptName = document.createElement('div');
            conceptName.classList.add('concept-name');
            conceptName.textContent = `Concept: ${concept.name}`;
            const conceptDefinition = document.createElement('div');
            conceptDefinition.classList.add('concept-definition');
            conceptDefinition.textContent = concept.definition;
            conceptSection.appendChild(conceptName);
            conceptSection.appendChild(conceptDefinition);

            container.appendChild(characterSection);
            container.appendChild(conceptSection);
            rightCol.appendChild(container);

            slide.appendChild(leftCol);
            slide.appendChild(rightCol);
            conceptContentArea.appendChild(slide);
        });

        createNavArrows(); // Add arrows after slides are created
        // console.log('DEBUG: Concept slides created:', conceptContentArea.querySelectorAll('.concept-slide').length);
    }

    function setActiveSlide(index) {
        if (!conceptContentArea) return;
        const slides = conceptContentArea.querySelectorAll('.concept-slide');
        if (index < 0 || index >= slides.length) {
            console.error('Invalid slide index:', index);
            return;
        }

        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = 'flex'; // Make it visible for transition
                // Force reflow before adding opacity class for transition
                void slide.offsetWidth;
                slide.style.opacity = '1';
            } else {
                slide.style.opacity = '0';
                // Set display to none after transition (optional, improves performance slightly)
                 setTimeout(() => { if(slide.style.opacity === '0') slide.style.display = 'none'; }, 400); // Match CSS transition time
            }
        });
        // console.log('DEBUG: Active slide set to index:', index);
        currentConceptIndex = index;
    }

    function changeConcept(direction) {
        if (isTransitioning || !conceptContentArea) return;
        isTransitioning = true;
        const slides = conceptContentArea.querySelectorAll('.concept-slide');
        if (slides.length === 0) { isTransitioning = false; return; }

        const nextIndex = (currentConceptIndex + direction + slides.length) % slides.length;
        const currentSlide = slides[currentConceptIndex];
        const nextSlide = slides[nextIndex];

        // Start fade-out of current slide
        if (currentSlide) {
            currentSlide.style.opacity = '0';
        }

        // After fade-out, switch display and fade-in next slide
        setTimeout(() => {
            if (currentSlide) currentSlide.style.display = 'none';
            if (nextSlide) {
                nextSlide.style.display = 'flex';
                // Force reflow
                void nextSlide.offsetWidth;
                nextSlide.style.opacity = '1';
                currentConceptIndex = nextIndex;
            }
            isTransitioning = false;
        }, 400); // Match CSS transition time
    }


    // --- Skills View Functions ---

     function initializePlayerArea() {
        if (!playerArea) { console.error("Player area not found."); return; }
        playerArea.innerHTML = ''; // Clear previous content

        // Character Side
        const characterSide = document.createElement('div');
        characterSide.classList.add('character-side');
        playerImageElement = document.createElement('img'); // Assign to global variable
        playerImageElement.id = 'player-skill-image';
        playerImageElement.src = skillImageBase + defaultSkillImage;
        playerImageElement.alt = 'Player Character';
        characterSide.appendChild(playerImageElement);

        // Magical Overlay for Transitions
        const overlay = document.createElement('div');
        overlay.classList.add('magical-overlay');
        characterSide.appendChild(overlay); // Append overlay inside character side

        // Description Side (initially hidden, maybe)
        const descriptionSide = document.createElement('div');
        descriptionSide.classList.add('description-side'); // Starts hidden via CSS (opacity 0, transform)
        descriptionSide.innerHTML = `<div class="skill-title"></div><div class="skill-description"></div>`;

        // Hero Quote (initially visible)
        const heroQuote = document.createElement('div');
        heroQuote.classList.add('hero-quote');
        heroQuote.innerHTML = `
            <div class="title">Path to Mastery</div>
            <p>Mastering Computer Science begins with building five core skills.</p>
        `;

        playerArea.appendChild(characterSide);
        playerArea.appendChild(descriptionSide); // Add description side
        playerArea.appendChild(heroQuote);      // Add hero quote side
    }

     function createMagicalOverlay() {
        const characterSide = playerArea?.querySelector('.character-side');
        if (!characterSide) return null;
        let overlay = characterSide.querySelector('.magical-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.classList.add('magical-overlay');
            characterSide.appendChild(overlay);
        }
        return overlay;
     }

    function transitionToNewImage(newSrc, newAlt) {
        const descriptionSide = playerArea?.querySelector('.description-side');
        const heroQuote = playerArea?.querySelector('.hero-quote');
        const overlayElement = playerArea?.querySelector('.magical-overlay') || createMagicalOverlay();

        if (!playerImageElement || !descriptionSide || !heroQuote || !overlayElement) {
            console.error("Missing elements for skill transition.");
            return;
        }

        // Extract skill name from alt text (adjust regex if alt text format changes)
        const skillMatch = newAlt.match(/demonstrating ([\w\s]+)$/);
        const skillKey = skillMatch ? skillMatch[1].replace(/\s+/g, '') : null; // e.g., "DataHandling"
        const skillInfo = skillKey ? skillDescriptions[skillKey] : null;

        // Start transition: fade out image, show overlay, hide quote, ensure description is hidden
        playerImageElement.classList.add('transitioning');
        overlayElement.classList.add('active');
        descriptionSide.classList.remove('active'); // Ensure description is reset
        heroQuote.classList.add('hidden'); // Hide the default quote

        // Wait for fade out to start, then change src
        setTimeout(() => {
            playerImageElement.src = newSrc;
            playerImageElement.alt = newAlt;

             // Check if image actually loads
             const tempImg = new Image();
             tempImg.onload = () => {
                // console.log("DEBUG: New skill image loaded:", newSrc);
                // Update description *after* confirming image load
                if (skillInfo) {
                    descriptionSide.querySelector('.skill-title').textContent = skillInfo.title;
                    descriptionSide.querySelector('.skill-description').textContent = skillInfo.description;
                    // Add 'active' class slightly after starting fade-in to ensure it's visible
                    setTimeout(() => descriptionSide.classList.add('active'), 50);
                } else {
                    // If no skill info (e.g., back to default), show the hero quote again
                     heroQuote.classList.remove('hidden');
                }

                 // After image is likely loaded and description updated, fade image back in and hide overlay
                 setTimeout(() => {
                     playerImageElement.classList.remove('transitioning');
                     overlayElement.classList.remove('active');
                 }, 50); // Short delay after setting src
             };
             tempImg.onerror = () => {
                 console.error("Failed to load new image:", newSrc);
                 // Still need to fade back in, even if it's the broken image icon or old image
                 playerImageElement.classList.remove('transitioning');
                 overlayElement.classList.remove('active');
                 // Show hero quote as fallback
                 heroQuote.classList.remove('hidden');
             };
             tempImg.src = newSrc; // Start loading the image

        }, 300); // Corresponds to transition duration for fade-out/overlay
    }

    function showSkill(button) {
        if (!playerImageElement) { // Ensure player area is initialized
             console.warn("Player image element not ready during showSkill call.");
             initializePlayerArea();
             if (!playerImageElement) return; // If still not ready, exit
         }

        const currentlyActive = skillsView.querySelector('.skill-button.active');
        const skillName = button.dataset.skill; // e.g., "Programming"
        const skillImageMap = { // Map dataset value to filename
             'Programming': 'Coding.png',
             'DataHandling': 'Data_Handling.png',
             'DigitalLiteracy': 'Digital_Literacy.png',
             'ComputationalThinking': 'Computational_Thinking.png',
             'Creativity': 'Creativity.png'
         };
        const imageName = skillImageMap[skillName] || defaultSkillImage; // Fallback to default
        const imagePath = skillImageBase + imageName;
        const altText = imageName === defaultSkillImage ? "Player Character" : `Player Character demonstrating ${skillName}`;

        // Deselecting the current skill
        if (currentlyActive === button) {
            button.classList.remove('active');
            transitionToNewImage(skillImageBase + defaultSkillImage, "Player Character");
        }
        // Selecting a new skill
        else {
            if (currentlyActive) currentlyActive.classList.remove('active');
            button.classList.add('active');
            transitionToNewImage(imagePath, altText);
        }
    }

    // --- Initialization ---

    function attachSkillButtonListeners(){
        const skillButtons = skillsView.querySelectorAll('.skill-button');
        skillButtons.forEach(button => {
            // Remove old listener if exists to prevent duplicates
            // Note: A more robust way is cloning and replacing the node, but this works too
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.addEventListener('click', () => showSkill(newButton));
        });
    }

    function initialize() {
        // Setup Concepts View
        createConceptSlides(); // Create slides structure
        setActiveSlide(0);     // Show the first slide

        // Setup Skills View
        initializePlayerArea(); // Create the initial skills view structure
        attachSkillButtonListeners(); // Attach listeners to skill buttons

        // Set Initial View State
        conceptsView.style.display = 'flex'; // Show concepts by default
        skillsView.style.display = 'none';  // Hide skills

        // Setup View Toggle Buttons
        showSkillsBtn.addEventListener('click', () => toggleView('skills'));
        showConceptsBtn.addEventListener('click', () => toggleView('concepts'));

        console.log("DEBUG: Foundations view initialized.");
    }

    // Run initialization
    initialize();

}); // End DOMContentLoaded