// learn_python.js
// Simulates running code with a typing effect in the shell output
// and provides a resizable editor/shell interface

document.addEventListener('DOMContentLoaded', () => {
  const runBtn = document.getElementById('run');
  const shell = document.getElementById('output');
  const codeElement = document.getElementById('code');
  const resizeHandle = document.getElementById('resize-handle');
  const screenContent = document.querySelector('.screen-content');
  const editorContainer = document.querySelector('.ide-editor-container');
  const shellContainer = document.querySelector('.ide-shell-container');
  const monitorContainer = document.querySelector('.monitor-container');
  
  // Get demo output from data attribute (fallback to empty array if not set)
  let demoOutput = [];
  try {
    const demoOutputAttr = monitorContainer.getAttribute('data-demo-output');
    if (demoOutputAttr) {
      demoOutput = JSON.parse(demoOutputAttr);
    }
  } catch (error) {
    console.error('Error parsing demo output data:', error);
    // Fallback to empty array already set
  }
  
  // Disable editing on the code element
  if (codeElement.tagName === 'PRE') {
    codeElement.setAttribute('contenteditable', 'false');
  }
  
  // Resize handle functionality
  let isDragging = false;
  let startY, startEditorHeight, startShellHeight;
  
  resizeHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startEditorHeight = editorContainer.offsetHeight;
    startShellHeight = shellContainer.offsetHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none'; // Prevent text selection during drag
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Calculate the shift based on mouse movement
    const deltaY = e.clientY - startY;
    
    // Calculate total height of screen content
    const totalHeight = screenContent.offsetHeight;
    
    // Convert pixel values to ratios for flex - reversed the deltaY signs
    const editorRatio = (startEditorHeight + deltaY) / totalHeight;
    const shellRatio = (startShellHeight - deltaY) / totalHeight;
    
    // Apply minimum size constraints
    if (editorRatio > 0.2 && shellRatio > 0.2) {
      editorContainer.style.flex = editorRatio;
      shellContainer.style.flex = shellRatio;
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
  
  // Run button functionality
  runBtn.addEventListener('click', () => {
    // Disable run button during execution
    runBtn.disabled = true;
    runBtn.textContent = 'Running...';
    
    // Show shell and resize handle if not already visible
    if (!shellContainer.classList.contains('active')) {
      resizeHandle.classList.add('active');
      shellContainer.classList.add('active');
      screenContent.classList.add('shell-active');
    }
    
    // Clear previous output
    shell.textContent = '';
    
    // Typing effect with 500ms between lines
    let lineCount = 0;
    
    function typeLine(index) {
      if (index >= demoOutput.length) {
        // Re-enable run button when finished
        runBtn.disabled = false;
        runBtn.textContent = 'Run ▶︎';
        return;
      }
      
      const line = demoOutput[index];
      let charIndex = 0;
      
      // Type characters one by one (faster for a smoother effect)
      const typeInterval = setInterval(() => {
        shell.textContent = shell.textContent + line[charIndex];
        charIndex++;
        
        if (charIndex >= line.length) {
          clearInterval(typeInterval);
          shell.textContent = shell.textContent + '\n';
          
          // Move to next line after a short delay
          setTimeout(() => {
            typeLine(index + 1);
          }, 300);
        }
      }, 30);
    }
    
    // Start typing animation
    setTimeout(() => {
      typeLine(0);
    }, 500);
  });
});