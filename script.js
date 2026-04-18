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
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("open");
      overlay.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("open")
        ? "hidden"
        : "";
    };

    const closeMenu = () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
      overlay.classList.remove("active");
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

  // --- Active nav link highlight on scroll ---
  const sections = document.querySelectorAll("section[id]");

  if (sections.length > 0 && navLinks) {
    const highlightNav = () => {
      const scrollY = window.scrollY + 120;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.querySelectorAll("a").forEach((link) => {
            link.style.color = "";
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.style.color = "var(--accent-color)";
            }
          });
        }
      });
    };

    window.addEventListener("scroll", highlightNav, { passive: true });
  }
})();
