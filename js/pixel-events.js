/**
 * Rastreamento de Eventos do Meta Pixel - Inaiara Anjos
 * Atualizado para o novo Pixel ID: 968048132755163
 */

document.addEventListener('DOMContentLoaded', function() {
    const PIXEL_ID = '968048132755163';

    // Função auxiliar para gerar ID de evento único (útil para deduplicação em CAPI futuro)
    function generateEventID() {
        return 'ev_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    // 1. Rastreamento de Scroll (ViewContent quando o usuário lê metade da página)
    let scrollTracked = false;
    window.addEventListener('scroll', function() {
        if (!scrollTracked && window.scrollY > (document.documentElement.scrollHeight / 2)) {
            fbq('track', 'ViewContent', { 
                content_name: 'Leitura da Página',
                content_category: 'Engajamento'
            }, { eventID: generateEventID() });
            scrollTracked = true;
        }
    });

    // 2. Rastreamento de Cliques em Botões de Agendamento (WhatsApp)
    const ctaButtons = document.querySelectorAll('.cta-button, .service-button, .contact-link[href*="wa.me"], .footer-social-link[href*="wa.me"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const location = this.closest('section') ? this.closest('section').id : 'footer';
            const eventID = generateEventID();
            
            fbq('track', 'Contact', {
                content_category: 'WhatsApp',
                content_name: 'Agendar Consulta',
                location: location
            }, { eventID: eventID });
            
            fbq('track', 'Lead', {
                content_category: 'WhatsApp',
                value: 0,
                currency: 'BRL'
            }, { eventID: eventID });
        });
    });

    // 3. Rastreamento de Cliques no Instagram
    const instagramLinks = document.querySelectorAll('a[href*="instagram.com"], a[href*="ig.me"]');
    instagramLinks.forEach(link => {
        link.addEventListener('click', function() {
            fbq('track', 'FindLocation', {
                content_name: 'Instagram Profile',
                content_category: 'Social Media'
            }, { eventID: generateEventID() });
        });
    });

    // 4. Rastreamento de Cliques em Links de Navegação (Interesse)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionName = this.textContent.trim();
            fbq('trackCustom', 'NavigationClick', {
                section: sectionName
            }, { eventID: generateEventID() });
        });
    });

    // 5. Rastreamento de Tempo na Página (Usuário Engajado)
    setTimeout(function() {
        fbq('trackCustom', 'EngagedUser', { 
            seconds: 30 
        }, { eventID: generateEventID() });
    }, 30000);
});
