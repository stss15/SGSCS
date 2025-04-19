document.addEventListener('DOMContentLoaded', function() {
    // Sound Elements
    const startSound = document.getElementById('start-sound');
    const clickSound = document.getElementById('click-sound');

    // UI Elements
    const startButton = document.querySelector('.start-button');
    const logo = document.querySelector('.logo');
    const zeldaMenu = document.querySelector('.zelda-menu');
    const selectorArrow = document.querySelector('.selector-arrow');
    const ks3Button = document.getElementById('ks3-button');
    const ks3Submenu = document.getElementById('ks3-submenu');
    const yearButtons = ks3Submenu ? ks3Submenu.querySelectorAll('.year-button') : []; // Check if submenu exists
    const igcseButton = document.getElementById('igcse-button');
    const ibButton = document.getElementById('ib-button');
    const backButton = document.querySelector('.back-button');
    const ks3MenuItem = document.querySelector('.ks3-menu-item'); // The wrapper div

    // Check if essential elements exist
    if (!startButton || !logo || !zeldaMenu || !selectorArrow || !ks3MenuItem || !igcseButton || !ibButton || !backButton) {
        console.error("Index animations: One or more essential elements not found. Aborting setup.");
        return;
    }
    if (!ks3Button) {
        console.warn("Index animations: KS3 button not found.");
        // KS3 functionality might be broken
    }
     if (!ks3Submenu || yearButtons.length === 0) {
        console.warn("Index animations: KS3 submenu or year buttons not found.");
        // Submenu functionality might be broken
    }


    // Group ALL main menu items the arrow should interact with
    const arrowTargetElements = [
         ks3MenuItem, // Target the wrapper div for positioning
         igcseButton,
         ibButton,
         backButton
     ];
    // We still need the ks3Button reference for clicking/specific targeting if it exists
    const buttonElementsForHover = [ks3Button, igcseButton, ibButton, backButton].filter(el => el); // Filter out null if ks3Button is missing

    let currentArrowTargetElement = ks3MenuItem; // Default to KS3 menu item

    // Initial positioning of the arrow at KS3
    setTimeout(() => {
        if (zeldaMenu && zeldaMenu.classList.contains('visible')) {
            positionArrowAt(currentArrowTargetElement);
        }
    }, 50);

    // --- Helper Functions ---

    function playSoundEffect(element) {
         if (!element) return;
         const soundEffect = document.createElement('div');
         const elementRect = element.getBoundingClientRect();
         soundEffect.classList.add('sound-effect');
         // Position relative to viewport initially
         soundEffect.style.position = 'fixed';
         soundEffect.style.left = `${elementRect.left + elementRect.width / 2 - 50}px`;
         soundEffect.style.top = `${elementRect.top + elementRect.height / 2 - 50}px`;
         document.body.appendChild(soundEffect);
         soundEffect.addEventListener('animationend', () => soundEffect.remove());
    }

    function playSound(soundElement) {
        if (soundElement && typeof soundElement.play === 'function') {
             soundElement.currentTime = 0;
             soundElement.play().catch(e => console.error("Sound play failed:", e));
        } else {
            console.warn("Attempted to play an invalid sound element.");
        }
    }

    function positionArrowAt(targetElement) {
        // Use the actual button for height calculation, but position relative to its main menu item
        let buttonForHeight = targetElement;
        let elementForPosition = targetElement;

        // Special handling for KS3
        if (targetElement === ks3Button || targetElement === ks3MenuItem) {
            // Always use ks3Button for height calculation
            buttonForHeight = ks3Button;
            // Use ks3MenuItem for positioning when submenu is closed
            elementForPosition = ks3Submenu && ks3Submenu.classList.contains('open') ? ks3Button : ks3MenuItem;
        }

        if (!elementForPosition || !buttonForHeight || !zeldaMenu || !selectorArrow || !zeldaMenu.classList.contains('visible')) {
            if(selectorArrow) selectorArrow.classList.remove('selector-active');
            return;
        }

        const buttonRect = buttonForHeight.getBoundingClientRect();
        const posElementRect = elementForPosition.getBoundingClientRect();
        const menuRect = zeldaMenu.getBoundingClientRect();

        // Only position if the menu and the target elements are actually visible and rendered
        if (menuRect.width > 0 && menuRect.height > 0 && posElementRect.width > 0 && posElementRect.height > 0) {
            // Calculate top relative to the zeldaMenu container
            let topPosition = posElementRect.top - menuRect.top + (buttonRect.height / 2) - (selectorArrow.offsetHeight / 2);

            selectorArrow.style.top = `${topPosition}px`;
            // Calculate left position relative to the zeldaMenu container
            let leftPosition = posElementRect.left - menuRect.left - selectorArrow.offsetWidth - 10; // 10px gap

            selectorArrow.style.left = `${leftPosition}px`;
            selectorArrow.classList.add('selector-active');

            // Only update the current target if not in a temporary state (like hovering)
            if (!ks3Submenu || !ks3Submenu.classList.contains('open')) {
                currentArrowTargetElement = targetElement === ks3Button ? ks3MenuItem : targetElement;
            }
        } else {
            selectorArrow.classList.remove('selector-active');
        }
    }


    // --- Event Listeners Setup ---

    // Start Button Click
    startButton.addEventListener('click', function() {
        playSound(startSound);
        playSoundEffect(this);

        // Use CSS classes for transitions
        logo.classList.add('fade-transition');
        startButton.classList.add('fade-transition');

        setTimeout(() => {
            logo.style.display = 'none';
            startButton.style.display = 'none';
            logo.classList.remove('fade-transition'); // Clean up class
            startButton.classList.remove('fade-transition'); // Clean up class

            zeldaMenu.classList.add('visible'); // This class should handle the fade/scale in via CSS
            currentArrowTargetElement = ks3MenuItem; // Reset to KS3 menu item
            // Delay positioning slightly to allow menu layout to settle
            setTimeout(() => positionArrowAt(currentArrowTargetElement), 50);
        }, 800); // Match animation duration in CSS
    });

    // KS3 Button Click (Toggle Submenu & Arrow Logic)
    if (ks3Button && ks3Submenu) {
        ks3Button.addEventListener('click', function(e) {
            e.preventDefault();
            playSound(clickSound);
            playSoundEffect(this);

            const isOpening = !ks3Submenu.classList.contains('open');
            ks3Submenu.classList.toggle('open');
            if (zeldaMenu) zeldaMenu.classList.toggle('ks3-submenu-open', isOpening);

            // Position arrow based on submenu state
            positionArrowAt(isOpening ? ks3Button : ks3MenuItem);
        });
    }

    // Year 7/8/9 Button Click
    yearButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent immediate navigation
            const href = this.getAttribute('href');

            playSound(clickSound);
            playSoundEffect(this);

            // Fade out effect using class
            if(zeldaMenu) zeldaMenu.classList.add('fade-transition');
            if(logo) logo.classList.add('fade-transition'); // Also fade logo if it was somehow visible

            // Navigate after animation
            setTimeout(() => {
                if (href && href !== '#') {
                    window.location.href = href;
                } else {
                    console.log('Page coming soon...');
                    // Reset the animation if no valid href
                    if(zeldaMenu) zeldaMenu.classList.remove('fade-transition');
                    if(logo) logo.classList.remove('fade-transition');
                }
            }, 800); // Match animation duration
        });
    });

    // Back Button Click
    backButton.addEventListener('click', function() {
        playSound(clickSound);
        playSoundEffect(this);

        // Close submenu if open
        if (ks3Submenu && ks3Submenu.classList.contains('open')) {
            ks3Submenu.classList.remove('open');
            if(zeldaMenu) zeldaMenu.classList.remove('ks3-submenu-open');
        }

        // Fade out menu using class
        if(zeldaMenu) zeldaMenu.classList.add('fade-transition');
        if(selectorArrow) selectorArrow.classList.remove('selector-active'); // Hide arrow immediately

        setTimeout(() => {
            if(zeldaMenu) {
                zeldaMenu.classList.remove('visible');
                zeldaMenu.classList.remove('fade-transition'); // Clean up class
            }
            if(logo) logo.style.display = 'block';
            if(startButton) startButton.style.display = 'inline-block';

            // Use classes to fade back in
            setTimeout(() => {
                 if(logo) logo.classList.remove('fade-transition'); // Ensure fade-out class is removed
                 if(startButton) startButton.classList.remove('fade-transition');
            }, 50); // Small delay before making visible

        }, 800); // Match animation duration
    });

    // Mouse Hover for ALL main buttons
    buttonElementsForHover.forEach(button => {
         button.addEventListener('mouseenter', () => {
            // If KS3 submenu is open, only allow hover effect on KS3 button itself
             if (ks3Submenu && ks3Submenu.classList.contains('open')) {
                 if (button === ks3Button) {
                     positionArrowAt(ks3Button);
                 }
             } else {
                 // For KS3 button, use the menu item wrapper for positioning
                 if (button === ks3Button) {
                     positionArrowAt(ks3MenuItem);
                 } else {
                     positionArrowAt(button);
                 }
             }
         });
    });

    // Reset to KS3 when mouse leaves the menu container
    if(zeldaMenu) {
        zeldaMenu.addEventListener('mouseleave', () => {
             if (!ks3Submenu || !ks3Submenu.classList.contains('open')) {
                // Always reset to KS3 menu item when mouse leaves
                currentArrowTargetElement = ks3MenuItem;
                positionArrowAt(ks3MenuItem);
            }
        });
    }

    // IGCSE / IB Button Click (Example - assuming they navigate or show coming soon)
    [igcseButton, ibButton].forEach(button => {
         if (!button) return; // Skip if button doesn't exist
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            playSound(clickSound);
            playSoundEffect(this);

            // Fade out effect
            if(zeldaMenu) zeldaMenu.classList.add('fade-transition');
            if(logo) logo.classList.add('fade-transition');


            setTimeout(() => {
                if (href && href !== '#') {
                    window.location.href = href; // Navigate if valid href
                } else {
                    console.log(`${this.id} page coming soon...`);
                    // Reset the animation if no valid href
                     if(zeldaMenu) zeldaMenu.classList.remove('fade-transition');
                     if(logo) logo.classList.remove('fade-transition');
                }
            }, 800); // Match animation duration
        });
    });


    // --- Window Resize ---
    window.addEventListener('resize', function() {
        if (zeldaMenu && zeldaMenu.classList.contains('visible')) {
             let targetForReposition = currentArrowTargetElement;
             if (ks3Submenu && ks3Submenu.classList.contains('open') && ks3Button) {
                 targetForReposition = ks3Button; // Keep arrow on KS3 if submenu is open
             }
             // Debounce or throttle this if it causes performance issues
             positionArrowAt(targetForReposition);
        }
    });

    // --- Particles Background ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) { // Check if canvas exists
        const ctx = canvas.getContext('2d');

        function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let mouse = { x: null, y: null, radius: Math.min(120, window.innerWidth / 8) }; // Adjust radius based on screen size
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.radius = Math.min(120, window.innerWidth / 8); });
        window.addEventListener('touchmove', e => { if (e.touches.length > 0) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.radius = Math.min(120, window.innerWidth / 8); } }, { passive: true });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
        window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

        // Adjust particle count based on screen size
        const particleCount = Math.max(30, Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000)));
        const particles = [];
        const colors = ['#5C85D0', '#F5D06B', '#2E59A0', '#FFF1B5']; // KS3/Zelda inspired

        class Particle {
             constructor() { this.reset(); this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; }
            reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 3 + 1.5; // Slightly smaller base size
                 this.originalSize = this.size; this.speedX = (Math.random() - 0.5) * 1; // Slower base speed
                 this.speedY = (Math.random() - 0.5) * 1; this.color = colors[Math.floor(Math.random() * colors.length)]; this.opacity = Math.random() * 0.3 + 0.4; // Base opacity slightly lower
                 this.lifeTime = 0; this.maxLife = Math.random() * 500 + 300; // Slightly longer life
                 this.pulseSpeed = Math.random() * 0.015 + 0.005; // Slower pulse
                 this.pulseAmount = Math.random() * 0.4 + 0.3; // Less intense pulse
            }
            update() { this.x += this.speedX; this.y += this.speedY; this.lifeTime++; this.size = this.originalSize + Math.sin(this.lifeTime * this.pulseSpeed) * this.pulseAmount; // Pulsing size
                 // Interaction with mouse
                 if (mouse.x !== null) { const dx = this.x - mouse.x; const dy = this.y - mouse.y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < mouse.radius) { const force = (mouse.radius - dist) / mouse.radius; const angle = Math.atan2(dy, dx); this.speedX += Math.cos(angle) * force * 0.6; this.speedY += Math.sin(angle) * force * 0.6; // Reduced force
                     const maxSpeed = 3; const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY); if (currentSpeed > maxSpeed) { this.speedX = (this.speedX / currentSpeed) * maxSpeed; this.speedY = (this.speedY / currentSpeed) * maxSpeed; } } } // Apply friction/damping
                 this.speedX *= 0.99; this.speedY *= 0.99; // Slower damping
                 // Reset particle if it goes way off screen or exceeds lifetime
                 if (this.x < -this.size - 100 || this.x > canvas.width + this.size + 100 || this.y < -this.size - 100 || this.y > canvas.height + this.size + 100 || this.lifeTime > this.maxLife) { this.reset(); } }
            draw(ctx) {
                ctx.beginPath();
                // Ensure size is not negative
                const drawSize = Math.max(0, this.size);
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, drawSize);
                try {
                    // Define gradient stops
                    gradient.addColorStop(0, this.color);        // Center color
                    gradient.addColorStop(0.7, this.color);      // Maintain color further out
                    gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Fade to transparent at the edge

                    ctx.fillStyle = gradient;
                    ctx.globalAlpha = this.opacity; // Apply particle opacity
                    ctx.arc(this.x, this.y, drawSize, 0, Math.PI * 2);
                    ctx.fill();
                } catch (e) {
                    // Fallback if gradient fails (e.g., size is exactly 0)
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = this.opacity;
                    ctx.arc(this.x, this.y, drawSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                 ctx.globalAlpha = 1; // Reset global alpha
            }
        }


        function initParticles() { particles.length = 0; // Clear existing particles
            for (let i = 0; i < particleCount; i++) particles.push(new Particle()); }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw background gradient
            const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, 'rgba(10, 30, 60, 1)'); // Solid color top
            bgGradient.addColorStop(1, 'rgba(5, 15, 30, 1)');  // Solid color bottom
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const connectionDistance = Math.min(100, canvas.width / 12); // Shorter connection distance

            particles.forEach((particle, i) => {
                particle.update();
                particle.draw(ctx);

                // Draw connection lines
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        const lineOpacity = 0.3 * (1 - distance / connectionDistance); // Fainter lines
                        ctx.strokeStyle = particle.color; // Use particle's color for the line
                        ctx.globalAlpha = lineOpacity * particle.opacity * particles[j].opacity; // Factor in particle opacity
                        ctx.lineWidth = 0.6; // Thinner lines
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            });
            ctx.globalAlpha = 1; // Reset global alpha
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
        window.addEventListener('resize', () => {
             resizeCanvas();
             initParticles(); // Reinitialize particles on resize
        });
    } else {
         console.warn("Particles canvas not found.");
    }
});