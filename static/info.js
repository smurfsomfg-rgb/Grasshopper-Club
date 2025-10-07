// Controlador para el panel de información
document.addEventListener('DOMContentLoaded', () => {
    const infoBtn = document.getElementById('toggleDesc');
    const infoPanel = document.getElementById('tiradaDescPanel');
    const closeInfoBtn = document.getElementById('closeDesc');

    if (!infoBtn || !infoPanel || !closeInfoBtn) {
        console.error('Elementos del panel de información no encontrados');
        return;
    }

    function showInfoPanel() {
        infoPanel.style.display = 'block';
        infoPanel.style.opacity = '0';
        requestAnimationFrame(() => {
            infoPanel.style.transition = 'opacity 0.3s ease-in-out';
            infoPanel.style.opacity = '1';
        });
    }

    function hideInfoPanel() {
        infoPanel.style.opacity = '0';
        setTimeout(() => {
            infoPanel.style.display = 'none';
        }, 300);
    }

    // Mostrar panel de información
    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (infoPanel.style.display === 'block') {
            hideInfoPanel();
        } else {
            showInfoPanel();
        }
    });

    // Cerrar panel de información
    closeInfoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideInfoPanel();
    });

    // Cerrar panel si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        if (infoPanel.style.display === 'block' && 
            e.target !== infoBtn && 
            !infoPanel.contains(e.target)) {
            hideInfoPanel();
        }
    });
});