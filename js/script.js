// Efeitos visuais e interatividade
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const sections = document.querySelectorAll('.section');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const newTestimonialsContainer = document.getElementById('newTestimonials');
    
    // Variáveis para controle do carrossel
    let currentSlide = 0;
    let slideWidth = 0;
    let slideInterval;
    let maxSlides = 0;
    
    // Inicialização
    initAnimations();
    initNavbar();
    initScrollEvents();
    initTestimonialSlider();
    addTestimonialControls();
    createStars();
    initParallaxEffect();
    
    // Função para inicializar animações de entrada
    function initAnimations() {
        // Animação de fade-in para elementos principais
        const fadeElements = document.querySelectorAll('.title, .subtitle, .description, .service-card, .button-container, .social-media');
        fadeElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.animation = `fadeIn 0.8s ease-out ${0.2 + index * 0.15}s forwards`;
        });
        
        // Animação para seções
        sections.forEach(section => {
            const elements = section.querySelectorAll('.section-title, .section-subtitle, .service-detailed, .about-container, .testimonial-card, .contact-item, .contact-cta, .testimonial-form-container');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = `opacity 0.8s ease-out ${index * 0.15}s, transform 0.8s ease-out ${index * 0.15}s`;
                observer.observe(element);
            });
        });
    }
    
    // Função para inicializar a barra de navegação
    function initNavbar() {
        // Toggle menu mobile
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Destacar link ativo ao rolar - CORRIGIDO
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            // Se não há seção atual detectada, manter a primeira como ativa
            if (!current && window.pageYOffset < 100) {
                current = 'home';
            }
            
            // Correção especial para contato - detectar quando está próximo da seção contato
            const contatoSection = document.getElementById('contato');
            if (contatoSection) {
                const contatoTop = contatoSection.offsetTop - 200;
                if (window.pageYOffset >= contatoTop) {
                    current = 'contato';
                }
            }
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href').substring(1); // Remove o #
                if (linkHref === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // Função para inicializar eventos de rolagem
    function initScrollEvents() {
        // Navbar fixa com efeito ao rolar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                scrollTopBtn.classList.add('visible');
            } else {
                navbar.classList.remove('scrolled');
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Rolagem suave para links de âncora - MELHORADO
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Force update active nav link
                    setTimeout(() => {
                        navLinks.forEach(link => link.classList.remove('active'));
                        this.classList.add('active');
                    }, 100);
                }
            });
        });
        
        // Botão de voltar ao topo
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Função para inicializar o slider de depoimentos
    function initTestimonialSlider() {
        const testimonialContainer = document.querySelector('.testimonials-container');
        
        if (!testimonialContainer || testimonialCards.length === 0) return;
        
        // Configuração inicial
        function setupSlider() {
            // Determinar largura do slide com base no tamanho da tela
            const containerWidth = testimonialContainer.offsetWidth;
            let visibleSlides;
            
            if (window.innerWidth >= 1200) {
                visibleSlides = 3;
                slideWidth = containerWidth / 3;
            } else if (window.innerWidth >= 768) {
                visibleSlides = 2;
                slideWidth = containerWidth / 2;
            } else {
                visibleSlides = 1;
                slideWidth = containerWidth;
            }
            
            // Calcular número máximo de slides
            maxSlides = Math.max(0, testimonialCards.length - visibleSlides);
            
            // Aplicar largura aos cards
            testimonialCards.forEach(card => {
                card.style.flex = `0 0 ${slideWidth}px`;
            });
            
            // Ajustar currentSlide se necessário
            if (currentSlide > maxSlides) {
                currentSlide = maxSlides;
            }
            
            // Mover para o slide atual
            moveToSlide(currentSlide);
        }
        
        // Função para mover para um slide específico
        function moveToSlide(slideIndex) {
            currentSlide = Math.max(0, Math.min(slideIndex, maxSlides));
            
            // Mover o container
            const translateX = -currentSlide * slideWidth;
            testimonialContainer.style.transform = `translateX(${translateX}px)`;
            
            // Atualizar indicadores se existirem
            updateSlideIndicators();
        }
        
        // Função para atualizar indicadores visuais
        function updateSlideIndicators() {
            const dots = document.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Função pública para controlar slides
        window.nextTestimonialSlide = function() {
            if (currentSlide < maxSlides) {
                moveToSlide(currentSlide + 1);
            } else {
                moveToSlide(0); // Volta para o primeiro
            }
            resetInterval();
        };
        
        window.prevTestimonialSlide = function() {
            if (currentSlide > 0) {
                moveToSlide(currentSlide - 1);
            } else {
                moveToSlide(maxSlides); // Vai para o último
            }
            resetInterval();
        };
        
        // Auto-play DESABILITADO - slides passam apenas com clique
        function startInterval() {
            // Função vazia - auto-play desabilitado
            // Para reativar, descomente as linhas abaixo:
            *
            if (maxSlides > 0) {
                slideInterval = setInterval(() => {
                    window.nextTestimonialSlide();
                }, 5000);
            }
            
        }
        
        function resetInterval() {
            // Função vazia - auto-play desabilitado
            // clearInterval(slideInterval);
            // startInterval();
        }
        
        // Inicializar slider
        setupSlider();
        // startInterval(); // DESABILITADO - auto-play removido
        
        // Recalcular em caso de redimensionamento
        window.addEventListener('resize', () => {
            setupSlider();
        });
        
        // Event listeners para pause/resume removidos (auto-play desabilitado)
        /*
        // Pausar auto-play quando mouse estiver sobre os depoimentos
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialContainer.addEventListener('mouseleave', () => {
            startInterval();
        });
        */
    }
    
    // Função para adicionar controles de depoimentos
    function addTestimonialControls() {
        const testimonialsSection = document.getElementById('testimonials');
        if (!testimonialsSection) return;
        
        // Criar container para os controles
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'testimonial-controls';
        controlsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-top: 40px;
            margin-bottom: 20px;
        `;
        
        // Botão anterior
        const prevButton = document.createElement('button');
        prevButton.className = 'testimonial-nav-btn prev-btn';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.style.cssText = `
            background: linear-gradient(135deg, #d4af37, #f4e4bc);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            color: #1a1a1a;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Botão próximo
        const nextButton = document.createElement('button');
        nextButton.className = 'testimonial-nav-btn next-btn';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.style.cssText = prevButton.style.cssText;
        
        // Indicador de slide atual
        const slideIndicator = document.createElement('div');
        slideIndicator.className = 'slide-indicator';
        slideIndicator.style.cssText = `
            background: rgba(212, 175, 55, 0.2);
            border: 2px solid #d4af37;
            border-radius: 25px;
            padding: 8px 16px;
            color: #d4af37;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.5px;
            min-width: 80px;
            text-align: center;
        `;
        
        // Função para atualizar o indicador
        function updateIndicator() {
            const total = testimonialCards.length;
            const current = currentSlide + 1;
            slideIndicator.textContent = `${current} / ${total}`;
        }
        
        // Event listeners
        prevButton.addEventListener('click', () => {
            if (typeof window.prevTestimonialSlide === 'function') {
                window.prevTestimonialSlide();
                updateIndicator();
            }
        });
        
        nextButton.addEventListener('click', () => {
            if (typeof window.nextTestimonialSlide === 'function') {
                window.nextTestimonialSlide();
                updateIndicator();
            }
        });
        
        // Efeitos hover
        [prevButton, nextButton].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1) translateY(-2px)';
                btn.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1) translateY(0)';
                btn.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
            });
        });
        
        // Montar controles
        controlsContainer.appendChild(prevButton);
        controlsContainer.appendChild(slideIndicator);
        controlsContainer.appendChild(nextButton);
        
        // Inserir após a seção de depoimentos
        const testimonialsContainer = testimonialsSection.querySelector('.testimonials-container');
        if (testimonialsContainer && testimonialsContainer.parentNode) {
            testimonialsContainer.parentNode.insertBefore(controlsContainer, testimonialsContainer.nextSibling);
        }
        
        // Inicializar indicador
        updateIndicator();
        
        // Código para auto-update do indicador removido (auto-play desabilitado)
        /*
        // Atualizar indicador quando slides mudarem automaticamente
        const originalNextSlide = window.nextTestimonialSlide;
        if (originalNextSlide) {
            window.nextTestimonialSlide = function() {
                originalNextSlide();
                setTimeout(updateIndicator, 100);
            };
        }
        */
    }
    
    // Função para criar estrelas adicionais
    function createStars() {
        const mysticalElements = document.querySelector('.mystical-elements');
        if (!mysticalElements) return;
        
        const starsCount = 15;
        
        for (let i = 0; i < starsCount; i++) {
            const star = document.createElement('div');
            star.classList.add('stars');
            
            // Posição aleatória
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Tamanho aleatório
            const size = Math.random() * 3 + 2;
            
            // Atraso de animação aleatório
            const delay = Math.random() * 5;
            
            // Aplicar estilos
            star.style.left = `${posX}%`;
            star.style.top = `${posY}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.animationDelay = `${delay}s`;
            
            mysticalElements.appendChild(star);
        }
    }
    
    // Função para efeito parallax
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.service-icon-large, .title, .subtitle');
        
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            parallaxElements.forEach(element => {
                const offsetX = (mouseX - 0.5) * 20;
                const offsetY = (mouseY - 0.5) * 20;
                
                element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });
    }
    
    // Adicionar classe 'animate' aos elementos quando entrarem na viewport
    document.addEventListener('scroll', () => {
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('animate');
            }
        });
    });
    
    // Função auxiliar para verificar se elemento está na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
});

// Adicionar classe 'animate' aos elementos quando a página carregar
window.addEventListener('load', function() {
    document.querySelectorAll('.section').forEach(section => {
        if (isElementInViewport(section)) {
            section.classList.add('animate');
        }
    });
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
});
