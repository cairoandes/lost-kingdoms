/* ============================================
   LOST KINGDOMS - Main JavaScript
   Premium Interactivity & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    window.addEventListener('load', () => setTimeout(hidePreloader, 2500));
    setTimeout(hidePreloader, 3500);

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (window.innerWidth > 768 && cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX - 3 + 'px';
            cursorDot.style.top = e.clientY - 3 + 'px';
            cursorRing.style.left = e.clientX - 18 + 'px';
            cursorRing.style.top = e.clientY - 18 + 'px';
        });

        const hoverTargets = document.querySelectorAll('a, button, .ticket-card, .lineup-card, .exp-card, .faq-question');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // ==========================================
    // PARTICLES CANVAS
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];
    let particleAnimId;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }
        draw() {
            const fade = this.life / this.maxLife;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(201,168,76,${this.opacity * fade})`;
            ctx.fill();
        }
    }

    function initParticles() {
        if (!canvas || !ctx) return;
        const count = Math.min(80, Math.floor(window.innerWidth / 20));
        particles = Array.from({ length: count }, () => new Particle());
    }

    function animateParticles() {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        particleAnimId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ==========================================
    // NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
        navbar && navbar.classList.toggle('scrolled', window.scrollY > 100);
    });

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // COUNTDOWN TIMER
    // ==========================================
    const eventDate = new Date('December 12, 2027 22:00:00').getTime();

    function updateCountdown() {
        const distance = eventDate - Date.now();
        if (distance < 0) return;
        const d = Math.floor(distance / 86400000);
        const h = Math.floor((distance % 86400000) / 3600000);
        const m = Math.floor((distance % 3600000) / 60000);
        const s = Math.floor((distance % 60000) / 1000);

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('days', String(d).padStart(3, '0'));
        set('hours', String(h).padStart(2, '0'));
        set('minutes', String(m).padStart(2, '0'));
        set('seconds', String(s).padStart(2, '0'));

        document.querySelectorAll('.cta-days').forEach(el => el.textContent = String(d).padStart(3, '0'));
        document.querySelectorAll('.cta-hours').forEach(el => el.textContent = String(h).padStart(2, '0'));
        document.querySelectorAll('.cta-minutes').forEach(el => el.textContent = String(m).padStart(2, '0'));
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================
    // TICKET PROGRESS BARS
    // ==========================================
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                setTimeout(() => { bar.style.width = bar.getAttribute('data-progress') + '%'; }, 300);
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.progress-fill').forEach(bar => progressObserver.observe(bar));

    // ==========================================
    // STAT COUNTER ANIMATION
    // ==========================================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) { current = target; clearInterval(timer); }
                    counter.textContent = Math.floor(current).toLocaleString();
                }, 16);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(c => counterObserver.observe(c));

    // ==========================================
    // LINEUP TABS
    // ==========================================
    const lineupTabs = document.querySelectorAll('.lineup-tab');
    const lineupCards = document.querySelectorAll('.lineup-card');

    lineupTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            lineupTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const stage = tab.getAttribute('data-stage');

            lineupCards.forEach(card => {
                if (stage === 'all' || card.getAttribute('data-stage') === stage) {
                    card.style.display = 'block';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ==========================================
    // TRAILER MODAL
    // ==========================================
    const trailerBtn = document.getElementById('watchTrailer');
    const modal = document.getElementById('trailerModal');
    const modalClose = document.getElementById('modalClose');

    if (trailerBtn && modal) {
        trailerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    function closeModal() {
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // ==========================================
    // STICKY BUY BUTTON
    // ==========================================
    const stickyBuy = document.getElementById('stickyBuy');
    window.addEventListener('scroll', () => {
        if (stickyBuy) stickyBuy.classList.toggle('visible', window.scrollY > 600);
    });

    // ==========================================
    // TICKET CARD HOVER EFFECTS
    // ==========================================
    document.querySelectorAll('.ticket-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(201,168,76,0.06) 0%, transparent 50%), var(--dark-card)`;
        });
        card.addEventListener('mouseleave', () => { card.style.background = 'var(--dark-card)'; });
    });

    // ==========================================
    // HERO SAND PARTICLES
    // ==========================================
    const heroContainer = document.getElementById('heroParticles');
    if (heroContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            const dir = Math.random() > 0.5 ? '' : '-';
            p.style.cssText = `position:absolute;width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;background:rgba(201,168,76,${Math.random()*0.3+0.1});border-radius:50%;top:${Math.random()*100}%;left:${Math.random()*100}%;animation:hf${i} ${Math.random()*10+10}s linear infinite;animation-delay:-${Math.random()*10}s;`;
            heroContainer.appendChild(p);
            const s = document.createElement('style');
            s.textContent = `@keyframes hf${i}{0%{transform:translate(0,0) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translate(${dir}${Math.random()*200+100}px,-${Math.random()*300+100}px) rotate(360deg);opacity:0}}`;
            document.head.appendChild(s);
        }
    }

    // ==========================================
    // GSAP HERO ANIMATION ONLY (no ScrollTrigger)
    // ==========================================
    function initHeroAnimation() {
        if (typeof gsap === 'undefined') return;

        const tl = gsap.timeline({ delay: 0.3 });
        tl.from('.hero-badge', { y: -30, opacity: 0, duration: 0.8, ease: 'power2.out' })
          .from('.title-line-1', { y: 80, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
          .from('.title-line-2', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
          .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
          .from('.hero-tagline', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
          .from('.hero-date', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
          .from('.countdown', { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
          .from('.hero-buttons', { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
    }

    // ==========================================
    // SCROLL REVEAL - SIMPLE & RELIABLE
    // ==========================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.delay || 0);
                    setTimeout(() => el.classList.add('revealed'), delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // KEYBOARD
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ==========================================
    // PERFORMANCE
    // ==========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(particleAnimId);
        else animateParticles();
    });

    // ==========================================
    // INIT
    // ==========================================
    window.addEventListener('load', () => {
        setTimeout(initHeroAnimation, 300);
    });
    initScrollReveal();
});
