// Sistema de animaciones simplificado
function limpiarCartas(callback) {
    const cardsDiv = document.getElementById('cards');
    if (!cardsDiv) return;
    
    const cartasAnteriores = cardsDiv.querySelectorAll('.card');
    if (cartasAnteriores.length === 0) {
        if (callback) callback();
        return;
    }

    // Limpiar inmediatamente y ejecutar callback
    cardsDiv.innerHTML = '';
    if (callback) callback();
}

// Gestor de animaciones
const AnimationManager = {
    // Añadir efecto de ripple a los botones
    initRippleEffect() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'feedback-ripple';
                this.appendChild(ripple);

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;

                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    },

    // Revelar cartas secuencialmente
    revealSpreadCards() {
        const cards = document.querySelectorAll('.spread-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('is-revealing');
            }, index * 300); // Revelar cada carta con 300ms de diferencia
        });
    },

    // Efecto de volteado de carta
    flipCard(cardElement) {
        cardElement.classList.add('is-flipping');
        cardElement.addEventListener('animationend', () => {
            cardElement.classList.remove('is-flipping');
        }, { once: true });
    },

    // Mostrar modal con animación
    showModal(modalElement) {
        modalElement.style.display = 'flex';
        modalElement.classList.add('is-opening');
        modalElement.addEventListener('animationend', () => {
            modalElement.classList.remove('is-opening');
        }, { once: true });
    },

    // Ocultar modal con animación
    hideModal(modalElement) {
        modalElement.classList.add('is-closing');
        modalElement.addEventListener('animationend', () => {
            modalElement.classList.remove('is-closing');
            modalElement.style.display = 'none';
        }, { once: true });
    },

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('is-closing');
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }, 3000);
    },

    // Animar panel lateral
    toggleSidePanel(panelElement, show) {
        panelElement.classList.toggle('is-open', show);
        panelElement.classList.toggle('is-closed', !show);
    },

    // Mostrar spinner de carga
    showLoading() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        document.body.appendChild(spinner);
        return spinner;
    },

    // Ocultar spinner de carga
    hideLoading(spinner) {
        spinner.remove();
    }
};

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AnimationManager.initRippleEffect();
    
    // Evento para voltear cartas al hacer clic
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            AnimationManager.flipCard(card);
        });
    });

    // Evento para el modal
    const cardModal = document.getElementById('cardModal');
    if (cardModal) {
        document.getElementById('closeModal')?.addEventListener('click', () => {
            AnimationManager.hideModal(cardModal);
        });
    }

    // Evento para el panel de descripción
    const tiradaDescPanel = document.getElementById('tiradaDescPanel');
    if (tiradaDescPanel) {
        // El evento click se maneja en info.js
        Logger.getContextLogger('UI').debug('Panel de descripción de tirada inicializado');
    }
});