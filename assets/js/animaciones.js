document.addEventListener('DOMContentLoaded', function() {
    console.log('Portafolio cargado - Iniciando animaciones...');
    
    // 1. Inicializar partículas
    initParticles();
    
    // 2. Animar contadores
    animateCounters();
    
    // 3. Configurar botones de código
    setupCodeButtons();
    
    // 4. Configurar scroll to top
    setupScrollTop();
    
    // 5. Animar elementos al hacer scroll
    setupScrollAnimations();
    
    // 6. Configurar botón "Cargar más"
    setupLoadMore();
});

// 1. Sistema de partículas
function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Crear 30 partículas
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(59, 130, 246, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Animación
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        container.appendChild(particle);
    }
}

// 2. Animación de contadores
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar animación cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// 3. Botones de código
function setupCodeButtons() {
    // Botón Copiar
    const copyBtn = document.getElementById('copy-code');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const code = document.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                // Feedback visual
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                this.style.background = '#10b981';
                this.style.borderColor = '#10b981';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                    this.style.borderColor = '';
                }, 2000);
            });
        });
    }
    
    // Botón Ejecutar
    const runBtn = document.getElementById('run-code');
    if (runBtn) {
        runBtn.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ejecutando...';
            this.disabled = true;
            
            setTimeout(() => {
                // Mostrar notificación
                showNotification('API ejecutada correctamente. Revisa la consola.', 'success');
                console.log('PortfolioAPI: Obteniendo unidades...');
                console.log('PortfolioAPI: 4 unidades cargadas');
                
                // Restaurar botón
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 1500);
        });
    }
}

// 4. Botón Scroll to Top
function setupScrollTop() {
    const scrollBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 5. Animaciones al hacer scroll
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.unit-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 6. Botón "Cargar más"
function setupLoadMore() {
    const loadBtn = document.getElementById('load-more');
    if (loadBtn) {
        loadBtn.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            this.disabled = true;
            
            setTimeout(() => {
                // Crear nueva unidad
                const unitsGrid = document.querySelector('.units-grid');
                const newUnit = document.createElement('div');
                newUnit.className = 'unit-card';
                newUnit.style.opacity = '0';
                newUnit.style.transform = 'translateY(20px)';
                newUnit.innerHTML = `
                    <div class="unit-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3>Unidad Extra</h3>
                    <p>Contenido adicional sobre desarrollo de servicios web.</p>
                    <div class="progress">
                        <div class="progress-bar" style="width: 15%"></div>
                    </div>
                    <span class="progress-text">15% completado</span>
                `;
                
                unitsGrid.appendChild(newUnit);
                
                // Animar la nueva unidad
                setTimeout(() => {
                    newUnit.style.opacity = '1';
                    newUnit.style.transform = 'translateY(0)';
                }, 100);
                
                // Restaurar botón
                this.innerHTML = originalHTML;
                this.disabled = false;
                
                // Mostrar notificación
                showNotification('Nueva unidad cargada exitosamente', 'success');
            }, 1200);
        });
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.background = type === 'success' ? '#10b981' : '#3b82f6';
    notification.style.color = 'white';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.zIndex = '9999';
    notification.style.transform = 'translateX(150%)';
    notification.style.transition = 'transform 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Añadir keyframes para la animación de partículas
document.head.insertAdjacentHTML('beforeend', `
<style>
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
        }
        25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
        }
        50% {
            transform: translateY(0) translateX(-10px);
            opacity: 0.5;
        }
        75% {
            transform: translateY(20px) translateX(0);
            opacity: 0.8;
        }
    }
</style>
`);