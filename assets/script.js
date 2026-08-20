// ==========================================================================
// Deniz Bido — Project Manager · site interaction layer
// ==========================================================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------------- */
/* Data                                                                    */
/* ---------------------------------------------------------------------- */

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
    return; // CSS gradient backdrop remains as graceful fallback
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
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0.3, 10.5);
  camera.lookAt(1.0, -0.2, 0);

  // ---- Lighting: soft studio setup ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(4, 6, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-5, 2, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xcfe0ff, 0.5);
  rim.position.set(-2, -3, -4);
  scene.add(rim);

  // ---- Rig: a wayfinding signpost — the concrete, "real world object"
  // counterpart to the site's own navigation (nameplate + section signs) ----
  const rig = new THREE.Group();
  rig.position.set(1.1, -0.5, 0);
  rig.rotation.z = -0.05;
  scene.add(rig);

  const chrome = new THREE.MeshStandardMaterial({ color: 0xd7dade, metalness: 0.85, roughness: 0.28 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x17181a, metalness: 0.6, roughness: 0.4 });

  // pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 6.4, 20), chrome);
  pole.position.y = 0.2;
  rig.add(pole);
  const poleCap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), chrome);
  poleCap.position.y = 3.4;
  rig.add(poleCap);

  // nameplate sign (top) — blue enamel plate, like municipal street signage
  const nameTex = makeSignTexture(document, {
    text: "DENİZ BİDO",
    sub: "PROJECT MANAGER",
    bg: "#1a3d75",
    fg: "#ffffff",
    w: 1024, h: 320,
  });
  const namePlaque = makePlaque(THREE, nameTex, 2.3, 0.68, darkMetal);
  namePlaque.position.set(0.75, 2.3, 0);
  namePlaque.rotation.set(0, 0.28, -0.04);
  rig.add(namePlaque);
  attachBracket(THREE, rig, chrome, namePlaque.position, 2.65);

  // directional sign (mid) — yellow, points to the programmes wall
  const progTex = makeSignTexture(document, {
    text: "PROGRAMMES ARCHIVE",
    sub: "19 MARKS · SCROLL ↓",
    bg: "#f3c23d",
    fg: "#141414",
    w: 1024, h: 300,
  });
  const progPlaque = makePlaque(THREE, progTex, 2.5, 0.64, darkMetal);
  progPlaque.position.set(-0.55, 1.25, 0.15);
  progPlaque.rotation.set(0, -0.22, 0.05);
  rig.add(progPlaque);
  attachBracket(THREE, rig, chrome, progPlaque.position, 1.55);

  // directional sign (lower) — red, points to experience timeline
  const expTex = makeSignTexture(document, {
    text: "EXPERIENCE",
    sub: "8 ROLES SINCE 2018",
    bg: "#d94433",
    fg: "#ffffff",
    w: 900, h: 300,
  });
  const expPlaque = makePlaque(THREE, expTex, 2.0, 0.64, darkMetal);
  expPlaque.position.set(0.65, 0.3, -0.1);
  expPlaque.rotation.set(0, 0.18, -0.06);
  rig.add(expPlaque);
  attachBracket(THREE, rig, chrome, expPlaque.position, 0.6);

  // small circular badge — a nod to the Altın Karınca award
  const badgeTex = makeBadgeTexture(document, { line1: "AWARD", line2: "2024", bg: "#141414", fg: "#ffffff" });
  const badge = makeBadge(THREE, badgeTex, 0.4, darkMetal);
  badge.position.set(0.85, 1.85, 0.35);
  badge.rotation.set(0.1, 0.5, 0.08);
  rig.add(badge);

  // ---- Fake contact-shadow: soft blurred ellipse under the rig ----
  const shadowTex = makeShadowTexture(document);
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.2), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.set(1.4, -3.05, 0.4);
  scene.add(shadowPlane);

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

  const baseRigY = rig.rotation.y;
  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();
    targetX += (pointerX - targetX) * 0.05;
    targetY += (pointerY - targetY) * 0.05;

    // whole rig sways gently, like a real post — plus a light parallax tilt
    rig.rotation.y = baseRigY + Math.sin(t * 0.35) * 0.035 + targetX * 0.18;
    rig.rotation.x = Math.sin(t * 0.28) * 0.015 + targetY * 0.06;
    rig.position.y = -0.5 + scrollFactor * -1.4;

    // individual plaques swing slightly out of phase, like signs on a post
    namePlaque.rotation.z = -0.04 + Math.sin(t * 0.5) * 0.02;
    progPlaque.rotation.z = 0.05 + Math.sin(t * 0.45 + 1.2) * 0.02;
    expPlaque.rotation.z = -0.06 + Math.sin(t * 0.6 + 2.1) * 0.02;
    badge.rotation.z = Math.sin(t * 0.4) * 0.05;

    camera.position.z = 9.5 - scrollFactor * 2.6;
    camera.position.y = 0.3 + scrollFactor * -0.6;

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

/* ---- signpost scene helpers ---- */

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeSignTexture(doc, { text, sub, bg, fg, w, h }) {
  const canvas = doc.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  roundRectPath(ctx, 6, 6, w - 12, h - 12, 22);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.stroke();

  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${Math.floor(h * 0.26)}px Arial, Helvetica, sans-serif`;
  ctx.fillText(text, w / 2, sub ? h * 0.4 : h / 2, w * 0.86);
  if (sub) {
    ctx.font = `700 ${Math.floor(h * 0.12)}px Arial, Helvetica, sans-serif`;
    ctx.globalAlpha = 0.88;
    ctx.fillText(sub, w / 2, h * 0.72, w * 0.86);
    ctx.globalAlpha = 1;
  }
  return canvas;
}

function makeBadgeTexture(doc, { line1, line2, bg, fg }) {
  const size = 512;
  const canvas = doc.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.stroke();

  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 76px Arial, Helvetica, sans-serif";
  ctx.fillText(line1, size / 2, size / 2 - 36);
  ctx.font = "800 108px Arial, Helvetica, sans-serif";
  ctx.fillText(line2, size / 2, size / 2 + 56);
  return canvas;
}

function makeShadowTexture(doc) {
  const size = 256;
  const canvas = doc.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(10,10,10,0.34)");
  grad.addColorStop(0.6, "rgba(10,10,10,0.14)");
  grad.addColorStop(1, "rgba(10,10,10,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function makePlaque(THREE, canvasEl, w, h, edgeMat) {
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  const faceMat = new THREE.MeshPhysicalMaterial({
    map: texture,
    roughness: 0.38,
    metalness: 0.06,
    clearcoat: 0.55,
    clearcoatRoughness: 0.3,
  });
  const geo = new THREE.BoxGeometry(w, h, 0.055);
  // face order: +x -x +y -y +z -z — texture on the front (+z) face only
  const mesh = new THREE.Mesh(geo, [edgeMat, edgeMat, edgeMat, edgeMat, faceMat, edgeMat]);
  return mesh;
}

function makeBadge(THREE, canvasEl, radius, rimMat) {
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  const faceMat = new THREE.MeshPhysicalMaterial({
    map: texture,
    roughness: 0.35,
    metalness: 0.08,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
  });
  const geo = new THREE.CylinderGeometry(radius, radius, 0.05, 40);
  const mesh = new THREE.Mesh(geo, [rimMat, faceMat, faceMat]);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function attachBracket(THREE, rig, mat, plaquePos, poleY) {
  const dx = plaquePos.x;
  const len = Math.max(0.12, Math.abs(dx) + 0.05);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, len, 8), mat);
  arm.position.set(dx / 2, poleY, plaquePos.z * 0.5);
  arm.rotation.z = Math.PI / 2;
  rig.add(arm);
}
