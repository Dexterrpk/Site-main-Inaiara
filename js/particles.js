// Configuração e inicialização das partículas místicas
class MysticalParticles {
    constructor(options = {}) {
        // Configurações padrão
        this.options = {
            selector: '.mystical-bg',
            particleCount: 50,
            colors: ['#DAA520', '#B8860B', '#FFD700', '#FFFFFF'],
            minSize: 2,
            maxSize: 6,
            minOpacity: 0.2,
            maxOpacity: 0.7,
            minSpeed: 0.5,
            maxSpeed: 0.8,
            connectParticles: true,
            connectDistance: 150,
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        particleCount: 30,
                        connectDistance: 100
                    }
                },
                {
                    breakpoint: 480,
                    options: {
                        particleCount: 20,
                        connectDistance: 80
                    }
                }
            ],
            ...options
        };

        // Elementos e variáveis
        this.container = document.querySelector(this.options.selector);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.animationFrame = null;
        this.resizeTimeout = null;

        // Inicializar
        this.init();
    }

    // Inicialização
    init() {
        // Configurar canvas
        this.setupCanvas();
        
        // Criar partículas
        this.createParticles();
        
        // Iniciar animação
        this.animate();
        
        // Adicionar eventos
        this.addEventListeners();
    }

    // Configurar canvas
    setupCanvas() {
        this.canvas.className = 'particles-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        this.container.appendChild(this.canvas);
        
        // Definir tamanho do canvas
        this.resizeCanvas();
    }

    // Redimensionar canvas
    resizeCanvas() {
        const containerRect = this.container.getBoundingClientRect();
        this.width = containerRect.width;
        this.height = containerRect.height;
        
        // Ajustar para densidade de pixels
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Aplicar configurações responsivas
        this.applyResponsiveSettings();
    }

    // Aplicar configurações responsivas
    applyResponsiveSettings() {
        let currentOptions = { ...this.options };
        
        // Verificar breakpoints e aplicar configurações
        for (const responsive of this.options.responsive) {
            if (window.innerWidth <= responsive.breakpoint) {
                currentOptions = { ...currentOptions, ...responsive.options };
            }
        }
        
        // Atualizar partículas se necessário
        if (this.particles.length !== currentOptions.particleCount) {
            this.particles = [];
            this.createParticles(currentOptions);
        }
    }

    // Criar partículas
    createParticles(options = this.options) {
        for (let i = 0; i < options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (options.maxSize - options.minSize) + options.minSize,
                color: options.colors[Math.floor(Math.random() * options.colors.length)],
                opacity: Math.random() * (options.maxOpacity - options.minOpacity) + options.minOpacity,
                speed: Math.random() * (options.maxSpeed - options.minSpeed) + options.minSpeed,
                directionX: Math.random() * 2 - 1,
                directionY: Math.random() * 2 - 1,
                pulse: Math.random() * 0.1 + 0.05,
                pulseDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    }

    // Desenhar partículas
    drawParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Desenhar conexões entre partículas
        if (this.options.connectParticles) {
            this.drawConnections();
        }
        
        // Desenhar cada partícula
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.closePath();
            
            // Gradiente para efeito de brilho
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, `${particle.color}`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
    }

    // Desenhar conexões entre partículas
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectDistance) {
                    const opacity = 1 - (distance / this.options.connectDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(218, 165, 32, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    // Atualizar posição das partículas
    updateParticles() {
        this.particles.forEach(particle => {
            // Mover partícula
            particle.x += particle.directionX * particle.speed;
            particle.y += particle.directionY * particle.speed;
            
            // Efeito de pulsar (tamanho e opacidade)
            particle.size += particle.pulse * particle.pulseDirection;
            if (particle.size > this.options.maxSize || particle.size < this.options.minSize) {
                particle.pulseDirection *= -1;
            }
            
            // Verificar limites da tela
            if (particle.x < 0 || particle.x > this.width) {
                particle.directionX *= -1;
            }
            
            if (particle.y < 0 || particle.y > this.height) {
                particle.directionY *= -1;
            }
        });
    }

    // Animar partículas
    animate() {
        this.updateParticles();
        this.drawParticles();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    // Adicionar event listeners
    addEventListeners() {
        // Redimensionar canvas quando a janela for redimensionada
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
            }, 250);
        });
        
        // Interação com o mouse (opcional)
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Fazer partículas reagirem ao movimento do mouse
            this.particles.forEach(particle => {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    particle.directionX = -Math.cos(angle) * 0.5;
                    particle.directionY = -Math.sin(angle) * 0.5;
                }
            });
        });
    }

    // Destruir instância
    destroy() {
        cancelAnimationFrame(this.animationFrame);
        this.canvas.remove();
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Inicializar partículas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Criar instância de partículas
    const particles = new MysticalParticles({
        selector: '.mystical-bg',
        particleCount: 50,
        colors: ['#DAA520', '#B8860B', '#FFD700', '#FFFFFF'],
        connectParticles: true
    });
});
