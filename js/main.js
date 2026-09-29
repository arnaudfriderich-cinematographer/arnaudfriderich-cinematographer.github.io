(() => {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isNarrow = () => innerWidth < 600;      // grille : lignes de 1 ou 2 vignettes
  const isMobileNav = () => innerWidth <= 833;  // menu en plein écran

  const catLabel = Object.fromEntries(D.categories.map((c) => [c.id, c.label]));
  const media = (slug) => ({
    film: `media/films/${slug}.mp4`,
    preview: `media/previews/${slug}.mp4`,
    poster: `media/posters/${slug}.jpg`,
    posterSm: `media/posters/${slug}-sm.jpg`,
  });

  function el(tag, attrs = {}, ...children) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v === true ? "" : v);
    }
    n.append(...children.filter((c) => c != null && c !== false));
    return n;
  }

  const safePlay = (v) => {
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };

  // Certains navigateurs refusent de modifier l'URL quand la page est ouverte depuis un fichier local
  const setUrl = (url) => {
    try { history.replaceState(null, "", url); } catch (e) { /* sans importance */ }
  };

  /* ---------- Textes ---------- */

  $$("[data-name]").forEach((n) => (n.textContent = D.name));
  $$("[data-tagline]").forEach((n) => {
    if (D.tagline) n.textContent = D.tagline;
    else n.remove();
  });
  $("#year").textContent = new Date().getFullYear();

  // Instagram, e-mail… : des icônes cliquables, dans le menu et en bas de page
  const GLYPHS = {
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
    email: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.8 7.2L12 13l8.2-5.8"/>',
    phone: '<path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a11 11 0 006.3 6.3l1.4-2 4.2 1.4v2.6a2 2 0 01-2 2A15.9 15.9 0 014.6 5.5a2 2 0 012-2z"/>',
  };

  function contactEntries() {
    const c = D.contact || {};
    const out = [];
    if (c.instagram) {
      const handle = c.instagram.replace(/^@/, "");
      out.push({ icon: "instagram", label: "Instagram", detail: `@${handle}`, href: `https://www.instagram.com/${handle}/`, external: true });
    }
    if (c.email) out.push({ icon: "email", label: "E-mail", detail: c.email, href: `mailto:${c.email}` });
    if (c.phone) {
      // Numéro français (06…) → format international (+33 6…) pour appeler aussi depuis l'étranger
      const digits = c.phone.replace(/[^\d+]/g, "");
      const tel = /^0\d{9}$/.test(digits) ? `+33${digits.slice(1)}` : digits;
      out.push({ icon: "phone", label: "Téléphone", detail: c.phone, href: `tel:${tel}` });
    }
    return out;
  }

  function contactIcons() {
    const list = el("ul", { class: "contact-icons" });
    contactEntries().forEach((e) => {
      const a = el("a", {
        class: "contact-icon",
        href: e.href,
        target: e.external ? "_blank" : null,
        rel: e.external ? "noopener" : null,
        title: e.detail,
        "aria-label": `${e.label} : ${e.detail}`,
      });
      a.innerHTML = `<span class="contact-glyph"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${GLYPHS[e.icon]}</svg></span>`;
      a.append(el("span", { class: "contact-label", text: e.label }));
      list.append(el("li", {}, a));
    });
    if (D.contact && D.contact.agent) list.append(el("li", { class: "contact-agent", text: D.contact.agent }));
    return list;
  }
  const hasContact = () => contactEntries().length > 0 || !!(D.contact && D.contact.agent);

  /* ---------- Menu déroulant (les deux traits en haut à droite) ---------- */

  const nav = $("#nav");
  const flyout = $("#flyout");
  const scrim = $("#scrim");
  const burger = $("#nav-burger");
  let flyoutOpen = false;
  const panels = []; // onglets qui se déplient dans le menu (Bio, Contact)

  function buildFlyout() {
    const inner = $("#flyout-inner");
    let i = 0;
    const item = (node) => {
      node.classList.add("flyout-item");
      node.style.setProperty("--i", i++);
      return node;
    };
    const list = el("ul", { class: "menu-list" });

    D.categories.forEach((c) => {
      if (!D.projects.some((p) => p.category === c.id)) return;
      list.append(item(el("li", {},
        el("a", { class: "menu-link", href: "#films", "data-filter": c.id, text: c.label }))));
    });

    const addPanel = (id, label, content) => {
      const toggle = el("button", { class: "menu-link", type: "button", "aria-expanded": "false", "aria-controls": `menu-${id}` }, label);
      toggle.insertAdjacentHTML("beforeend",
        '<svg class="chev" viewBox="0 0 14 9" aria-hidden="true"><path d="M1.5 1.5L7 7l5.5-5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      const panel = el("div", { class: `menu-panel menu-${id}`, id: `menu-${id}` }, el("div", {}, content));
      const entry = { toggle, panel };
      toggle.addEventListener("click", () => openPanel(toggle.getAttribute("aria-expanded") === "true" ? null : entry));
      panels.push(entry);
      list.append(item(el("li", {}, toggle, panel)));
    };

    const bio = Array.isArray(D.bio) ? { fr: D.bio } : D.bio || {};
    const langs = Object.keys(bio).filter((l) => bio[l] && bio[l].length);
    if (langs.length) {
      // Langue du navigateur si disponible, sinon l'anglais
      const nav = (navigator.language || "").slice(0, 2);
      let lang = langs.includes(nav) ? nav : langs.includes("en") ? "en" : langs[0];
      const text = el("div", { class: "menu-bio-text" });
      const switcher = langs.length > 1
        ? el("div", { class: "lang-switch", role: "group", "aria-label": "Langue / Language" },
          ...langs.map((l) => el("button", { type: "button", "data-lang": l, "aria-pressed": "false", text: l.toUpperCase() })))
        : null;
      const render = (l) => {
        lang = l;
        text.lang = l;
        text.replaceChildren(...bio[l].map((t) => el("p", { text: t })));
        if (switcher) $$("button", switcher).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
      };
      if (switcher) switcher.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-lang]");
        if (b) render(b.dataset.lang);
      });
      render(lang);
      addPanel("bio", "Bio", el("div", {}, switcher, text));
    }
    if (hasContact()) addPanel("contact", "Contact", contactIcons());

    inner.append(list);
  }

  // Un seul onglet ouvert à la fois ; openPanel(null) les referme tous
  function openPanel(target) {
    panels.forEach((p) => {
      const open = p === target;
      p.toggle.setAttribute("aria-expanded", String(open));
      p.panel.classList.toggle("is-open", open);
    });
  }

  function setFlyout(open) {
    if (open === flyoutOpen) return;
    flyoutOpen = open;
    nav.classList.toggle("is-open", open);
    scrim.classList.toggle("is-on", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    flyout.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("is-locked", open && isMobileNav());
    if (!open) setTimeout(() => { if (!flyoutOpen) openPanel(null); }, 450);
  }

  buildFlyout();
  burger.addEventListener("click", () => setFlyout(!flyoutOpen));
  scrim.addEventListener("click", () => setFlyout(false));

  flyout.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-filter]");
    if (!a) return;
    e.preventDefault();
    setFlyout(false);
    const id = a.dataset.filter;
    // Recliquer sur la catégorie active réaffiche tous les films
    setFilter(currentFilter === id ? "all" : id, { toTop: true });
  });

  // Le nom au centre ramène en haut et réaffiche tous les films
  $$("[data-home]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    setFlyout(false);
    if (currentFilter !== "all") setFilter("all");
    scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }));

  /* ---------- Grille des films ---------- */

  const grid = $("#grid");
  const PATTERN = [1, 2, 1, 3];
  let currentFilter = "all";
  let visible = D.projects.slice();
  let currentTiles = [];
  let layoutNarrow = null;

  const isVertical = (t) => t._p.ratio < 1;

  const tiles = D.projects.map((p, idx) => {
    const m = media(p.slug);
    const vertical = p.ratio < 1;
    const tile = el("a", {
      class: "tile",
      href: `#${p.slug}`,
      "data-slug": p.slug,
      "aria-label": p.director ? `${p.title}, ${p.director}` : p.title,
    },
    el("img", {
      class: "tile-poster",
      src: vertical ? m.poster : m.posterSm,
      srcset: vertical ? null : `${m.posterSm} 960w, ${m.poster} 1920w`,
      sizes: "100vw",
      alt: "",
      loading: idx < 3 ? "eager" : "lazy",
      decoding: "async",
    }),
    el("div", { class: "tile-shade" }),
    el("div", { class: "tile-text", "aria-hidden": "true" },
      el("h3", { class: "tile-title display", text: p.title }),
      p.director ? el("p", { class: "tile-dir", text: p.director }) : null,
      p.producer ? el("p", { class: "tile-prod", text: `Produced by ${p.producer}` }) : null));
    tile.style.setProperty("--r", p.ratio);
    tile._p = p;
    tile.addEventListener("click", (e) => {
      e.preventDefault();
      openPlayer(p.slug);
    });
    return tile;
  });

  const bySlug = Object.fromEntries(tiles.map((t) => [t._p.slug, t]));

  // Rangées automatiques façon Apicorp (1, 2, 1, 3 vignettes), pour les films absents de data.layout
  function autoRows(list) {
    const queue = list.slice();
    const rows = [];
    let r = 0;
    while (queue.length) {
      let n = Math.min(PATTERN[r % PATTERN.length], queue.length);
      if (n === 1 && isVertical(queue[0]) && queue.length > 1) n = 2;
      if (n === 3 && queue.slice(0, 3).some(isVertical)) n = 2;
      rows.push({ items: queue.splice(0, n) });
      r++;
    }
    return rows;
  }

  // Rangées décrites dans data.js (layout), complétées par les films qui n'y figurent pas
  const plannedRows = (() => {
    const used = new Set();
    const take = (slug) => {
      const t = bySlug[slug];
      if (!t || used.has(t)) return null;
      used.add(t);
      return t;
    };
    const rows = [];
    (D.layout || []).forEach((r) => {
      if (Array.isArray(r)) {
        const items = r.map(take).filter(Boolean);
        if (items.length) rows.push({ items });
      } else if (r && r.tall) {
        rows.push({ tall: take(r.tall), stack: (r.stack || []).map(take).filter(Boolean), right: r.side === "right" });
      }
    });
    return rows.concat(autoRows(tiles.filter((t) => !used.has(t))));
  })();

  const rowItems = (r) => r.items || (r.right ? [...r.stack, r.tall] : [r.tall, ...r.stack]).filter(Boolean);

  // Ne garde que les films du filtre en cours ; une rangée incomplète redevient une rangée simple
  function rowsFor(set) {
    const out = [];
    plannedRows.forEach((r) => {
      if (r.items) {
        const items = r.items.filter((t) => set.has(t));
        if (items.length) out.push({ items });
        return;
      }
      const tall = r.tall && set.has(r.tall) ? r.tall : null;
      const stack = r.stack.filter((t) => set.has(t));
      if (tall && stack.length === 2) out.push({ tall, stack, right: r.right });
      else {
        const items = rowItems({ tall, stack, right: r.right });
        if (items.length) out.push({ items });
      }
    });
    // Un film vertical n'est jamais seul sur une ligne pleine largeur : il serait immense
    for (let i = 0; i < out.length; i++) {
      const r = out[i];
      if (!r.items || !r.items.every(isVertical)) continue;
      const next = out[i + 1];
      if (next && next.items) {
        r.items.push(next.items.shift());
        if (!next.items.length) out.splice(i + 1, 1);
      } else if (i > 0 && out[i - 1].items) {
        out[i - 1].items.push(...r.items);
        out.splice(i--, 1);
      }
    }
    return out;
  }

  // Sur mobile : un film vertical prend toute la largeur, les autres vont par une ou deux vignettes
  function narrowRows(rows) {
    const out = [];
    rows.forEach((r) => {
      const buf = [];
      const flush = () => {
        while (buf.length) out.push({ items: buf.splice(0, buf.length === 3 ? 1 : 2) });
      };
      rowItems(r).forEach((t) => {
        if (isVertical(t)) {
          flush();
          out.push({ items: [t] });
        } else buf.push(t);
      });
      flush();
    });
    return out;
  }

  function place(t, k, basis, width) {
    t.style.flex = `0 0 ${basis.toFixed(4)}%`;
    t.style.transitionDelay = reduceMotion ? "" : `${k * 90}ms`;
    t.querySelector(".tile-poster").sizes = `${Math.ceil(width)}vw`;
  }

  // Construit la grille et renvoie les films dans l'ordre d'affichage
  function layout(list) {
    layoutNarrow = isNarrow();
    let rows = rowsFor(new Set(list));
    if (layoutNarrow) rows = narrowRows(rows);
    grid.textContent = "";
    const order = [];
    rows.forEach((r) => {
      const rowEl = el("div", { class: "row" });
      if (r.tall) {
        // Film vertical en grand à côté de deux films empilés, bords alignés
        const k = r.stack.reduce((s, t) => s + 1 / t._p.ratio, 0);
        const aspect = (1 + r.tall._p.ratio * k) / k;
        const tallPct = (r.tall._p.ratio / aspect) * 100;
        const stackEl = el("div", { class: "stack" });
        stackEl.style.flex = `0 0 ${(100 - tallPct).toFixed(4)}%`;
        rowEl.style.setProperty("--sum", aspect.toFixed(4));
        place(r.tall, r.right ? 2 : 0, tallPct, tallPct);
        r.stack.forEach((t, i) => {
          place(t, r.right ? i : i + 1, ((1 / t._p.ratio) / k) * 100, 100 - tallPct);
          stackEl.append(t);
        });
        if (r.right) rowEl.append(stackEl, r.tall);
        else rowEl.append(r.tall, stackEl);
        order.push(...rowItems(r));
      } else {
        const sum = r.items.reduce((s, t) => s + t._p.ratio, 0);
        rowEl.style.setProperty("--sum", sum.toFixed(4));
        r.items.forEach((t, k) => {
          const pct = (t._p.ratio / sum) * 100;
          place(t, k, pct, pct);
          rowEl.append(t);
        });
        order.push(...r.items);
      }
      grid.append(rowEl);
    });
    return order;
  }

  // Apparition au scroll
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        revealIO.unobserve(e.target);
      }
    }
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

  function reveal(nodes) {
    nodes.forEach((n) => {
      n.classList.remove("is-in");
      revealIO.observe(n);
    });
  }

  // Previews : au survol (souris) ou quand la vignette est bien visible (tactile).
  // Le premier film de la grille tourne en boucle tant qu'il est à l'écran.
  let autoTile = null;
  let playerIsOpen = false;

  function startPreview(tile) {
    let v = tile._v;
    if (!v) {
      v = el("video", { class: "tile-preview", muted: true, loop: true, playsinline: true, preload: "auto", "aria-hidden": "true" });
      v.muted = true;
      v.src = media(tile._p.slug).preview;
      v.addEventListener("playing", () => {
        if (tile._want) tile.classList.add("is-playing");
      });
      tile.insertBefore(v, tile.querySelector(".tile-shade"));
      tile._v = v;
    }
    tile._want = true;
    if (!v.paused && v.readyState > 2) tile.classList.add("is-playing");
    safePlay(v);
  }

  function stopPreview(tile, force) {
    if (!force && tile === autoTile && tile._inView && !playerIsOpen) return;
    tile._want = false;
    tile.classList.remove("is-playing");
    const v = tile._v;
    if (v) setTimeout(() => { if (!tile._want) v.pause(); }, 650);
  }

  const autoIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.target !== autoTile) continue;
      autoTile._inView = e.isIntersecting;
      if (e.isIntersecting && !playerIsOpen) startPreview(autoTile);
      else stopPreview(autoTile, true);
    }
  }, { threshold: 0.25 });

  function setAutoTile(t) {
    if (autoTile) {
      autoIO.unobserve(autoTile);
      autoTile._inView = false;
      const old = autoTile;
      autoTile = null;
      stopPreview(old, true);
    }
    if (!t || reduceMotion) return;
    autoTile = t;
    autoIO.observe(t);
  }

  if (canHover) {
    tiles.forEach((t) => {
      t.addEventListener("mouseenter", () => startPreview(t));
      t.addEventListener("mouseleave", () => stopPreview(t));
      t.addEventListener("focus", () => startPreview(t));
      t.addEventListener("blur", () => stopPreview(t));
    });
  } else if (!reduceMotion) {
    const touchIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.intersectionRatio >= 0.75) startPreview(e.target);
        else stopPreview(e.target);
      }
    }, { threshold: [0, 0.75] });
    tiles.forEach((t) => touchIO.observe(t));
  }

  // Filtre par catégorie (depuis le menu)
  const gridFoot = $("#grid-foot");
  let filterTimer = 0;

  function setFilter(id, { toTop = false, instant = false } = {}) {
    currentFilter = id;
    visible = D.projects.filter((p) => id === "all" || p.category === id);
    currentTiles = tiles.filter((t) => visible.includes(t._p));
    flyout.classList.toggle("has-filter", id !== "all");
    $$(".menu-link[data-filter]", flyout).forEach((a) => {
      const on = a.dataset.filter === id;
      a.classList.toggle("is-current", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    gridFoot.hidden = id === "all";
    if (toTop) scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

    const apply = () => {
      tiles.forEach((t) => stopPreview(t, true));
      currentTiles = layout(currentTiles);
      visible = currentTiles.map((t) => t._p);
      grid.classList.remove("is-fading");
      reveal(currentTiles);
      setAutoTile(currentTiles[0]);
    };
    clearTimeout(filterTimer);
    if (instant || reduceMotion) apply();
    else {
      grid.classList.add("is-fading");
      filterTimer = setTimeout(apply, 300);
    }
  }

  $("#grid-all").addEventListener("click", () => setFilter("all", { toTop: true }));
  setFilter("all", { instant: true });

  addEventListener("resize", () => {
    if (isNarrow() !== layoutNarrow) currentTiles = layout(currentTiles);
    if (!isMobileNav()) document.body.classList.toggle("is-locked", playerIsOpen);
  });

  /* ---------- Réalisateurs, clients, contact ---------- */

  const directors = [...new Set(D.projects.map((p) => p.director).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "fr"));
  $("#info-directors").append(...directors.map((d) => el("li", { text: d })));
  $("#info-clients").append(...(D.clients || []).map((c) => el("li", { text: c })));

  if (hasContact()) $("#info-contact").replaceWith(contactIcons());
  else $("#contact").remove();

  const infoCols = $(".info-cols");
  infoCols.classList.add("reveal");
  reveal([infoCols]);

  /* ---------- Lecteur ---------- */

  const player = $("#player");
  const pWindow = $(".player-window", player);
  const stage = $("#player-stage");
  const pv = $("#player-video");
  const seek = $("#ctrl-seek");
  const tCur = $("#ctrl-time");
  const tDur = $("#ctrl-dur");
  let playlist = D.projects;
  let pIdx = -1;
  let lastFocus = null;
  let idleTimer = 0;
  let seeking = false;
  const card = $("#player-card");
  const infoBtn = $("#player-info-btn");
  let cardTimer = 0;

  // Fiche réalisation / production : affichée quelques secondes à l'ouverture, ou épinglée avec le bouton i
  function showCard(on, { auto = false } = {}) {
    clearTimeout(cardTimer);
    card.classList.toggle("is-on", on);
    card.setAttribute("aria-hidden", String(!on));
    infoBtn.setAttribute("aria-expanded", String(on && !auto));
    if (on && auto) cardTimer = setTimeout(() => showCard(false), 4500);
  }

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    s = Math.max(0, Math.floor(s));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  function loadFilm(idx) {
    pIdx = (idx + playlist.length) % playlist.length;
    const p = playlist[pIdx];
    const m = media(p.slug);
    player.style.setProperty("--ar", p.ratio);
    pv.poster = m.poster;
    pv.src = m.film;
    $("#player-cat").textContent = catLabel[p.category] || "";
    $("#player-title").textContent = p.title;
    $("#player-dir").textContent = p.director;
    $("#player-prod").textContent = p.producer ? `Produced by ${p.producer}` : "";
    $("#card-title").textContent = p.title;
    $("#card-dir").textContent = p.director;
    $("#card-prod").textContent = p.producer || "";
    $("#card-dir-row").hidden = !p.director;
    $("#card-prod-row").hidden = !p.producer;
    infoBtn.hidden = !p.director && !p.producer;
    if (infoBtn.hidden) showCard(false);
    else showCard(true, { auto: true });
    seek.value = 0;
    seek.style.setProperty("--p", "0%");
    tCur.textContent = "0:00";
    tDur.textContent = "0:00";
    stage.classList.remove("is-idle");
    setUrl(`#${p.slug}`);
    safePlay(pv);
  }

  function openPlayer(slug) {
    playlist = visible.some((p) => p.slug === slug) ? visible : D.projects;
    const idx = playlist.findIndex((p) => p.slug === slug);
    if (idx < 0) return;
    lastFocus = document.activeElement;
    setFlyout(false);
    playerIsOpen = true;
    tiles.forEach((t) => stopPreview(t, true));
    loadFilm(idx);
    player.classList.add("is-open");
    player.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    setTimeout(() => $(".player-close", player).focus({ preventScroll: true }), 60);
  }

  function closePlayer() {
    if (!playerIsOpen) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    playerIsOpen = false;
    player.classList.remove("is-open");
    player.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    pv.pause();
    showCard(false);
    setTimeout(() => {
      if (playerIsOpen) return;
      pv.removeAttribute("src");
      pv.load();
    }, 650);
    setUrl(location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    if (autoTile && autoTile._inView) startPreview(autoTile);
  }

  const togglePlay = () => (pv.paused || pv.ended ? safePlay(pv) : pv.pause());
  infoBtn.addEventListener("click", () => showCard(infoBtn.getAttribute("aria-expanded") !== "true"));

  function wake() {
    stage.classList.remove("is-idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!pv.paused && !seeking) stage.classList.add("is-idle");
    }, 2200);
  }

  pv.addEventListener("play", () => { stage.classList.remove("is-paused"); $("#ctrl-play").setAttribute("aria-label", "Pause"); wake(); });
  pv.addEventListener("pause", () => { stage.classList.add("is-paused"); stage.classList.remove("is-idle"); $("#ctrl-play").setAttribute("aria-label", "Lecture"); });
  pv.addEventListener("loadedmetadata", () => { tDur.textContent = fmt(pv.duration); });
  pv.addEventListener("timeupdate", () => {
    if (seeking || !pv.duration) return;
    const r = pv.currentTime / pv.duration;
    seek.value = Math.round(r * 1000);
    seek.style.setProperty("--p", `${(r * 100).toFixed(2)}%`);
    tCur.textContent = fmt(pv.currentTime);
  });
  pv.addEventListener("volumechange", () => {
    stage.classList.toggle("is-muted", pv.muted);
    $("#ctrl-mute").setAttribute("aria-label", pv.muted ? "Activer le son" : "Couper le son");
  });

  seek.addEventListener("input", () => {
    seeking = true;
    const r = seek.value / 1000;
    seek.style.setProperty("--p", `${(r * 100).toFixed(2)}%`);
    if (pv.duration) {
      pv.currentTime = r * pv.duration;
      tCur.textContent = fmt(pv.currentTime);
    }
  });
  seek.addEventListener("change", () => { seeking = false; wake(); });

  pv.addEventListener("click", togglePlay);
  $("#player-bigplay").addEventListener("click", togglePlay);
  $("#ctrl-play").addEventListener("click", togglePlay);
  $("#ctrl-mute").addEventListener("click", () => { pv.muted = !pv.muted; });
  $("#ctrl-fs").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
    else if (pv.webkitEnterFullscreen) pv.webkitEnterFullscreen();
  });
  stage.addEventListener("pointermove", wake);
  stage.addEventListener("pointerdown", wake);

  $$("[data-close]", player).forEach((n) => n.addEventListener("click", closePlayer));
  $("#player-prev").addEventListener("click", () => loadFilm(pIdx - 1));
  $("#player-next").addEventListener("click", () => loadFilm(pIdx + 1));

  document.addEventListener("keydown", (e) => {
    if (playerIsOpen) {
      const onRange = e.target === seek;
      if (e.key === "Escape") {
        if (!document.fullscreenElement) closePlayer();
      } else if ((e.key === " " || e.key === "k") && !e.target.closest("button")) {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowRight" && !onRange) {
        pv.currentTime = Math.min(pv.duration || 0, pv.currentTime + 5);
        wake();
      } else if (e.key === "ArrowLeft" && !onRange) {
        pv.currentTime = Math.max(0, pv.currentTime - 5);
        wake();
      } else if (e.key === "m") {
        pv.muted = !pv.muted;
      } else if (e.key === "i" && !infoBtn.hidden) {
        showCard(infoBtn.getAttribute("aria-expanded") !== "true");
      } else if (e.key === "f") {
        $("#ctrl-fs").click();
      } else if (e.key === "Tab") {
        // Garde le focus dans la fenêtre
        const f = $$("button, input", pWindow).filter((n) => n.offsetParent !== null);
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (e.key === "Escape" && flyoutOpen) {
      setFlyout(false);
      burger.focus();
    }
  });

  /* ---------- Lien direct vers un film (#slug) ---------- */

  const fromHash = () => {
    const slug = decodeURIComponent(location.hash.slice(1));
    if (D.projects.some((p) => p.slug === slug)) openPlayer(slug);
  };
  fromHash();
  addEventListener("hashchange", fromHash);
})();
