/* Albert Antioquia. Vanilla, no dependencies. */
(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

    /* ── Rooms: the page takes its light from the photograph in view ──── */

    // Read a 12×12 version of the photograph (Cloudinary serves it with open
    // CORS) and find its dominant colour: hues are binned and weighted by how
    // vivid each cell is, so a gold dome or a green canopy wins over grey sky.
    // The wall becomes a deep shade of that hue for night shots and a pale
    // tint of it for daylight ones; lightness is fixed so text stays readable.
    function toHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        const d = max - min;
        if (!d) return [0, 0, l];
        const s = d / (1 - Math.abs(2 * l - 1));
        let h;
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        return [(h * 60 + 360) % 360, s, l];
    }

    function sampleRoom(el) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = canvas.height = 12;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    ctx.drawImage(img, 0, 0, 12, 12);
                    const d = ctx.getImageData(0, 0, 12, 12).data;
                    const bins = Array.from({ length: 12 }, () => ({ w: 0, h: 0, s: 0 }));
                    let lumSum = 0;
                    for (let i = 0; i < d.length; i += 4) {
                        lumSum += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
                        const [h, s, l] = toHsl(d[i], d[i + 1], d[i + 2]);
                        const vivid = s * (1 - Math.abs(2 * l - 1));
                        const bin = bins[Math.floor(h / 30) % 12];
                        bin.w += vivid; bin.h += h * vivid; bin.s += s * vivid;
                    }
                    const best = bins.reduce((a, b) => (b.w > a.w ? b : a));
                    const hue = best.w ? best.h / best.w : 210;
                    const sat = best.w ? best.s / best.w : 0;
                    const dark = lumSum / (d.length / 4) < 0.42;
                    const s = Math.round(Math.min(dark ? 48 : 42, Math.max(dark ? 24 : 26, sat * 100 * (dark ? 0.8 : 0.75))));
                    el.dataset.tone = dark ? 'dark' : 'light';
                    el.dataset.room = `hsl(${Math.round(hue)} ${s}% ${dark ? 13 : 87}%)`;
                } catch (e) { /* tainted or blocked: keep the night wall */ }
                resolve();
            };
            img.onerror = () => resolve();
            img.src = el.dataset.roomSample;
        });
    }

    function initRooms() {
        const rooms = $$('[data-room], [data-room-sample]');
        if (!rooms.length) return;
        let current = null;

        const apply = (el) => {
            if (!el) return;
            current = el;
            const tone = el.dataset.tone || 'dark';
            if (root.dataset.tone !== tone) root.dataset.tone = tone;
            root.style.setProperty('--room', el.dataset.room || '');
        };

        // The room whose box crosses the middle of the screen sets the light.
        const pick = () => {
            const mid = window.innerHeight / 2;
            const hit = rooms.find((el) => {
                const r = el.getBoundingClientRect();
                return r.top <= mid && r.bottom >= mid;
            });
            if (hit && hit !== current) apply(hit);
        };

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; pick(); }); }
        }, { passive: true });
        window.addEventListener('resize', pick);

        Promise.all($$('[data-room-sample]').map(sampleRoom)).then(() => {
            if (current) apply(current);
            pick();
        });
        pick();
    }

    /* ── Navigation ───────────────────────────────────────────────────── */

    function initNav() {
        const nav = $('[data-nav]');
        if (!nav) return;
        const cover = $('.cover');
        let lastY = window.scrollY;
        let ticking = false;

        const update = () => {
            ticking = false;
            const y = window.scrollY;
            const overCover = cover ? cover.getBoundingClientRect().bottom > nav.offsetHeight : false;
            nav.classList.toggle('is-over-cover', overCover);
            nav.classList.toggle('is-solid', !overCover && y > 8);
            // Get out of the way while reading down; come back on the way up.
            const goingDown = y > lastY + 4;
            const goingUp = y < lastY - 4;
            if (goingDown && y > 480 && !nav.contains(document.activeElement)) nav.classList.add('is-hidden');
            if (goingUp || y < 480) nav.classList.remove('is-hidden');
            lastY = y;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
        update();

        const menu = $('#menu');
        $('[data-open-menu]')?.addEventListener('click', () => menu.showModal());
        $('[data-close-menu]', menu)?.addEventListener('click', () => menu.close());
        menu?.addEventListener('click', (e) => { if (e.target.closest('a')) menu.close(); });
    }

    /* ── Index: the photograph follows the cursor ─────────────────────── */
    // After SmoothUI's Hover Image List: lerped position, a lean that follows
    // horizontal speed, and a per-frame hit test so it never sticks on scroll.

    function initIndex() {
        const list = $('[data-index]');
        const preview = $('[data-index-preview]');
        if (!list || !preview || !finePointer.matches) return;

        const img = new Image();
        img.alt = '';
        img.decoding = 'async';
        preview.appendChild(img);
        $$('.index-row', list).forEach((row) => { const pre = new Image(); pre.src = row.dataset.preview; });

        let mx = 0, my = 0, x = 0, y = 0, lean = 0, lastX = 0;
        let active = null, running = false, inside = false;

        const setActive = (row) => {
            if (row === active) return;
            active = row;
            if (row) {
                if (img.getAttribute('src') !== row.dataset.preview) img.src = row.dataset.preview;
                preview.classList.add('is-on');
            } else {
                preview.classList.remove('is-on');
            }
        };

        const frame = () => {
            const hit = inside ? document.elementFromPoint(mx, my)?.closest('.index-row') : null;
            setActive(hit && list.contains(hit) ? hit : null);
            const k = reduceMotion.matches ? 1 : 0.16;
            x += (mx - x) * k;
            y += (my - y) * k;
            const vx = x - lastX;
            lastX = x;
            const target = reduceMotion.matches ? 0 : Math.max(-6, Math.min(6, vx * 0.3));
            lean += (target - lean) * 0.18;
            preview.style.transform = `translate3d(${x + 32}px, ${y - 120}px, 0)`;
            img.style.transform = `rotate(${lean * 0.5}deg) skewX(${-lean}deg)`;
            if (inside || Math.abs(mx - x) > 0.5 || Math.abs(lean) > 0.05) requestAnimationFrame(frame);
            else running = false;
        };
        const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

        list.addEventListener('pointerenter', (e) => { inside = true; mx = x = lastX = e.clientX; my = y = e.clientY; kick(); });
        list.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; kick(); });
        list.addEventListener('pointerleave', () => { inside = false; setActive(null); });
        window.addEventListener('scroll', () => { if (inside) kick(); }, { passive: true });
    }

    /* ── Viewer ───────────────────────────────────────────────────────── */

    function initViewer() {
        const dialog = $('[data-viewer]');
        const dataEl = $('[data-photos]');
        if (!dialog || !dataEl) return;
        let photos = [];
        try { photos = JSON.parse(dataEl.textContent); } catch (e) { return; }
        if (!photos.length) return;

        const stage = $('[data-viewer-stage]', dialog);
        const title = $('[data-viewer-title]', dialog);
        const count = $('[data-viewer-count]', dialog);
        const meta = $('[data-viewer-meta]', dialog);
        const desc = $('[data-viewer-desc]', dialog);
        const prev = $('[data-viewer-prev]', dialog);
        const next = $('[data-viewer-next]', dialog);

        const img = document.createElement('img');
        img.className = 'viewer-img';
        img.decoding = 'async';
        stage.prepend(img);

        let index = 0;
        let opener = null;

        // Size the frame from the photo's known dimensions before any pixels
        // arrive, so the opening animation has a box to grow into.
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
            // Start from the copy already on the page, then swap in the large
            // file once decoded: Cloudinary can take a moment to make a new size.
            const onPage = document.querySelector(`[data-open-photo="${p.id}"] img, img[data-photo-id="${p.id}"]`);
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
            title.textContent = p.title;
            const pad = (n) => String(n).padStart(2, '0');
            count.textContent = `${pad(index + 1)} / ${pad(photos.length)}`;
            meta.textContent = [p.place, p.date].filter(Boolean).join(' · ');
            desc.textContent = p.description || '';
            prev.hidden = next.hidden = photos.length < 2;
        };

        const flipFrom = (thumb) => {
            if (!thumb || reduceMotion.matches || !img.animate) return;
            requestAnimationFrame(() => {
                const a = thumb.getBoundingClientRect();
                const b = img.getBoundingClientRect();
                if (!a.width || !b.width) return;
                const s = Math.min(a.width / b.width, a.height / b.height);
                const dx = a.left + a.width / 2 - (b.left + b.width / 2);
                const dy = a.top + a.height / 2 - (b.top + b.height / 2);
                img.animate(
                    [{ transform: `translate(${dx}px, ${dy}px) scale(${s})` }, { transform: 'none' }],
                    { duration: 560, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
                );
            });
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-open-photo]');
            if (!trigger) return;
            const i = photos.findIndex((p) => String(p.id) === trigger.dataset.openPhoto);
            if (i < 0) return;
            e.preventDefault();
            opener = trigger;
            dialog.showModal();
            show(i);
            fit();
            flipFrom(trigger.querySelector('img'));
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

        // Swipe between photographs on touch screens.
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

    /* ── /tech: the phone follows the session steps ───────────────────── */

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

    /* ── /tech: rotation modes replay their shuffle on arrival ────────── */

    function initModes() {
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

    initRooms();
    initNav();
    initIndex();
    initViewer();
    initRide();
    initModes();
})();
