// Generar estrellas
function createStars() {
    // Limpiar estrellas existentes
    document.querySelectorAll('.star').forEach(star => star.remove());
    
    // Crear nuevas estrellas
    const numStars = 200; // Número de estrellas
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Posición aleatoria
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        // Tamaño aleatorio
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Brillo aleatorio
        star.style.opacity = Math.random() * 0.7 + 0.3;
        
        // Animación retrasada aleatoria
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        document.body.appendChild(star);
    }
}

// Crear estrellas cuando se carga la página
window.addEventListener('DOMContentLoaded', createStars);

// Recrear estrellas cuando se redimensiona la ventana
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(createStars, 250);
});