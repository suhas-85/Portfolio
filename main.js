/**
 * main.js
 * Adds interactivity, handles theme toggling, mobile navigation menu,
 * scroll reveals, scroll tracking, and client-side contact form validation.
 */

// Wait until the HTML document is fully loaded and parsed before running JS
document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. DYNAMIC FOOTER YEAR ====================
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    // Automatically sets copyright year to the current calendar year
    footerYear.textContent = new Date().getFullYear();
  }

  // ==================== 2. THEME SWITCHER (DARK/LIGHT) ====================
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check user preferences: look in LocalStorage first, fallback to system preferences
  const savedTheme = localStorage.getItem('theme');
  // window.matchMedia lets us check if user's OS has light mode enabled
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  // Set default theme: default is dark unless light is stored or preferred by OS
  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme'); // default is dark
  }

  // Handle clicking the theme toggle button
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
      // Switch to Dark Mode (default: remove attribute)
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      // Switch to Light Mode
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });

  // ==================== 3. MOBILE MENU TOGGLE ====================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Open/Close menu overlay when clicking hamburger
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active'); // Animates Hamburger to "X"
    navMenu.classList.toggle('mobile-active'); // Slides navigation overlay in/out
  });

  // Automatically close menu overlay when clicking any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('mobile-active');
    });
  });

  // ==================== 4. SCROLL REVEAL (Intersection Observer) ====================
  // Selects all HTML components we want to fade/slide in on scroll
  const revealElements = document.querySelectorAll('.reveal');

  // IntersectionObserver lets us monitor when elements enter the viewport
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Is the element visible on screen?
      if (entry.isIntersecting) {
        entry.target.classList.add('active'); // Triggers CSS transition
        // Once visible, stop observing this element (saves performance)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Triggers when 15% of the element is visible on screen
    rootMargin: '0px 0px -50px 0px' // Offsets check slightly from bottom boundary
  });

  // Attach observer to each element
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==================== 5. ACTIVE LINK TRACKING ON SCROLL ====================
  // Dynamically highlights current navbar link based on scroll position
  const sections = document.querySelectorAll('section');

  const scrollActiveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all links, then add to current section link
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3, // Triggers when 30% of the section takes up the screen
    rootMargin: '-80px 0px -40% 0px' // Adjusts for top sticky header offset
  });

  sections.forEach(section => {
    scrollActiveObserver.observe(section);
  });

  // ==================== 6. CONTACT FORM VALIDATION ====================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents default form loading/refreshing behavior

    // Grab input fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Assume form is valid initially
    let isValid = true;

    // Helper: clears existing errors on a field
    const clearError = (input) => {
      const formGroup = input.parentElement;
      formGroup.classList.remove('has-error');
    };

    // Helper: triggers validation error state
    const showError = (input) => {
      const formGroup = input.parentElement;
      formGroup.classList.add('has-error');
      isValid = false;
    };

    // 1. Validate Name (cannot be empty or whitespace)
    clearError(nameInput);
    if (!nameInput.value.trim()) {
      showError(nameInput);
    }

    // 2. Validate Email (regex checks format validation)
    clearError(emailInput);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput);
    }

    // 3. Validate Message (cannot be empty)
    clearError(messageInput);
    if (!messageInput.value.trim()) {
      showError(messageInput);
    }

    // Stop execution if any validation checks fail
    if (!isValid) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Please fill out all fields correctly.';
      return;
    }

    // If validation passes, simulate form submission
    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending message...';

    // Disable button to prevent duplicate submissions
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.disabled = true;

    // Simulate Server Request using setTimeout (2 seconds)
    setTimeout(() => {
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Thank you! Your message has been sent successfully.';

      // Clear input fields
      contactForm.reset();
      
      // Re-enable submit button
      submitBtn.disabled = false;
      
      // Fade out success message after 5 seconds
      setTimeout(() => {
        formStatus.textContent = '';
      }, 5000);

    }, 2000);
  });
});
