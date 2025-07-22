// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initParticles();
    initScrollAnimations();
    initContactForm();
    initNavbarScroll();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('show');
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('show')) {
                icon.className = 'fas fa-times text-xl';
            } else {
                icon.className = 'fas fa-bars text-xl';
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}


// Floating Particles Animation
function initParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = Math.random() * 3 + 2 + 's';
        particle.style.opacity = Math.random();
        particle.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }
    
    // Create particles at intervals
    setInterval(createParticle, 300);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.add('fade-in-up');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));
    
    // Observe skill badges
    const skillBadges = document.querySelectorAll('.skill-badge');
    skillBadges.forEach(badge => observer.observe(badge));
    
    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => observer.observe(card));
}

// Contact Form Handling
// In script.js, replace the old function with this one

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Add loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        const formData = new FormData(contactForm);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        const json = JSON.stringify(object);
        
        fetch('/.netlify/functions/submit-form', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: json
})
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                console.log(response);
                showMessage(jsonResponse.message, 'error');
            }
        })
        .catch(error => {
            console.log(error);
            showMessage('Something went wrong! Please try again.', 'error');
        })
        .finally(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Simulate form submission (replace with actual implementation)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Show success/error messages
function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `${type}-message`;
    message.textContent = text;
    
    // Add to contact form
    const contactForm = document.getElementById('contact-form');
    contactForm.appendChild(message);
    
    // Show message with animation
    setTimeout(() => message.classList.add('show'), 100);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 5000);
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('nav');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.05)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Utility function for throttling scroll events
function throttle(func, wait) {
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

// Add scroll-to-top functionality
function addScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-all z-50 opacity-0 pointer-events-none';
    scrollBtn.id = 'scroll-to-top';
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'auto';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.pointerEvents = 'none';
        }
    }, 100));
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top after DOM load
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Add active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-purple-400');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-purple-400');
        }
    });
}

// Add scroll listener for active nav links
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// Preloader (optional)
function addPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
            <div class="flex flex-col items-center">
                <div class="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-white text-xl gradient-text">Loading...</p>
            </div>
        </div>
    `;
    
    document.body.prepend(preloader);
    
    // Hide preloader when page is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 1000);
    });
}

// Initialize preloader
addPreloader();