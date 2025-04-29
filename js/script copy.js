// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const dropdowns = document.querySelectorAll('.dropdown');
    const sections = document.querySelectorAll('.section-card');
    const backToTopButton = document.getElementById('back-to-top');
    const slides = document.querySelectorAll('.slide');
    
    // Prevent default outline on logo
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('focus', function() {
            this.blur();
        });
    }
    
    // ===== HERO SLIDER =====
    let currentSlide = 0;

    // Initialize slides
    if (slides.length > 0) {
        slides[0].classList.add('active');
        setTimeout(() => {
            slides[0].classList.add('zoomed');
        }, 50);
    }

    function nextSlide() {
        const current = currentSlide;
        currentSlide = (currentSlide + 1) % slides.length;
        const next = currentSlide;

        slides[current].classList.remove('active');
        slides[current].classList.remove('zoomed');

        slides[next].classList.add('active');

        setTimeout(() => {
            slides[next].classList.add('zoomed');
        }, 50);
    }

    // Change slide every 7 seconds
    if (slides.length > 0) {
        setInterval(nextSlide, 7000);
    }

    // ===== GSAP SAFETY INITIALIZATION =====
    function initializeAnimations() {
        // Fallback: Show all content immediately if GSAP fails
        const fallback = () => {
            document.querySelectorAll('.gsap-content').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        };

        try {
            // Check if GSAP is loaded
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.warn('GSAP not loaded - using fallback');
                fallback();
                return;
            }

            // Only animate on desktop
            if (window.innerWidth > 768) {
                if (typeof initContentAnimations === 'function') {
                    initContentAnimations();
                } else {
                    console.warn('initContentAnimations not found');
                    fallback();
                }
            } else {
                // Mobile fallback
                fallback();
            }
        } catch (e) {
            console.error('Animation error:', e);
            fallback();
        }
    }

    // Initialize with delay to ensure everything is loaded
    setTimeout(initializeAnimations, 500);

    // ===== SMOOTH SCROLL =====
    function smoothScroll(target, duration) {
        // Pause GSAP ScrollTrigger during manual scroll if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(st => st.disable());
        }
        
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Re-enable ScrollTrigger when done
                if (typeof ScrollTrigger !== 'undefined') {
                    setTimeout(() => {
                        ScrollTrigger.getAll().forEach(st => st.enable());
                    }, 100);
                }
            }
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // ===== SCROLL EVENT HANDLER =====
    window.addEventListener('scroll', function() {
        // Add or remove scrolled class to header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTopButton.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            backToTopButton.classList.remove('show');
        }
        
        // Always update active navigation links - removed conditional
        updateActiveNavLink();
        updateHomeLink();
    });
    
    // ===== ACTIVE NAV LINK UPDATE =====
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        // First remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Special handling for home section
        if (window.scrollY < 100) {
            const homeLink = document.querySelector('nav ul li a[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
                return;
            }
        }
        
        // Special case for sustainability section
        const sustainabilitySection = document.getElementById('sustentabilidad');
        if (sustainabilitySection && isElementInView(sustainabilitySection)) {
            const sustainabilityLink = document.querySelector('nav ul li a[href="#sustentabilidad"]');
            if (sustainabilityLink) {
                sustainabilityLink.classList.add('active');
                return;
            }
        }
        
        // Find the current visible section
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Add offset for header
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
            }
        });
        
        if (currentSection) {
            const id = currentSection.getAttribute('id');
            // Try different possible href formats (with or without .html)
            let activeLink = document.querySelector(`nav ul li a[href="#${id}"]`);
            
            if (!activeLink) {
                activeLink = document.querySelector(`nav ul li a[href="${id}.html"]`);
            }
            
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // ===== ELEMENT VISIBILITY CHECK =====
    function isElementInView(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.5
        );
    }
    
    // ===== BACK TO TOP BUTTON =====
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScroll('body', 800);
    });
    
    // ===== MOBILE MENU TOGGLE =====
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // ===== DROPDOWN TOGGLE ON MOBILE =====
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
    
    // ===== NAV LINK CLICK HANDLER =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Handle both #section links and regular page links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Update active state
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                
                // Smooth scroll to the target
                const target = this.getAttribute('href');
                smoothScroll(target, 1000);
            }
        });
    });

    // Handle home link special case - allow both index.html and #home to work
    function updateHomeLink() {
        const homeLinks = document.querySelectorAll('nav ul li a[href="#home"], nav ul li a[href="index.html"]');
        if (window.scrollY < 100) {
            homeLinks.forEach(link => {
                link.classList.add('active');
            });
        }
    }

    // Create a ScrollTrigger for each section that also updates navigation
    function setupSectionNavigation() {
        // Only run if GSAP is loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }
        
        // Register the plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Create a ScrollTrigger for each section
        sections.forEach(section => {
            const id = section.getAttribute('id');
            const link = document.querySelector(`nav ul li a[href="#${id}"]`);
            
            if (link) {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 50%", 
                    end: "bottom 50%",
                    toggleClass: {
                        targets: link,
                        className: "active"
                    },
                    onToggle: (self) => {
                        if (self.isActive) {
                            navLinks.forEach(otherLink => {
                                if (otherLink !== link) {
                                    otherLink.classList.remove('active');
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    
    // Call this after GSAP initialization
    setTimeout(() => {
        setupSectionNavigation();
    }, 800);
});

// ===== CONTENT ANIMATIONS INITIALIZATION =====
function initContentAnimations() {
    // Safety check
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP libraries not available');
        return;
    }

    // Register plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Clear existing triggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Get all content blocks
    const contentBlocks = document.querySelectorAll('.gsap-content');
    
    // Set initial state
    gsap.set(contentBlocks, {
        opacity: 0,
        y: 50
    });
    
    // Create animations for each content block
    contentBlocks.forEach((content) => {
        const section = content.closest('.section-card');
        if (!section) return;

        ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "top 30%",
            onEnter: () => gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out"
            }),
            onLeave: () => gsap.to(content, {
                opacity: 0,
                y: 30,
                duration: 0.3,
                ease: "power2.in"
            }),
            onEnterBack: () => gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out"
            }),
            onLeaveBack: () => gsap.to(content, {
                opacity: 0,
                y: -30,
                duration: 0.3,
                ease: "power2.in"
            }),
            markers: false // Set to true for debugging
        });
    });
}