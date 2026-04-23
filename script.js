// ============================================
// Portfolio — Main Script
// ============================================

(function () {
  "use strict";

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // --- Navbar scroll effect ---
  const navbar = document.getElementById("navbar");

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // --- Hamburger Menu ---
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  if (hamburger && navLinks) {
    // Create overlay element
    const overlay = document.createElement("div");
    overlay.classList.add("nav-overlay");
    document.body.appendChild(overlay);

    const toggleMenu = () => {
      const isOpen = navLinks.classList.contains("open");
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("open");
      overlay.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", String(!isOpen));
      hamburger.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación"
      );
      document.body.style.overflow = !isOpen ? "hidden" : "";
    };

    const closeMenu = () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      overlay.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Abrir menú de navegación");
      document.body.style.overflow = "";
    };

    hamburger.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", closeMenu);

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        closeMenu();
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // --- Active nav link highlight on scroll (throttled with rAF) ---
  const sections = document.querySelectorAll("section[id]");

  if (sections.length > 0 && navLinks) {
    let navTicking = false;
    const navAnchors = navLinks.querySelectorAll("a");

    const highlightNav = () => {
      const scrollY = window.scrollY + 120;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navAnchors.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${sectionId}`;
            link.classList.toggle("is-active", isCurrent);
            if (isCurrent) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        }
      });

      navTicking = false;
    };

    window.addEventListener("scroll", () => {
      if (!navTicking) {
        requestAnimationFrame(highlightNav);
        navTicking = true;
      }
    }, { passive: true });
  }

  // --- Typing Effect ---
  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    const phrases = [
      "Desarrollador Full Stack",
      "Diseñador Web",
      "Freelancer Creativo",
      "AM Studio",
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeEffect, typingSpeed);
    }

    // Start after a small delay
    setTimeout(typeEffect, 1000);
  }

  // --- Animated Counter ---
  const statNumbers = document.querySelectorAll("[data-count]");

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-count"), 10);
            const duration = 2000;
            const start = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(target * eased);

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              }
            }

            requestAnimationFrame(updateCounter);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));
  }

  // --- Hero Particle Animation (optimized) ---
  const canvas = document.getElementById("hero-particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;
    let isAnimating = false;
    let width, height;

    function resizeCanvas() {
      const hero = document.getElementById("hero");
      if (!hero) return;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      // Reduced particle count for better performance
      const count = width < 600 ? 20 : 45;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    }

    // Squared distance threshold to avoid Math.sqrt per pair
    const connectionDistSq = 100 * 100;

    function drawParticles() {
      isAnimating = true;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(211, 254, 100, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections using squared distance (no sqrt)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(211, 254, 100, ${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(drawParticles);
    }

    function startParticles() {
      if (!isAnimating) {
        drawParticles();
      }
    }

    function stopParticles() {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      isAnimating = false;
    }

    // Only animate when hero is visible
    const heroSection = document.getElementById("hero");
    const particleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startParticles();
          } else {
            stopParticles();
          }
        });
      },
      { threshold: 0 }
    );

    resizeCanvas();
    createParticles();
    if (heroSection) particleObserver.observe(heroSection);

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 200);
    });
  }

  // --- Prefers reduced motion check ---
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReduced.matches && canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // --- Language Toggle functionality ---
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const activeLang = langToggle.querySelector(".active");
      const inactiveLang = langToggle.querySelector(":not(.active):not(.lang-divider)");
      
      if (activeLang && inactiveLang) {
        activeLang.classList.remove("active");
        inactiveLang.classList.add("active");
        
        // Example logic for actual translation can go here:
        // const currentLang = inactiveLang.classList.contains("lang-en") ? "en" : "es";
        // changeLanguage(currentLang);
      }
    });
  }

})();
