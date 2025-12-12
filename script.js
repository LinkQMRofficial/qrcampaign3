// ============================================
// ANALYTICS & TRACKING SYSTEM
// ============================================

class AnalyticsTracker {
    constructor() {
        this.storageKey = 'jctt_campaign_analytics';
        this.sessionKey = 'jctt_session_id';
        this.init();
    }

    init() {
        // Generate or retrieve session ID
        if (!sessionStorage.getItem(this.sessionKey)) {
            sessionStorage.setItem(this.sessionKey, this.generateSessionId());
        }

        // Load existing analytics or create new
        this.data = this.loadAnalytics();
        
        // Track page visit
        this.trackVisit();
        
        // Display welcome message
        this.displayWelcome();
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    loadAnalytics() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading analytics:', e);
            }
        }
        
        return {
            totalVisits: 0,
            firstVisit: new Date().toISOString(),
            lastVisit: null,
            platforms: {
                facebook: 0,
                instagram: 0,
                tiktok: 0,
                twitter: 0
            },
            sessions: [],
            clicks: []
        };
    }

    saveAnalytics() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving analytics:', e);
        }
    }

    trackVisit() {
        this.data.totalVisits++;
        this.data.lastVisit = new Date().toISOString();
        
        const sessionId = sessionStorage.getItem(this.sessionKey);
        this.data.sessions.push({
            id: sessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        });
        
        this.saveAnalytics();
    }

    trackClick(platform) {
        if (this.data.platforms.hasOwnProperty(platform)) {
            this.data.platforms[platform]++;
            
            this.data.clicks.push({
                platform: platform,
                timestamp: new Date().toISOString(),
                sessionId: sessionStorage.getItem(this.sessionKey)
            });
            
            this.saveAnalytics();
            
            console.log(`%c✓ Click registrado: ${platform.toUpperCase()}`, 
                'color: #10a8e0; font-weight: bold; font-size: 14px;');
        }
    }

    getStats() {
        const totalClicks = Object.values(this.data.platforms).reduce((a, b) => a + b, 0);
        
        return {
            totalVisits: this.data.totalVisits,
            totalClicks: totalClicks,
            platformBreakdown: this.data.platforms,
            firstVisit: this.data.firstVisit,
            lastVisit: this.data.lastVisit,
            totalSessions: this.data.sessions.length,
            recentClicks: this.data.clicks.slice(-10)
        };
    }

    displayWelcome() {
        const styles = {
            header: 'color: #f79c1c; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);',
            info: 'color: #10a8e0; font-size: 14px;',
            command: 'background: #f79c1c; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
        };

        console.log('%c🗳️ Julio César Torrez Tapia - El Pelón', styles.header);
        console.log('%cCampaña Digital Oficial | Gobernador Santa Cruz', styles.info);
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #10a8e0;');
        console.log('%c✓ Sistema de Analytics Activado', styles.info);
        console.log('%cPara ver estadísticas detalladas, ejecuta: %cverEstadisticas()', 
            styles.info, styles.command);
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #10a8e0;');
    }
}

// Global function to view statistics
window.verEstadisticas = function() {
    if (!window.tracker) {
        console.error('Sistema de analytics no inicializado');
        return;
    }

    const stats = window.tracker.getStats();
    
    console.clear();
    console.log('%c📊 ESTADÍSTICAS DE CAMPAÑA', 
        'color: #f79c1c; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #10a8e0;');
    
    console.group('%c📈 Métricas Generales', 'color: #10a8e0; font-weight: bold;');
    console.log(`Total de Visitas: ${stats.totalVisits}`);
    console.log(`Total de Clicks: ${stats.totalClicks}`);
    console.log(`Sesiones Registradas: ${stats.totalSessions}`);
    console.log(`Primera Visita: ${new Date(stats.firstVisit).toLocaleString('es-BO')}`);
    console.log(`Última Visita: ${new Date(stats.lastVisit).toLocaleString('es-BO')}`);
    console.groupEnd();
    
    console.group('%c🌐 Clicks por Plataforma', 'color: #10a8e0; font-weight: bold;');
    Object.entries(stats.platformBreakdown).forEach(([platform, clicks]) => {
        const percentage = stats.totalClicks > 0 ? 
            ((clicks / stats.totalClicks) * 100).toFixed(1) : 0;
        const icon = {
            facebook: '📘',
            instagram: '📸',
            tiktok: '🎵',
            twitter: '🐦'
        }[platform] || '📱';
        
        console.log(`${icon} ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${clicks} clicks (${percentage}%)`);
    });
    console.groupEnd();
    
    if (stats.recentClicks.length > 0) {
        console.group('%c⏱️ Clicks Recientes', 'color: #10a8e0; font-weight: bold;');
        console.table(stats.recentClicks.map(click => ({
            Plataforma: click.platform,
            Fecha: new Date(click.timestamp).toLocaleString('es-BO'),
            Sesión: click.sessionId.slice(-8)
        })));
        console.groupEnd();
    }
    
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #10a8e0;');
    console.log('%c💡 Tip: Los datos se guardan localmente en tu navegador', 
        'color: #666; font-style: italic;');
};

// ============================================
// PARTICLE EFFECTS SYSTEM
// ============================================

class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.particle-container');
        this.colors = ['#f79c1c', '#10a8e0', '#ffffff'];
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const size = Math.random() * 8 + 4;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 ${size * 2}px ${color};
        `;
        
        this.container.appendChild(particle);
        
        this.animateParticle(particle, vx, vy);
    }

    animateParticle(particle, vx, vy) {
        let opacity = 1;
        let x = parseFloat(particle.style.left);
        let y = parseFloat(particle.style.top);
        const gravity = 200; // pixels per second squared
        let startTime = null;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = (currentTime - startTime) / 1000; // Convert to seconds

            if (elapsed > 1) {
                particle.remove();
                return;
            }

            x += vx * 0.016; // Approximate frame time
            y += vy * 0.016 + 0.5 * gravity * 0.016 * 0.016;
            vy += gravity * 0.016;
            opacity = 1 - elapsed;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.opacity = opacity;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    burst(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createParticle(x, y);
            }, i * 20);
        }
    }
}

// ============================================
// RIPPLE EFFECT SYSTEM
// ============================================

function createRipple(event, element) {
    const ripple = element.querySelector('.ripple-effect');
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    
    ripple.classList.remove('active');
    void ripple.offsetWidth; // Trigger reflow
    ripple.classList.add('active');
}

// ============================================
// LOGO INTERACTIONS
// ============================================

function initLogoInteractions() {
    const logoContainer = document.querySelector('.logo-container');
    let clickCount = 0;
    let clickTimer = null;

    logoContainer.addEventListener('click', () => {
        clickCount++;
        
        if (clickTimer) clearTimeout(clickTimer);
        
        clickTimer = setTimeout(() => {
            if (clickCount >= 5) {
                activateEasterEgg();
            }
            clickCount = 0;
        }, 2000);
    });

    // Keyboard interaction
    logoContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logoContainer.click();
        }
    });
}

function activateEasterEgg() {
    console.log('%c🎉 ¡EASTER EGG ACTIVADO!', 
        'color: #f79c1c; font-size: 24px; font-weight: bold; animation: rainbow 2s linear infinite;');
    console.log('%c¡Gracias por tu interés en nuestra campaña!', 
        'color: #10a8e0; font-size: 16px;');
    
    const hexagon = document.querySelector('.hexagon');
    hexagon.style.animation = 'hexagon-pulse 0.5s ease-in-out 3';
    
    if (window.particleSystem) {
        const rect = hexagon.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        window.particleSystem.burst(centerX, centerY, 30);
    }
}

// ============================================
// SOCIAL MEDIA CARD INTERACTIONS
// ============================================

function initSocialCards() {
    const socialCards = document.querySelectorAll('.social-card');

    socialCards.forEach(card => {
        // Click handler
        card.addEventListener('click', function(e) {
            const platform = this.getAttribute('data-platform');
            
            // Track click
            if (window.tracker) {
                window.tracker.trackClick(platform);
            }
            
            // Visual feedback
            createRipple(e, this);
            
            // Particle effect
            if (window.particleSystem) {
                window.particleSystem.burst(e.clientX, e.clientY, 15);
            }
            
            // Vibration feedback (if supported)
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });

        // Keyboard interaction
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });

        // Mouse move effect for glow
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const glow = this.querySelector('.card-glow');
            glow.style.left = `${x - glow.offsetWidth / 2}px`;
            glow.style.top = `${y - glow.offsetHeight / 2}px`;
        });
    });
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

function initPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;
                
                console.group('%c⚡ Performance Metrics', 'color: #10a8e0; font-weight: bold;');
                console.log(`Tiempo de carga total: ${pageLoadTime}ms`);
                console.log(`Tiempo de conexión: ${connectTime}ms`);
                console.log(`Tiempo de renderizado: ${renderTime}ms`);
                console.groupEnd();
            }, 0);
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// LAZY LOADING IMAGES (if any added later)
// ============================================

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// VISIBILITY CHANGE TRACKING
// ============================================

function initVisibilityTracking() {
    let visibilityStartTime = Date.now();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const timeSpent = Math.floor((Date.now() - visibilityStartTime) / 1000);
            console.log(`%cTiempo en página: ${timeSpent} segundos`, 
                'color: #10a8e0; font-weight: bold;');
        } else {
            visibilityStartTime = Date.now();
        }
    });
}

// ============================================
// CUSTOM CURSOR (Optional - Desktop Only)
// ============================================

function initCustomCursor() {
    if (window.innerWidth > 1024) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #f79c1c;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.15s ease, opacity 0.15s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.15;
            cursorY += dy * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor interactions
        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = '#10a8e0';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#f79c1c';
            });
        });
    }
}

// ============================================
// PARALLAX EFFECT (Subtle)
// ============================================

function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============================================
// NETWORK STATUS INDICATOR
// ============================================

function initNetworkStatus() {
    window.addEventListener('online', () => {
        console.log('%c✓ Conexión restaurada', 
            'color: #4caf50; font-weight: bold;');
    });

    window.addEventListener('offline', () => {
        console.log('%c✗ Sin conexión a internet', 
            'color: #f44336; font-weight: bold;');
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    window.tracker = new AnalyticsTracker();
    window.particleSystem = new ParticleSystem();
    
    initLogoInteractions();
    initSocialCards();
    initPerformanceMonitoring();
    initSmoothScroll();
    initLazyLoading();
    initVisibilityTracking();
    initCustomCursor();
    initParallax();
    initNetworkStatus();
    
    // Log initialization complete
    console.log('%c✓ Sistema completamente inicializado', 
        'color: #4caf50; font-weight: bold; font-size: 14px;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #10a8e0;');
});

// ============================================
// SERVICE WORKER REGISTRATION (Optional)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registrado', reg))
        //     .catch(err => console.log('Error en Service Worker', err));
    });
}

// ============================================
// EXPORT FOR TESTING
// ============================================

window.campaignApp = {
    tracker: window.tracker,
    particleSystem: window.particleSystem,
    verEstadisticas: window.verEstadisticas
};
