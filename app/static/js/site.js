/* Albert Antioquia — the interchange. Vanilla, no dependencies. */
(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

    /* ── Strip map: light the station you're at ───────────────────────── */

    function initStripMap() {
        const stops = $$('.strip-map .stop');
        const routeStops = $$('.route-stop');
        const nowName = $('[data-now]');
        const linePlates = $$('.strip-lines .line-plate');
        if (!stops.length) return;

        const ids = stops.map((li) => li.querySelector('a').dataset.stop);
        const labels = stops.map((li) => li.querySelector('a').title);
        const sections = ids.map((id) => document.getElementById(id));
        let current = -1;
        let ticking = false;

        const update = () => {
            ticking = false;
            const line = window.innerHeight * 0.38;
            let idx = 0;
            sections.forEach((el, i) => {
                if (el && el.getBoundingClientRect().top <= line) idx = i;
            });
            // At the very bottom the last stop is where you are, however short it is.
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                idx = sections.length - 1;
            }
            if (idx === current) return;
            current = idx;
            stops.forEach((li, i) => {
                li.classList.toggle('is-current', i === idx);
                li.classList.toggle('is-passed', i < idx);
                li.querySelector('a').toggleAttribute('aria-current', i === idx);
            });
            routeStops.forEach((li, i) => li.classList.toggle('is-current', i === idx));
            // At the interchange every line is lit; elsewhere only the one you're riding.
            const riding = stops[idx].dataset.line;
            linePlates.forEach((a) => a.classList.toggle('is-current', (riding === 'x' && idx === 0) || a.dataset.line === riding));
            if (nowName) setNowName(nowName, labels[idx]);
        };

        const onScroll = () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    // The in-car display re-draws its characters when the station changes.
    let scrambleTimer = null;
    function setNowName(el, text) {
        clearInterval(scrambleTimer);
        if (reduceMotion.matches || !el.textContent) { el.textContent = text; return; }
        const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const start = performance.now();
        const duration = 360;
        scrambleTimer = setInterval(() => {
            const p = Math.min(1, (performance.now() - start) / duration);
            const settled = Math.floor(p * text.length);
            el.textContent = text
                .split('')
                .map((ch, i) => (i < settled || ch === ' ' ? ch : glyphs[(Math.random() * glyphs.length) | 0]))
                .join('');
            if (p === 1) clearInterval(scrambleTimer);
        }, 40);
    }

    /* ── Route map dialog ─────────────────────────────────────────────── */

    function initRouteMap() {
        const dialog = $('#route-map');
        const openers = $$('[data-open-map]');
        if (!dialog || !openers.length) return;

        openers.forEach((btn) => btn.addEventListener('click', () => {
            dialog.showModal();
            const current = $('.route-stop.is-current a', dialog);
            (current || $('a', dialog))?.focus();
        }));
        $('[data-close-map]', dialog)?.addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) dialog.close();
            if (e.target.closest('a')) dialog.close();
        });
    }

    /* ── Arrivals: platform doors and quiet rises ─────────────────────── */

    function initReveals() {
        if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
        const doors = $$('.doors');
        const risers = $$('.station-text, .about-body, .pipeline-head, .pipe-route, .q-phone, .spec, .why-body');
        risers.forEach((el) => el.classList.add('rise'));
        const targets = [...doors, ...risers];
        if (!targets.length) return;

        // A closed door is clipped to nothing, and a fully clipped element never
        // intersects, so each door is watched through its station instead.
        const watched = new Map();
        targets.forEach((el) => {
            const box = el.classList.contains('doors') ? (el.closest('.station') || el.parentElement) : el;
            if (!watched.has(box)) watched.set(box, []);
            watched.get(box).push(el);
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                watched.get(entry.target).forEach((el) => el.classList.add('is-open'));
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

        root.classList.add('reveal-ready');
        // Anything already on screen opens immediately so nothing blinks out.
        watched.forEach((els, box) => {
            const r = box.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.9 && r.bottom > 0) els.forEach((el) => el.classList.add('is-open'));
            else io.observe(box);
        });
    }

    /* ── Timetable: preview follows the cursor ────────────────────────── */
    // Ported from SmoothUI's Hover Image List: lerped position, velocity skew,
    // and a per-frame hit test so the preview never sticks while scrolling.

    function initTimetable() {
        const list = $('[data-timetable]');
        const preview = $('[data-tt-preview]');
        if (!list || !preview || !finePointer.matches) return;

        const img = new Image();
        img.alt = '';
        img.decoding = 'async';
        preview.appendChild(img);

        const rows = $$('.tt-row', list);
        rows.forEach((row) => { const pre = new Image(); pre.src = row.dataset.preview; });

        let mx = 0, my = 0, x = 0, y = 0, skew = 0, lastX = 0;
        let active = null;
        let running = false;
        let inside = false;

        const setActive = (row) => {
            if (row === active) return;
            active?.classList.remove('is-hot');
            active = row;
            if (row) {
                row.classList.add('is-hot');
                if (img.src !== row.dataset.preview) img.src = row.dataset.preview;
                preview.classList.add('is-on');
            } else {
                preview.classList.remove('is-on');
            }
        };

        const frame = () => {
            const hit = inside ? document.elementFromPoint(mx, my)?.closest('.tt-row') : null;
            setActive(hit && list.contains(hit) ? hit : null);

            const k = reduceMotion.matches ? 1 : 0.18;
            x += (mx - x) * k;
            y += (my - y) * k;
            const vx = x - lastX;
            lastX = x;
            const targetSkew = reduceMotion.matches ? 0 : Math.max(-7, Math.min(7, vx * 0.35));
            skew += (targetSkew - skew) * 0.2;
            preview.style.transform = `translate3d(${x + 28}px, ${y - 90}px, 0)`;
            img.style.transform = `skewX(${-skew}deg)`;

            if (inside || Math.abs(mx - x) > 0.5 || Math.abs(skew) > 0.05) {
                requestAnimationFrame(frame);
            } else {
                running = false;
            }
        };
        const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

        list.addEventListener('pointerenter', (e) => {
            inside = true; mx = x = lastX = e.clientX; my = y = e.clientY; kick();
        });
        list.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; kick(); });
        list.addEventListener('pointerleave', () => { inside = false; setActive(null); });
        window.addEventListener('scroll', () => { if (inside) kick(); }, { passive: true });
    }

    /* ── Viewer: the tunnel ───────────────────────────────────────────── */

    function initViewer() {
        const dialog = $('[data-viewer]');
        const dataEl = $('[data-photos]');
        if (!dialog || !dataEl) return;

        let photos = [];
        try { photos = JSON.parse(dataEl.textContent); } catch (e) { return; }
        if (!photos.length) return;

        const stage = $('[data-viewer-stage]', dialog);
        const code = $('[data-viewer-code]', dialog);
        const title = $('[data-viewer-title]', dialog);
        const count = $('[data-viewer-count]', dialog);
        const meta = $('[data-viewer-meta]', dialog);
        const desc = $('[data-viewer-desc]', dialog);
        const prev = $('[data-viewer-prev]', dialog);
        const next = $('[data-viewer-next]', dialog);

        const img = document.createElement('img');
        img.className = 'viewer-img';
        img.decoding = 'async';
        img.sizes = '100vw';
        stage.prepend(img);

        let index = 0;
        let opener = null;

        // Size the frame from the photo's known dimensions so it exists before
        // any pixels arrive (and so the FLIP has a box to grow into).
        const fit = () => {
            const p = photos[index];
            const box = stage.getBoundingClientRect();
            const style = getComputedStyle(stage);
            const w = box.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            const k = Math.min(w / p.width, box.height / p.height);
            img.style.width = `${Math.floor(p.width * k)}px`;
            img.style.height = `${Math.floor(p.height * k)}px`;
            img.sizes = `${Math.ceil(p.width * k)}px`;
        };

        const show = (i) => {
            index = (i + photos.length) % photos.length;
            const p = photos[index];
            const shown = index;
            // Start from whatever the page already has on screen, then swap in
            // the full-size file once it has decoded: Cloudinary can take a few
            // seconds to make a new size the first time it's asked for.
            const onPage = document.querySelector(`[data-open-photo="${p.id}"] img`);
            img.removeAttribute('srcset');
            img.src = onPage?.currentSrc || p.src;
            if (dialog.open) fit();
            const full = new Image();
            full.sizes = img.sizes || '100vw';
            full.srcset = p.srcset;
            full.src = p.src;
            (full.decode ? full.decode() : Promise.resolve()).then(() => {
                if (index === shown && dialog.open) img.src = full.currentSrc || p.src;
            }).catch(() => {});
            img.alt = p.description || p.title;
            code.textContent = p.code;
            title.textContent = p.title;
            count.textContent = `${index + 1} / ${photos.length}`;
            meta.textContent = [p.place, p.date && `Added ${p.date}`].filter(Boolean).join(' · ');
            desc.textContent = p.description || '';
            const single = photos.length < 2;
            prev.hidden = single;
            next.hidden = single;
            // Warm the neighbours so stepping through feels instant.
            [index + 1, index - 1].forEach((n) => {
                const q = photos[(n + photos.length) % photos.length];
                const pre = new Image(); pre.sizes = '100vw'; pre.srcset = q.srcset;
            });
        };

        const open = (id, from) => {
            const i = photos.findIndex((p) => String(p.id) === String(id));
            if (i < 0) return;
            opener = from;
            dialog.showModal();
            show(i);
            fit();
            flipFrom(from?.querySelector('img'));
        };

        // FLIP: grow the photo out of the thumbnail it was opened from.
        const flipFrom = (thumb) => {
            if (!thumb || reduceMotion.matches || !img.animate) return;
            const run = () => {
                const a = thumb.getBoundingClientRect();
                const b = img.getBoundingClientRect();
                if (!b.width || !a.width) return;
                const sx = a.width / b.width;
                const sy = a.height / b.height;
                const s = Math.min(sx, sy);
                const dx = a.left + a.width / 2 - (b.left + b.width / 2);
                const dy = a.top + a.height / 2 - (b.top + b.height / 2);
                img.animate(
                    [{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.6 }, { transform: 'none', opacity: 1 }],
                    { duration: 520, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
                );
            };
            requestAnimationFrame(run);
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-open-photo]');
            if (!trigger) return;
            e.preventDefault();
            open(trigger.dataset.openPhoto, trigger);
        });

        prev.addEventListener('click', () => show(index - 1));
        next.addEventListener('click', () => show(index + 1));
        $('[data-viewer-close]', dialog).addEventListener('click', () => dialog.close());
        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
        });
        window.addEventListener('resize', () => { if (dialog.open) fit(); });
        dialog.addEventListener('close', () => {
            img.removeAttribute('src');
            opener?.focus({ preventScroll: true });
        });

        // Swipe between photos on touch screens.
        let sx = 0, sy = 0, tracking = false;
        stage.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse') return;
            tracking = true; sx = e.clientX; sy = e.clientY;
        });
        stage.addEventListener('pointerup', (e) => {
            if (!tracking) return;
            tracking = false;
            const dx = e.clientX - sx;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - sy) * 1.4) show(index + (dx < 0 ? 1 : -1));
        });
        stage.addEventListener('pointercancel', () => { tracking = false; });
    }

    /* ── Interchange: three lines run in and dock at their platforms ─── */
    // Transit-map geometry: horizontal runs and 45° bends, fanning out from
    // the edge of the wall into the three "Change here for" rows.

    function initHeroRoutes() {
        const svg = $('[data-hero-routes]');
        if (!svg) return;
        const hero = svg.parentElement;
        const ns = 'http://www.w3.org/2000/svg';
        const colours = { p: 'var(--p)', d: 'var(--d)', q: 'var(--q)' };
        let drawn = false;

        const draw = () => {
            svg.replaceChildren();
            if (getComputedStyle(svg).display === 'none') return;
            const box = hero.getBoundingClientRect();
            const docks = ['p', 'd', 'q'].map((l) => $(`[data-dock="${l}"]`, hero));
            if (docks.some((d) => !d)) return;
            const list = docks[0].closest('.change-lines').getBoundingClientRect();
            const spacing = 18;
            const base = box.height - Math.min(84, box.height * 0.09);
            const dockX = list.right - box.left;
            const bendTop = dockX + 30;

            docks.forEach((dock, i) => {
                const r = dock.getBoundingClientRect();
                const yDock = r.top - box.top + r.height / 2;
                const yRun = base - (2 - i) * spacing;
                const xBend = bendTop + (yRun - yDock);
                const path = document.createElementNS(ns, 'path');
                path.setAttribute('d', `M${box.width + 10},${yRun} L${xBend},${yRun} L${bendTop},${yDock} L${dockX},${yDock}`);
                path.style.stroke = colours[dock.dataset.dock];
                svg.appendChild(path);
                if (!drawn && !reduceMotion.matches && path.animate) {
                    const len = path.getTotalLength();
                    path.animate(
                        [{ strokeDasharray: `${len}`, strokeDashoffset: len }, { strokeDasharray: `${len}`, strokeDashoffset: 0 }],
                        { duration: 1300, delay: 150 + i * 110, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
                    );
                }
            });
            svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
            drawn = true;
        };

        if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(draw)).observe(hero);
        else window.addEventListener('resize', draw);
        document.fonts?.ready.then(draw);
        draw();
    }

    /* ── /tech: sticky phone follows the session steps ────────────────── */

    function initRide() {
        const ride = $('[data-ride]');
        if (!ride || !('IntersectionObserver' in window)) return;
        const steps = $$('.ride-step', ride);
        const shots = $$('[data-shot-img]', ride);
        const activate = (step) => {
            steps.forEach((s) => s.classList.toggle('is-active', s === step));
            shots.forEach((img) => {
                const on = img.dataset.shotImg === step.dataset.shot;
                img.classList.toggle('is-on', on);
                if (on) img.loading = 'eager';
            });
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) activate(e.target); });
        }, { rootMargin: '-45% 0px -45% 0px' });
        steps.forEach((s) => io.observe(s));
        activate(steps[0]);
    }

    /* ── /tech: rotation modes play one round when they arrive ───────── */

    function initModes() {
        // Each mode is drawn in its end state by default; with motion allowed it
        // replays the shuffle from the starting line-up when it comes into view.
        const modes = $$('.mode');
        if (!modes.length || reduceMotion.matches || !('IntersectionObserver' in window)) return;
        const replay = (m) => {
            m.classList.remove('is-played');
            void m.offsetWidth;
            setTimeout(() => m.classList.add('is-played'), 450);
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                replay(e.target);
                io.unobserve(e.target);
            });
        }, { threshold: 0.6 });
        modes.forEach((m) => {
            io.observe(m);
            m.addEventListener('pointerenter', () => replay(m));
        });
    }

    initStripMap();
    initRouteMap();
    initReveals();
    initTimetable();
    initViewer();
    initHeroRoutes();
    initRide();
    initModes();
})();
