/* ============================================================
   ADEBIYI THOMPSON — PORTFOLIO INTERACTIONS
   1. Preloader  2. Custom cursor physics  3. GSAP scroll reveals
   4. Case-study overlay  5. Form / nav / counters / magnetic
   ============================================================ */
(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. PRELOADER: name animates in, then slides away ---------- */
  const preloader = document.getElementById("preloader");
  const barFill = document.getElementById("preloaderBarFill");
  const countEl = document.getElementById("preloaderCount");
  document.body.style.overflow = "hidden"; // lock scroll during load

  const load = { v: 0 };
  const introTl = gsap.timeline({
    onComplete() {
      // slide preloader away to reveal site, then play hero entrance
      gsap.to(preloader, {
        yPercent: -100, duration: 1, ease: "power4.inOut",
        onComplete() {
          preloader.style.display = "none";
          document.body.style.overflow = "";
          heroEntrance();
          ScrollTrigger.refresh();
        },
      });
    },
  });

  introTl
    .from(".preloader-name span", { yPercent: 110, duration: 0.9, stagger: 0.12, ease: "power4.out" })
    .to(load, {
      v: 100, duration: 1.4, ease: "power2.inOut",
      onUpdate() {
        const n = Math.round(load.v);
        countEl.textContent = n;
        barFill.style.width = n + "%";
      },
    }, "-=0.4");

  /* ---------- 2. CUSTOM CURSOR: dot follows instantly, ring lerps ---------- */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const fine = window.matchMedia("(pointer: fine)").matches;

  if (fine) {
    let mx = innerWidth / 2, my = innerHeight / 2; // mouse target
    let rx = mx, ry = my;                          // ring position (lerped)
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() { // trailing-ring physics via lerp
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    // scale ring up on interactive elements
    document.querySelectorAll("[data-hover], a, button, .work-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ---------- 3. HERO ENTRANCE (plays after preloader) ---------- */
  gsap.set(".hero .line-inner", { yPercent: 110 });
  gsap.set([".hero-eyebrow", ".hero-subtitle", ".hero-desc", ".scroll-indicator"], { opacity: 0, y: 24 });
  function heroEntrance() {
    gsap.timeline({ defaults: { ease: "power4.out" } })
      .to(".hero .line-inner", { yPercent: 0, duration: 1.1, stagger: 0.12 })
      .to([".hero-eyebrow", ".hero-subtitle", ".hero-desc", ".scroll-indicator"],
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, "-=0.6");
  }

  /* ---------- 4. SCROLL REVEALS: every .reveal fades/slides in ---------- */
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      // start slightly offset for the slide effect
      onStart() { gsap.set(el, { y: 28 }); },
    });
  });
  // subtle parallax on hero blobs
  gsap.to(".blob-1", { y: 120, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
  gsap.to(".blob-2", { y: -80, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
  // stat counters
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter() {
        const o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) });
      },
    });
  });

  /* ---------- 5. CASE-STUDY OVERLAY ---------- */
  const PROJECTS = {
    nova:     { title: "Nova Studio", category: "Web Design — 2025", art: "art-nova",
                desc: "A cinematic marketing site for a creative studio — oversized type, buttery page transitions and a work index built to convert admirers into clients.",
                tags: ["Art direction", "Web design", "Motion"] },
    kaffa:    { title: "Kaffa Roasters", category: "Branding — 2025", art: "art-kaffa",
                desc: "Full identity for a specialty coffee roaster: wordmark, packaging-ready color system and a warm, editorial voice across every touchpoint.",
                tags: ["Logo", "Identity", "Packaging"] },
    pulse:    { title: "Pulse Fitness", category: "Web Design — 2024", art: "art-pulse",
                desc: "High-energy landing experience for a fitness brand — bold gradients, class booking flows and mobile-first layouts that doubled signups.",
                tags: ["Landing page", "UX", "Mobile-first"] },
    atelier:  { title: "Atelier Noir", category: "Branding + Web — 2024", art: "art-atelier",
                desc: "Monochrome luxury identity plus portfolio site for a fashion atelier. Restrained, gallery-like layouts that let the garments speak.",
                tags: ["Identity", "Portfolio site", "Editorial"] },
    waveform: { title: "Waveform", category: "Ideation — 2024", art: "art-waveform",
                desc: "Concept sprint for a music-tech startup: naming, positioning and interactive prototypes that took them from fuzzy idea to funded pitch.",
                tags: ["Naming", "Concepts", "Prototype"] },
    velvet:   { title: "Velvet & Co.", category: "Web Design — 2023", art: "art-velvet",
                desc: "Elegant e-commerce refresh for a beauty brand — softer palette, clearer hierarchy and product storytelling that lifted average order value.",
                tags: ["E-commerce", "Redesign", "Storytelling"] },
  };
  const overlay = document.getElementById("caseOverlay");
  const oArt = document.getElementById("overlayArt");
  const oCat = document.getElementById("overlayCategory");
  const oTitle = document.getElementById("overlayTitle");
  const oDesc = document.getElementById("overlayDesc");
  const oTags = document.getElementById("overlayTags");

  function openCase(key) {
    const p = PROJECTS[key];
    if (!p) return;
    oArt.className = "overlay-art work-art " + p.art;
    oCat.textContent = p.category;
    oTitle.textContent = p.title;
    oDesc.textContent = p.desc;
    oTags.innerHTML = p.tags.map((t) => `<li>${t}</li>`).join("");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    gsap.to(".overlay-backdrop", { opacity: 1, duration: 0.35 });
    gsap.fromTo(".overlay-panel", { opacity: 0, y: 40, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
  }
  function closeCase() {
    gsap.to(".overlay-panel", { opacity: 0, y: 24, duration: 0.3, ease: "power2.in" });
    gsap.to(".overlay-backdrop", {
      opacity: 0, duration: 0.3,
      onComplete() {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      },
    });
  }
  document.querySelectorAll(".work-card").forEach((card) => {
    card.addEventListener("click", () => openCase(card.dataset.project));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCase(card.dataset.project); }
    });
  });
  document.getElementById("overlayClose").addEventListener("click", closeCase);
  document.getElementById("overlayBackdrop").addEventListener("click", closeCase);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("open")) closeCase(); });

  /* ---------- 6. CONTACT FORM (front-end only success message) ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = form.querySelector(".btn-submit");
    btn.textContent = "Sending…";
    setTimeout(() => {
      btn.textContent = "Message sent ✓";
      success.hidden = false;
      gsap.from(success, { opacity: 0, y: 10, duration: 0.5 });
      form.querySelectorAll("input, textarea").forEach((f) => (f.value = ""));
      setTimeout(() => (btn.textContent = "Send message"), 3000);
    }, 700);
  });

  /* ---------- 7. NAV: mobile toggle + back-to-top + magnetic buttons ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    links.classList.remove("open"); toggle.classList.remove("active");
  }));
  document.getElementById("backToTop").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }));

  // subtle magnetic pull on desktop
  if (fine) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.3 });
      });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1,0.5)" }));
    });
  }
})();
