document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    initThemeToggle();
  });
  
  // Load the Navbar component dynamically
  async function loadNavbar() {
    const placeholder = document.getElementById("navbar-placeholder");
    if (!placeholder) return;
  
    try {
      const response = await fetch("components/navbar.html");
      if (response.ok) {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        placeholder.innerHTML = doc.body.innerHTML;
        
        // After injection, set active link and initialize theme button
        setActiveLink();
        initThemeToggleBtn();
      } else {
        console.error("Failed to load navbar:", response.status);
      }
    } catch (error) {
      console.error("Error fetching navbar:", error);
    }
  }
  
  // Set the active link based on current page
  function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.replace('.html', '');
    
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      // Clean up dataset reading
      if (link.dataset.page === pageName || (currentPage === '' && link.dataset.page === 'index')) {
        link.classList.add('active');
      }
    });
  }
  
  // Global theme initialization
  function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
  
  // Initialize the theme toggle button (called after navbar is loaded)
  function initThemeToggleBtn() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
  
    // Set initial icon
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    toggleBtn.textContent = currentTheme === 'light' ? '☀️' : '🌙';
  
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      toggleBtn.textContent = newTheme === 'light' ? '☀️' : '🌙';
      
      // Add a tiny popping animation class
      toggleBtn.classList.remove('pop');
      void toggleBtn.offsetWidth; // Trigger reflow for animation restart
      toggleBtn.classList.add('pop');
    });
  }
  
  // Simple typing effect utility (can be used across pages)
  class TypeWriter {
    constructor(element, words, wait = 3000) {
      this.element = element;
      this.words = words;
      this.txt = '';
      this.wordIndex = 0;
      this.wait = parseInt(wait, 10);
      this.type();
      this.isDeleting = false;
    }
  
    type() {
      const current = this.wordIndex % this.words.length;
      const fullTxt = this.words[current];
  
      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }
  
      this.element.innerHTML = `<span class="txt">${this.txt}</span>`;
  
      let typeSpeed = 100; // hacking typing speed
  
      if (this.isDeleting) {
        typeSpeed /= 2;
      }
  
      if (!this.isDeleting && this.txt === fullTxt) {
        typeSpeed = this.wait;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.wordIndex++;
        typeSpeed = 500;
      }
  
      setTimeout(() => this.type(), typeSpeed);
    }
  }
  
  // Initialize typewriter if element exists
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      const typeElement = document.querySelector('.typewrite');
      if (typeElement) {
        const words = JSON.parse(typeElement.getAttribute('data-words'));
        const wait = typeElement.getAttribute('data-wait');
        new TypeWriter(typeElement, words, wait);
      }
    }, 100);
  });
