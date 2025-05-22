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