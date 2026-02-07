document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .stagger-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Handle staggered children if it's a stagger-reveal container
                if (entry.target.classList.contains('stagger-reveal')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 1.5 Navbar Scroll Animation
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // 2. Carousel with Parallax & Smooth Transitions
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    let currentSlideIndex = 0;

    if (slides.length > 1) {
        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

            // Add scale effect to current image
            slides.forEach((slide, idx) => {
                const img = slide.querySelector('img');
                const text = slide.querySelector('.hero-text');
                if (idx === currentSlideIndex) {
                    img.style.transform = 'scale(1.1)';
                    text.style.opacity = '1';
                    text.style.transform = 'translateY(0)';
                } else {
                    img.style.transform = 'scale(1)';
                    text.style.opacity = '0';
                    text.style.transform = 'translateY(20px)';
                }
            });
        };

        // Initialize first slide
        updateCarousel();

        nextBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        // Auto-play
        setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateCarousel();
        }, 8000);
    } else {
        if (nextBtn) nextBtn.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        if (slides.length === 1) {
            slides[0].querySelector('.hero-text').style.opacity = '1';
            slides[0].querySelector('.hero-text').style.transform = 'translateY(0)';
        }
    }

    // 3. Lightbox Interaction
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const { title, description } = item.dataset;

            lightboxImg.style.opacity = '0';
            lightboxImg.style.transform = 'scale(0.95)';

            lightboxImg.src = img.src;
            lightboxCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;

            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Animate in
            setTimeout(() => {
                lightboxImg.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            }, 50);
        });
    });

    const closeLightbox = () => {
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    };

    // 4. Dynamic Tab Title
    const baseTitle = 'albertantioquia |';
    const sections = document.querySelectorAll('section[id]');

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                let subTitle = '';

                if (id === 'about') subTitle = ' About Me';
                else if (id === 'gallery') subTitle = ' Photography';
                else if (id === 'hero') subTitle = ''; // Just base title for home

                document.title = `${baseTitle}${subTitle}`;
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => titleObserver.observe(section));

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
});
