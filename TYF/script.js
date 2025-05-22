// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const menuItems = document.querySelector('.menu-items');
const ctaButtons = document.querySelector('.cta-buttons');

hamburger.addEventListener('click', () => {
    menuItems.classList.toggle('active');
    ctaButtons.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.menu-items a').forEach(link => {
    link.addEventListener('click', () => {
        menuItems.classList.remove('active');
        ctaButtons.classList.remove('active');
    });
});

// Counter animation
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        counter.textContent = Math.floor(current);
        if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
        }
    }, 20);
};

// Intersection Observer for counter animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target.querySelector('.counter');
            const target = parseInt(entry.target.dataset.count);
            animateCounter(counter, target);
            observer.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.stat-item').forEach(item => {
    observer.observe(item);
});

// Gallery Access System
const API_URL = 'http://localhost:3000/api';

// Check for access token in URL
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('token');

// Function to verify access token
async function verifyAccess(token) {
    try {
        const response = await fetch(`${API_URL}/verify-access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error verifying access:', error);
        return false;
    }
}

// Function to show/hide gallery sections
function toggleGallerySections(hasAccess) {
    const accessRequestSection = document.getElementById('accessRequestSection');
    const galleryPreviewSection = document.getElementById('galleryPreviewSection');
    const fullGallerySection = document.getElementById('fullGallerySection');

    if (hasAccess) {
        accessRequestSection.style.display = 'none';
        galleryPreviewSection.style.display = 'none';
        fullGallerySection.style.display = 'block';
    } else {
        accessRequestSection.style.display = 'block';
        galleryPreviewSection.style.display = 'block';
        fullGallerySection.style.display = 'none';
    }
}

// Check access on page load
if (accessToken) {
    verifyAccess(accessToken).then(hasAccess => {
        toggleGallerySections(hasAccess);
        if (hasAccess) {
            // Store token in localStorage for future visits
            localStorage.setItem('galleryAccessToken', accessToken);
        }
    });
} else {
    // Check localStorage for stored token
    const storedToken = localStorage.getItem('galleryAccessToken');
    if (storedToken) {
        verifyAccess(storedToken).then(hasAccess => {
            toggleGallerySections(hasAccess);
            if (!hasAccess) {
                localStorage.removeItem('galleryAccessToken');
            }
        });
    }
}

// Gallery Access Request Form
const accessForm = document.getElementById('accessForm');
if (accessForm) {
    accessForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            organization: document.getElementById('organization').value,
            purpose: document.getElementById('purpose').value,
            message: document.getElementById('message').value
        };

        try {
            // Submit request to server
            const response = await fetch(`${API_URL}/request-access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Thank you for your request. We will review your application and contact you via email if approved.');
                accessForm.reset();
            } else {
                alert('There was an error submitting your request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('There was an error submitting your request. Please try again.');
        }
    });
}

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Intersection Observer for fade-in animations
const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, fadeObserverOptions);

// Observe sections for fade-in animation
document.querySelectorAll('.overview-section, .partners-categories, .team-content, .blog-content, .gallery-content').forEach(section => {
    fadeObserver.observe(section);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }

    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll Down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll Up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Enhanced FAQ Toggle Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.onclick = function () {
                const isActive = item.classList.contains('active');

                // Close all other items with animation
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item with animation
                if (!isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            };
        }
    });
}

// Initialize FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initFAQ();
});

// Enhanced Hero Section Animations
document.addEventListener('DOMContentLoaded', function () {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    // Parallax effect on mouse move
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        heroContent.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });

    // Reset position on mouse leave
    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
    });

    // Animate stats when they come into view
    const statsContainer = document.querySelector('.stats-container');
    const stats = document.querySelectorAll('.stat-item');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statsContainer.classList.add('visible');
                stats.forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // Animate numbers in stats
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counterObserver.observe(counter);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});