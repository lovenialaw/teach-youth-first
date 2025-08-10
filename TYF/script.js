// Logo refresh functionality
function refreshPage() {
    window.location.reload();
}

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

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Add scroll event listener for active navigation
window.addEventListener('scroll', updateActiveNavLink);

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
        if (accessRequestSection) accessRequestSection.style.display = 'none';
        if (galleryPreviewSection) galleryPreviewSection.style.display = 'none';
        if (fullGallerySection) fullGallerySection.style.display = 'block';
    } else {
        if (accessRequestSection) accessRequestSection.style.display = 'block';
        if (galleryPreviewSection) galleryPreviewSection.style.display = 'block';
        if (fullGallerySection) fullGallerySection.style.display = 'none';
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
document.querySelectorAll('.overview-section, .partners-categories, .team-content, .blog-content, .gallery-content, .programs-content').forEach(section => {
    fadeObserver.observe(section);
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

// Image Animation System
function initImageAnimations() {
    const profileImages = document.getElementById('profileImages');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const slideshowBtn = document.getElementById('slideshowBtn');
    const stopBtn = document.getElementById('stopBtn');

    if (!profileImages || !shuffleBtn || !slideshowBtn || !stopBtn) return;

    let slideshowInterval;
    let isSlideshowActive = false;

    // Shuffle functionality
    shuffleBtn.addEventListener('click', () => {
        const imageCards = profileImages.querySelectorAll('.image-card');
        const cardsArray = Array.from(imageCards);

        // Remove any existing animation classes
        cardsArray.forEach(card => {
            card.classList.remove('shuffling', 'slideshow', 'highlight');
        });

        // Shuffle the array
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
        }

        // Animate each card with shuffle effect
        cardsArray.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('shuffling');
                profileImages.appendChild(card);

                // Remove animation class after animation completes
                setTimeout(() => {
                    card.classList.remove('shuffling');
                }, 600);
            }, index * 150);
        });
    });

    // Slideshow functionality
    slideshowBtn.addEventListener('click', () => {
        if (isSlideshowActive) return;

        isSlideshowActive = true;
        slideshowBtn.textContent = '⏸️ Pause';
        slideshowBtn.style.background = 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))';

        const imageCards = profileImages.querySelectorAll('.image-card');
        let currentIndex = 0;

        slideshowInterval = setInterval(() => {
            // Remove previous highlight
            imageCards.forEach(card => card.classList.remove('highlight'));

            // Add highlight to current card
            imageCards[currentIndex].classList.add('highlight');

            // Move to next card
            currentIndex = (currentIndex + 1) % imageCards.length;
        }, 2000);
    });

    // Stop functionality
    stopBtn.addEventListener('click', () => {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }

        isSlideshowActive = false;
        slideshowBtn.textContent = '▶️ Slideshow';
        slideshowBtn.style.background = 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))';

        // Remove all animation classes
        const imageCards = profileImages.querySelectorAll('.image-card');
        imageCards.forEach(card => {
            card.classList.remove('shuffling', 'slideshow', 'highlight');
        });
    });

    // Add click interaction to individual cards
    const imageCards = profileImages.querySelectorAll('.image-card');
    imageCards.forEach(card => {
        card.addEventListener('click', () => {
            // Stop slideshow if active
            if (isSlideshowActive) {
                stopBtn.click();
            }

            // Add highlight effect
            card.classList.remove('highlight');
            void card.offsetWidth; // Trigger reflow
            card.classList.add('highlight');

            // Remove highlight after animation
            setTimeout(() => {
                card.classList.remove('highlight');
            }, 500);
        });
    });
}

// Enhanced Hero Section Animations
document.addEventListener('DOMContentLoaded', function () {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
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
    }

    // Animate stats when they come into view
    const statsContainer = document.querySelector('.stats-container');
    const stats = document.querySelectorAll('.stat-item');

    if (statsContainer && stats.length > 0) {
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

        statsObserver.observe(statsContainer);
    }

    // Animate numbers in stats
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        if (target) {
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
            }, { threshold: 0.5 });

            counterObserver.observe(counter);
        }
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

    // Initialize Image Animation System
    initImageAnimations();
});