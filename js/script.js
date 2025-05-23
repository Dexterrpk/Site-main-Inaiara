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
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    const dots = document.querySelectorAll('.dot');
    const testimonialForm = document.getElementById('testimonialForm');
    const newTestimonialsContainer = document.getElementById('newTestimonials');
    
    // Variáveis para controle do carrossel
    let currentSlide = 0;
    let slideWidth = 0;
    let slideInterval;
    
    // Inicialização
    initAnimations();
    initNavbar();
    initScrollEvents();
    initTestimonialSlider();
    initTestimonialForm();
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
        
        // Destacar link ativo ao rolar
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
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
        
        // Rolagem suave para links de âncora
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
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
        
        // Configuração inicial
        function setupSlider() {
            // Determinar largura do slide com base no tamanho da tela
            if (window.innerWidth >= 1200) {
                slideWidth = testimonialContainer.offsetWidth / 3;
            } else if (window.innerWidth >= 768) {
                slideWidth = testimonialContainer.offsetWidth / 2;
            } else {
                slideWidth = testimonialContainer.offsetWidth;
            }
            
            // Aplicar largura aos cards
            testimonialCards.forEach(card => {
                card.style.flex = `0 0 ${slideWidth}px`;
            });
            
            // Mover para o slide atual
            moveToSlide(currentSlide);
        }
        
        // Função para mover para um slide específico
        function moveToSlide(slideIndex) {
            // Limitar o índice ao número de slides disponíveis
            const maxSlides = testimonialCards.length - (window.innerWidth >= 1200 ? 2 : window.innerWidth >= 768 ? 1 : 0);
            currentSlide = Math.max(0, Math.min(slideIndex, maxSlides - 1));
            
            // Mover o container
            testimonialContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            testimonialContainer.style.transition = 'transform 0.5s ease-out';
            
            // Atualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Event listeners para controles
        prevBtn.addEventListener('click', () => {
            moveToSlide(currentSlide - 1);
            resetInterval();
        });
        
        nextBtn.addEventListener('click', () => {
            moveToSlide(currentSlide + 1);
            resetInterval();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetInterval();
            });
        });
        
        // Auto-play
        function startInterval() {
            slideInterval = setInterval(() => {
                const maxSlides = testimonialCards.length - (window.innerWidth >= 1200 ? 2 : window.innerWidth >= 768 ? 1 : 0);
                moveToSlide(currentSlide === maxSlides - 1 ? 0 : currentSlide + 1);
            }, 5000);
        }
        
        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }
        
        // Inicializar slider
        setupSlider();
        startInterval();
        
        // Recalcular em caso de redimensionamento
        window.addEventListener('resize', () => {
            setupSlider();
        });
    }
    
    // Função para inicializar o formulário de depoimentos
    function initTestimonialForm() {
        if (testimonialForm) {
            testimonialForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Obter valores do formulário
                const name = document.getElementById('name').value;
                const message = document.getElementById('message').value;
                
                // Criar novo depoimento
                const newTestimonial = createTestimonialCard(name, message);
                
                // Adicionar ao container de novos depoimentos
                newTestimonialsContainer.appendChild(newTestimonial);
                
                // Animar entrada do novo depoimento
                setTimeout(() => {
                    newTestimonial.style.opacity = '1';
                    newTestimonial.style.transform = 'translateY(0)';
                }, 100);
                
                // Limpar formulário
                testimonialForm.reset();
                
                // Rolar suavemente até o novo depoimento
                setTimeout(() => {
                    newTestimonial.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        }
    }
    
    // Função para criar um novo card de depoimento
    function createTestimonialCard(name, message) {
        // Criar elementos
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'testimonial-quote';
        quoteDiv.innerHTML = '<i class="fas fa-quote-left"></i>';
        
        const textP = document.createElement('p');
        textP.className = 'testimonial-text';
        textP.textContent = message;
        
        const authorDiv = document.createElement('div');
        authorDiv.className = 'testimonial-author';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'testimonial-avatar';
        avatarDiv.innerHTML = '<i class="fas fa-user-circle"></i>';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'testimonial-info';
        
        const nameH4 = document.createElement('h4');
        nameH4.textContent = name;
        
        const typeP = document.createElement('p');
        typeP.textContent = 'Comentário recente';
        
        // Montar estrutura
        infoDiv.appendChild(nameH4);
        infoDiv.appendChild(typeP);
        
        authorDiv.appendChild(avatarDiv);
        authorDiv.appendChild(infoDiv);
        
        card.appendChild(quoteDiv);
        card.appendChild(textP);
        card.appendChild(authorDiv);
        
        return card;
    }
    
    // Função para criar estrelas adicionais
    function createStars() {
        const mysticalElements = document.querySelector('.mystical-elements');
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
