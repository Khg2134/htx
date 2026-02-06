// Mobile-First JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const navLinks = document.querySelectorAll('nav a');
    const starsContainer = document.getElementById('stars-background');
    
    // Performance: Debounce scroll events
    let scrollTimeout;
    
    // Mobile Menu Toggle
    function toggleMobileMenu() {
        const isActive = mainNav.classList.contains('active');
        if(mainNav) mainNav.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        if(mobileMenuBtn) mobileMenuBtn.innerHTML = isActive ? 
            '<i class="ph ph-list"></i>' : 
            '<i class="ph ph-x"></i>';
    }
    
    // Close mobile menu when clicking overlay or link
    function closeMobileMenu() {
        if(mainNav) mainNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        if(mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="ph ph-list"></i>';
    }
    
    // Event Listeners
    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking nav links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                closeMobileMenu();
            }
        });
    });
    
    // Create optimized stars background
    function createStars() {
        const starCount = window.innerWidth <= 767 ? 80 : 
                            window.innerWidth <= 1024 ? 120 : 150;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            const size = Math.random();
            let sizeClass = 'small';
            
            if (size > 0.9) sizeClass = 'large';
            else if (size > 0.7) sizeClass = 'medium';
            
            star.className = `star ${sizeClass}`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 8}s`;
            
            // Only add animation to visible stars
            if (Math.random() > 0.3) {
                star.style.animation = 'twinkle 8s infinite alternate';
            }
            
            starsContainer.appendChild(star);
        }
    }
    
    // Animate food cards on scroll with Intersection Observer
    function initScrollAnimations() {
        const foodCards = document.querySelectorAll('.food-card');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        foodCards.forEach((card, index) => {
            // Staggered animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }
    
    // Smooth scrolling for all anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Optimized scroll event for header
    function initScrollHeader() {
        let lastScrollTop = 0;
        const header = document.querySelector('header');
        
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Hide/show header on scroll
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
            }, 10); // Debounce delay
        }, { passive: true });
    }
    
    // Touch device optimizations
    function initTouchOptimizations() {
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            // Add touch-friendly classes
            document.body.classList.add('touch-device');
            
            // Remove hover effects on touch devices
            const style = document.createElement('style');
            style.textContent = `
                @media (hover: none) and (pointer: coarse) {
                    .food-card:hover {
                        transform: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function initAllSectionsAnimations() {
        const sections = document.querySelectorAll('.about-grid, .activities-grid, .team-grid, .gallery-grid, .contact-grid, .section-subtitle');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Initialize all functions
    function init() {
        createStars();
        initScrollAnimations();
        initAllSectionsAnimations(); 
        initSmoothScrolling();
        initScrollHeader();
        initTouchOptimizations();
        
        // Set initial header state
        window.dispatchEvent(new Event('scroll'));
    }
    
    // Handle resize events efficiently
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recreate stars on resize (for performance)
            starsContainer.innerHTML = '';
            createStars();
            
            // Auto-close mobile menu on desktop
            if (window.innerWidth > 767) {
                closeMobileMenu();
            }
        }, 250);
    }, { passive: true });
    
    
    // Initialize everything
    init();
    
    // Performance: Preload critical images (simulated)
    window.addEventListener('load', function() {
        // Add loaded class for potential CSS transitions
        document.body.classList.add('loaded');
    });
    
});