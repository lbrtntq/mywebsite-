document.addEventListener('DOMContentLoaded', () => {

    // ── Blur-up image loader ────────────────────────────────────────────────
    const loadFull = (img) => {
        if (!img.dataset.src || img.dataset.src === img.src) return;
        const full = new Image();
        full.onload = () => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        };
        full.src = img.dataset.src;
    };

    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                loadFull(e.target);
                lazyObserver.unobserve(e.target);
            }
        });
    }, { rootMargin: '400px' });

    document.querySelectorAll('img.blur-up[data-src]').forEach(img => {
        if (img.classList.contains('eager')) loadFull(img);
        else lazyObserver.observe(img);
    });

    // ── Scroll reveal ───────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stagger-reveal')) {
                    Array.from(entry.target.children).forEach((child, i) => {
                        child.style.transitionDelay = `${i * 0.08}s`;
                    });
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .stagger-reveal').forEach(el => revealObserver.observe(el));

    // ── Dynamic tab title ───────────────────────────────────────────────────
    const baseTitle = 'albertantioquia |';
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const sub = id === 'about' ? ' About'
                          : id === 'gallery' ? ' Photography'
                          : '';
                document.title = `${baseTitle}${sub}`;
            }
        });
    }, { threshold: 0.35 });

    document.querySelectorAll('section[id]').forEach(s => titleObserver.observe(s));

    // ── Lightbox ────────────────────────────────────────────────────────────
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption     = document.getElementById('lightbox-caption');
    const closeBtn    = document.querySelector('.close-btn');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const { title, description, fullsrc } = item.dataset;
            const img = item.querySelector('img');
            const src = fullsrc || img.dataset.src || img.src;

            lightboxImg.style.cssText = 'opacity:0; transform:scale(0.96)';
            lightboxImg.src = src;
            caption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;

            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(() => requestAnimationFrame(() => {
                lightboxImg.style.cssText =
                    'opacity:1; transform:scale(1); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
            }));
        });
    });

    const closeLightbox = () => {
        lightboxImg.style.cssText =
            'opacity:0; transform:scale(0.96); transition: opacity 0.4s ease, transform 0.4s ease';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 380);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // Close lightbox with Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') closeLightbox();
    });
});
