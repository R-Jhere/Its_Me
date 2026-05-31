document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========================================
    // CONSTANTS
    // ========================================
    const GITHUB_USERNAME = 'R-Jhere';
    const GITHUB_CACHE_KEY = 'gh_stats_cache';
    const GITHUB_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    const cursor = document.getElementById('cursor');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.transform = 'translate(-50%, -50%)';
        });

        // Use event delegation on document to catch ALL interactive elements
        // (including ones added dynamically, e.g. by mobile menu)
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('.cursor-hover, a, button, input, textarea')) {
                cursor.style.width = '60px';
                cursor.style.height = '60px';
                cursor.style.backgroundColor = '#FBFF48';
                cursor.style.mixBlendMode = 'normal';
                cursor.style.border = '2px solid black';
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('.cursor-hover, a, button, input, textarea')) {
                cursor.style.width = '24px';
                cursor.style.height = '24px';
                cursor.style.backgroundColor = '#fff';
                cursor.style.mixBlendMode = 'difference';
                cursor.style.border = 'none';
            }
        }, true);
    }

    // ========================================
    // DARK MODE TOGGLE
    // ========================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
    const htmlEl = document.documentElement;

    function applyDarkMode(isDark) {
        if (isDark) {
            htmlEl.classList.add('dark');
        } else {
            htmlEl.classList.remove('dark');
        }
        // Update both toggle button icons
        updateToggleIcons(isDark);
    }

    function updateToggleIcons(isDark) {
        const toggles = [darkModeToggle, darkModeToggleMobile].filter(Boolean);
        toggles.forEach(btn => {
            const sunIcon = btn.querySelector('.ri-sun-line');
            const moonIcon = btn.querySelector('.ri-moon-line');
            if (sunIcon && moonIcon) {
                sunIcon.style.display = isDark ? 'none' : 'block';
                moonIcon.style.display = isDark ? 'block' : 'none';
            }
        });
    }

    function toggleDarkMode() {
        const isDark = !htmlEl.classList.contains('dark');
        applyDarkMode(isDark);
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch {
            // localStorage not available
        }
    }

    // Initialize dark mode: check localStorage, then OS preference
    function initDarkMode() {
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('theme');
        } catch {
            // localStorage not available
        }

        if (savedTheme === 'dark') {
            applyDarkMode(true);
        } else if (savedTheme === 'light') {
            applyDarkMode(false);
        } else {
            // Follow OS preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyDarkMode(prefersDark);
        }
    }

    initDarkMode();

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', toggleDarkMode);
    }

    // Listen for OS preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        let savedTheme = null;
        try { savedTheme = localStorage.getItem('theme'); } catch { }
        // Only auto-switch if user hasn't manually set a preference
        if (!savedTheme) {
            applyDarkMode(e.matches);
        }
    });

    // ========================================
    // GITHUB API (with caching + rate-limit handling)
    // ========================================

    /**
     * Safely update a DOM element's text content by ID.
     * Returns false if the element doesn't exist.
     */
    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            return true;
        }
        return false;
    }

    /**
     * Try to load GitHub stats from sessionStorage cache.
     * Returns null if cache is expired or missing.
     */
    function getCachedStats() {
        try {
            const raw = sessionStorage.getItem(GITHUB_CACHE_KEY);
            if (!raw) return null;
            const cached = JSON.parse(raw);
            if (Date.now() - cached.timestamp > GITHUB_CACHE_TTL) {
                sessionStorage.removeItem(GITHUB_CACHE_KEY);
                return null;
            }
            return cached.data;
        } catch {
            return null;
        }
    }

    /**
     * Save GitHub stats to sessionStorage cache.
     */
    function setCachedStats(data) {
        try {
            sessionStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch {
            // sessionStorage not available — silently ignore
        }
    }

    /**
     * Render GitHub stats into the DOM.
     */
    function renderGitHubStats(data) {
        setText('repos-count', data.public_repos ?? '0');
        setText('followers-count', data.followers ?? '0');

        if (data.created_at) {
            const date = new Date(data.created_at);
            setText('created-at', date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            }));
        }

        // Contribution count — approximation based on public data
        // For real contribution data, use the GitHub GraphQL API
        const contribValue = `${(data.public_repos * 20) + (data.followers * 5)}+`;
        setText('total-contributions', contribValue);
        setText('total-contributions-grid', contribValue);
    }

    /**
     * Render error fallback values.
     */
    function renderGitHubError(message) {
        setText('repos-count', '—');
        setText('followers-count', '—');
        setText('created-at', '—');
        setText('total-contributions', message);
    }

    /**
     * Fetch GitHub user stats with caching and rate-limit awareness.
     */
    async function fetchGitHubStats() {
        // Check cache first to avoid unnecessary API calls
        const cached = getCachedStats();
        if (cached) {
            renderGitHubStats(cached);
            return;
        }

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });

            // Handle rate limiting (403 with X-RateLimit headers)
            if (response.status === 403) {
                const resetTime = response.headers.get('X-RateLimit-Reset');
                const resetDate = resetTime ? new Date(resetTime * 1000) : null;
                const msg = resetDate
                    ? `Rate limited until ${resetDate.toLocaleTimeString()}`
                    : 'Rate limited';
                console.warn('GitHub API:', msg);
                renderGitHubError('Rate limited');
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            setCachedStats(data);
            renderGitHubStats(data);

        } catch (error) {
            console.error('GitHub API error:', error);
            renderGitHubError('API Error');
        }
    }

    fetchGitHubStats();

    // ========================================
    // CONTACT FORM HANDLER
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        let isSubmitting = false;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (isSubmitting) return;

            // Clear previous errors
            clearFormErrors();

            // Get form values
            const name = contactForm.querySelector('#contact-name');
            const email = contactForm.querySelector('#contact-email');
            const message = contactForm.querySelector('#contact-message');
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            // Validate
            let hasErrors = false;

            if (!name.value.trim()) {
                showInputError(name, 'Name is required');
                hasErrors = true;
            }

            if (!email.value.trim()) {
                showInputError(email, 'Email is required');
                hasErrors = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showInputError(email, 'Invalid email format');
                hasErrors = true;
            }

            if (!message.value.trim()) {
                showInputError(message, 'Message is required');
                hasErrors = true;
            } else if (message.value.trim().length < 10) {
                showInputError(message, 'Message must be at least 10 characters');
                hasErrors = true;
            }

            if (hasErrors) return;

            // Submit
            isSubmitting = true;
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
            hideFormStatus();

            try {
                const formData = new FormData(contactForm);

                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showFormStatus('success', '✓ TRANSMISSION SUCCESSFUL — Message received. I\'ll get back to you soon!');
                    contactForm.reset();
                } else {
                    const data = await response.json().catch(() => ({}));
                    const errorMsg = data.errors
                        ? data.errors.map(err => err.message).join(', ')
                        : 'Transmission failed. Please try again.';
                    showFormStatus('error', `✕ ERROR — ${errorMsg}`);
                }
            } catch (error) {
                showFormStatus('error', '✕ NETWORK ERROR — Check your connection and try again.');
            } finally {
                isSubmitting = false;
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
            }
        });
    }

    function showInputError(input, message) {
        input.classList.add('input-error');
        // Create error label
        const errorEl = document.createElement('span');
        errorEl.className = 'font-mono text-xs text-neo-red font-bold mt-1 block form-error-msg';
        errorEl.textContent = `> ${message}`;
        input.parentNode.appendChild(errorEl);
    }

    function clearFormErrors() {
        if (!contactForm) return;
        contactForm.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        contactForm.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    }

    function showFormStatus(type, message) {
        if (!formStatus) return;
        formStatus.className = `form-status show form-status-${type}`;
        formStatus.textContent = message;
    }

    function hideFormStatus() {
        if (!formStatus) return;
        formStatus.className = 'form-status';
        formStatus.textContent = '';
    }

    // ========================================
    // SCROLL REVEAL (IntersectionObserver) — Enhanced
    // ========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once revealed — saves resources
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ========================================
    // PARALLAX EFFECT (Hero decorative elements)
    // ========================================
    const parallaxElements = document.querySelectorAll('.parallax-element');

    if (parallaxElements.length > 0) {
        let parallaxTicking = false;

        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.dataset.speed) || 0.3;
                        const yOffset = -(scrollY * speed);
                        el.style.transform = `translateY(${yOffset}px)`;
                    });
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // SCROLL PROGRESS BAR (rAF-throttled)
    // ========================================
    const progressBar = document.getElementById('progressBar');

    if (progressBar) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // MILESTONES MARQUEE — JS-driven scroll
    // CSS animation runs as fallback until this loads
    // ========================================
    const milestonesContent = document.querySelector('#reports .marquee-content');

    if (milestonesContent) {
        // Disable CSS animation — JS takes over for smoother control
        milestonesContent.style.animation = 'none';

        let scrollPos = 0;
        const speed = 1; // pixels per frame (~60px/sec at 60fps)
        let lastTime = 0;

        function animateMarquee(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const delta = timestamp - lastTime;
            lastTime = timestamp;

            // Move at consistent speed regardless of frame rate
            scrollPos += speed * (delta / 16.67); // normalize to ~60fps

            // Reset when we've scrolled past half (the duplicate set)
            const halfWidth = milestonesContent.scrollWidth / 2;
            if (scrollPos >= halfWidth) {
                scrollPos = 0;
            }

            milestonesContent.style.transform = `translateX(-${scrollPos}px)`;
            requestAnimationFrame(animateMarquee);
        }

        requestAnimationFrame(animateMarquee);
    }

});
