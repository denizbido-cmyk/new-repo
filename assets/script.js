// ==========================================================================
// Deniz Bido — Project Manager · site interaction layer
// ==========================================================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------------- */
/* Data                                                                    */
/* ---------------------------------------------------------------------- */

const ACCENTS = [
  { name: "crimson", hex: "#ff6b5e", tint: "#241416" },
  { name: "violet", hex: "#b79bff", tint: "#1c1826" },
  { name: "cobalt", hex: "#66beff", tint: "#141c28" },
  { name: "leaf", hex: "#8ae066", tint: "#151f16" },
  { name: "marigold", hex: "#ffcb61", tint: "#241f13" },
];

const FOCUS_LINES = [
  "Shipping programmes across 33 Üsküdar neighbourhoods",
  "Keeping a 175M TL municipal budget compliant",
  "Reaching 1,500,000+ residents this year",
  "Running Klasik Pazar, Üsküdar's award-winning programme",
  "Leading a cross-functional team across Comms, Finance, Ops, and Procurement",
];

/* ---------------------------------------------------------------------- */
/* Boot                                                                     */
/* ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initHeroMount();
  initFocusTicker();
  initClock();
  initScrollProgress();
  initNavScroll();
  initNavSpy();
  initMobileNav();
  initReveal();
  initTilt();
  initEmailCopy();
  initCursorGlow();
  initHeroParallax();
  initTimelineRail();
  initHeroScene();
});

/* ---------------------------------------------------------------------- */
/* Hero mount fade-in                                                      */
/* ---------------------------------------------------------------------- */

function initHeroMount() {
  const hero = document.querySelector(".hero-inner");
  requestAnimationFrame(() => {
    setTimeout(() => hero && hero.classList.add("hero-mounted"), 60);
  });
}

/* ---------------------------------------------------------------------- */
/* Rotating "right now" ticker                                             */
/* ---------------------------------------------------------------------- */

function initFocusTicker() {
  const el = document.querySelector("[data-focus-ticker]");
  if (!el || reduceMotion) {
    if (el) el.textContent = FOCUS_LINES[0];
    return;
  }
  let i = 0;
  el.textContent = FOCUS_LINES[0];
  el.classList.add("rl-in");
  setInterval(() => {
    el.classList.remove("rl-in");
    el.classList.add("rl-out");
    setTimeout(() => {
      i = (i + 1) % FOCUS_LINES.length;
      el.textContent = FOCUS_LINES[i];
      el.classList.remove("rl-out");
      el.classList.add("rl-in");
    }, 280);
  }, 2800);
}

/* ---------------------------------------------------------------------- */
/* Live Istanbul clock                                                     */
/* ---------------------------------------------------------------------- */

function initClock() {
  const el = document.querySelector("[data-clock]");
  if (!el) return;
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  el.textContent = fmt();
  setInterval(() => (el.textContent = fmt()), 1000);
}

/* ---------------------------------------------------------------------- */
/* Scroll progress bar                                                     */
/* ---------------------------------------------------------------------- */

function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrolled))})`;
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------------- */
/* Nav background on scroll                                                */
/* ---------------------------------------------------------------------- */

function initNavScroll() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("nav-scrolled", window.scrollY > 12);
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------------- */
/* Nav scroll-spy                                                          */
/* ---------------------------------------------------------------------- */

function initNavSpy() {
  const links = [...document.querySelectorAll(".nav-links a")];
  if (!links.length) return;
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---------------------------------------------------------------------- */
/* Mobile nav toggle                                                       */
/* ---------------------------------------------------------------------- */

function initMobileNav() {
  const burger = document.querySelector(".nav-burger");
  const links = document.querySelector(".nav-links");
  if (!burger || !links) return;
  burger.addEventListener("click", () => {
    const open = links.style.display === "flex";
    links.style.display = open ? "" : "flex";
    links.style.position = "absolute";
    links.style.top = "var(--nav-h)";
    links.style.left = "0";
    links.style.right = "0";
    links.style.flexDirection = "column";
    links.style.background = "rgba(8,8,10,0.96)";
    links.style.padding = "20px 24px";
    links.style.borderBottom = "1px solid var(--border)";
    links.style.gap = "18px";
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      if (window.innerWidth <= 760) links.style.display = "";
    })
  );
}

/* ---------------------------------------------------------------------- */
/* Scroll reveal (IntersectionObserver)                                    */
/* ---------------------------------------------------------------------- */

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("reveal-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------------- */
/* Pointer tilt cards                                                      */
/* ---------------------------------------------------------------------- */

function initTilt() {
  if (reduceMotion) return;
  const cards = document.querySelectorAll(".tilt-card");
  cards.forEach((card) => {
    const maxTilt = parseFloat(card.dataset.tilt || "8");
    let raf = null;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(700px) rotateX(${(py * -maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) scale(1.03) translateY(-4px)`;
      });
    });
    card.addEventListener("mouseleave", () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = "";
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Email copy button                                                       */
/* ---------------------------------------------------------------------- */

function initEmailCopy() {
  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.dataset.copyEmail;
      const flag = btn.querySelector(".email-copied");
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
      if (flag) {
        flag.textContent = "Copied";
        setTimeout(() => (flag.textContent = ""), 1800);
      }
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Cursor glow follower                                                    */
/* ---------------------------------------------------------------------- */

function initCursorGlow() {
  if (reduceMotion || window.matchMedia("(hover: none)").matches) return;
  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;
  let tx = -1000, ty = -1000, cx = -1000, cy = -1000;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ---------------------------------------------------------------------- */
/* Hero text depth parallax on mouse move                                  */
/* ---------------------------------------------------------------------- */

function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const name = document.querySelector(".name-block");
  if (!hero || !name || reduceMotion) return;
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    name.style.transform = `rotateX(${(py * -3).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg)`;
  });
  hero.addEventListener("mouseleave", () => {
    name.style.transform = "";
  });
}

/* ---------------------------------------------------------------------- */
/* Timeline progress rail                                                  */
/* ---------------------------------------------------------------------- */

function initTimelineRail() {
  const rail = document.querySelector(".timeline-rail-fill");
  const timeline = document.querySelector(".timeline");
  if (!rail || !timeline) return;
  const onScroll = () => {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const passed = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
    rail.style.height = `${(passed / total) * 100}%`;
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------------- */
/* 3D immersive hero scene (Three.js)                                      */
/* ---------------------------------------------------------------------- */

async function initHeroScene() {
  const canvas = document.getElementById("hero-canvas");
  const wrap = document.querySelector(".hero-canvas-wrap");
  if (!canvas || !wrap) return;

  // Respect reduced-motion & low-power: render a single static frame only.
  const STATIC_ONLY = reduceMotion;

  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (err) {
    wrap.classList.add("hero-canvas-fallback");
    return; // CSS gradient background remains as graceful fallback
  }

  let width = wrap.clientWidth;
  let height = wrap.clientHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0, 11);

  const accentColors = ACCENTS.map((a) => new THREE.Color(a.hex));

  // ---- Particle field: soft glowing points orbiting the hub ----
  const PARTICLE_COUNT = window.innerWidth < 700 ? 260 : 620;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const radii = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 3.4 + Math.random() * 6.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.72;
    const z = r * Math.cos(phi) * 0.6 - 2;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    radii[i] = r;
    const c = accentColors[i % accentColors.length];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const spriteTexture = makeGlowSprite(THREE);
  const particleMat = new THREE.PointsMaterial({
    size: 0.16,
    map: spriteTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Central wireframe hub: icosahedron ----
  const hubGeo = new THREE.IcosahedronGeometry(2.15, 1);
  const hubMat = new THREE.MeshBasicMaterial({
    color: 0xdced8f,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  scene.add(hub);

  const hubGeo2 = new THREE.IcosahedronGeometry(2.9, 0);
  const hubMat2 = new THREE.MeshBasicMaterial({
    color: 0x66beff,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const hub2 = new THREE.Mesh(hubGeo2, hubMat2);
  scene.add(hub2);

  scene.rotation.x = 0.15;

  // ---- Pointer parallax & scroll dolly ----
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  window.addEventListener("mousemove", (e) => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  let scrollFactor = 0;
  const heroEl = document.querySelector(".hero");
  function updateScrollFactor() {
    if (!heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    scrollFactor = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
  }
  document.addEventListener("scroll", updateScrollFactor, { passive: true });
  updateScrollFactor();

  // ---- Visibility gating: only animate while hero is on screen ----
  let heroVisible = true;
  if ("IntersectionObserver" in window && heroEl) {
    const io = new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(heroEl);
  }

  function resize() {
    width = wrap.clientWidth;
    height = wrap.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();
    targetX += (pointerX - targetX) * 0.04;
    targetY += (pointerY - targetY) * 0.04;

    scene.rotation.y = t * 0.05 + targetX * 0.4;
    scene.rotation.x = 0.15 + targetY * 0.2;

    hub.rotation.y = t * 0.09;
    hub.rotation.x = t * 0.05;
    hub2.rotation.y = -t * 0.05;

    particles.rotation.y = t * 0.02;

    camera.position.z = 11 - scrollFactor * 3.2;
    camera.position.y = scrollFactor * -1.2;

    renderer.render(scene, camera);
  }

  if (STATIC_ONLY) {
    render();
    return;
  }

  function loop() {
    if (heroVisible) render();
    requestAnimationFrame(loop);
  }
  loop();
}

function makeGlowSprite(THREE) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}
