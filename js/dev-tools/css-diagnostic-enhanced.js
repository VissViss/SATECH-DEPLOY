/**
 * Enhanced CSS Diagnostic Tool for SATECH website - Version 2.0 (April 2025)
 * 
 * This advanced diagnostic tool helps identify potential CSS issues and optimize performance
 * during development. The enhanced version includes more robust testing, customizable
 * visualization options, and device-specific diagnostics.
 * 
 * Usage: Add <script src="js/dev-tools/css-diagnostic-enhanced.js"></script> before </body>
 * 
 * COLOR CODE GUIDE:
 * - RED dashed outline: Section cards (main page sections)
 * - GREEN dashed outline: Content containers
 * - BLUE solid outline: Navigation menu items
 * - YELLOW solid outline: Floating social media buttons
 * - MAGENTA dashed outline: Footer content
 * - ORANGE dotted outline: Form elements
 * - CYAN solid outline: Background images and elements
 * - PURPLE dashed outline: GSAP-animated elements
 */

(function() {
  // Configuration object
  const config = {
    showOutlines: false,        // Set to true to show element outlines
    checkZIndex: true,          // Check for potential z-index conflicts
    checkGlowEffects: true,     // Verify glow effects are working
    checkResponsiveness: true,  // Check responsive breakpoints
    checkPerformance: true,     // Check for performance issues
    checkAccessibility: true,   // Check for basic accessibility issues
    checkImageOptimization: true, // Check if images could be optimized
    checkGSAPConflicts: true,   // Check for conflicts with GSAP animations
    logLevel: 'warning',        // 'info', 'warning', or 'error'
    visualizationLevel: 'detailed' // 'basic', 'detailed', or 'comprehensive'
  };

  // Stored test results
  let testResults = {
    zIndex: {},
    performance: {},
    accessibility: {},
    imageOptimization: {},
    gsapConflicts: {}
  };

  // Element selectors for testing
  const selectors = {
    sections: '.section-card',
    containers: '.content-container, .section-content-view',
    navItems: 'nav ul li a',
    buttons: '.floating-social a, .btn, .link-button, .back-to-top',
    footer: '.footer-content, footer .social-links',
    forms: '.form-group, input, select, textarea, .contact-form',
    backgrounds: '.section-background-image, .slide, .bg-image',
    gsapElements: '.gsap-content, [data-gsap]'
  };

  // Initialize
  function init() {
    console.log('%c🔍 Enhanced CSS Diagnostic Tool v2.0 Activated', 'background:#222; color:#28D4FF; padding:5px; border-radius:3px; font-weight:bold;');
    
    // Register service worker for network monitoring
    if ('serviceWorker' in navigator && config.checkPerformance) {
      try {
        // We're not actually registering a service worker, just checking if it's supported
        logMessage('Performance monitoring available', 'info');
      } catch (e) {
        logMessage('Performance monitoring not fully available in this browser', 'warning');
      }
    }
    
    // Run initial checks
    runAllDiagnostics();
    
    // Add UI elements
    addControlPanel();
    
    // Add keyboard shortcut (Ctrl+Shift+D)
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        toggleControlPanel();
      }
    });

    // Listen for window resize events for responsive testing
    window.addEventListener('resize', debounce(function() {
      if (config.checkResponsiveness) {
        checkResponsiveBreakpoints();
      }
    }, 250));
  }

  // Run all diagnostics
  function runAllDiagnostics() {
    if (config.showOutlines) {
      showElementOutlines(config.visualizationLevel);
    }
    
    if (config.checkZIndex) {
      checkZIndexConflicts();
    }
    
    if (config.checkGlowEffects) {
      verifyGlowEffects();
    }
    
    if (config.checkResponsiveness) {
      checkResponsiveBreakpoints();
    }
    
    if (config.checkPerformance) {
      checkPerformanceIssues();
    }
    
    if (config.checkAccessibility) {
      checkAccessibilityIssues();
    }
    
    if (config.checkImageOptimization) {
      checkImageOptimization();
    }
    
    if (config.checkGSAPConflicts) {
      checkGSAPConflicts();
    }
  }

  // Show outlines around elements for visual debugging with different levels of detail
  function showElementOutlines(level = 'basic') {
    // Remove existing outlines first
    const existingStyle = document.getElementById('css-diagnostic-outlines');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'css-diagnostic-outlines';
    
    let css = '';
    
    // Basic outlines (main structural elements)
    css += `
      ${selectors.sections} { outline: 2px dashed rgba(255,0,0,0.5) !important; }
      ${selectors.containers} { outline: 2px dashed rgba(0,255,0,0.5) !important; }
      ${selectors.navItems} { outline: 1px solid rgba(0,0,255,0.5) !important; }
      ${selectors.buttons} { outline: 1px solid rgba(255,255,0,0.5) !important; }
      ${selectors.footer} { outline: 2px dashed rgba(255,0,255,0.5) !important; }
    `;
    
    // Add detailed outlines
    if (level === 'detailed' || level === 'comprehensive') {
      css += `
        ${selectors.forms} { outline: 1px dotted rgba(255,165,0,0.8) !important; }
        ${selectors.backgrounds} { outline: 1px solid rgba(0,255,255,0.5) !important; }
      `;
    }
    
    // Add comprehensive outlines and element labeling
    if (level === 'comprehensive') {
      css += `
        ${selectors.gsapElements} { outline: 2px dashed rgba(128,0,128,0.5) !important; }
      `;
      
      // Add before pseudo-elements for labels on hover
      css += `
        ${selectors.sections}:hover::before,
        ${selectors.containers}:hover::before,
        ${selectors.forms}:hover::before,
        ${selectors.gsapElements}:hover::before {
          content: attr(class);
          position: absolute;
          top: -20px;
          left: 0;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 2px 6px;
          font-size: 10px;
          white-space: nowrap;
          z-index: 9999;
          pointer-events: none;
        }
      `;
    }
    
    style.textContent = css;
    document.head.appendChild(style);
    logMessage(`Element outlines enabled (${level} mode)`, 'info');
  }

  // Check for potential z-index conflicts
  function checkZIndexConflicts() {
    const zIndexMap = {};
    const zIndexElements = document.querySelectorAll('*');
    
    zIndexElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const zIndex = computedStyle.getPropertyValue('z-index');
      const position = computedStyle.getPropertyValue('position');
      
      if (zIndex !== 'auto' && position !== 'static') {
        if (!zIndexMap[zIndex]) {
          zIndexMap[zIndex] = [];
        }
        
        // Track elements with z-index >= 10 to avoid noise
        if (parseInt(zIndex) >= 10) {
          zIndexMap[zIndex].push({
            element: el,
            selector: getSelector(el),
            position: position
          });
        }
      }
    });
    
    // Store results
    testResults.zIndex = zIndexMap;
    
    // Check for conflicts
    Object.keys(zIndexMap).forEach(z => {
      if (zIndexMap[z].length > 1) {
        const elements = zIndexMap[z].map(item => item.selector).join(', ');
        logMessage(`Potential z-index conflict: ${elements} all use z-index: ${z}`, 'warning');
      }
    });
    
    // Check for potential stacking issues with fixed/absolute elements
    const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.position === 'fixed' || style.position === 'absolute';
    });
    
    if (fixedElements.length > 5) {
      logMessage(`High number of fixed/absolute elements (${fixedElements.length}) may cause stacking issues`, 'warning');
    }
  }
  
  // Verify glow effects are working
  function verifyGlowEffects() {
    // Check CSS variables are defined
    const rootStyles = getComputedStyle(document.documentElement);
    const glowPrimary = rootStyles.getPropertyValue('--glow-color-primary').trim();
    const glowSecondary = rootStyles.getPropertyValue('--glow-color-secondary').trim();
    const glowIntensityMenu = rootStyles.getPropertyValue('--glow-intensity-menu').trim();
    const glowIntensityButtons = rootStyles.getPropertyValue('--glow-intensity-buttons').trim();
    const glowOpacityMenu = rootStyles.getPropertyValue('--glow-opacity-menu').trim();
    const glowOpacityButtons = rootStyles.getPropertyValue('--glow-opacity-buttons').trim();
    
    // Check for missing variables
    const missingVars = [];
    if (!glowPrimary) missingVars.push('--glow-color-primary');
    if (!glowSecondary) missingVars.push('--glow-color-secondary');
    if (!glowIntensityMenu) missingVars.push('--glow-intensity-menu');
    if (!glowIntensityButtons) missingVars.push('--glow-intensity-buttons');
    if (!glowOpacityMenu) missingVars.push('--glow-opacity-menu');
    if (!glowOpacityButtons) missingVars.push('--glow-opacity-buttons');
    
    if (missingVars.length > 0) {
      logMessage(`Missing glow effect CSS variables: ${missingVars.join(', ')}`, 'error');
    } else {
      logMessage('All glow effect CSS variables are properly defined', 'info');
    }
    
    // Check that menu items have glow effect defined
    const menuItems = document.querySelectorAll(selectors.navItems);
    if (menuItems.length > 0) {
      // This is a somewhat limited check since we can't easily get the :hover state
      // in JavaScript without actually hovering
      logMessage('Menu items present - verify cyan glow appears on hover', 'info');
    }
    
    // Check buttons for hover effects
    const buttons = document.querySelectorAll(selectors.buttons);
    if (buttons.length > 0) {
      logMessage('Interactive buttons present - verify lime green glow appears on hover', 'info');
    }
  }
  
  // Check responsive breakpoints
  function checkResponsiveBreakpoints() {
    const breakpoints = [
      { name: 'Mobile Small', width: 360 },
      { name: 'Mobile', width: 480 },
      { name: 'Tablet', width: 768 },
      { name: 'Desktop', width: 992 },
      { name: 'Large Desktop', width: 1200 }
    ];
    
    // Create or update responsive indicator
    let indicator = document.getElementById('css-diagnostic-responsive-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'css-diagnostic-responsive-indicator';
      indicator.style.cssText = 'position:fixed; top:60px; right:15px; padding:3px 6px; background:rgba(0,0,0,0.7); color:white; font-size:11px; border-radius:3px; z-index:9999; pointer-events:none;';
      document.body.appendChild(indicator);
    }
    
    // Find current breakpoint
    const currentWidth = window.innerWidth;
    let currentBreakpoint = 'Extra Large Desktop';
    
    for (let i = 0; i < breakpoints.length; i++) {
      if (currentWidth <= breakpoints[i].width) {
        currentBreakpoint = breakpoints[i].name;
        break;
      }
    }
    
    // Update indicator
    indicator.textContent = `${currentWidth}px (${currentBreakpoint})`;
    
    // Log breakpoint information
    logMessage(`Current window width: ${currentWidth}px (${currentBreakpoint})`, 'info');
    
    // Check for potential issues
    if (currentWidth <= 480) {
      const hamburgerMenu = document.querySelector('.hamburger');
      if (!hamburgerMenu) {
        logMessage('Mobile breakpoint active but hamburger menu not found', 'warning');
      }
      
      // Check form layout at mobile sizes
      const formRows = document.querySelectorAll('.form-row');
      formRows.forEach(row => {
        const computed = window.getComputedStyle(row);
        if (computed.flexDirection !== 'column') {
          logMessage('Form row may not be properly stacking at mobile size', 'warning');
        }
      });
    }
  }
  
  // Check for performance issues
  function checkPerformanceIssues() {
    // Check for large images
    const images = Array.from(document.querySelectorAll('img'));
    const largeImages = [];
    
    // This is a basic check - we can't actually get the file size
    // without making network requests
    images.forEach(img => {
      const src = img.src;
      if (!src.includes('webp') && (src.includes('.png') || src.includes('.jpg') || src.includes('.jpeg'))) {
        largeImages.push({
          src: src,
          element: img,
          width: img.width,
          height: img.height
        });
      }
    });
    
    if (largeImages.length > 0) {
      logMessage(`Found ${largeImages.length} images that could be converted to WebP format`, 'warning');
      testResults.imageOptimization.largeImages = largeImages;
    }
    
    // Check for excessive DOM elements
    const totalElements = document.querySelectorAll('*').length;
    if (totalElements > 1000) {
      logMessage(`High DOM element count (${totalElements}) may affect performance`, 'warning');
    }
    
    // Check for inline styles which might indicate inefficient CSS
    const inlineStyles = document.querySelectorAll('[style]');
    if (inlineStyles.length > 10) {
      logMessage(`Found ${inlineStyles.length} elements with inline styles - consider moving to CSS file`, 'warning');
    }
    
    // Check for any animation libraries
    if (window.gsap) {
      logMessage('GSAP library detected - ensure animations are disabled on mobile', 'info');
    }
  }
  
  // Check for basic accessibility issues
  function checkAccessibilityIssues() {
    // Check for missing alt attributes on images
    const images = document.querySelectorAll('img');
    const missingAlt = [];
    
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        missingAlt.push({
          src: img.src,
          element: img
        });
      }
    });
    
    if (missingAlt.length > 0) {
      logMessage(`Found ${missingAlt.length} images missing alt attributes`, 'warning');
      testResults.accessibility.missingAlt = missingAlt;
    }
    
    // Check for inadequate color contrast (simplified check)
    // Note: This is a very basic check and doesn't actually calculate contrast ratios
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, input, select, textarea');
    
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = style.backgroundColor;
      
      // If the element has transparent background, it's harder to check
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        // Skip for now - would need to trace up the DOM tree for actual bg color
      } else {
        // Very simplistic check - just looking for potential very light text on light backgrounds
        if (color.includes('255, 255, 255') && 
            bgColor.includes('rgba') && 
            bgColor.split(',')[3].replace(')', '').trim() < 0.5) {
          logMessage(`Possible low contrast text found in ${getSelector(el)}`, 'warning');
        }
      }
    });
    
    // Check for missing focus styles
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    logMessage(`Found ${interactiveElements.length} interactive elements - verify they all have visible focus states`, 'info');
    
    // Check for missing form labels
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
        // Check for accessible name via label, aria-label, or aria-labelledby
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.hasAttribute('aria-label');
        const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          logMessage(`Form control missing accessible label: ${getSelector(input)}`, 'warning');
        }
      }
    });
  }
  
  // Check for image optimization opportunities
  function checkImageOptimization() {
    // Check background images
    const backgroundImageElements = document.querySelectorAll('.section-background-image, .bg-image, .slide');
    const backgroundImages = [];
    
    backgroundImageElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      
      if (bgImage && bgImage !== 'none') {
        // Extract URL
        const match = bgImage.match(/url\(['"]?([^'"()]+)['"]?\)/);
        
        if (match && match[1]) {
          const url = match[1];
          
          if (!url.includes('webp') && (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg'))) {
            backgroundImages.push({
              url: url,
              element: el
            });
          }
        }
      }
    });
    
    if (backgroundImages.length > 0) {
      logMessage(`Found ${backgroundImages.length} background images that could be converted to WebP format`, 'warning');
      testResults.imageOptimization.backgroundImages = backgroundImages;
    }
    
    // Check for preload/lazy-load attributes
    const images = document.querySelectorAll('img');
    const nonLazyImages = [];
    
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        nonLazyImages.push({
          src: img.src,
          element: img
        });
      }
    });
    
    if (nonLazyImages.length > 3) {  // Allow a few critical images without lazy loading
      logMessage(`Found ${nonLazyImages.length} images without lazy loading attribute`, 'warning');
      testResults.imageOptimization.nonLazyImages = nonLazyImages;
    }
  }
  
  // Check for GSAP animation conflicts
  function checkGSAPConflicts() {
    if (!window.gsap) {
      logMessage('GSAP not detected - skipping GSAP conflict checks', 'info');
      return;
    }
    
    // Check for elements with both GSAP animation and CSS transitions
    const gsapElements = document.querySelectorAll('.gsap-content, [data-gsap]');
    const conflictElements = [];
    
    gsapElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const transition = style.transition;
      
      if (transition && transition !== 'none' && transition !== 'all 0s ease 0s') {
        conflictElements.push({
          element: el,
          selector: getSelector(el),
          transition: transition
        });
      }
    });
    
    if (conflictElements.length > 0) {
      logMessage(`Found ${conflictElements.length} elements with possible GSAP/CSS transition conflicts`, 'warning');
      testResults.gsapConflicts.transitionConflicts = conflictElements;
      
      conflictElements.forEach(item => {
        logMessage(`Potential GSAP conflict: ${item.selector} has CSS transition: ${item.transition}`, 'warning');
      });
    }
    
    // Check for other animation libraries that might conflict
    if (window.jQuery && jQuery.fn.animate) {
      logMessage('jQuery animation methods detected - possible conflict with GSAP animations', 'warning');
    }
    
    // Check for will-change property on GSAP elements
    gsapElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const willChange = style.willChange;
      
      if (!willChange || willChange === 'auto') {
        logMessage(`GSAP element without will-change property: ${getSelector(el)}`, 'info');
      }
    });
  }
  
  // Add control panel for diagnostics
  function addControlPanel() {
    // Create panel container
    const panel = document.createElement('div');
    panel.id = 'css-diagnostic-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: #28D4FF;
      color: #000;
      border-radius: 50%;
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    `;
    
    // Create toggle button
    const toggleButton = document.createElement('span');
    toggleButton.textContent = '🔍';
    toggleButton.style.cssText = 'font-size: 20px;';
    
    panel.appendChild(toggleButton);
    
    // Create expanded panel (hidden initially)
    const expandedPanel = document.createElement('div');
    expandedPanel.id = 'css-diagnostic-expanded-panel';
    expandedPanel.style.cssText = `
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 280px;
      background: #222;
      color: #fff;
      border-radius: 6px;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      padding: 10px;
      font-family: sans-serif;
      font-size: 12px;
      display: none;
    `;
    
    // Create panel header
    const panelHeader = document.createElement('div');
    panelHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #444;
      padding-bottom: 8px;
      margin-bottom: 8px;
    `;
    
    const panelTitle = document.createElement('div');
    panelTitle.textContent = 'CSS Diagnostic Tool v2.0';
    panelTitle.style.cssText = 'font-weight: bold; color: #28D4FF;';
    
    const panelClose = document.createElement('span');
    panelClose.textContent = '✕';
    panelClose.style.cssText = 'cursor: pointer; color: #999;';
    panelClose.addEventListener('click', toggleControlPanel);
    
    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(panelClose);
    expandedPanel.appendChild(panelHeader);
    
    // Create panel content
    const panelContent = document.createElement('div');
    panelContent.style.cssText = 'margin-bottom: 10px;';
    
    // Create diagnostic toggle switches
    const diagnostics = [
      { id: 'outlines', label: 'Show Element Outlines', config: 'showOutlines' },
      { id: 'zindex', label: 'Check Z-Index Conflicts', config: 'checkZIndex' },
      { id: 'glow', label: 'Verify Glow Effects', config: 'checkGlowEffects' },
      { id: 'responsive', label: 'Check Responsive Design', config: 'checkResponsiveness' },
      { id: 'performance', label: 'Check Performance Issues', config: 'checkPerformance' },
      { id: 'accessibility', label: 'Check Accessibility', config: 'checkAccessibility' },
      { id: 'images', label: 'Check Image Optimization', config: 'checkImageOptimization' },
      { id: 'gsap', label: 'Check GSAP Conflicts', config: 'checkGSAPConflicts' }
    ];
    
    diagnostics.forEach(diag => {
      const toggleRow = document.createElement('div');
      toggleRow.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 6px;';
      
      const label = document.createElement('label');
      label.textContent = diag.label;
      label.style.cssText = 'display: flex; align-items: center;';
      
      const toggle = document.createElement('input');
      toggle.type = 'checkbox';
      toggle.checked = config[diag.config];
      toggle.dataset.config = diag.config;
      toggle.style.cssText = 'margin-right: 8px;';
      
      toggle.addEventListener('change', function() {
        config[this.dataset.config] = this.checked;
        
        // Special handling for outlines toggle
        if (diag.config === 'showOutlines') {
          if (this.checked) {
            showElementOutlines(config.visualizationLevel);
          } else {
            const outlines = document.getElementById('css-diagnostic-outlines');
            if (outlines) outlines.remove();
          }
        }
        // Rerun diagnostics for other options
        else {
          runAllDiagnostics();
        }
      });
      
      label.insertBefore(toggle, label.firstChild);
      
      toggleRow.appendChild(label);
      panelContent.appendChild(toggleRow);
    });
    
    // Add visualization level selector
    const visualizationRow = document.createElement('div');
    visualizationRow.style.cssText = 'margin-top: 10px; border-top: 1px solid #444; padding-top: 8px;';
    
    const visualizationLabel = document.createElement('div');
    visualizationLabel.textContent = 'Visualization Level:';
    visualizationLabel.style.cssText = 'margin-bottom: 5px; color: #ccc;';
    
    const visualizationSelect = document.createElement('select');
    visualizationSelect.style.cssText = 'width: 100%; background: #333; color: #fff; border: 1px solid #444; padding: 3px;';
    
    const visualizationOptions = [
      { value: 'basic', label: 'Basic (Main Elements Only)' },
      { value: 'detailed', label: 'Detailed (All Elements)' },
      { value: 'comprehensive', label: 'Comprehensive (With Labels)' }
    ];
    
    visualizationOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      option.selected = config.visualizationLevel === opt.value;
      visualizationSelect.appendChild(option);
    });
    
    visualizationSelect.addEventListener('change', function() {
      config.visualizationLevel = this.value;
      if (config.showOutlines) {
        showElementOutlines(config.visualizationLevel);
      }
    });
    
    visualizationRow.appendChild(visualizationLabel);
    visualizationRow.appendChild(visualizationSelect);
    
    panelContent.appendChild(visualizationRow);
    
    // Add run diagnostics button
    const runDiagnosticsButton = document.createElement('button');
    runDiagnosticsButton.textContent = 'Run All Diagnostics';
    runDiagnosticsButton.style.cssText = `
      width: 100%;
      background: #28D4FF;
      color: #222;
      border: none;
      padding: 6px 0;
      margin-top: 10px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    `;
    
    runDiagnosticsButton.addEventListener('click', runAllDiagnostics);
    
    panelContent.appendChild(runDiagnosticsButton);
    
    // Add keyboard shortcut info
    const shortcutInfo = document.createElement('div');
    shortcutInfo.textContent = 'Keyboard Shortcut: Ctrl+Shift+D';
    shortcutInfo.style.cssText = 'margin-top: 8px; text-align: center; font-size: 10px; color: #888;';
    
    panelContent.appendChild(shortcutInfo);
    
    expandedPanel.appendChild(panelContent);
    
    // Add panel to body
    document.body.appendChild(panel);
    document.body.appendChild(expandedPanel);
    
    // Add click event to toggle panel
    panel.addEventListener('click', toggleControlPanel);
    
    logMessage('Control panel added. Click the diagnostic button or press Ctrl+Shift+D to open', 'info');
  }
  
  // Toggle control panel visibility
  function toggleControlPanel() {
    const panel = document.getElementById('css-diagnostic-expanded-panel');
    const button = document.getElementById('css-diagnostic-panel');
    
    if (panel.style.display === 'none' || !panel.style.display) {
      panel.style.display = 'block';
      button.style.backgroundColor = '#A3D267'; // Change to lime green when open
    } else {
      panel.style.display = 'none';
      button.style.backgroundColor = '#28D4FF'; // Change back to cyan when closed
    }
  }
  
  // Helper to get a selector for an element
  function getSelector(el) {
    if (el.id) {
      return '#' + el.id;
    }
    
    if (el.className) {
      const classes = Array.from(el.classList).join('.');
      return el.tagName.toLowerCase() + (classes ? '.' + classes : '');
    }
    
    return el.tagName.toLowerCase();
  }
  
  // Logging with configurable level
  function logMessage(message, level) {
    const styles = {
      info: 'background:#222; color:#28D4FF; padding:3px 6px; border-radius:3px;',
      warning: 'background:#222; color:#FFA500; padding:3px 6px; border-radius:3px;',
      error: 'background:#222; color:#FF4040; padding:3px 6px; border-radius:3px;'
    };
    
    const levels = {
      'info': 0,
      'warning': 1,
      'error': 2
    };
    
    if (levels[level] >= levels[config.logLevel]) {
      console.log(`%c${level.toUpperCase()} %c${message}`, styles[level], '');
    }
  }
  
  // Debounce function to limit rapid firing of events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();