// ==============================================
// LANDING PAGE JAVASCRIPT - VIDEO FIJO
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Landing Page cargada - Video fijo, contenido scroll');
    
    // Inicializar todos los efectos
    initVideoBackground();
    initTypewriterEffect();
    initStatsCounter();
    initScrollReveal();
    initButtonEffects();
    initParticles();
    initInteractiveElements();
    initSmoothScrolling();
    initPreloader();
    initScrollEffects();
});

// === 1. CONTROL DE VIDEO DE FONDO FIJO ===
function initVideoBackground() {
    const video = document.getElementById('landingVideo');
    
    if (!video) {
        console.log('⚠️ Video no encontrado, usando fondo alternativo');
        return;
    }
    
    // Intentar reproducir el video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('🎬 La reproducción automática no está permitida:', error);
            createPlayButton();
        });
    }
    
    // Control de volumen y mute
    video.volume = 0.3;
    video.muted = true; // Mute por defecto para mejor UX
    
    // Crear botón de mute
    createMuteToggle(video);
}

function createPlayButton() {
    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-btn';
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(99, 102, 241, 0.5);
        animation: pulse 2s infinite;
        transition: all 0.3s ease;
    `;
    
    playBtn.addEventListener('click', function() {
        const video = document.getElementById('landingVideo');
        if (video) {
            video.play();
            this.remove();
        }
    });
    
    document.body.appendChild(playBtn);
}

function createMuteToggle(video) {
    const muteBtn = document.createElement('button');
    muteBtn.className = 'mute-toggle-btn';
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    muteBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    muteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        this.innerHTML = video.muted 
            ? '<i class="fas fa-volume-mute"></i>' 
            : '<i class="fas fa-volume-up"></i>';
        this.style.background = video.muted 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(99, 102, 241, 0.3)';
    });
    
    document.body.appendChild(muteBtn);
}

// === 2. EFECTO MÁQUINA DE ESCRIBIR ===
function initTypewriterEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    
    if (!titleLines.length) return;
    
    // Ocultar texto inicialmente
    titleLines.forEach(line => {
        line.style.opacity = '0';
    });
    
    // Efecto secuencial
    setTimeout(() => {
        typeWriter(titleLines[0], 0, () => {
            setTimeout(() => {
                typeWriter(titleLines[1], 0, () => {
                    // Revelar resto del contenido después del título
                    revealContent();
                });
            }, 300);
        });
    }, 500);
}

function typeWriter(element, i, callback) {
    const originalText = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    function type() {
        if (i < originalText.length) {
            element.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, 50); // Velocidad de escritura
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

function revealContent() {
    const elements = [
        '.subtitle',
        '.glass-card',
        '.cta-container',
        '.stats-floating',
        '#featuresReveal',
        '.authors-section'
    ];
    
    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.classList.add('animate-fade-in-up');
                element.style.opacity = '1';
            }, index * 200);
        }
    });
}

// === 3. CONTADOR DE ESTADÍSTICAS ===
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (!statNumbers.length) return;
    
    // Observer para activar contadores cuando son visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function startCounter(element) {
    const finalValue = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = finalValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            current = finalValue;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, duration / steps);
}

// === 4. REVELAR ELEMENTOS AL SCROLL ===
function initScrollReveal() {
    const revealSection = document.getElementById('featuresReveal');
    
    if (!revealSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animar tarjetas individualmente
                const featureCards = entry.target.querySelectorAll('.feature-card');
                featureCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-fade-in-up');
                    }, index * 200);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(revealSection);
}

// === 5. EFECTOS PARA BOTONES ===
function initButtonEffects() {
    const ctaButton = document.getElementById('mainButton');
    
    if (!ctaButton) return;
    
    // Efecto hover con partículas
    ctaButton.addEventListener('mouseenter', function() {
        createButtonParticles(this, 6);
        animateButtonRipple(this);
    });
    
    // Efecto click
    ctaButton.addEventListener('click', function(e) {
        e.preventDefault();
        createClickEffect(e);
        
        // Pequeña animación antes de redireccionar
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            window.location.href = this.href;
        }, 300);
    });
    
    // Efecto de seguimiento con mouse
    document.addEventListener('mousemove', function(e) {
        const rect = ctaButton.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctaButton.style.setProperty('--mouse-x', `${x}px`);
        ctaButton.style.setProperty('--mouse-y', `${y}px`);
    });
}

function createButtonParticles(button, count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createParticle(button);
        }, i * 50);
    }
}

function createParticle(button) {
    const particle = document.createElement('span');
    const size = Math.random() * 10 + 5;
    const rect = button.getBoundingClientRect();
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        filter: blur(2px);
    `;
    
    particle.style.left = `${Math.random() * rect.width}px`;
    particle.style.top = `${Math.random() * rect.height}px`;
    
    button.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 50 + 30;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let opacity = 1;
    
    function animate() {
        x += vx * 0.1;
        y += vy * 0.1;
        opacity -= 0.03;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    animate();
}

function animateButtonRipple(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: buttonRipple 0.6s linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${rect.width/2 - size/2}px;
        top: ${rect.height/2 - size/2}px;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createClickEffect(event) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
    `;
    
    effect.style.left = `${event.clientX}px`;
    effect.style.top = `${event.clientY}px`;
    
    document.body.appendChild(effect);
    
    // Animación
    effect.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    });
    
    setTimeout(() => effect.remove(), 600);
}

// === 6. SISTEMA DE PARTÍCULAS ===
function initParticles() {
    if (typeof particlesJS === 'undefined') {
        console.log('⚠️ Particles.js no cargado');
        return;
    }
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ["#6366f1", "#8b5cf6", "#ec4899"]
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#6366f1",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// === 7. ELEMENTOS INTERACTIVOS ===
function initInteractiveElements() {
    // Tarjetas interactivas
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            // Efecto de elevación
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            this.style.zIndex = '1';
        });
        
        // Efecto click
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Badges interactivos
    const techBadges = document.querySelectorAll('.tech-badge');
    
    techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Autores interactivos
    const authorCards = document.querySelectorAll('.author-card');
    
    authorCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.author-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.1)';
                avatar.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.author-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1)';
            }
        });
    });
}

// === 8. SCROLL SUAVE Y EFECTOS ===
function initSmoothScrolling() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mostrar/ocultar botón de scroll to top
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 5px 20px rgba(99, 102, 241, 0.5);
    `;
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(20px)';
        }
    });
}

// === 9. PRELOADER ===
function initPreloader() {
    // Simular tiempo de carga
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Remover preloader después de animación
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
    }, 1000);
    
    // Crear preloader si no existe
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-logo">
                    <i class="fas fa-code"></i>
                </div>
                <div class="preloader-text">Cargando experiencia...</div>
                <div class="preloader-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        `;
        
        // Estilos inline para el preloader
        const style = document.createElement('style');
        style.textContent = `
            .preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0f0f23;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .preloader.fade-out {
                opacity: 0;
            }
            
            .preloader-content {
                text-align: center;
            }
            
            .preloader-logo {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 2rem;
                font-size: 2.5rem;
                color: white;
                animation: pulse 2s infinite;
            }
            
            .preloader-text {
                color: white;
                font-size: 1.2rem;
                margin-bottom: 1.5rem;
                font-family: 'Poppins', sans-serif;
            }
            
            .preloader-progress {
                width: 200px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-bar {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #6366f1, #ec4899);
                border-radius: 2px;
                animation: loadProgress 1s ease-in-out forwards;
            }
            
            @keyframes loadProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            
            body.loaded .preloader {
                opacity: 0;
                pointer-events: none;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(preloader);
    }
}

// === 10. EFECTOS DE SCROLL ESPECIALES ===
function initScrollEffects() {
    // Efecto de parallax ligero para el contenido
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // Efecto de opacidad en elementos según scroll
        const elements = document.querySelectorAll('.scrollable-content > *');
        
        elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.clientHeight;
            const windowHeight = window.innerHeight;
            
            // Calcular opacidad basada en posición
            const distanceFromTop = elementTop - scrolled;
            const opacity = 1 - Math.abs(distanceFromTop) / (windowHeight * 0.5);
            
            // Aplicar efecto solo a ciertos elementos
            if (element.classList.contains('glass-card') || 
                element.classList.contains('stats-floating') ||
                element.classList.contains('feature-card')) {
                element.style.opacity = Math.max(0.3, Math.min(1, opacity));
            }
        });
        
        // Efecto de escala en el logo
        const logo = document.querySelector('.floating-logo');
        if (logo && scrolled > 100) {
            const scale = Math.max(0.5, 1 - scrolled / 1000);
            logo.style.transform = `scale(${scale})`;
            logo.style.opacity = Math.max(0.3, 1 - scrolled / 500);
        }
    });
}

// === INICIALIZACIÓN DE ESTILOS DINÁMICOS ===
function initDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animación para botón ripple */
        @keyframes buttonRipple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Variables CSS dinámicas */
        :root {
            --mouse-x: 50%;
            --mouse-y: 50%;
        }
        
        /* Efecto de seguimiento para botón CTA */
        .cta-button:hover .button-glow {
            background: radial-gradient(
                circle at var(--mouse-x) var(--mouse-y),
                rgba(99, 102, 241, 0.4) 0%,
                transparent 70%
            );
        }
        
        /* Efecto de partículas en hover de tarjetas */
        .feature-card:hover .feature-glow {
            opacity: 1;
            animation: glowPulse 2s infinite;
        }
        
        @keyframes glowPulse {
            0%, 100% {
                opacity: 0.5;
            }
            50% {
                opacity: 0.8;
            }
        }
        
        /* Estilos para el botón de scroll to top */
        .scroll-top-btn:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.6);
        }
    `;
    
    document.head.appendChild(style);
}

// Inicializar estilos dinámicos
initDynamicStyles();

