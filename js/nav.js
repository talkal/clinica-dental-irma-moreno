/**
 * Mobile Navigation
 * Handles responsive navigation menu toggle
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__list');

    if (!navToggle || !navMenu) {
      return; // No mobile nav on this page
    }

    // Toggle menu on button click
    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on a nav link
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && navMenu.classList.contains('nav__list--open')) {
        closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('nav__list--open')) {
        closeMenu();
        navToggle.focus(); // Return focus to toggle button
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Close menu if window is resized to desktop size
        if (window.innerWidth >= 768 && navMenu.classList.contains('nav__list--open')) {
          closeMenu();
        }
      }, 250);
    });
  }

  function toggleMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__list');

    const isOpen = navMenu.classList.toggle('nav__list--open');
    navToggle.classList.toggle('nav__toggle--open');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__list');

    navMenu.classList.remove('nav__list--open');
    navToggle.classList.remove('nav__toggle--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

})();
