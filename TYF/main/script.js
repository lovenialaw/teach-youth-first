// Modern JavaScript for Teach Youth First Website

document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize AOS (Animate On Scroll) — reference-style smooth reveals
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 650,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            delay: 0,
            disable: prefersReducedMotion
        });
    }

    // Page load: staggered reveal then mark ready
    const body = document.body;
    requestAnimationFrame(() => {
        body.classList.remove('page-loading');
        body.classList.add('page-ready');
    });

    const NAV_SCROLL_OFFSET = 88;

    function scrollToHashTarget(hash) {
        if (!hash || hash === '#') return false;
        const targetSection = document.querySelector(hash);
        if (!targetSection) return false;
        const offsetTop = targetSection.offsetTop - NAV_SCROLL_OFFSET;
        window.scrollTo({
            top: offsetTop,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        return true;
    }

    function initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navOverlay = document.getElementById('nav-overlay');
        if (!navToggle || !navMenu) return;

        function setNavOpen(isOpen) {
            navMenu.classList.toggle('active', isOpen);
            navToggle.classList.toggle('active', isOpen);
            if (navOverlay) navOverlay.classList.toggle('is-active', isOpen);
            body.classList.toggle('nav-open', isOpen);
            navOverlay?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        }

        navToggle.addEventListener('click', function () {
            setNavOpen(!navMenu.classList.contains('active'));
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', () => setNavOpen(false));
        }

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('a[href*="#"]').forEach(anchor => {
            const raw = anchor.getAttribute('href');
            if (!raw || raw === '#') return;
            const hashIndex = raw.indexOf('#');
            if (hashIndex === -1) return;
            const hash = raw.slice(hashIndex);
            if (!document.querySelector(hash)) return;

            const linkPage = hashIndex > 0 ? raw.slice(0, hashIndex).replace(/^\.\//, '') : '';
            const isSamePageHash = !linkPage || linkPage === currentPage;

            if (!isSamePageHash) return;

            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                scrollToHashTarget(hash);
                if (anchor.classList.contains('nav-link')) {
                    setNavOpen(false);
                }
            });
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => setNavOpen(false));
        });
    }

    function scrollToInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            requestAnimationFrame(() => scrollToHashTarget(hash));
        }
    }

    // FAQ Accordion — smooth open/close
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });

            item.classList.toggle('active', !isActive);
        });
    });

    // Navbar scroll state (class-based, no inline color overrides)
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');

    function updateNavbar() {
        if (!navbar) return;
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 48);
    }

    // Scroll reveal for major blocks without AOS
    if (!prefersReducedMotion) {
        const revealTargets = document.querySelectorAll(
            '.partner-item, .program-detail-inner, .impact-card, .impact-story, .testimonial-card, .team-profile, .contact-content'
        );
        revealTargets.forEach(el => el.classList.add('scroll-reveal'));

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

        // Subtle scale when sections enter viewport
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-in-view');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.section').forEach(section => sectionObserver.observe(section));
    }

    // Counter Animation for Impact Stats
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'), 10);
                const duration = 2000;
                const step = target / (duration / 16);
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

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Form submission handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const name = this.querySelector('input[type="text"]')?.value;
            const email = this.querySelector('input[type="email"]')?.value;
            const message = this.querySelector('textarea')?.value;

            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (submitBtn) submitBtn.classList.add('is-loading');

            setTimeout(() => {
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                this.reset();
                if (submitBtn) submitBtn.classList.remove('is-loading');
            }, 600);
        });
    }

    const partnerForm = document.querySelector('.partner-inquiry-form');
    if (partnerForm) {
        partnerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const organization = this.querySelector('#partner-org-name')?.value?.trim();
            const orgType = this.querySelector('#partner-org-type')?.value;
            const contactName = this.querySelector('#partner-contact-name')?.value?.trim();
            const email = this.querySelector('#partner-email')?.value?.trim();
            const phone = this.querySelector('#partner-phone')?.value?.trim();
            const location = this.querySelector('#partner-location')?.value?.trim();
            const message = this.querySelector('#partner-message')?.value?.trim();

            if (!organization || !orgType || !contactName || !email || !phone || !location || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (submitBtn) submitBtn.classList.add('is-loading');

            setTimeout(() => {
                showNotification(
                    'Thank you! Our Partnerships Team will contact you within 5–7 business days.',
                    'success'
                );
                this.reset();
                if (submitBtn) submitBtn.classList.remove('is-loading');
            }, 600);
        });
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => notification.classList.add('is-visible'));

        setTimeout(() => {
            notification.classList.remove('is-visible');
            setTimeout(() => notification.remove(), 350);
        }, 5000);
    }

    // Gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery-item, .collage-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (!img) return;
            openLightbox(img.src, img.alt);
        });
    });

    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt || ''}">
                <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => lightbox.classList.add('is-open'));

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            setTimeout(() => lightbox.remove(), 320);
        }

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        const onEscape = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', onEscape);
            }
        };
        document.addEventListener('keydown', onEscape);
    }

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.type = 'button';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    function updateScrollToTop() {
        scrollToTopBtn.classList.toggle('is-visible', window.scrollY > 500);
    }

    // Program overview cards: full-card click navigates to detail anchor
    document.querySelectorAll('.program-overview-card').forEach(card => {
        const jump = card.querySelector('.program-overview-jump');
        if (!jump) return;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.program-overview-jump')) return;
            jump.click();
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                jump.click();
            }
        });

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
    });

    // Performance: debounce scroll handlers
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    const debouncedUpdateNavbar = debounce(updateNavbar, 12);
    const debouncedScrollToTop = debounce(updateScrollToTop, 12);

    window.addEventListener('scroll', debouncedUpdateNavbar);
    window.addEventListener('scroll', debouncedScrollToTop);

    // Gallery Navigation
    window.scrollGallery = function (direction) {
        const gallery = document.querySelector('.gallery-collage');
        if (!gallery) return;
        const scrollAmount = 400;

        gallery.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    };

    // Counter Animation for Impact Section (data-target)
    function animateCounters() {
        const impactCounters = document.querySelectorAll('.stat-number[data-target]');

        impactCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };

            updateCounter();
        });
    }

    const impactSection = document.getElementById('impact');
    if (impactSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(impactSection);
    }

    // Education interactive hotspots — click dots to reveal sliding yellow callouts
    const eduSection = document.querySelector('.education-interactive');

    if (eduSection) {
        const eduHotspots = eduSection.querySelectorAll('.edu-hotspot');
        const eduCallouts = eduSection.querySelectorAll('.edu-callout');

        function setCalloutOpen(callout, open) {
            callout.classList.toggle('is-visible', open);
            callout.setAttribute('aria-hidden', open ? 'false' : 'true');
            callout.querySelectorAll('.edu-callout-box').forEach(box => {
                box.setAttribute('aria-hidden', open ? 'false' : 'true');
            });
        }

        function toggleEduCallout(hotspot) {
            const calloutId = hotspot.getAttribute('data-callout');
            const callout = calloutId ? document.getElementById(calloutId) : null;
            if (!callout) return;

            const isOpen = callout.classList.contains('is-visible');
            setCalloutOpen(callout, !isOpen);
            hotspot.classList.toggle('is-active', !isOpen);
            hotspot.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        }

        eduHotspots.forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleEduCallout(hotspot);
            });
        });
    }

    // Mission / Vision cards — GPU-smooth stack on scroll
    function initMissionVisionStack() {
        const pin = document.querySelector('[data-mv-stack]');
        if (!pin) return;

        const mission = pin.querySelector('.mv-card--mission');
        const vision = pin.querySelector('.mv-card--vision');
        if (!mission || !vision) return;

        const mq = window.matchMedia('(max-width: 768px)');
        const STICKY_TOP = NAV_SCROLL_OFFSET + 16;
        const STACK_PEEK = 34;
        const RUNWAY_MIN = 420;

        let metrics = null;
        let isClosed = false;
        let rafId = null;

        function computeMetrics() {
            const missionHeight = mission.offsetHeight;
            const gapOpen = Math.max(80, Math.round(missionHeight * 0.38));
            const gapClosed = -(missionHeight - STACK_PEEK);
            const runway = Math.max(RUNWAY_MIN, window.innerHeight * 0.55);
            return { missionHeight, gapOpen, gapClosed, runway, travel: gapClosed - gapOpen };
        }

        function resetStack() {
            metrics = null;
            isClosed = false;
            vision.style.removeProperty('margin-top');
            vision.style.removeProperty('transform');
            pin.style.removeProperty('min-height');
            pin.classList.remove('mv-stack-pin--closed');
        }

        function layoutStack() {
            if (mq.matches || prefersReducedMotion) {
                resetStack();
                return;
            }

            metrics = computeMetrics();
            pin.style.minHeight = `${window.innerHeight + metrics.missionHeight + metrics.runway}px`;
            vision.style.marginTop = `${metrics.gapOpen}px`;
            vision.style.transform = 'translate3d(0, 0, 0)';
            paintStack();
        }

        function paintStack() {
            if (!metrics || mq.matches || prefersReducedMotion) return;

            const scrolled = STICKY_TOP - pin.getBoundingClientRect().top;
            const progress = Math.min(1, Math.max(0, scrolled / metrics.runway));
            const ty = metrics.travel * progress;

            vision.style.transform = `translate3d(0, ${ty}px, 0)`;

            const closed = progress > 0.96;
            if (closed !== isClosed) {
                isClosed = closed;
                pin.classList.toggle('mv-stack-pin--closed', closed);
            }
        }

        function onScroll() {
            if (!metrics || mq.matches || prefersReducedMotion) return;
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                paintStack();
                rafId = null;
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', layoutStack);
        if (mq.addEventListener) {
            mq.addEventListener('change', layoutStack);
        }

        pin.querySelectorAll('img').forEach((img) => {
            if (!img.complete) {
                img.addEventListener('load', layoutStack, { once: true });
            }
        });

        layoutStack();
    }

    function initImpactGallery() {
        const gallery = document.querySelector('.impact-gallery');
        const track = gallery?.querySelector('.impact-gallery-track');
        if (!gallery || !track || prefersReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        }, { threshold: 0.08 });

        observer.observe(gallery);
    }

    function onChromeReady() {
        initNavigation();
        scrollToInitialHash();
        updateNavbar();
    }

    if (document.getElementById('nav-toggle')) {
        onChromeReady();
    } else {
        document.addEventListener('tyf:chrome-ready', onChromeReady, { once: true });
    }

    initMissionVisionStack();
    initImpactGallery();

    updateNavbar();
    updateScrollToTop();
});
