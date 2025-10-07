// Sistema de búsqueda de cartas del Tarot
const SearchSystem = (function() {
    const logger = Logger.getContextLogger('SearchSystem');
    
    // Estado interno del módulo
    const state = {
        currentFilter: 'all',
        searchTerm: '',
        initialized: false,
        errors: []
    };

    // Cache de elementos DOM
    let DOM = {
        searchInput: null,
        filterBtns: null,
        cardLibrary: null,
        toggleSearchBtn: null,
        searchContainer: null,
        closeSearchBtn: null,
        searchOverlay: null
    };

    // Inicializar el sistema
    function initialize() {
        try {
            // Inicializar cache DOM
            DOM = {
                searchInput: document.getElementById('cardSearch'),
                filterBtns: document.querySelectorAll('.filter-btn'),
                cardLibrary: document.getElementById('cardLibrary'),
                toggleSearchBtn: document.getElementById('toggleSearch'),
                searchContainer: document.querySelector('.search-container'),
                closeSearchBtn: document.querySelector('.close-search-btn'),
                searchOverlay: document.querySelector('.search-overlay')
            };

            // Verificar elementos críticos
            const requiredElements = ['cardLibrary', 'toggleSearchBtn', 'searchContainer', 'searchOverlay'];
            const missingElements = requiredElements.filter(el => !DOM[el]);
            
            if (missingElements.length > 0) {
                throw new Error(`Elementos requeridos no encontrados: ${missingElements.join(', ')}`);
            }

            // Configurar eventos
            setupEventListeners();
            
            state.initialized = true;
            
            // Cargar biblioteca inicial
            loadCardLibrary();

            return true;
        } catch (error) {
            logger.error('Error al inicializar sistema de búsqueda', error);
            ErrorPanel.log('Error: No se pudo inicializar el sistema de búsqueda');
            return false;
        }
    }

    // Configurar eventos del sistema
    function setupEventListeners() {
        try {
            // Toggle búsqueda
            DOM.toggleSearchBtn.addEventListener('click', showSearch);
            DOM.closeSearchBtn?.addEventListener('click', hideSearch);
            DOM.searchOverlay?.addEventListener('click', hideSearch);
            
            // Prevenir cierre al hacer click dentro del contenedor
            DOM.searchContainer?.addEventListener('click', (e) => e.stopPropagation());

            // Filtros
            DOM.filterBtns?.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;
                    filterCards(filter);
                });
            });

            // Búsqueda por texto
            if (DOM.searchInput) {
                DOM.searchInput.addEventListener('input', handleSearch);
                // Limpiar búsqueda al cerrar
                DOM.closeSearchBtn?.addEventListener('click', () => {
                    DOM.searchInput.value = '';
                    handleSearch({ target: { value: '' } });
                });
            }
        } catch (error) {
            logger.error('Error al configurar eventos', error);
            ErrorPanel.log('Error: No se pudieron configurar los eventos del sistema');
        }
    }

    // Maneja el evento de búsqueda por texto
    function handleSearch(e) {
        try {
            const searchTerm = e.target.value.toLowerCase();
            logger.info('Búsqueda realizada', { searchTerm });

            if (!DOM.cardLibrary) {
                throw new Error('Contenedor de biblioteca no encontrado');
            }

            state.searchTerm = searchTerm;
            const cards = DOM.cardLibrary.querySelectorAll('.library-card');
            
            cards.forEach(card => {
                const name = card.dataset.name;
                const matchesSearch = !searchTerm || name.includes(searchTerm);
                const matchesFilter = state.currentFilter === 'all' || 
                                    card.dataset.type === state.currentFilter;
                
                card.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
            });

            logger.info('Filtrado por búsqueda completado', { 
                searchTerm, 
                filter: state.currentFilter,
                totalCards: cards.length,
                visibleCards: Array.from(cards).filter(c => c.style.display !== 'none').length
            });
        } catch (error) {
            logger.error('Error al realizar búsqueda', error);
            ErrorPanel.log('Error: No se pudo realizar la búsqueda');
        }
    }

    // Muestra el buscador
    async function showSearch() {
        try {
            logger.info('Mostrando buscador');
            
            if (!DOM.searchContainer || !DOM.searchOverlay) {
                throw new Error('Elementos del buscador no encontrados');
            }

            // Asegurarse de que las cartas estén cargadas primero
            await loadCardLibrary();

            DOM.searchContainer.classList.add('show');
            DOM.searchOverlay.classList.add('show');
            DOM.searchInput?.focus();
            document.body.style.overflow = 'hidden';
            
            logger.info('Buscador mostrado correctamente');
        } catch (error) {
            logger.error('Error al mostrar el buscador', error);
            ErrorPanel.log('Error: No se pudo mostrar el buscador');
            hideSearch(); // Intentar limpiar el estado
        }
    }

    // Oculta el buscador
    function hideSearch() {
        try {
            logger.info('Ocultando buscador');
            
            if (!DOM.searchContainer || !DOM.searchOverlay) {
                throw new Error('Elementos del buscador no encontrados');
            }
            
            DOM.searchContainer.classList.remove('show');
            DOM.searchOverlay.classList.remove('show');
            document.body.style.overflow = '';
            
            // Limpiar búsqueda al cerrar
            if (DOM.searchInput) {
                DOM.searchInput.value = '';
                handleSearch({ target: { value: '' } });
            }
            
            logger.info('Buscador ocultado correctamente');
        } catch (error) {
            logger.error('Error al ocultar el buscador', error);
            ErrorPanel.log('Error: No se pudo ocultar el buscador');
            // Intentar restaurar el estado normal de la página
            document.body.style.overflow = '';
        }
    }

    // Filtra las cartas por tipo
    function filterCards(filter = 'all') {
        try {
            logger.info('Filtrando cartas', { filter });
            
            if (!DOM.cardLibrary) {
                throw new Error('Contenedor de biblioteca no encontrado');
            }

            state.currentFilter = filter;

            // Actualizar clases de los botones
            if (!DOM.filterBtns?.length) {
                throw new Error('Botones de filtro no encontrados');
            }

            DOM.filterBtns.forEach(btn => {
                if (btn.dataset.filter === filter) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Filtrar las cartas
            const cards = DOM.cardLibrary.querySelectorAll('.library-card');
            if (!cards.length) {
                logger.warn('No se encontraron cartas para filtrar');
                return;
            }

            cards.forEach(card => {
                const matchesFilter = filter === 'all' || card.dataset.type === filter;
                const matchesSearch = !state.searchTerm || 
                                    card.dataset.name.includes(state.searchTerm);
                
                card.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
            });

            logger.info('Filtrado completado', { 
                filter, 
                totalCards: cards.length,
                visibleCards: Array.from(cards).filter(c => c.style.display !== 'none').length
            });
        } catch (error) {
            logger.error('Error al filtrar cartas', error);
            ErrorPanel.log('Error: No se pudieron filtrar las cartas');
        }
    }

    // Carga la biblioteca de cartas
    async function loadCardLibrary() {
        try {
            if (!DOM.cardLibrary) {
                throw new Error('Contenedor de biblioteca no encontrado');
            }

            // Si ya hay cartas cargadas, no es necesario volver a cargar
            if (DOM.cardLibrary.children.length > 0 && 
                DOM.cardLibrary.querySelector('.library-card')) {
                logger.info('Biblioteca ya está cargada');
                return;
            }

            // Mostrar indicador de carga
            DOM.cardLibrary.innerHTML = `
                <div class="loading-indicator">
                    <div class="loading-spinner"></div>
                    <p>Cargando biblioteca de cartas...</p>
                </div>
            `;

            const cards = await getCards();
            logger.info('Cartas obtenidas', { count: cards.length });
            
            DOM.cardLibrary.innerHTML = '';
            cards.forEach(card => {
                const element = createCardElement(card);
                if (element) {
                    DOM.cardLibrary.appendChild(element);
                }
            });

            // Aplicar filtros actuales
            if (state.searchTerm || state.currentFilter !== 'all') {
                const cards = DOM.cardLibrary.querySelectorAll('.library-card');
                cards.forEach(card => {
                    const matchesFilter = state.currentFilter === 'all' || 
                                        card.dataset.type === state.currentFilter;
                    const matchesSearch = !state.searchTerm || 
                                        card.dataset.name.includes(state.searchTerm);
                    card.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
                });
            }

            logger.info('Biblioteca de cartas cargada exitosamente');
        } catch (error) {
            logger.error('Error al cargar la biblioteca', error);
            ErrorPanel.log('Error: No se pudo cargar la biblioteca de cartas');
            DOM.cardLibrary.innerHTML = `
                <div class="error-message">
                    Error cargando las cartas. Por favor, intenta de nuevo.
                </div>
            `;
        }
    }

    // Crea un elemento de carta
    function createCardElement(cardData) {
        try {
            if (!cardData || !cardData.name || !cardData.type || !cardData.imageName) {
                logger.error('Datos de carta incompletos', { cardData });
                throw new Error('Datos de carta incompletos');
            }

            const element = document.createElement('div');
            element.className = 'library-card animated-card';
            element.dataset.type = cardData.type;
            element.dataset.name = cardData.name.toLowerCase();

            element.innerHTML = `
                <div class="card-front">
                    <img src="cards/img/big/${cardData.imageName}" alt="${cardData.name}" loading="lazy"
                         onerror="this.src='cards/img/cover.jpg'">
                </div>
                <div class="card-title">
                    <span>${cardData.name}</span>
                </div>
            `;

            element.addEventListener('click', () => showCardDetails(cardData));
            return element;
        } catch (error) {
            logger.error('Error al crear elemento de carta', error);
            ErrorPanel.log('Error: No se pudo crear la carta');
            return null;
        }
    }

    // Muestra los detalles de una carta
    function showCardDetails(cardData) {
        try {
            logger.info('Mostrando detalles de carta', { cardName: cardData.name });
            
            const detailsContainer = document.getElementById('cardDetailsContainer');
            if (!detailsContainer) {
                throw new Error('No se encontró el contenedor de detalles');
            }

            detailsContainer.innerHTML = `
                <div class="card-details-modal">
                    <div class="modal-content">
                        <div class="card-header">
                            <h2>${cardData.name}</h2>
                            <button class="close-details">&times;</button>
                        </div>
                        <div class="card-content">
                            <div class="card-image">
                                <img src="cards/img/big/${cardData.imageName}" alt="${cardData.name}">
                            </div>
                            <div class="card-meanings">
                                <div class="meaning-section">
                                    <h3>Significado Derecho</h3>
                                    <p>${cardData.meanings.up}</p>
                                </div>
                                <div class="meaning-section">
                                    <h3>Significado Invertido</h3>
                                    <p>${cardData.meanings.rev}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            detailsContainer.classList.add('active');
            document.body.style.overflow = 'hidden';

            const closeBtn = detailsContainer.querySelector('.close-details');
            if (!closeBtn) {
                throw new Error('No se encontró el botón de cerrar');
            }

            const closeModal = () => {
                detailsContainer.classList.remove('active');
                document.body.style.overflow = '';
            };

            closeBtn.onclick = closeModal;
            detailsContainer.onclick = (e) => {
                if (e.target === detailsContainer) {
                    closeModal();
                }
            };

            logger.info('Detalles de carta mostrados correctamente');
        } catch (error) {
            logger.error('Error al mostrar detalles de carta', error);
            ErrorPanel.log('Error: No se pudieron mostrar los detalles de la carta');
            // Restaurar estado normal de la página
            document.body.style.overflow = '';
        }
    }

    // Obtiene la lista de cartas
    async function getCards() {
        try {
            logger.info('Obteniendo lista de cartas');

            const majorArcana = [
                { name: 'El Loco', number: 0, type: 'major' },
                { name: 'El Mago', number: 1, type: 'major' },
                { name: 'La Sacerdotisa', number: 2, type: 'major' },
                { name: 'La Emperatriz', number: 3, type: 'major' },
                { name: 'El Emperador', number: 4, type: 'major' },
                { name: 'El Hierofante', number: 5, type: 'major' },
                { name: 'Los Enamorados', number: 6, type: 'major' },
                { name: 'El Carro', number: 7, type: 'major' },
                { name: 'La Fuerza', number: 8, type: 'major' },
                { name: 'El Ermitaño', number: 9, type: 'major' },
                { name: 'La Rueda de la Fortuna', number: 10, type: 'major' },
                { name: 'La Justicia', number: 11, type: 'major' },
                { name: 'El Colgado', number: 12, type: 'major' },
                { name: 'La Muerte', number: 13, type: 'major' },
                { name: 'La Templanza', number: 14, type: 'major' },
                { name: 'El Diablo', number: 15, type: 'major' },
                { name: 'La Torre', number: 16, type: 'major' },
                { name: 'La Estrella', number: 17, type: 'major' },
                { name: 'La Luna', number: 18, type: 'major' },
                { name: 'El Sol', number: 19, type: 'major' },
                { name: 'El Juicio', number: 20, type: 'major' },
                { name: 'El Mundo', number: 21, type: 'major' }
            ];

            const minorArcana = [
                { suit: 'wands', name: 'Bastos' },
                { suit: 'cups', name: 'Copas' },
                { suit: 'swords', name: 'Espadas' },
                { suit: 'pents', name: 'Oros' }
            ];

            // Normalización de nombres para buscar en TarotMeanings
            const nameMapping = {
                'El Loco': 'El Loco',
                'El Hierofante': 'El Hierofante',
                'El Carro': 'El Carruaje',
                'La Rueda de la Fortuna': 'La Rueda',
                'El Colgado': 'El Ahorcado'
            };

            let allCards = [];

            // Agregar Arcanos Mayores
            allCards = majorArcana.map(card => {
                const meaningKey = nameMapping[card.name] || card.name;
                return {
                    id: `major-${card.number}`,
                    name: card.name,
                    type: 'major',
                    imageName: `maj${String(card.number).padStart(2, '0')}.jpg`,
                    meanings: window.TarotMeanings?.[meaningKey] || {
                        up: "Significado por definir",
                        rev: "Significado invertido por definir"
                    }
                };
            });

            // Agregar Arcanos Menores
            minorArcana.forEach(suit => {
                const numbers = ['As', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 
                               'Siete', 'Ocho', 'Nueve', 'Diez', 'Sota', 
                               'Caballero', 'Reina', 'Rey'];
                
                for (let i = 1; i <= 14; i++) {
                    const name = `${numbers[i - 1]} de ${suit.name}`;
                    allCards.push({
                        id: `${suit.suit}-${i}`,
                        name: name,
                        type: suit.suit,
                        imageName: `${suit.suit}${String(i).padStart(2, '0')}.jpg`,
                        meanings: window.TarotMeanings?.[name] || {
                            up: "Significado por definir",
                            rev: "Significado invertido por definir"
                        }
                    });
                }
            });

            logger.info('Lista de cartas generada', { cardCount: allCards.length });
            return allCards;
        } catch (error) {
            logger.error('Error al obtener lista de cartas', error);
            ErrorPanel.log('Error: No se pudo obtener la lista de cartas');
            return [];
        }
    }

    // Interfaces públicas
    return {
        initialize,
        filterCards,
        showSearch,
        hideSearch,
        showCardDetails
    };
})();

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    SearchSystem.initialize();
});
