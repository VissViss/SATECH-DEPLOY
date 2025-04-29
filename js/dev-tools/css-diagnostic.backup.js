/**
 * CSS Diagnostic Tool for SATECH website
 * 
 * This script helps identify potential CSS issues during development.
 * Include this script only during development, not in production.
 * 
 * Usage: Add <script src="js/dev-tools/css-diagnostic.js"></script> before </body>
 * 
 * COLOR CODE GUIDE:
 * - RED dashed outline: Section cards (main page sections)
 * - GREEN dashed outline: Content containers
 * - BLUE solid outline: Navigation menu items
 * - YELLOW solid outline: Floating social media buttons
 * - MAGENTA dashed outline: Footer content
 */

(function() {
  // Configuration
  const config = {
    showOutlines: false,        // Set to true to show element outlines
    checkZIndex: true,          // Check for potential z-index conflicts
    checkGlowEffects: true,     // Verify glow effects are working
    checkResponsiveness: true,  // Check responsive breakpoints
    logLevel: 'warning'         // 'info', 'warning', or 'error'
  };

  // Initialize
  function init() {
    console.log('%c🔍 CSS Diagnostic Tool Activated', 'background:#222; color:#28D4FF; padding:5px; border-radius:3px;');
    
    if (config.showOutlines) {
      showElementOutlines();
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
    
    addToggleButton();
  }

  // Show outlines around elements for visual debugging
  function showElementOutlines() {
    const style = document.createElement('style');
    style.id = 'css-diagnostic-outlines';
    style.textContent = `
      .section-card { outline: 2px dashed rgba(255,0,0,0.5) !important; }
      .content-container { outline: 2px dashed rgba(0,255,0,0.5) !important; }
      nav ul li a { outline: 1px solid rgba(0,0,255,0.5) !important; }
      .floating-social a { outline: 1px solid rgba(255,255,0,0.5) !important; }
      .footer-content { outline: 2px dashed rgba(255,0,255,0.5) !important; }
    `;
    document.head.appendChild(style);
    logMessage('Element outlines enabled for visual debugging', 'info');
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
        
        // Only track elements with z-index >= 10 to avoid noise
        if (parseInt(zIndex) >= 10) {
          zIndexMap[zIndex].push({
            element: el,
            selector: getSelector(el),
            position: position
          });
        }
      }
    });
    
    // Check for conflicts
    Object.keys(zIndexMap).forEach(z => {
      if (zIndexMap[z].length > 1) {
        const elements = zIndexMap[z].map(item => item.selector).join(', ');
        logMessage(`Potential z-index conflict: ${elements} all use z-index: ${z}`, 'warning');
      }
    });
  }
  
  // Verify glow effects are working
  function verifyGlowEffects() {
    // Check CSS variables are defined
    const rootStyles = getComputedStyle(document.documentElement);
    const glowPrimary = rootStyles.getPropertyValue('--glow-color-primary').trim();
    const glowSecondary = rootStyles.getPropertyValue('--glow-color-secondary').trim();
    
    if (!glowPrimary) {
      logMessage('--glow-color-primary CSS variable is not defined or empty', 'error');
    }
    
    if (!glowSecondary) {
      logMessage('--glow-color-secondary CSS variable is not defined or empty', 'error');
    }
    
    // Check that menu items have glow effect defined
    const menuItems = document.querySelectorAll('nav ul li a');
    if (menuItems.length > 0) {
      const navStyle = window.getComputedStyle(menuItems[0], ':hover');
      if (!navStyle.textShadow || navStyle.textShadow === 'none') {
        logMessage('Menu items may be missing hover glow effect', 'warning');
      }
    }
    
    // Check footer social links
    const footerLinks = document.querySelectorAll('footer .social-links a');
    if (footerLinks.length > 0) {
      logMessage('Footer social links present - cyan glow should be applied on hover', 'info');
    }
  }
  
  // Check responsive breakpoints
  function checkResponsiveBreakpoints() {
    const breakpoints = [
      { name: 'Mobile', width: 480 },
      { name: 'Tablet', width: 768 },
      { name: 'Desktop', width: 992 }
    ];
    
    logMessage(`Current window width: ${window.innerWidth}px`, 'info');
    
    breakpoints.forEach(bp => {
      const isActive = window.innerWidth <= bp.width;
      logMessage(`${bp.name} breakpoint (${bp.width}px): ${isActive ? 'ACTIVE' : 'inactive'}`, 'info');
    });
    
    // Add resize listener to show updated breakpoints
    window.addEventListener('resize', debounce(() => {
      logMessage(`Window resized to ${window.innerWidth}px`, 'info');
      breakpoints.forEach(bp => {
        const isActive = window.innerWidth <= bp.width;
        logMessage(`${bp.name} breakpoint (${bp.width}px): ${isActive ? 'ACTIVE' : 'inactive'}`, 'info');
      });
    }, 250));
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
  
  // Add toggle button to page
  function addToggleButton() {
    const button = document.createElement('button');
    button.textContent = '🔍 CSS Debug';
    button.style.cssText = 'position:fixed; bottom:80px; right:15px; z-index:9999; background:#28D4FF; color:#000; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-family:sans-serif; font-size:12px; opacity:0.85;';
    
    button.addEventListener('click', () => {
      if (document.getElementById('css-diagnostic-outlines')) {
        document.getElementById('css-diagnostic-outlines').remove();
        button.textContent = '🔍 CSS Debug';
      } else {
        showElementOutlines();
        button.textContent = '🔍 Hide Debug';
      }
    });
    
    document.body.appendChild(button);
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