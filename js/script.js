/**
 * Portfolio JavaScript Suite
 * Standards: Modern Vanilla ES6+, WCAG 2.2 Level AA Accessible Interactions
 * Author: Hemabala J
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Theme Preference & Toggle (Dark / Light)
     ========================================================================== */
  const THEME_STORAGE_KEY = 'portfolio_theme_preference';
  const themeToggleBtn = document.getElementById('theme-toggle');

  /**
   * Determine the initial theme preference
   * Prioritizes localStorage, then OS system preference (prefers-color-scheme)
   */
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  /**
   * Apply theme to root document and update accessible button attributes
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update browser theme-color meta tag for mobile address bar harmony
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#f8f6fc' : '#0d0b18');
    }

    if (themeToggleBtn) {
      const isLight = theme === 'light';
      themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggleBtn.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      
      // Update toggle icon (Sun icon for light, Moon icon for dark)
      themeToggleBtn.innerHTML = isLight
        ? `<svg class="theme-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm5.657 3.05a1 1 0 0 1 0 1.414l-.707.708a1 1 0 1 1-1.414-1.415l.707-.707a1 1 0 0 1 1.414 0zM21 12a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm-3.05 5.657a1 1 0 0 1-1.415 0l-.707-.707a1 1 0 0 1 1.414-1.414l.708.707a1 1 0 0 1 0 1.414zM12 19a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm-6.364-.707a1 1 0 0 1 0-1.414l.707-.708a1 1 0 0 1 1.415 1.415l-.708.707a1 1 0 0 1-1.414 0zM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm1.05-6.364a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 1 1-1.414 1.414L6.05 5.636zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>`
        : `<svg class="theme-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.5-11.5A10 10 0 0 0 12.3 2zm-.3 18a8 8 0 1 1 6.3-12.9 8.1 8.1 0 0 1-6.3 12.9z"/></svg>`;
    }

    // Dispatch custom event for extensible listeners
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyTheme(newTheme);
    });
  }

  // Respond to OS theme preference changes if user hasn't set an explicit override
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  /* ==========================================================================
     2. Accessible Mobile Navigation Menu
     ========================================================================== */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (menuToggleBtn && primaryNav) {
    function toggleMobileMenu(open) {
      const isExpanded = open !== undefined ? open : menuToggleBtn.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;

      menuToggleBtn.setAttribute('aria-expanded', String(newState));
      menuToggleBtn.setAttribute('aria-label', newState ? 'Close navigation menu' : 'Open navigation menu');
      primaryNav.classList.toggle('is-active', newState);
      document.body.classList.toggle('menu-open', newState);

      // Morph Hamburger icon <-> Close "X" icon
      menuToggleBtn.innerHTML = newState
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

      if (newState) {
        // Focus first link in nav menu for seamless keyboard flow
        const firstLink = primaryNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    }

    menuToggleBtn.addEventListener('click', function () {
      toggleMobileMenu();
    });

    // Close menu when clicking on any nav link inside mobile menu
    const navLinks = primaryNav.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768 && menuToggleBtn.getAttribute('aria-expanded') === 'true') {
          toggleMobileMenu(false);
        }
      });
    });

    // Close menu on Escape key press (WCAG 2.1.1 & 2.1.2)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuToggleBtn.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu(false);
        menuToggleBtn.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (
        menuToggleBtn.getAttribute('aria-expanded') === 'true' &&
        !primaryNav.contains(e.target) &&
        !menuToggleBtn.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });

    // Reset when resizing past mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && menuToggleBtn.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu(false);
      }
    });
  }

  /* ==========================================================================
     3. Accessible Filter Controls (Projects & Skills)
     ========================================================================== */
  const filterContainers = document.querySelectorAll('[data-filter-group]');

  filterContainers.forEach(function (groupContainer) {
    const buttons = groupContainer.querySelectorAll('.filter-btn');
    const targetSelector = groupContainer.getAttribute('data-filter-target');
    const items = document.querySelectorAll(targetSelector);
    const liveAnnouncer = document.getElementById(groupContainer.getAttribute('data-filter-announcer'));

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        const filterVal = this.getAttribute('data-filter');

        // Update button pressed states
        buttons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
        this.setAttribute('aria-pressed', 'true');

        let visibleCount = 0;
        items.forEach(function (item) {
          const itemCategories = (item.getAttribute('data-category') || '').split(' ');
          const isMatch = filterVal === 'all' || itemCategories.includes(filterVal);

          if (isMatch) {
            item.removeAttribute('hidden');
            item.style.display = '';
            visibleCount++;
          } else {
            item.setAttribute('hidden', 'until-found');
            item.style.display = 'none';
          }
        });

        // Announce change to screen readers via aria-live
        if (liveAnnouncer) {
          const categoryName = button.textContent.trim();
          liveAnnouncer.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'item' : 'items'} in category: ${categoryName}`;
        }
      });
    });
  });

  /* ==========================================================================
     4. Accessible Contact Form Validation (WCAG 3.3.1, 3.3.2, 3.3.3)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    const fields = {
      fullname: {
        el: document.getElementById('fullname'),
        errorEl: document.getElementById('fullname-error'),
        validate: val => val.trim().length >= 2,
        errorMsg: 'Please enter your full name (at least 2 characters).'
      },
      email: {
        el: document.getElementById('email'),
        errorEl: document.getElementById('email-error'),
        validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
        errorMsg: 'Please enter a valid email address (e.g., name@example.com).'
      },
      subject: {
        el: document.getElementById('subject'),
        errorEl: document.getElementById('subject-error'),
        validate: val => val.trim().length >= 3,
        errorMsg: 'Please enter a subject (at least 3 characters).'
      },
      message: {
        el: document.getElementById('message'),
        errorEl: document.getElementById('message-error'),
        validate: val => val.trim().length >= 10,
        errorMsg: 'Please enter a message (at least 10 characters).'
      }
    };

    /**
     * Validate a single input field
     */
    function validateField(key, showFeedback = true) {
      const field = fields[key];
      if (!field.el) return true;

      const isValid = field.validate(field.el.value);

      if (!isValid && showFeedback) {
        field.el.setAttribute('aria-invalid', 'true');
        if (field.errorEl) {
          field.errorEl.textContent = field.errorMsg;
        }
      } else if (isValid) {
        field.el.removeAttribute('aria-invalid');
        if (field.errorEl) {
          field.errorEl.textContent = '';
        }
      }
      return isValid;
    }

    // Add live blur & input listeners for proactive feedback
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      if (field.el) {
        field.el.addEventListener('blur', function () {
          validateField(key, true);
        });

        field.el.addEventListener('input', function () {
          if (field.el.getAttribute('aria-invalid') === 'true') {
            validateField(key, true);
          }
        });
      }
    });

    // Form submission validation
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidField = null;
      let invalidCount = 0;

      Object.keys(fields).forEach(function (key) {
        const isValid = validateField(key, true);
        if (!isValid) {
          isFormValid = false;
          invalidCount++;
          if (!firstInvalidField && fields[key].el) {
            firstInvalidField = fields[key].el;
          }
        }
      });

      if (!isFormValid) {
        if (formStatus) {
          formStatus.setAttribute('data-state', 'error');
          formStatus.setAttribute('role', 'alert');
          formStatus.innerHTML = `<strong>Please fix the errors below:</strong> Found ${invalidCount} field ${invalidCount === 1 ? 'error' : 'errors'}. Check marked inputs.`;
        }
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
      } else {
        const senderName = fields.fullname.el.value.trim();
        contactForm.reset();

        Object.keys(fields).forEach(function (key) {
          fields[key].el.removeAttribute('aria-invalid');
          if (fields[key].errorEl) {
            fields[key].errorEl.textContent = '';
          }
        });

        if (formStatus) {
          formStatus.setAttribute('data-state', 'success');
          formStatus.setAttribute('role', 'status');
          formStatus.innerHTML = `
            <strong>Thank you, ${escapeHtml(senderName)}!</strong><br>
            Your message was validated successfully on the client side.<br>
            <small style="display:inline-block; margin-top:0.5rem; opacity:0.9;">
              <strong>Note on Email Delivery:</strong> This is a static portfolio demonstration. In production, this form connects to a backend endpoint or service (e.g., Formspree, EmailJS, or Node.js server) to dispatch emails directly to Hemabala J.
            </small>
          `;
          formStatus.focus();
        }
      }
    });
  }

  /**
   * Helper function to escape user input before rendering into HTML
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ==========================================================================
     5. Back to Top Smooth Keyboard Focus Management
     ========================================================================== */
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus({ preventScroll: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

})();
