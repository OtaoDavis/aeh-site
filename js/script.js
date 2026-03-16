/**
 * AEH GLOBAL SCRIPT
 * Version: Institutional Premium
 * Features: Loader, Page Transitions, Mobile Menu, Video Modal, Active Nav, Faculty Tabs, Problem Cards
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 0. DEFINITIONS ---
  const preloader = document.getElementById("aeh-loader");
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  // --- 1. LOADER HIDE LOGIC ---
  const hideLoader = () => {
    if (!preloader) return;
    setTimeout(() => {
      preloader.classList.add("loader-finished");
      document.body.classList.remove("content-hidden");
    }, 1000); // 1s mandatory pulse
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }

  // --- 2. AUTOMATIC ACTIVE NAV LINK LOGIC ---
  const currentUrl = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (currentUrl === linkHref) {
      link.classList.add("active-link");
    }
    // Home cases
    if (
      (currentUrl === "" || currentUrl === "index.html") &&
      linkHref === "index.html"
    ) {
      link.classList.add("active-link");
    }
  });

  // --- 3. GLOBAL REDIRECTION LOGIC (Page Transitions) ---
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const destination = link.getAttribute("href");
      if (
        destination &&
        !destination.startsWith("#") &&
        !destination.startsWith("http") &&
        !destination.startsWith("mailto:") &&
        !destination.startsWith("tel:") &&
        link.target !== "_blank" &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        if (preloader) preloader.classList.remove("loader-finished");
        setTimeout(() => {
          window.location.href = destination;
        }, 500);
      }
    });
  });

  // --- 4. HAMBURGER MENU LOGIC ---
  const hamburgerBtn = document.querySelector('.hamburger');
  const navLinksEl = document.querySelector('.nav-links');

  if (hamburgerBtn && navLinksEl) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.toggle('nav-open');
    });

    // Close menu when a nav link is clicked
    navLinksEl.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (document.body.classList.contains('nav-open') &&
          !navLinksEl.contains(e.target) &&
          !hamburgerBtn.contains(e.target)) {
        document.body.classList.remove('nav-open');
      }
    });
  }

  // --- 5. INTERACTIVE FACULTY TABS (Network Page) ---
  const facultyTabs = document.querySelectorAll(".faculty-tab");
  facultyTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const wrapper = this.closest(".faculties-interactive-wrapper");
      const targetId = this.dataset.target;
      const targetContent = document.getElementById(targetId);

      if (wrapper && targetContent) {
        wrapper
          .querySelectorAll(".faculty-tab")
          .forEach((t) => t.classList.remove("active"));
        wrapper
          .querySelectorAll(".faculty-programs")
          .forEach((p) => p.classList.remove("active"));
        this.classList.add("active");
        targetContent.classList.add("active");
      }
    });
  });

  // 3. Swipers
  // --- Hero Swiper Initialization ---
  const heroSwiper = new Swiper(".hero-swiper", {
    autoHeight: false,
    direction: "horizontal",
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 1500,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const uniPortfolio = new Swiper(".university-portfolio-swiper", {
    loop: true,
    speed: 1200,
    grabCursor: true,
    navigation: { nextEl: ".uni-next", prevEl: ".uni-prev" },
    pagination: {
      el: ".uni-fraction",
      type: "fraction",
      formatFractionCurrent: (n) => (n < 10 ? "0" + n : n),
      formatFractionTotal: (n) => (n < 10 ? "0" + n : n),
    },
  });

  // --- 7. PORTAL SWITCHER (Network Page Sidebar) ---
  const portalLinks = document.querySelectorAll(".portal-link");
  const assetViews = document.querySelectorAll(".asset-view");
  portalLinks.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      portalLinks.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      assetViews.forEach((section) => section.classList.remove("active"));
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});

// --- 8. GLOBAL VIDEO MODAL FUNCTIONS ---
// Outside DOMContentLoaded for HTML 'onclick' support
/**
 * Opens the Video Modal dynamically
 * @param {string} videoID - The YouTube ID (e.g., 'JMLsHI8aV0g')
 */
function openVideoModal(videoID) {
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoPlayer");

  if (!modal || !player || !videoID) return;

  // 1. Construct the embed URL
  // autoplay=1 starts the video, rel=0 prevents unrelated video suggestions
  const videoURL = `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0`;

  // 3. Set source and show modal
  player.src = videoURL;
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Lock background scroll
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoPlayer");
  if (modal && player) {
    player.src = "";
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}
