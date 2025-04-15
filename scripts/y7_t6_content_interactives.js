/*
 * Year 7 Term 6: Streamlined Interactive Script
 * Focus: Core binary, hexadecimal, and ASCII interactives.
 * Based on the original HTML structure ( [oai_citation:2‡Y7_T6_Content.html](file-service://file-UVLb3fG45M8VLMjbB8KGpx)) and JS file ( [oai_citation:3‡y7_t6_content_interactives.js](file-service://file-LWWKuwZE1dP9VvHJchkpEa)).
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all interactives on page load:
    document.querySelectorAll('.light-switch-container').forEach(widget => initLightSwitch(widget));
    document.querySelectorAll('.binary-interactive-converter').forEach(widget => initConverter(widget));
    document.querySelectorAll('.interactive-color-picker').forEach(widget => initColorPicker(widget));
    document.querySelectorAll('.interactive-binary-adder').forEach(widget => initBinaryAdder(widget));
    document.querySelectorAll('.overflow-simulator').forEach(widget => initOverflowSim(widget));
    document.querySelectorAll('.binary-to-char-converter').forEach(widget => initBinaryToChar(widget));

    // Adjust accordion heights on load and window resize:
    adjustAccordionHeights();
    window.addEventListener('resize', adjustAccordionHeights);
});

/* ----------------- Accordion Height Adjustment ----------------- */
// If an accordion section is expanded, adjust its max-height to the content height.
function adjustAccordionHeights() {
    document.querySelectorAll('.ks3-accordion-content.expanded').forEach(function (content) {
        content.style.maxHeight = content.scrollHeight + 'px';
    });
}

/* ----------------- Lesson 0: Light Switch ----------------- */
// Initializes the light switch interactive
function initLightSwitch(containerElement) {
    const button = containerElement.querySelector('.light-switch');
    if (button) {
        button.onclick = () => toggleLight(button); // Attach event listener
        // Initial state check? (Optional, based on HTML)
        const valueSpan = containerElement.querySelector('.switch-binary-value span');
        if (valueSpan) {
             valueSpan.textContent = button.classList.contains('on') ? '1' : '0';
        }
    } else {
        console.error('Light switch button not found within container:', containerElement);
    }
}

// Toggles a light switch button to simulate binary 0/1.
function toggleLight(button) { // Keep button param for onclick
    const isOn = button.classList.toggle('on');
    button.setAttribute('aria-pressed', isOn);
    const valueSpan = button.closest('.light-switch-container').querySelector('.switch-binary-value span');
    if (valueSpan) {
        valueSpan.textContent = isOn ? '1' : '0';
    }
}

/* ----------------- Lessons 0 & 1: Interactive Binary Converter ----------------- */
// Initializes a binary converter widget by ensuring its initial decimal value is set.
function initConverter(containerElement) {
    if (!containerElement) return;
    
    // Attach event listeners to clickable place value buttons
    const placeValueButtons = containerElement.querySelectorAll('.binary-place-values.clickable .place-value-button');
    placeValueButtons.forEach((button, index) => {
        // Assuming index corresponds to the data-index attribute in the digit display
        const digitIndex = index; 
        button.onclick = () => toggleBinaryDigit(button, digitIndex, containerElement);
    });

    // Attach event listeners to toggleable binary digits
    const digitToggles = containerElement.querySelectorAll('.binary-digits-row .binary-digit-toggle');
    digitToggles.forEach(toggle => {
        const index = parseInt(toggle.getAttribute('data-index'));
        toggle.onclick = () => toggleBinaryDigit(toggle, index, containerElement); // Pass toggle itself too
    });

    updateInteractiveDecimalValue(containerElement);
}

// Toggles a binary digit (0 or 1) when a place value button or digit toggle is clicked.
function toggleBinaryDigit(clickedElement, index, containerElement) {
    if (!containerElement) return;
    // Find the digit display using the index relative to the container
    const digitDisplay = containerElement.querySelector(`.binary-digits-row .binary-digit-toggle[data-index="${index}"]`);
    
    if (digitDisplay) {
        digitDisplay.textContent = digitDisplay.textContent === '0' ? '1' : '0';
        digitDisplay.classList.toggle('on');
        updateInteractiveDecimalValue(containerElement);
    } else {
        console.warn("Could not find corresponding digit display for index", index, "in", containerElement);
    }
}

// Reads the binary digits from a widget and updates the displayed decimal value.
function updateInteractiveDecimalValue(containerElement) {
    const digitToggles = containerElement.querySelectorAll('.binary-digits-row .binary-digit-toggle');
    const decimalDisplay = containerElement.querySelector('.interactiveDecimalValueDisplay');
    if (!decimalDisplay) return;

    let decimalValue = 0;
    // Place values: assume the HTML order reflects highest to lowest (index 0 = 128, index 7 = 1)
    const placeValues = [128, 64, 32, 16, 8, 4, 2, 1];
    digitToggles.forEach(function (toggle) {
        const index = parseInt(toggle.getAttribute('data-index'));
        if (toggle.classList.contains('on')) {
            decimalValue += placeValues[index];
        }
    });
    decimalDisplay.textContent = decimalValue;
}

/* ----------------- Reveal Challenge Answer ----------------- */
// Initializes reveal answer functionality for all challenge boxes within the page or a specific container
function initRevealAnswer(container = document) { // Default to document
    container.querySelectorAll('.interactive-challenge .challenge-answer').forEach(element => {
        element.onclick = () => revealAnswer(element);
    });
}

// Toggles visibility for the challenge answer.
function revealAnswer(element) {
    const answerDiv = element.querySelector('.answer-hidden');
    if (!answerDiv) return;
    element.classList.toggle('revealed');

    // Adjust the accordion height if the answer is revealed.
    const accordionContent = element.closest('.ks3-accordion-content.expanded');
    if (accordionContent) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
    }
}

/* ----------------- Lesson 2: Interactive Color Picker ----------------- */
// Initializes the color picker widget.
function initColorPicker(containerElement) {
    if (!containerElement) return;
    // Attach listeners to sliders
    const sliders = containerElement.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.oninput = () => updateColorPicker(containerElement);
    });
    // Attach listener to copy button
    const copyButton = containerElement.querySelector('.hex-code'); // Using .hex-code span as the trigger
    if(copyButton) {
        copyButton.onclick = () => copyHexCode(copyButton);
    }
    updateColorPicker(containerElement); // Initial update
}

// Updates the color preview, RGB values, and derived Hex code.
function updateColorPicker(containerElement) {
    if (!containerElement) return;

    // Use querySelector relative to the containerElement
    const redSlider = containerElement.querySelector('input[id^="redSlider"]');
    const greenSlider = containerElement.querySelector('input[id^="greenSlider"]');
    const blueSlider = containerElement.querySelector('input[id^="blueSlider"]');

    const redValueSpan = containerElement.querySelector('span[id^="redValue"]');
    const greenValueSpan = containerElement.querySelector('span[id^="greenValue"]');
    const blueValueSpan = containerElement.querySelector('span[id^="blueValue"]');

    const redHexSpan = containerElement.querySelector('span[id^="redHex"]');
    const greenHexSpan = containerElement.querySelector('span[id^="greenHex"]');
    const blueHexSpan = containerElement.querySelector('span[id^="blueHex"]');

    const colorPreview = containerElement.querySelector('.color-preview');
    const hexCodeSpan = containerElement.querySelector('.hex-code, span[id^="hexCode"]');

    if (!redSlider || !greenSlider || !blueSlider || !redValueSpan || !greenValueSpan || !blueValueSpan || !redHexSpan || !greenHexSpan || !blueHexSpan || !colorPreview || !hexCodeSpan) {
        console.error('Color Picker: Missing elements in container:', containerElement);
        return;
    }

    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);

    redValueSpan.textContent = r;
    greenValueSpan.textContent = g;
    blueValueSpan.textContent = b;

    const rHex = r.toString(16).padStart(2, '0').toUpperCase();
    const gHex = g.toString(16).padStart(2, '0').toUpperCase();
    const bHex = b.toString(16).padStart(2, '0').toUpperCase();

    redHexSpan.textContent = rHex;
    greenHexSpan.textContent = gHex;
    blueHexSpan.textContent = bHex;

    const hexCode = `#${rHex}${gHex}${bHex}`;
    hexCodeSpan.textContent = hexCode;
    colorPreview.style.backgroundColor = hexCode;
}

// Function to copy hex code to clipboard
function copyHexCode(element) {
    const hexCode = element.textContent;
    navigator.clipboard.writeText(hexCode).then(() => {
        // Optional: Provide visual feedback (e.g., change text temporarily)
        const originalText = element.innerHTML; // Store original content (might include icon)
        element.innerHTML = 'Copied!';
        setTimeout(() => { element.innerHTML = originalText; }, 1500);
    }).catch(err => {
        console.error('Failed to copy hex code: ', err);
    });
}

/* ----------------- Lesson 3: Binary Adder ----------------- */
// Global state object remains, keys will now be WeakMap or similar if elements are passed directly,
// but for simplicity, let's use a generated ID if the element doesn't have one.
const adderState = {}; 
let adderCounter = 0; // Simple counter for generating unique IDs

// Initializes the binary adder interactive widget.
function initBinaryAdder(containerElement) {
    if (!containerElement) return;

    // Generate a unique key for the state map if the element lacks an ID
    const stateKey = containerElement.id || `adder-${adderCounter++}`;
    if (!containerElement.id) containerElement.dataset.adderKey = stateKey; // Store key on element if generated

    adderState[stateKey] = {
        currentColumn: 7,  
        carryBit: 0,
        numA: Array.from(containerElement.querySelectorAll('.num-a span')).map(span => parseInt(span.textContent)),
        numB: Array.from(containerElement.querySelectorAll('.num-b span')).map(span => parseInt(span.textContent)),
        result: Array(8).fill('?'),
        isComplete: false
    };
    setupAdderUI(containerElement); // Pass element directly

    // Bind buttons to appropriate functions, passing the element
    const stepButton = containerElement.querySelector('.step-button');
    const resetButton = containerElement.querySelector('.reset-button');
    if(stepButton) stepButton.onclick = () => stepBinaryAddition(containerElement);
    if(resetButton) resetButton.onclick = () => resetBinaryAddition(containerElement);
}

// Helper to get the state key for an adder element
function getAdderStateKey(containerElement) {
    return containerElement.id || containerElement.dataset.adderKey;
}

// Set up the UI (highlights, explanation text) for the adder.
function setupAdderUI(containerElement) {
    const stateKey = getAdderStateKey(containerElement);
    const state = adderState[stateKey];
    if (!containerElement || !state) return;

    // Use relative selectors
    const carrySpans = containerElement.querySelectorAll('.carry-row span');
    const resultSpans = containerElement.querySelectorAll('.result-row span');
    const explanationDiv = containerElement.querySelector('.adder-explanation');
    const stepButton = containerElement.querySelector('.step-button');
    const resetButton = containerElement.querySelector('.reset-button');

    carrySpans.forEach(span => { span.textContent = ''; span.classList.remove('active-carry'); });
    resultSpans.forEach((span, index) => {
        span.textContent = state.result[index];
        span.classList.remove('current-col');
    });

    if (!state.isComplete && state.currentColumn >= 0) {
        resultSpans[state.currentColumn].classList.add('current-col');
    }

    if(explanationDiv) explanationDiv.textContent = state.isComplete ? 'Addition complete! Press Reset.' : 'Click "Next Column" to add from the rightmost column.';
    if(stepButton) stepButton.style.display = state.isComplete ? 'none' : 'inline-block';
    if(resetButton) resetButton.style.display = state.isComplete ? 'inline-block' : 'none';
}

// Process one column of binary addition.
function stepBinaryAddition(containerElement) {
    const stateKey = getAdderStateKey(containerElement);
    const state = adderState[stateKey];
    if (!containerElement || !state || state.currentColumn < 0) return;

    // Use relative selectors
    const resultSpans = containerElement.querySelectorAll('.result-row span');
    const carrySpans = containerElement.querySelectorAll('.carry-row span');
    const explanationDiv = containerElement.querySelector('.adder-explanation');

    resultSpans.forEach(span => span.classList.remove('current-col'));
    carrySpans.forEach(span => span.classList.remove('active-carry'));

    const bitA = state.numA[state.currentColumn];
    const bitB = state.numB[state.currentColumn];
    const sum = bitA + bitB + state.carryBit;

    let resultBit = 0;
    let nextCarry = 0;
    let explanation = `Column ${8 - state.currentColumn} (${Math.pow(2, 7 - state.currentColumn)}s): ${bitA} + ${bitB}`;
    if (state.carryBit === 1) explanation += ` + ${state.carryBit} (carry)`;

    if (sum === 0) { resultBit = 0; nextCarry = 0; explanation += ` = 0. Write 0.`; }
    else if (sum === 1) { resultBit = 1; nextCarry = 0; explanation += ` = 1. Write 1.`; }
    else if (sum === 2) { resultBit = 0; nextCarry = 1; explanation += ` = 2 (10 bin). Write 0, carry 1.`; }
    else if (sum === 3) { resultBit = 1; nextCarry = 1; explanation += ` = 3 (11 bin). Write 1, carry 1.`; }

    state.result[state.currentColumn] = resultBit;
    resultSpans[state.currentColumn].textContent = resultBit;
    if(explanationDiv) explanationDiv.textContent = explanation;
    state.carryBit = nextCarry;

    if (state.carryBit === 1 && state.currentColumn > 0) {
        carrySpans[state.currentColumn - 1].textContent = '1';
        carrySpans[state.currentColumn - 1].classList.add('active-carry');
    }

    state.currentColumn--;

    if (state.currentColumn >= 0) {
        resultSpans[state.currentColumn].classList.add('current-col');
    } else {
        state.isComplete = true;
        setupAdderUI(containerElement); // Update UI to show completion
    }
}

// Reset the binary adder state and UI.
function resetBinaryAddition(containerElement) {
    const stateKey = getAdderStateKey(containerElement);
    if (adderState[stateKey]) {
        adderState[stateKey].currentColumn = 7;
        adderState[stateKey].carryBit = 0;
        adderState[stateKey].result = Array(8).fill('?');
        adderState[stateKey].isComplete = false;
        setupAdderUI(containerElement); // Pass element
    }
}

/* ----------------- Lesson 3: Overflow Simulator ----------------- */
// Initializes the overflow simulator.
function initOverflowSim(containerElement) {
    if (!containerElement) return;
    // Attach listeners to input fields
    const inputs = containerElement.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.oninput = () => updateOverflowSim(containerElement);
    });
    updateOverflowSim(containerElement); // Initial calculation
}

// Updates the binary display, performs addition, and shows overflow warning if needed.
function updateOverflowSim(containerElement) {
    if (!containerElement) return;
    
    // Use relative selectors
    const numAInput = containerElement.querySelector('input[id^="numA"]');
    const numBInput = containerElement.querySelector('input[id^="numB"]');
    const binaryADisp = containerElement.querySelector('code[id^="binaryA"]');
    const binaryBDisp = containerElement.querySelector('code[id^="binaryB"]');
    const resultValDisp = containerElement.querySelector('span.actual-value');
    const resultBinDisp = containerElement.querySelector('code.binary-result');
    const overflowWarning = containerElement.querySelector('.overflow-warning');
    const explanationDiv = containerElement.querySelector('.sim-explanation'); // Assuming an explanation div exists

    if (!numAInput || !numBInput || !binaryADisp || !binaryBDisp || !resultValDisp || !resultBinDisp || !overflowWarning) {
        console.error("Overflow Sim: Missing elements in container:", containerElement);
        return;
    }

    let numA = parseInt(numAInput.value) || 0;
    let numB = parseInt(numBInput.value) || 0;

    // Convert to 8-bit binary using the utility function
    const binaryA = decToBinary8Bit(numA);
    const binaryB = decToBinary8Bit(numB);

    binaryADisp.textContent = binaryA === "Invalid" ? "--------" : binaryA;
    binaryBDisp.textContent = binaryB === "Invalid" ? "--------" : binaryB;

    if (binaryA === "Invalid" || binaryB === "Invalid") {
        resultValDisp.textContent = "N/A";
        resultBinDisp.textContent = "--------";
        overflowWarning.classList.remove('visible');
        if(explanationDiv) explanationDiv.textContent = "Inputs must be 0-255.";
        return;
    }

    const sum = numA + numB;
    resultValDisp.textContent = sum;

    // Simulate 8-bit result (modulo 256)
    const resultBinary = decToBinary8Bit(sum % 256);
    resultBinDisp.textContent = resultBinary;

    // Check for overflow
    if (sum > 255) {
        overflowWarning.classList.add('visible');
        if(explanationDiv) explanationDiv.textContent = `OVERFLOW! ${sum} is too large for 8 bits. The stored result is ${sum % 256}.`;
    } else {
        overflowWarning.classList.remove('visible');
        if(explanationDiv) explanationDiv.textContent = "Result fits within 8 bits.";
    }
}

/* ----------------- Lesson 4: Binary to ASCII Character Converter ----------------- */
// Initializes the Binary-to-ASCII converter interactive.
function initBinaryToChar(containerElement) {
    if (!containerElement) return;
    const binaryInput = containerElement.querySelector('input[type="text"]');
    if (binaryInput) {
        binaryInput.oninput = () => updateCharFromBinary(containerElement);
        updateCharFromBinary(containerElement); // Initial update
    }
}

// Updates the displayed character based on the entered binary string.
function updateCharFromBinary(containerElement) {
    if (!containerElement) return;
    
    // Use relative selectors
    const binaryInput = containerElement.querySelector('input[type="text"]');
    const charResult = containerElement.querySelector('.char-result-box');
    const errorDiv = containerElement.querySelector('.input-error');

    if (!binaryInput || !charResult || !errorDiv) return;

    let binaryString = binaryInput.value.trim();
    // Remove non-binary characters and limit to 8 digits.
    binaryString = binaryString.replace(/[^01]/g, '').slice(0, 8);
    binaryInput.value = binaryString;
    errorDiv.textContent = '';
    charResult.textContent = '?';
    charResult.title = '';

    if (binaryString.length === 0) return;

    const paddedBinary = binaryString.padStart(8, '0');
    const decimalValue = parseInt(paddedBinary, 2);

    // For non-printable ASCII ranges:
    if (decimalValue < 32 || (decimalValue >= 127 && decimalValue <= 159)) {
        charResult.textContent = 'NP';
        charResult.title = `Decimal ${decimalValue} (Non-Printable)`;
    } else {
        charResult.textContent = String.fromCharCode(decimalValue);
        charResult.title = `Decimal ${decimalValue}`;
    }
}