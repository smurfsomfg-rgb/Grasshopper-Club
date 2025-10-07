// runesSearch.js - Funcionalidad de búsqueda de runas

// Inicializar la funcionalidad de búsqueda (global)
window.initRuneSearch = function() {
    const searchInput = document.getElementById('runeSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) {
        console.error('Elementos de búsqueda no encontrados');
        return;
    }

    // Configurar event listeners
    searchInput.addEventListener('input', (e) => {
        searchRunes(e.target.value);
    });

    // Mostrar todas las runas al abrir el modal de búsqueda
    document.getElementById('searchBtn')?.addEventListener('click', () => {
        displayAllRunes();
    });

    // Mostrar runas inicialmente
    displayAllRunes();
};



// Función para buscar runas
function searchRunes(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults || !window.RUNES) {
        console.error('Error: Elementos necesarios no encontrados');
        return;
    }

    query = query.toLowerCase().trim();
    
    const results = window.RUNES.filter(rune => 
        rune.name.toLowerCase().includes(query) ||
        rune.mean.toLowerCase().includes(query) ||
        rune.desc.toLowerCase().includes(query)
    );
    
    searchResults.innerHTML = results.length ? 
        results.map(renderRuneCard).join('') :
        '<p class="no-results">No se encontraron runas que coincidan con tu búsqueda.</p>';
}



// Función para mostrar todas las runas
function displayAllRunes() {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults || !window.RUNES) {
        console.error('Error: Elementos necesarios no encontrados');
        return;
    }
    searchResults.innerHTML = window.RUNES.map(renderRuneCard).join('');
}

// Función para renderizar una carta de runa
function renderRuneCard(rune) {
    return `
        <div class="rune-card search-card">
            <div class="rune-img-container">
                <img src="${rune.img}" alt="${rune.name}" class="rune-img">
            </div>
            <div class="rune-info">
                <h3 class="rune-name">${rune.name}</h3>
                <p class="rune-mean"><strong>Significado:</strong> ${rune.mean}</p>
                <p class="rune-desc">${rune.desc}</p>
            </div>
        </div>
    `;
}