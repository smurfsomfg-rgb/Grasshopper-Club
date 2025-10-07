// Sistema de tooltips y feedback visual
const UI = {
    // Mostrar feedback temporal
    showFeedback: function(message, type = 'info', duration = 2000) {
        let container = document.getElementById('feedback-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'feedback-container';
            document.body.appendChild(container);
        }

        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        
        // Asegurar que la animación sea fluida
        requestAnimationFrame(() => {
            container.appendChild(feedback);
            feedback.style.animation = 'fadeIn 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
        });
        
        // Programar la eliminación con transición suave
        const timeoutId = setTimeout(() => {
            feedback.style.animation = 'fadeOut 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards';
            
            const handleRemoval = (e) => {
                if (e.animationName === 'fadeOut') {
                    feedback.removeEventListener('animationend', handleRemoval);
                    if (feedback.parentNode === container) {
                        container.removeChild(feedback);
                    }
                    // Limpiar el contenedor si está vacío
                    if (container.children.length === 0) {
                        container.remove();
                    }
                }
            };
            
            feedback.addEventListener('animationend', handleRemoval);
        }, duration);
    },

    // Añadir tooltip a un elemento
    addTooltip: function(element, message, position = 'top') {
        element.setAttribute('data-tooltip', message);
        element.setAttribute('data-position', position);
    },

    // Mostrar estado de carga
    showLoading: function(element) {
        element.classList.add('loading');
        return () => element.classList.remove('loading');
    },

    // Añadir efecto de hover interactivo
    makeInteractive: function(element) {
        element.classList.add('interactive-element');
    },

    // Hacer elemento seleccionable
    makeSelectable: function(element, onSelect) {
        element.classList.add('selectable');
        element.addEventListener('click', () => {
            const wasSelected = element.classList.contains('selected');
            element.classList.toggle('selected');
            if (onSelect) onSelect(!wasSelected);
        });
    }
};

// Inicializar tooltips para elementos comunes
document.addEventListener('DOMContentLoaded', () => {
    // Tooltips para botones de la tirada
    const drawBtn = document.getElementById('drawBtn');
    if (drawBtn) {
        UI.addTooltip(drawBtn, 'Realiza una nueva tirada de tarot\ncon las cartas seleccionadas');
    }

    const pdfBtn = document.getElementById('pdfBtn');
    if (pdfBtn) {
        UI.addTooltip(pdfBtn, 'Guarda la tirada actual en formato PDF\npara consultarla más tarde');
    }

    const translateBtn = document.getElementById('translateBtn');
    if (translateBtn) {
        UI.addTooltip(translateBtn, 'Traduce el contenido a otros idiomas\nusando Google Translate');
    }

    // Tooltips para filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const filterType = btn.dataset.filter;
        let tooltipText;
        switch (filterType) {
            case 'all':
                tooltipText = 'Muestra todas las cartas disponibles';
                break;
            case 'major':
                tooltipText = 'Muestra solo los Arcanos Mayores\nLas 22 cartas principales del Tarot';
                break;
            case 'wands':
                tooltipText = 'Muestra las cartas de Bastos\nElemento Fuego - Creatividad y Acción';
                break;
            case 'cups':
                tooltipText = 'Muestra las cartas de Copas\nElemento Agua - Emociones e Intuición';
                break;
            case 'swords':
                tooltipText = 'Muestra las cartas de Espadas\nElemento Aire - Mente y Decisiones';
                break;
            case 'pents':
                tooltipText = 'Muestra las cartas de Oros\nElemento Tierra - Material y Práctico';
                break;
        }
        UI.addTooltip(btn, tooltipText);
    });

    // Hacer interactivos los elementos de selección
    document.querySelectorAll('select, input').forEach(element => {
        UI.makeInteractive(element);
    });
});

// Añadir feedback para acciones comunes
document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('drawBtn');
    if (drawBtn) {
        drawBtn.addEventListener('click', () => {
            const hideLoading = UI.showLoading(drawBtn);
            setTimeout(() => {
                hideLoading();
                UI.showFeedback('Tirada realizada con éxito', 'success');
            }, 1000);
        });
    }

    const pdfBtn = document.getElementById('pdfBtn');
    if (pdfBtn) {
        UI.addTooltip(pdfBtn, 'Guarda la tirada actual en formato PDF\npara consultarla más tarde');
    }
});

// Exportar para uso en otros archivos
window.UI = UI;