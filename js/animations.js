function initContentAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach(st => st.kill());

    // ===== CONTENT CONTAINER SYNC WITH BACKGROUND (SLIGHT DELAY) =====
    const contentBlocks = document.querySelectorAll('.gsap-content');
    gsap.set(contentBlocks, { opacity: 0, y: 50 });

    contentBlocks.forEach((content, idx) => {
        const section = content.closest('.section-card');
        if (!section) return;
        const isLast = idx === contentBlocks.length - 1;
        ScrollTrigger.create({
            trigger: section,
            start: "top 90%", // Start fade in as soon as section enters viewport
            end: isLast ? "bottom bottom" : "bottom top", // For last section, keep visible until very end
            onEnter: () => gsap.to(content, {
                opacity: 1,
                duration: 0.7,
                ease: "power2.out"
            }),
            onLeave: () => gsap.to(content, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut"
            }),
            onEnterBack: () => gsap.to(content, {
                opacity: 1,
                duration: 0.7,
                ease: "power2.out"
            }),
            onLeaveBack: () => gsap.to(content, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut"
            }),
            markers: false
        });
        // Scrubbed y animation: slide up as you scroll through the section
        gsap.to(content, {
            y: -80,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top 95%",
                end: isLast ? "bottom bottom" : "top 5%",
                scrub: true
            }
        });
    });

    // ===== NAVIGATION HIGHLIGHTING WITH SCROLLTRIGGER =====
    const sections = document.querySelectorAll('.section-card');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Create a ScrollTrigger for each section
    sections.forEach(section => {
        const id = section.getAttribute('id');
        if (!id) return;
        
        // Find corresponding navigation link
        const link = document.querySelector(`nav ul li a[href="#${id}"]`);
        if (!link) return;
        
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%", 
            end: "bottom 40%",
            onToggle: self => {
                if (self.isActive) {
                    // Remove active class from all links first
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    // Add active class to the corresponding link
                    link.classList.add('active');
                }
            }
        });
    });
    
    // Special case for home section
    const homeSection = document.getElementById('home');
    if (homeSection) {
        ScrollTrigger.create({
            trigger: homeSection,
            start: "top 0%",
            end: "bottom 50%",
            onToggle: self => {
                if (self.isActive) {
                    const homeLink = document.querySelector('nav ul li a[href="#home"]');
                    if (homeLink) {
                        navLinks.forEach(navLink => navLink.classList.remove('active'));
                        homeLink.classList.add('active');
                    }
                }
            }
        });
    }

    // ===== FLOATING ELEMENTS (ORIGINAL GSAP.HTML STYLE) =====
    const particles = gsap.utils.toArray('.floating-particle');
    // Only enable parallax effect if the page is scrollable
    const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight + 5;
    particles.forEach((particle, i) => {
        // Reset styles to match original
        gsap.set(particle, {
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
            width: "150px",
            height: "150px",
            filter: "blur(15px)"
        });

        // Original animation parameters
        const duration = 20 + Math.random() * 20;
        const movement = 100 + Math.random() * 200;
        gsap.to(particle, {
            x: `+=${movement}`,
            y: `+=${movement * 0.7}`,
            duration: duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });

        // Only add parallax effect if scrollable
        if (isScrollable) {
            ScrollTrigger.create({
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    gsap.to(particle, {
                        y: `+=${self.getVelocity() * 0.2}`,
                        duration: 0.8
                    });
                }
            });
        }
    });

    // ===== HERO → ABOUT DEDICATED BACKGROUND FADE-IN & ZOOM =====
    const heroSection = document.getElementById('home');
    const aboutBg = document.querySelector('.bg-image[data-section="about"]');
    if (heroSection && aboutBg) {
        gsap.set(aboutBg, { opacity: 0, scale: 1.05 }); // Start hidden and slightly zoomed
        ScrollTrigger.create({
            trigger: heroSection,
            start: "bottom 90%", // Start fade-in/zoom-in as hero is leaving
            end: "bottom top",   // End when hero is fully gone
            scrub: true,
            onUpdate: self => {
                // Animate opacity and scale based on scroll progress
                gsap.to(aboutBg, {
                    opacity: self.progress,
                    scale: 1.05 - 0.05 * self.progress, // 1.05 → 1 as progress goes 0→1
                    overwrite: 'auto',
                    duration: 0.1,
                    ease: 'none'
                });
            }
        });
    }

    // ===== SECTION BACKGROUND CROSSFADE & ZOOM (for all except About) =====
    const bgImages = gsap.utils.toArray('.bg-image');
    document.querySelectorAll('.section-card:not(#home)').forEach((section, i) => {
        const sectionId = section.getAttribute('id');
        if (sectionId === 'about') return; // About handled above
        const bg = document.querySelector(`.bg-image[data-section="${sectionId}"]`);
        if (!bg) return;
        ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onEnter: () => {
                gsap.to(bg, { opacity: 1, scale: 1, duration: 2, ease: "power2.inOut" }); // Fade in, zoom in
                // Crossfade: fade out previous if it exists
                if (i > 0) {
                    // Find previous section (skip About)
                    let prevSection = section.previousElementSibling;
                    while (prevSection && (!prevSection.classList || !prevSection.classList.contains('section-card') || prevSection.getAttribute('id') === 'about')) {
                        prevSection = prevSection.previousElementSibling;
                    }
                    if (prevSection) {
                        const prevId = prevSection.getAttribute('id');
                        const prevBg = document.querySelector(`.bg-image[data-section="${prevId}"]`);
                        if (prevBg) gsap.to(prevBg, { opacity: 0, scale: 1.05, duration: 2, ease: "power2.inOut" }); // Fade out, zoom out
                    }
                }
            },
            onLeaveBack: () => {
                gsap.to(bg, { opacity: 0, scale: 1.05, duration: 2, ease: "power2.inOut" }); // Fade out, zoom out
                // Fade previous back in if it exists
                if (i > 0) {
                    let prevSection = section.previousElementSibling;
                    while (prevSection && (!prevSection.classList || !prevSection.classList.contains('section-card') || prevSection.getAttribute('id') === 'about')) {
                        prevSection = prevSection.previousElementSibling;
                    }
                    if (prevSection) {
                        const prevId = prevSection.getAttribute('id');
                        const prevBg = document.querySelector(`.bg-image[data-section="${prevId}"]`);
                        if (prevBg) gsap.to(prevBg, { opacity: 1, scale: 1, duration: 2, ease: "power2.inOut" }); // Fade in, zoom in
                    }
                }
            }
        });
    });
}

/**
 * Initializes the hero section Swiper carousel
 * Applies fade effect and zoom animations to slide images
 */
function initHeroSwiper() {
    console.log('DOM loaded, checking for Swiper...');
    
    // Check if Swiper is defined
    if (typeof Swiper !== 'undefined') {
        console.log('Swiper is loaded! Version:', Swiper.version);
        
        // Wait a bit longer to ensure all resources are loaded
        setTimeout(function() {
            try {
                console.log('Attempting to initialize hero swiper...');
                const swiperEl = document.querySelector('.hero-swiper');
                
                if (!swiperEl) {
                    console.error('ERROR: Hero swiper element not found in DOM');
                    return;
                }
                
                console.log('Hero swiper element found:', swiperEl);
                
                // Check for existing images before initializing
                const slideImages = document.querySelectorAll('.swiper-slide .Pic img');
                console.log('Found ' + slideImages.length + ' slide images');
                
                // Log image paths to debug
                slideImages.forEach((img, index) => {
                    console.log(`Slide ${index} image src: ${img.src}`);
                });
                
                if (!window.heroSwiper) {
                    // Add styles for the zoom effect and slide visibility
                    const style = document.createElement('style');
                    style.textContent = `
                        /* Essential Swiper zoom styles */
                        .swiper-slide .Pic img {
                            transform: scale(1.2);
                            transition: transform 3.5s ease-out;
                            will-change: transform;
                        }
                        .swiper-fade .swiper-slide {
                            transition: opacity 1.5s ease-in-out;
                        }
                        /* Hide all non-first slides initially */
                        .swiper-slide:not(:first-child) {
                            opacity: 0 !important;
                        }
                        /* Once Swiper initializes, these classes will override the above */
                        .swiper-slide-active, 
                        .swiper-slide-visible {
                            opacity: 1 !important;
                        }
                    `;
                    document.head.appendChild(style);
                    
                    window.heroSwiper = new Swiper('.hero-swiper', {
                        effect: 'fade',
                        fadeEffect: {
                            crossFade: false
                        },
                        preloadImages: true, 
                        loop: true,
                        speed: 1500,
                        autoplay: {
                            delay: 7000,
                            disableOnInteraction: false
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        observer: true,
                        observeParents: true,
                        watchSlidesProgress: true,
                        resizeObserver: true,
                        initialSlide: 0, // Explicitly start with the first slide
                        on: {
                            init: function() {
                                console.log('Swiper initialized successfully');
                                setTimeout(() => {
                                    const activeSlide = this.slides[this.activeIndex];
                                    if (activeSlide) {
                                        const img = activeSlide.querySelector('.Pic img');
                                        if (img) {
                                            img.style.transform = 'scale(1.0)';
                                        }
                                    }
                                }, 50);
                            },
                            slideChangeTransitionStart: function() {
                                // Reset any previous animations
                                const allSlides = document.querySelectorAll('.swiper-slide:not(.swiper-slide-active) .Pic img');
                                allSlides.forEach(img => {
                                    img.style.transition = 'none';
                                    img.style.transform = 'scale(1.2)';
                                });
                                
                                // Set up the new active slide
                                const activeSlide = this.slides[this.activeIndex];
                                if (activeSlide) {
                                    const img = activeSlide.querySelector('.Pic img');
                                    if (img) {
                                        img.style.transition = 'none';
                                        img.style.transform = 'scale(1.2)';
                                        // Force reflow
                                        void img.offsetWidth;
                                        
                                        // Start zoom animation
                                        setTimeout(() => {
                                            img.style.transition = 'transform 3.5s ease-out'; 
                                            img.style.transform = 'scale(1.0)';
                                        }, 50);
                                    }
                                }
                            }
                        }
                    });
                    
                    console.log('Hero swiper created successfully:', window.heroSwiper);
                } else {
                    console.log('Hero swiper already exists');
                }
            } catch (error) {
                console.error('ERROR initializing Swiper:', error.message);
                console.error('Full error:', error);
                
                // Fallback: Show slides without animation if Swiper fails
                document.querySelectorAll('.swiper-slide').forEach((slide, index) => {
                    console.log('Applying fallback display to slide', index);
                    slide.style.display = 'block';
                    slide.style.opacity = '1';
                    if (index > 0) slide.style.display = 'none'; // Only show first slide
                });
            }
        }, 300); // Reduced from 500ms to 300ms for faster initialization
    } else {
        console.error('ERROR: Swiper is not loaded! Attempting to load it dynamically...');
        
        // Fallback: Try to load Swiper dynamically if it failed to load
        const swiperCSS = document.createElement('link');
        swiperCSS.rel = 'stylesheet';
        swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        document.head.appendChild(swiperCSS);
        
        const swiperScript = document.createElement('script');
        swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        document.head.appendChild(swiperScript);
        
        swiperScript.onload = function() {
            console.log('Swiper loaded dynamically!');
            // Reinitialize after a short delay
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        };
        
        swiperScript.onerror = function() {
            console.error('Failed to load Swiper dynamically');
            // Apply fallback for all slides
            document.querySelectorAll('.swiper-slide').forEach(slide => {
                slide.style.display = 'block';
                slide.style.opacity = '1';
            });
        };
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize content animations
    initContentAnimations();
    
    // Initialize hero swiper
    initHeroSwiper();
    
    // Handle mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    });
    
    // Add CSS diagnostic to check if swiper is working
    console.log('DOM Content Loaded - animations.js');
    console.log('Swiper availability:', typeof Swiper !== 'undefined' ? 'Available' : 'Not available');
    console.log('Hero swiper element:', document.querySelector('.hero-swiper') ? 'Found' : 'Not found');
});