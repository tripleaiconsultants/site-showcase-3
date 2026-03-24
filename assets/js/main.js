/**
* Template Name: BizLand
* Template URL: https://bootstrapmade.com/bizland-bootstrap-business-template/
* Updated: Dec 05 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
    
    // Close all dropdowns when closing mobile nav
    if (!document.querySelector('body').classList.contains('mobile-nav-active')) {
      document.querySelectorAll('.navmenu .dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
        const menu = dropdown.querySelector('ul');
        if (menu) {
          menu.classList.remove('dropdown-active');
        }
      });
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', (e) => {
      // Don't close menu if this is a dropdown parent link
      const isDropdownParent = navmenu.parentNode.classList.contains('dropdown') && 
                               navmenu.parentNode.querySelector('ul');
      
      if (document.querySelector('.mobile-nav-active') && !isDropdownParent) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get the parent <a> tag and the dropdown <li>
      const parentLink = this.parentNode;
      const dropdownLi = parentLink.parentNode;
      const dropdownMenu = dropdownLi.querySelector('ul');
      
      // Close all other dropdowns first
      document.querySelectorAll('.navmenu .dropdown').forEach(otherDropdown => {
        if (otherDropdown !== dropdownLi) {
          otherDropdown.classList.remove('active');
          const otherMenu = otherDropdown.querySelector('ul');
          if (otherMenu) {
            otherMenu.classList.remove('dropdown-active');
          }
        }
      });
      
      // Toggle current dropdown
      dropdownLi.classList.toggle('active');
      if (dropdownMenu) {
        dropdownMenu.classList.toggle('dropdown-active');
      }
    });
  });
  
  // Prevent parent link from navigating and trigger dropdown on mobile
  document.querySelectorAll('.navmenu .dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
      // Only prevent default on mobile
      if (window.innerWidth < 1200) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the parent <li> and the dropdown menu
        const dropdownLi = this.parentNode;
        const dropdownMenu = dropdownLi.querySelector('ul');
        
        // Close all other dropdowns first
        document.querySelectorAll('.navmenu .dropdown').forEach(otherDropdown => {
          if (otherDropdown !== dropdownLi) {
            otherDropdown.classList.remove('active');
            const otherMenu = otherDropdown.querySelector('ul');
            if (otherMenu) {
              otherMenu.classList.remove('dropdown-active');
            }
          }
        });
        
        // Toggle current dropdown
        dropdownLi.classList.toggle('active');
        if (dropdownMenu) {
          dropdownMenu.classList.toggle('dropdown-active');
        }
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   * Note: AOS init is delayed when page transitions are active
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  // Check if we're coming from a page transition
  window.addEventListener('load', function() {
    if (!sessionStorage.getItem('pageTransition')) {
      // No transition, init AOS immediately
      aosInit();
    }
    // If there IS a transition, AOS will be initialized after transition completes
    // (handled in the page transition system below)
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

/**
 * Dark Mode Toggle Functionality
 * Works with navigation menu toggle
 */

(function() {
  'use strict';

  // Check for saved dark mode preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the theme on page load (to both html and body for consistency)
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
  } else {
    // Ensure light mode - remove any leftover dark-mode class from html
    document.documentElement.classList.remove('dark-mode');
  }

  // Logo switching for dark mode with automatic path detection
  function updateLogo() {
    // Detect if we're in a subfolder (EL or CN)
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/EL/') || currentPath.includes('/CN/');
    const pathPrefix = isInSubfolder ? '../' : '';
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const darkLogo = pathPrefix + 'assets/img/logo-dark.png';
    const lightLogo = pathPrefix + 'assets/img/logo_gray.png';
    
    // Update header logo
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
      logoImg.src = isDarkMode ? darkLogo : lightLogo;
    }
    
    // Update service card logos
    const serviceCardLogos = document.querySelectorAll('.service-card .front img');
    serviceCardLogos.forEach(img => {
      img.src = isDarkMode ? darkLogo : lightLogo;
    });

    // Update footer logos
    const footerLogos = document.querySelectorAll('.footer-brand-logo');
    footerLogos.forEach(img => {
      img.src = isDarkMode ? darkLogo : lightLogo;
    });
  }
  
  // Toggle dark mode function
  function toggleDarkMode(e) {
    e.preventDefault();
    
    // Toggle on both html and body
    document.documentElement.classList.toggle('dark-mode');
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    
    // Update logo after toggling
    updateLogo();
  }

  // Initialize when DOM is ready
  function initDarkModeToggle() {
    const toggleButton = document.getElementById('darkModeToggle');
    
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleDarkMode);
    }
    
    // Update logo on initial load
    updateLogo();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkModeToggle);
  } else {
    initDarkModeToggle();
  }

  // Optional: Listen for system theme preference changes
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
    });
  }
})();

/**
 * Page Transition System - Smooth Physical Transitions
 * 3 types: zoom, slide, flip - each page gets a unique one
 */
(function() {
  'use strict';

  // Extract just the filename from a URL path
  function getFileName(url) {
    // Remove query strings and hashes
    let clean = url.split('?')[0].split('#')[0];
    // Remove leading ./ or ../
    clean = clean.replace(/^\.\.\//, '').replace(/^\.\//, '');
    // Get just the filename
    const parts = clean.split('/');
    return parts[parts.length - 1];
  }

  // Get transition type based on destination filename
  function getTransitionType(url) {
    const filename = getFileName(url);

    // Each page type gets a DIFFERENT transition for variety
    switch(filename) {
      // Service pages - each gets a unique transition
      case 'motor.html':
        return 'slide';    // Motor: slides in like a car
      case 'health.html':
        return 'flip';     // Health: flip like medical records
      case 'home.html':
        return 'zoom';     // Home insurance: zoom in
      case 'business.html':
        return 'slide';    // Business: professional slide

      // Going back to main homepage - use flip (like closing a folder/going back)
      case 'main.html':
        return 'flip';

      // Default
      default:
        return 'slide';
    }
  }

  // Create or get transition overlay
  function getTransitionOverlay() {
    let overlay = document.querySelector('.page-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  // Perform transition then navigate
  function transitionToPage(url, transitionType) {
    // Prevent double-clicks
    if (document.body.classList.contains('transitioning-out')) return;

    const overlay = getTransitionOverlay();
    
    document.body.classList.add('transitioning-out');
    document.body.setAttribute('data-transition', transitionType);

    // Show overlay to prevent white flash (inherits dark mode bg color from CSS)
    setTimeout(() => {
      overlay.classList.add('active');
    }, 150);

    // Store for incoming page
    sessionStorage.setItem('pageTransition', transitionType);
    // Also store dark mode state to restore on next page
    sessionStorage.setItem('darkModeTransition', document.body.classList.contains('dark-mode') ? 'true' : 'false');

    // Navigate after the exit animation plays
    setTimeout(() => {
      window.location.href = url;
    }, 280);
  }

  // Handle incoming transition on page load
  function handlePageLoad() {
    const transitionType = sessionStorage.getItem('pageTransition');
    const wasDarkMode = sessionStorage.getItem('darkModeTransition');

    if (transitionType) {
      sessionStorage.removeItem('pageTransition');
      sessionStorage.removeItem('darkModeTransition');

      const overlay = getTransitionOverlay();
      
      // If coming from dark mode, ensure overlay starts with dark background
      if (wasDarkMode === 'true') {
        overlay.style.backgroundColor = '#0a1929';
      }
      
      // Start with overlay visible to hide any flash
      overlay.classList.add('active');

      // Hide all AOS elements initially during transition
      document.body.classList.add('aos-delay-init');

      // Add class for incoming animation
      document.body.classList.add('transitioning-in');
      document.body.setAttribute('data-transition', transitionType);

      // Fade out overlay after a brief moment
      setTimeout(() => {
        overlay.classList.remove('active');
        overlay.style.backgroundColor = ''; // Reset to CSS-controlled color
      }, 100);

      // Clean up after animation and THEN start page animations
      setTimeout(() => {
        document.body.classList.remove('transitioning-in');
        document.body.removeAttribute('data-transition');
        document.body.classList.remove('aos-delay-init');

        // Initialize AOS AFTER transition completes
        if (typeof AOS !== 'undefined') {
          AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
          });
        }
      }, 450);
    }
  }

  // Intercept navigation clicks
  function interceptNavigation() {
    document.addEventListener('click', function(e) {
      // Match links containing .html (including those with hash fragments like main.html#hero)
      const link = e.target.closest('a[href*=".html"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href ||
          href.startsWith('#') ||
          href.startsWith('http://') ||
          href.startsWith('https://') ||
          link.hasAttribute('target') ||
          link.hasAttribute('data-transition-disabled')) {
        return;
      }

      // Check if this is a same-page anchor link (e.g., on main.html clicking main.html#about)
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const targetPage = getFileName(href);

      // If navigating to same page with just a hash change, let it scroll normally
      if (currentPage === targetPage && href.includes('#')) {
        return; // Don't intercept, let normal anchor behavior work
      }

      e.preventDefault();

      // Get transition type - check data attribute first, then use mapping
      let transitionType = link.getAttribute('data-transition');
      if (!transitionType) {
        transitionType = getTransitionType(href);
      }

      transitionToPage(href, transitionType);
    });
  }

  // Handle browser back/forward buttons - clear transition state
  window.addEventListener('pageshow', function(e) {
    // persisted = true means page was loaded from bfcache (back/forward cache)
    if (e.persisted) {
      // Clear any transition states to prevent lag/stuck animations
      sessionStorage.removeItem('pageTransition');
      sessionStorage.removeItem('darkModeTransition');
      
      // Reset body classes in case they were stuck
      document.body.classList.remove('transitioning-out', 'transitioning-in', 'aos-delay-init');
      document.body.removeAttribute('data-transition');
      
      // Hide overlay if visible
      const overlay = document.querySelector('.page-transition-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
    }
  });

  // Also handle popstate for hash changes and history navigation
  window.addEventListener('popstate', function() {
    // Clear transition states
    sessionStorage.removeItem('pageTransition');
    sessionStorage.removeItem('darkModeTransition');
    
    // Reset body classes
    document.body.classList.remove('transitioning-out', 'transitioning-in', 'aos-delay-init');
    document.body.removeAttribute('data-transition');
    
    // Hide overlay
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  });

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      handlePageLoad();
      interceptNavigation();
    });
  } else {
    handlePageLoad();
    interceptNavigation();
  }
})();
