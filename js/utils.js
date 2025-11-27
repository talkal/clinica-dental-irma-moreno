/**
 * Utility Functions
 * Reusable helper functions for common tasks
 */

(function(window) {
  'use strict';

  // Create utils namespace
  window.Utils = {
    /**
     * Smooth scroll to element
     * @param {string} selector - CSS selector for target element
     * @param {number} offset - Offset from top in pixels
     */
    smoothScroll: function(selector, offset = 0) {
      const element = document.querySelector(selector);
      if (!element) return;

      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    },

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function}
     */
    debounce: function(func, wait = 250) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function}
     */
    throttle: function(func, limit = 250) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Get query parameter from URL
     * @param {string} param - Parameter name
     * @returns {string|null}
     */
    getQueryParam: function(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    },

    /**
     * Format phone number for tel: link
     * @param {string} phone - Phone number
     * @returns {string}
     */
    formatPhoneLink: function(phone) {
      return 'tel:' + phone.replace(/\s+/g, '');
    },

    /**
     * Format email for mailto: link
     * @param {string} email - Email address
     * @param {string} subject - Email subject (optional)
     * @returns {string}
     */
    formatEmailLink: function(email, subject = '') {
      let link = 'mailto:' + email;
      if (subject) {
        link += '?subject=' + encodeURIComponent(subject);
      }
      return link;
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean}
     */
    isInViewport: function(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Lazy load images
     * Add 'data-src' attribute to img tags with loading="lazy"
     */
    lazyLoadImages: function() {
      if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      } else {
        // Fallback for older browsers
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => imageObserver.observe(img));
      }
    },

    /**
     * Set active navigation link based on current page
     */
    setActiveNavLink: function() {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.nav__link');

      navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/index.html')) {
          link.classList.add('nav__link--active');
          link.setAttribute('aria-current', 'page');
        }
      });
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise}
     */
    copyToClipboard: async function(text) {
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return Promise.resolve();
        } catch (err) {
          document.body.removeChild(textArea);
          return Promise.reject(err);
        }
      }
    },

    /**
     * Format date to locale string
     * @param {Date|string} date - Date to format
     * @param {string} locale - Locale string (default: 'en-US')
     * @returns {string}
     */
    formatDate: function(date, locale = 'en-US') {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    /**
     * Detect if user prefers reduced motion
     * @returns {boolean}
     */
    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Detect if user is on mobile device
     * @returns {boolean}
     */
    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Get current breakpoint
     * @returns {string} - 'mobile', 'tablet', or 'desktop'
     */
    getBreakpoint: function() {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    },

    /**
     * Trap focus within an element (for modals)
     * @param {HTMLElement} element - Element to trap focus in
     */
    trapFocus: function(element) {
      const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      });

      // Focus first element
      if (firstFocusable) {
        firstFocusable.focus();
      }
    },

    /**
     * Simple toast notification
     * @param {string} message - Message to display
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds
     */
    toast: function(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `alert alert--${type}`;
      toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideInRight 0.3s ease;';
      toast.setAttribute('role', 'alert');
      toast.innerHTML = `<div class="alert__body">${message}</div>`;

      // Add animation keyframes if not already present
      if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(toast);

      // Remove after duration
      setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Utils.lazyLoadImages();
      Utils.setActiveNavLink();
    });
  } else {
    Utils.lazyLoadImages();
    Utils.setActiveNavLink();
  }

  // Add smooth scroll to all anchor links
  document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute('href') !== '#') {
      e.preventDefault();
      Utils.smoothScroll(anchor.getAttribute('href'), 80);
    }
  });

})(window);
