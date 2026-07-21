function initials(name) {
  return name.replace(/^DG\s|^DeGrand\s/i, "").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function renderVentures() {
  const grid = document.getElementById("venturesGrid");
  if (!grid || !Array.isArray(window.PAGE_VENTURES)) return;
  grid.innerHTML = window.PAGE_VENTURES.map(v => `
    <div class="venture-card" data-animate>
      <div class="venture-card__icon${v.logo ? " venture-card__icon--logo" : ""}">${v.logo ? `<img src="${v.logo}" alt="${v.name} logo">` : initials(v.name)}</div>
      <h3>${v.name}</h3>
      <div class="venture-card__links">
        ${v.fb ? `<a href="${v.fb}" target="_blank" rel="noopener" aria-label="${v.name} on Facebook"><i class="fa-brands fa-facebook-f"></i></a>` : ""}
        ${v.tg ? `<a href="${v.tg}" target="_blank" rel="noopener" aria-label="${v.name} on Telegram"><i class="fa-brands fa-telegram"></i></a>` : ""}
        ${v.tt ? `<a href="${v.tt}" target="_blank" rel="noopener" aria-label="${v.name} on TikTok"><i class="fa-brands fa-tiktok"></i></a>` : ""}
      </div>
    </div>
  `).join("");
  initReveal();
}

// ---------- Navbar scroll state + mobile toggle ----------
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  });

  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("is-open"));
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => links.classList.remove("is-open"));
    });
  }
}

// ---------- Scroll spy ----------
function initScrollSpy() {
  const sections = document.querySelectorAll("main > section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("is-active"));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(s => observer.observe(s));
}

// ---------- Reveal-on-scroll animation ----------
function initReveal() {
  const els = document.querySelectorAll("[data-animate]:not(.is-visible)");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => observer.observe(el));
}

// ---------- Stat counters ----------
function initCounters() {
  const nums = document.querySelectorAll(".stat__num[data-count]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        current = Math.min(target, current + step);
        el.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach(el => observer.observe(el));
}

// ---------- Back to top ----------
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 500);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ---------- Copy to clipboard ----------
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function initCopyable() {
  document.querySelectorAll(".copyable").forEach(el => {
    el.addEventListener("click", async () => {
      const text = el.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied: ${text}`);
      } catch {
        showToast(text);
      }
    });
  });
}

// ---------- Footer year ----------
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderVentures();
  initNavbar();
  initScrollSpy();
  initReveal();
  initCounters();
  initBackToTop();
  initCopyable();
  initYear();
});
