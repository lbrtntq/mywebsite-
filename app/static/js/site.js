/* Albert Antioquia. Vanilla JS plus Lenis for smooth scrolling. */
(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const $ = (sel, el = document) => el.querySelector(sel);
    const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = (t) => t * t * (3 - 2 * t);
    let lenis = null;

    /* ── Springs: one tiny physics rig shared by the deck and the day ─── */
    // Each rig eases x, y and rotation towards a target with a damped
    // spring, so a dealt print overshoots a touch and settles like paper.

    const rigs = new Set();
    let ticking = false;
    class Rig {
        constructor(el, base) {
            this.el = el;
            this.base = base || '';
            this.s = { x: 0, y: 0, r: 0 };
            this.v = { x: 0, y: 0, r: 0 };
            this.t = { x: 0, y: 0, r: 0 };
            this.k = 170;
            this.d = 19;
        }
        render() {
            this.el.style.transform = `${this.base} translate(${this.s.x.toFixed(2)}px, ${this.s.y.toFixed(2)}px) rotate(${this.s.r.toFixed(3)}deg)`;
        }
        jump(t) { Object.assign(this.t, t); Object.assign(this.s, t); this.v = { x: 0, y: 0, r: 0 }; this.render(); }
        to(t, feel = 'snap') {
            Object.assign(this.t, t);
            [this.k, this.d] = feel === 'throw' ? [120, 15] : [190, 21];
            if (reduceMotion.matches) { this.jump(this.t); return; }
            rigs.add(this);
            if (!ticking) { ticking = true; requestAnimationFrame(step); }
        }
        advance(dt) {
            let moving = false;
            for (const key of ['x', 'y', 'r']) {
                const a = this.k * (this.t[key] - this.s[key]) - this.d * this.v[key];
                this.v[key] += a * dt;
                this.s[key] += this.v[key] * dt;
                if (Math.abs(this.v[key]) > 0.02 || Math.abs(this.t[key] - this.s[key]) > 0.05) moving = true;
            }
            if (!moving) Object.assign(this.s, this.t);
            this.render();
            return moving;
        }
    }
    let last = 0;
    function step(now) {
        const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
        last = now;
        rigs.forEach((rig) => { if (!rig.advance(dt)) rigs.delete(rig); });
        if (rigs.size) requestAnimationFrame(step);
        else { ticking = false; last = 0; }
    }

    /* ── Smooth scrolling ─────────────────────────────────────────────── */

    function initLenis() {
        if (reduceMotion.matches || typeof window.Lenis !== 'function') return;
        lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
        const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
        // Same-page anchors glide too.
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href*="#"]');
            if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
            const target = a.hash && document.querySelector(a.hash);
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target);
            history.replaceState(null, '', a.hash);
        });
    }

    /* ── Sections set the page's tone and wall ────────────────────────── */

    function setWall(tone, colour) {
        if (root.dataset.tone !== tone) root.dataset.tone = tone;
        root.style.setProperty('--room', colour || '');
    }

    function initRooms() {
        const rooms = $$('[data-room]');
        if (!rooms.length) return;
        let current = null;
        const pick = () => {
            const mid = window.innerHeight / 2;
            const hit = rooms.find((el) => {
                const r = el.getBoundingClientRect();
                return r.top <= mid && r.bottom >= mid;
            });
            if (hit && hit !== current) setWall(hit.dataset.tone || 'dark', hit.dataset.room);
            current = hit || null;
        };
        window.addEventListener('scroll', () => requestAnimationFrame(pick), { passive: true });
        window.addEventListener('resize', pick);
        pick();
    }

    /* ── Navigation ───────────────────────────────────────────────────── */

    function initNav() {
        const nav = $('[data-nav]');
        if (!nav) return;
        let lastY = window.scrollY;
        const update = () => {
            const y = window.scrollY;
            nav.classList.toggle('is-solid', y > 8);
            if (y > lastY + 4 && y > 480 && !nav.contains(document.activeElement)) nav.classList.add('is-hidden');
            if (y < lastY - 4 || y < 480) nav.classList.remove('is-hidden');
            lastY = y;
        };
        window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
        nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
        update();

        const menu = $('#menu');
        $('[data-open-menu]')?.addEventListener('click', () => { menu.showModal(); lenis?.stop(); });
        $('[data-close-menu]', menu)?.addEventListener('click', () => menu.close());
        menu?.addEventListener('close', () => lenis?.start());
        menu?.addEventListener('click', (e) => { if (e.target.closest('a')) menu.close(); });
    }

    /* ── The deck: prints you can deal or flick ───────────────────────── */

    function initDeck() {
        const deck = $('[data-deck]');
        if (!deck) return;
        const prints = $$('[data-deck-print]', deck);
        if (prints.length < 2) return;
        const title = $('[data-deck-title]', deck);
        const meta = $('[data-deck-meta]', deck);
        const tilts = [-2.2, 3.1, -4.4, 2.6, -1.4];
        const rigsFor = new Map(prints.map((p) => [p, new Rig(p)]));
        let order = prints.slice();
        let busy = false;

        const slot = (k) => ({ x: k * 5, y: k * 4, r: k === 0 ? -1.2 : tilts[k % tilts.length] });
        const layout = (jump) => {
            order.forEach((p, k) => {
                p.style.zIndex = String(order.length - k);
                const rig = rigsFor.get(p);
                jump ? rig.jump(slot(k)) : rig.to(slot(k));
            });
            title.textContent = order[0].dataset.title;
            meta.textContent = order[0].dataset.meta;
        };

        // Throw the top print off in a direction, then tuck it under the pile.
        const deal = (dir = 1) => {
            if (busy) return;
            busy = true;
            const top = order[0];
            rigsFor.get(top).to({ x: dir * deck.offsetWidth * 1.1, y: -40, r: dir * 22 }, 'throw');
            setTimeout(() => {
                order = order.slice(1).concat(top);
                layout(false);
                busy = false;
            }, reduceMotion.matches ? 0 : 230);
        };

        $('[data-deck-next]', deck).addEventListener('click', () => deal(1));

        // Drag the top print; let go fast or far and it flies.
        let drag = null;
        deck.addEventListener('pointerdown', (e) => {
            const p = e.target.closest('[data-deck-print]');
            if (!p || p !== order[0] || busy) return;
            drag = { p, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, t: performance.now(), vx: 0, moved: false };
            p.setPointerCapture(e.pointerId);
        });
        deck.addEventListener('pointermove', (e) => {
            if (!drag) return;
            const now = performance.now();
            const dx = e.clientX - drag.x0;
            drag.vx = (dx - drag.dx) / Math.max(1, now - drag.t);
            drag.dx = dx;
            drag.dy = e.clientY - drag.y0;
            drag.t = now;
            if (Math.abs(dx) > 4) drag.moved = true;
            rigsFor.get(drag.p).jump({ x: dx, y: drag.dy * 0.4, r: dx * 0.06 });
        });
        const release = () => {
            if (!drag) return;
            const { dx, vx, moved } = drag;
            drag = null;
            if (!moved) { deal(1); return; }
            if (Math.abs(dx) > 90 || Math.abs(vx) > 0.6) deal(Math.sign(dx || vx));
            else layout(false);
        };
        deck.addEventListener('pointerup', release);
        deck.addEventListener('pointercancel', release);

        layout(true);
    }

    /* ── One long day: the clock, the light and the prints ────────────── */
    // The section is a tall track with a sticky scene. Scroll progress picks
    // the photograph; the clock holds on its real capture time, then ticks
    // towards the next one; the wall follows the time of day.

    const SKY = [
        [600, [232, 238, 241], 'light'],
        [690, [238, 241, 238], 'light'],
        [780, [243, 240, 230], 'light'],
        [930, [241, 230, 209], 'light'],
        [1020, [236, 214, 180], 'light'],
        [1090, [226, 186, 146], 'light'],
        [1105, [47, 36, 51], 'dark'],
        [1160, [26, 26, 43], 'dark'],
        [1230, [11, 17, 26], 'dark'],
    ];
    function skyAt(m) {
        if (m <= SKY[0][0]) return SKY[0];
        for (let i = 1; i < SKY.length; i++) {
            const [m1, c1, tone1] = SKY[i];
            const [m0, c0, tone0] = SKY[i - 1];
            if (m <= m1) {
                const t = (m - m0) / (m1 - m0);
                return [m, c0.map((v, k) => Math.round(lerp(v, c1[k], t))), t < 0.5 ? tone0 : tone1];
            }
        }
        return SKY[SKY.length - 1];
    }
    const fmt = (m) => {
        const total = Math.round(m);
        const h = Math.floor(total / 60) % 24;
        return { hm: `${h % 12 || 12}:${String(total % 60).padStart(2, '0')}`, ap: h < 12 ? 'AM' : 'PM' };
    };

    function initDay() {
        const day = $('[data-day]');
        if (!day) return;
        const track = $('.day-track', day);
        const scene = $('[data-day-scene]', day);
        const stages = $$('[data-stage]', day);
        const prints = stages.map((s) => $('.print', s));
        const ticks = $$('.day-ticks li', day);
        const hm = $('[data-day-hm]', day);
        const ap = $('[data-day-ap]', day);
        const fill = $('.day-rail-fill', day);
        const times = stages.map((s) => (s.dataset.minute === '' ? null : Number(s.dataset.minute)));
        const n = stages.length;
        if (!n) return;

        day.classList.add('is-live');
        const jitter = stages.map((_, i) => ({ x: [-14, 10, -6, 16, -10, 8][i % 6], r: [-3.5, 2.8, -1.8, 3.6, -2.6, 1.6][i % 6] }));
        const rigsFor = prints.map((p) => new Rig(p, 'translate(-50%, -50%)'));
        let stage = -1;

        const place = (seg, jump) => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            rigsFor.forEach((rig, i) => {
                let t;
                if (i < seg) {
                    const k = seg - i;
                    t = { x: jitter[i].x - k * 6, y: k * 5, r: jitter[i].r };
                } else if (i === seg) {
                    t = { x: 0, y: 0, r: [-1.2, 1, -0.6, 1.4, -0.9][i % 5] };
                } else {
                    t = { x: vw * 0.7, y: -vh * 0.75, r: 20 };
                }
                prints[i].style.zIndex = String(i + 1);
                prints[i].tabIndex = i === seg ? 0 : -1;
                jump ? rig.jump(t) : rig.to(t, i === seg ? 'throw' : 'snap');
            });
        };

        const update = () => {
            const vh = window.innerHeight;
            const r = track.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) return;
            const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
            const seg = Math.min(n - 1, Math.floor(p * n));
            const f = p * n - seg;

            const t0 = times[seg];
            const t1 = times[seg + 1] ?? t0;
            if (t0 != null) {
                const m = f < 0.6 ? t0 : lerp(t0, t1, smooth(clamp((f - 0.6) / 0.4, 0, 1)));
                const time = fmt(m);
                if (hm.textContent !== time.hm) hm.textContent = time.hm;
                if (ap.textContent !== time.ap) ap.textContent = time.ap;

                // The wall follows the clock once the scene owns the screen.
                if (r.top < vh * 0.5) {
                    const [, rgb, tone] = skyAt(m);
                    setWall(tone, `rgb(${rgb.join(' ')})`);
                }

                // The sun crosses an arc from 6 AM to 6 PM and sets; the moon comes up after dusk.
                const daylight = clamp((m - 360) / 720, 0, 1);
                // A high arc that keeps clear of the clock (top left) and the prints.
                const narrow = window.innerWidth < 720;
                const arc = Math.sin(Math.PI * daylight);
                scene.style.setProperty('--sun-x', `${narrow ? 66 + 26 * daylight : 28 + 64 * daylight}%`);
                scene.style.setProperty('--sun-y', `${narrow ? 22 - 9 * arc : 21 - 13 * arc}%`);
                scene.style.setProperty('--sun-o', String(clamp(1 - (m - 1060) / 50, 0, 1)));
                scene.style.setProperty('--moon-o', String(clamp((m - 1110) / 60, 0, 1)));

            }
            fill.style.setProperty('--p', p.toFixed(4));

            if (seg !== stage) {
                const first = stage < 0;
                stage = seg;
                place(seg, first);
                stages.forEach((s, i) => s.classList.toggle('is-now', i === seg));
                ticks.forEach((tk, i) => tk.classList.toggle('is-now', i === seg));
            }
        };

        window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
        window.addEventListener('resize', () => { place(Math.max(0, stage), true); update(); });
        place(0, true);
        update();
    }

    /* ── Lineage: the dbt graph, drawn from its own refs ──────────────── */
    // Magic UI's Animated Beam idea: measure node centres, draw a curve
    // between each pair, and let the lines draw in when the graph arrives.

    function initLineage() {
        const dag = $('[data-dag]');
        const dataEl = $('[data-dag-data]');
        if (!dag || !dataEl) return;
        let edges = [];
        try { edges = JSON.parse(dataEl.textContent); } catch (e) { return; }
        const svg = $('[data-dag-svg]', dag);
        const nodes = new Map($$('[data-model]', dag).map((n) => [n.dataset.model, n]));
        const ns = 'http://www.w3.org/2000/svg';
        let paths = [];
        let drawn = false;

        const draw = () => {
            svg.replaceChildren();
            const box = dag.getBoundingClientRect();
            svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
            paths = edges.map(([from, to]) => {
                const a = nodes.get(from).getBoundingClientRect();
                const b = nodes.get(to).getBoundingClientRect();
                const x1 = a.right - box.left, y1 = a.top + a.height / 2 - box.top;
                const x2 = b.left - box.left, y2 = b.top + b.height / 2 - box.top;
                const mid = (x1 + x2) / 2;
                const path = document.createElementNS(ns, 'path');
                path.setAttribute('d', `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`);
                path.dataset.from = from;
                path.dataset.to = to;
                svg.appendChild(path);
                return path;
            });
        };

        const reveal = () => {
            if (drawn || reduceMotion.matches) { drawn = true; return; }
            drawn = true;
            paths.forEach((p) => {
                const len = p.getTotalLength();
                const layer = [...nodes.keys()].indexOf(p.dataset.from) < 5 ? 0 : p.dataset.from.startsWith('staging') ? 1 : 2;
                p.animate(
                    [{ strokeDasharray: len, strokeDashoffset: len }, { strokeDasharray: len, strokeDashoffset: 0 }],
                    { duration: 700, delay: layer * 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
                );
            });
        };

        // Trace: everything upstream and downstream of the focused model.
        const walk = (start, dir) => {
            const seen = new Set([start]);
            const queue = [start];
            while (queue.length) {
                const m = queue.shift();
                edges.forEach(([a, b]) => {
                    const next = dir === 'up' ? (b === m ? a : null) : (a === m ? b : null);
                    if (next && !seen.has(next)) { seen.add(next); queue.push(next); }
                });
            }
            return seen;
        };
        const trace = (model) => {
            if (!model) {
                dag.classList.remove('is-tracing');
                nodes.forEach((n) => n.classList.remove('is-on', 'is-focus'));
                paths.forEach((p) => p.classList.remove('is-on'));
                return;
            }
            const linked = new Set([...walk(model, 'up'), ...walk(model, 'down')]);
            dag.classList.add('is-tracing');
            nodes.forEach((n, key) => {
                n.classList.toggle('is-on', linked.has(key));
                n.classList.toggle('is-focus', key === model);
            });
            paths.forEach((p) => p.classList.toggle('is-on', linked.has(p.dataset.from) && linked.has(p.dataset.to)));
        };
        nodes.forEach((n, key) => {
            n.addEventListener('pointerenter', () => trace(key));
            n.addEventListener('focus', () => trace(key));
            n.addEventListener('click', () => trace(key));
        });
        dag.addEventListener('pointerleave', () => trace(null));
        dag.addEventListener('focusout', (e) => { if (!dag.contains(e.relatedTarget)) trace(null); });

        draw();
        if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(draw)).observe(dag);
        document.fonts?.ready.then(draw);
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                if (entries.some((e) => e.isIntersecting)) { reveal(); io.disconnect(); }
            }, { threshold: 0.35 });
            io.observe(dag);
        }
    }

    /* ── Follow one photo: steps switch the inspector ─────────────────── */

    function initTrace() {
        const trace = $('[data-trace]');
        if (!trace || !('IntersectionObserver' in window)) return;
        const steps = $$('[data-trace-step]', trace);
        const panels = $$('[data-trace-panel]', trace);
        const widths = $('[data-widths]', trace);
        const picked = $('[data-picked]', trace);

        // Which width did this browser actually load for the photo?
        const showPicked = () => {
            if (!widths) return;
            const imgs = $$(`[data-open-photo="${widths.dataset.photoId}"] img`).filter((i) => i.currentSrc);
            const w = imgs.map((i) => Number((i.currentSrc.match(/w_(\d+)/) || [])[1])).filter(Boolean).sort((a, b) => b - a)[0];
            if (!w) return;
            $$('li', widths).forEach((li) => li.classList.toggle('is-picked', Number(li.dataset.w) === w));
            picked.textContent = `Your browser loaded the ${w}px file for a ${Math.round(window.innerWidth)}px-wide window at ${window.devicePixelRatio}× pixel density.`;
        };

        const activate = (step) => {
            steps.forEach((s) => s.classList.toggle('is-active', s === step));
            panels.forEach((p) => p.classList.toggle('is-on', p.dataset.tracePanel === step.dataset.traceStep));
            if (step.dataset.traceStep === 'browser') showPicked();
        };
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) activate(e.target); });
        }, { rootMargin: '-45% 0px -45% 0px' });
        steps.forEach((s) => io.observe(s));
        activate(steps[0]);
    }

    /* ── A small tilt on the PaQueueKa phone ──────────────────────────── */

    function initTilt() {
        if (!finePointer.matches || reduceMotion.matches) return;
        $$('[data-tilt]').forEach((el) => {
            el.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
            });
            el.addEventListener('pointerleave', () => { el.style.transform = ''; });
        });
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
        const pad = (v) => String(v).padStart(2, '0');

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
            title.textContent = p.title;
            count.textContent = `${pad(index + 1)} / ${pad(photos.length)}`;
            meta.textContent = [p.taken, p.place, p.date].filter(Boolean).join(' · ');
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
            lenis?.stop();
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
            lenis?.start();
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

    /* ── Footer: the time in Manila, kept current ──────────────────────── */

    function initManila() {
        const el = $('[data-manila]');
        if (!el || !window.Intl) return;
        const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit' });
        const tick = () => { el.textContent = fmt.format(new Date()); };
        tick();
        setInterval(tick, 20000);
    }

    /* ── Footer sky: a slow parallax under the close ───────────────────── */

    function initParallax() {
        const img = $('[data-parallax]');
        if (!img || reduceMotion.matches) return;
        const host = img.closest('.footer');
        const update = () => {
            const r = host.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) return;
            const p = clamp(1 - r.top / window.innerHeight, 0, 2);
            img.style.transform = `translate3d(0, ${(-p * 6).toFixed(2)}%, 0)`;
        };
        window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
        update();
    }

    initLenis();
    initParallax();
    initManila();
    initRooms();
    initNav();
    initDeck();
    initDay();
    initTilt();
    initLineage();
    initTrace();
    initIndex();
    initViewer();
    initRide();
    initModes();
})();
