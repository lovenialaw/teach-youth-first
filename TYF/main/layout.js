// Load shared nav & footer, set active page from body[data-page]
(function () {
    const page = document.body.dataset.page;

    function setActiveNav() {
        if (!page) return;
        document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
            link.classList.toggle('active', link.dataset.nav === page);
        });
    }

    function injectChrome() {
        const navSlot = document.getElementById('site-nav');
        const footerSlot = document.getElementById('site-footer');

        const tasks = [];

        if (navSlot) {
            tasks.push(
                fetch('partials/nav.html')
                    .then(r => r.text())
                    .then(html => { navSlot.innerHTML = html; })
            );
        }

        if (footerSlot) {
            tasks.push(
                fetch('partials/footer.html')
                    .then(r => r.text())
                    .then(html => { footerSlot.innerHTML = html; })
            );
        }

        return Promise.all(tasks).then(setActiveNav);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectChrome().then(() => {
                document.dispatchEvent(new CustomEvent('tyf:chrome-ready'));
            });
        });
    } else {
        injectChrome().then(() => {
            document.dispatchEvent(new CustomEvent('tyf:chrome-ready'));
        });
    }
})();
