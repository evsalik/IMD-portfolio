document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("theme-light");
    });
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const navLinks = Array.from(document.querySelectorAll(".side-nav .nav-link"));
  const blobs = Array.from(document.querySelectorAll(".blob"));
  const strengths = [40, 80, 120];

  navLinks.forEach(link => {
    const isContact = link.dataset.contact === "true";

    link.addEventListener("click", (event) => {
      if (isContact) {
        event.preventDefault();
        openContactOverlay();
        flashLink(link);
        return;
      }

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const top = target.offsetTop;

      window.scrollTo({
        top,
        behavior: "smooth"
      });

      flashLink(link);
    });
  });

  function flashLink(link) {
    link.classList.remove("nav-flash");
    void link.offsetWidth;
    link.classList.add("nav-flash");
  }

  window.addEventListener("mousemove", (event) => {
    const { innerWidth, innerHeight } = window;
    const normX = (event.clientX / innerWidth - 0.5) * 2;
    const normY = (event.clientY / innerHeight - 0.5) * 2;

    blobs.forEach((blob, index) => {
      const s = strengths[index] || 40;
      const x = normX * s;
      const y = normY * s;
      blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  });

  const overlay = document.getElementById("contactOverlay");
  const heroContactBtn = document.getElementById("heroContactBtn");
  const closeBtn = document.getElementById("contactCloseBtn");

  function openContactOverlay() {
    if (!overlay) return;
    overlay.style.display = "flex";
  }

  function closeContactOverlay() {
    if (!overlay) return;
    overlay.style.display = "none";
  }

  if (heroContactBtn) {
    heroContactBtn.addEventListener("click", (event) => {
      event.preventDefault();
      openContactOverlay();
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", closeContactOverlay);

  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeContactOverlay();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeContactOverlay();
    }
  });

  const skillBars = Array.from(document.querySelectorAll(".skill-bar"));

  if (skillBars.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const bar = entry.target;
          const inner = bar.querySelector(".skill-bar-inner");
          const glow = bar.querySelector(".skill-bar-glow");
          const level = bar.getAttribute("data-level");

          if (inner && level) {
            inner.style.width = level + "%";
          }
          if (glow) {
            bar.classList.add("is-filled");
          }

          obs.unobserve(bar);
        });
      },
      {
        threshold: 0.45
      }
    );

    skillBars.forEach((bar) => {
      const inner = bar.querySelector(".skill-bar-inner");
      if (inner) {
        inner.style.width = "0%";
      }
      observer.observe(bar);
    });
  }

  skillBars.forEach((bar) => {
    bar.addEventListener("mousemove", (event) => {
      const rect = bar.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      bar.style.setProperty("--hover-x", `${x}px`);
      bar.style.setProperty("--hover-y", `${y}px`);
    });
  });

  const sendLink = document.getElementById("contactSendLink");

  if (sendLink) {
    sendLink.addEventListener("click", (event) => {
      event.preventDefault();

      const name = document.getElementById("contactName").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const message = document.getElementById("contactMessage").value.trim();

      const subject = encodeURIComponent(`Portfolio contact from ${name || "Someone"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      window.location.href = `mailto:ems2312227@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
