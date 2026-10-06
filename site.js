/* Teta portfolio — GSAP + ScrollTrigger + Lenis motion system */
(function(){
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined";
  var isDesktop = window.matchMedia("(min-width:1001px)").matches;

  /* CDN-failure fallback: never trap content hidden */
  if (!hasGsap || reduced) {
    document.querySelectorAll(".rv").forEach(function(el){
      el.style.opacity = 1; el.style.transform = "none";
    });
    var pl = document.getElementById("preloader");
    if (pl) pl.style.display = "none";
    var veil = document.getElementById("page-veil");
    if (veil) veil.style.display = "none";
    document.querySelectorAll(".hero-title .ch").forEach(function(c){ c.style.transform = "none"; });
    if (!hasGsap) return;
  }
  document.documentElement.classList.add("gsap-on");
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (typeof Lenis !== "undefined" && !reduced) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToTarget(sel){
    var el = document.querySelector(sel);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click", function(e){
      var id = a.getAttribute("href");
      if (id.length > 1) { e.preventDefault(); scrollToTarget(id); closeMenu(); }
    });
  });

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById("preloader");
  var veil = document.getElementById("page-veil");
  var seen = sessionStorage.getItem("teta_seen");
  var heroTl = gsap.timeline({ paused: true });

  function heroIntro(){
    heroTl
      .to(".hero-title .ch", { y: 0, duration: 1, ease: "expo.out", stagger: 0.035 })
      .fromTo(".hero-kicker", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8 }, "-=.7")
      .fromTo(".hero-sub > *", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, stagger: .12 }, "-=.6")
      .fromTo(".pill-nav", { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: .7 }, "-=.7")
      .fromTo(".ticker", { opacity: 0 }, { opacity: 1, duration: .8 }, "-=.5");
    heroTl.play();
    startHeroCrossfade();
  }

  if (seen || reduced) {
    if (preloader) preloader.style.display = "none";
    if (veil) veil.style.display = "none";
    gsap.set(".hero-title .ch", { y: 0 });
    gsap.set([".hero-kicker", ".hero-sub > *", ".pill-nav", ".ticker"], { opacity: 1, y: 0 });
    startHeroCrossfade();
  } else {
    gsap.set("#page-veil", { clipPath: "polygon(9% 42%, 91% 42%, 91% 58%, 9% 58%)" });
    var plTl = gsap.timeline();
    plTl
      .to("#preloader .pl-mark", { opacity: 1, duration: 1, ease: "power2.out" })
      .to("#page-veil", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.6, ease: "expo.inOut" }, "-=.3")
      .to("#preloader", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=1.1")
      .add(function(){
        preloader.style.display = "none";
        sessionStorage.setItem("teta_seen", "1");
        heroIntro();
      })
      .to("#page-veil", { opacity: 0, duration: .4, onComplete: function(){ veil.style.display = "none"; } }, "-=.3");
  }

  /* ---------- Hero crossfade ---------- */
  function startHeroCrossfade(){
    var imgs = document.querySelectorAll(".hero-media img");
    if (!imgs.length) return;
    var i = 0;
    gsap.set(imgs[0], { opacity: 1 });
    if (imgs.length < 2 || reduced) return;
    setInterval(function(){
      var prev = imgs[i];
      i = (i + 1) % imgs.length;
      gsap.to(prev, { opacity: 0, duration: 1.6, ease: "power2.inOut" });
      gsap.fromTo(imgs[i], { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.6, ease: "power2.inOut" });
    }, 6000);
  }

  /* hero parallax on scroll away */
  gsap.to(".hero-inner", {
    yPercent: 18, opacity: .25, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  /* ---------- generic reveals ---------- */
  gsap.utils.toArray(".rv").forEach(function(el){
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  /* ---------- intro scrubbed char highlight ---------- */
  document.querySelectorAll("[data-char-hl]").forEach(function(block){
    var text = block.textContent.trim().replace(/\s+/g, " ");
    block.setAttribute("aria-label", text);
    block.innerHTML = text.split("").map(function(c){
      return '<span class="c" aria-hidden="true">' + (c === " " ? "&nbsp;" : c) + "</span>";
    }).join("");
    var chars = block.querySelectorAll(".c");
    gsap.to(chars, {
      opacity: 1, ease: "none", stagger: 0.06,
      scrollTrigger: { trigger: block, start: "top 78%", end: "bottom 45%", scrub: true }
    });
  });

  /* ---------- services 3D cube (desktop) ---------- */
  var cube = document.querySelector(".cube");
  if (cube && isDesktop && !reduced) {
    gsap.to(cube, {
      rotationY: -270, ease: "none",
      scrollTrigger: { trigger: ".cube-sec", start: "top top", end: "+=300%", pin: ".cube-pin", scrub: 1 }
    });
  }

  /* ---------- work rows ---------- */
  gsap.utils.toArray(".work-row").forEach(function(row, i){
    gsap.fromTo(row, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: .9, ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 90%", once: true }
    });
  });

  /* giant marquee scrub */
  var wm = document.querySelector(".work-marquee .track");
  if (wm) gsap.to(wm, {
    xPercent: -25, ease: "none",
    scrollTrigger: { trigger: ".work-marquee", start: "top bottom", end: "bottom top", scrub: true }
  });

  /* hover preview follows cursor */
  var preview = document.getElementById("hover-preview");
  if (preview && isDesktop && !reduced) {
    var px = gsap.quickTo(preview, "x", { duration: .45, ease: "power3" });
    var py = gsap.quickTo(preview, "y", { duration: .45, ease: "power3" });
    window.addEventListener("mousemove", function(e){ px(e.clientX + 24); py(e.clientY - 110); });
    document.querySelectorAll(".work-row[data-img]").forEach(function(row){
      row.addEventListener("mouseenter", function(){
        preview.querySelector("img").src = row.getAttribute("data-img");
        gsap.to(preview, { opacity: 1, scale: 1, rotate: 0, duration: .35, ease: "power3.out" });
      });
      row.addEventListener("mouseleave", function(){
        gsap.to(preview, { opacity: 0, scale: .85, rotate: -3, duration: .3 });
      });
    });
  }

  /* ---------- odometer stats ---------- */
  document.querySelectorAll(".stat b[data-count]").forEach(function(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: function(){
        gsap.to(obj, { v: target, duration: 1.8, ease: "power3.out", onUpdate: function(){
          el.firstChild.nodeValue = Math.round(obj.v).toString();
        }});
      }
    });
  });

  /* ---------- faq ---------- */
  document.querySelectorAll(".acc-item").forEach(function(item){
    var q = item.querySelector(".acc-q");
    q.addEventListener("click", function(){
      var open = item.classList.contains("open");
      item.parentElement.querySelectorAll(".acc-item.open").forEach(function(o){ o.classList.remove("open"); });
      if (!open) item.classList.add("open");
    });
  });

  /* ---------- cta letter wave ---------- */
  document.querySelectorAll("[data-wave]").forEach(function(block){
    var text = block.textContent.trim();
    block.setAttribute("aria-label", text);
    block.innerHTML = text.split("").map(function(c){
      return '<span class="ch" aria-hidden="true">' + (c === " " ? "&nbsp;" : c) + "</span>";
    }).join("");
    var chars = block.querySelectorAll(".ch");
    gsap.fromTo(chars, { y: 60 }, {
      y: -60, ease: "sine.inOut", stagger: { each: 0.08, yoyo: true, repeat: 1 },
      scrollTrigger: { trigger: block, start: "top 95%", end: "top 30%", scrub: true }
    });
  });

  /* ---------- nav ---------- */
  var burger = document.querySelector(".pill-nav .burger");
  var menu = document.getElementById("mobileMenu");
  function closeMenu(){ if (menu) menu.classList.remove("open"); }
  if (burger && menu) {
    burger.addEventListener("click", function(){ menu.classList.add("open"); });
    menu.querySelector(".mclose").addEventListener("click", closeMenu);
  }
  var sections = ["work", "services", "about", "contact"];
  sections.forEach(function(id){
    var sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: "top 45%", end: "bottom 45%",
      onToggle: function(self){
        if (self.isActive) {
          document.querySelectorAll(".pill-nav .nl").forEach(function(a){
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      }
    });
  });

  /* footer year */
  document.querySelectorAll(".js-year").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });
  window.__tetaScrollTo = scrollToTarget;
})();
