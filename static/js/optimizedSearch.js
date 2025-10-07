// Sistema de búsqueda optimizado
class CardLibrary {
    constructor() {
        this.cards = [];
        this.searchIndex = new Map();
        this.cardElements = new Map();
        this.currentFilter = 'all';
        this.virtualScroller = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        // Referencias DOM
        this.container = document.getElementById('cardLibrary');
        this.searchInput = document.getElementById('cardSearch');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // Crear índice de búsqueda y elementos
        await this.initializeCards();
        this.setupVirtualScroller();
        this.setupEventListeners();

        this.initialized = true;
    }

    async initializeCards() {
        // Pre-crear todos los elementos de cartas y guardarlos en caché
        const majorArcana = this.getMajorArcana();
        const minorArcana = this.getMinorArcana();
        
        // Procesar en chunks para no bloquear el main thread
        const chunkSize = 10;
        const allCards = [...majorArcana, ...minorArcana];
        
        for (let i = 0; i < allCards.length; i += chunkSize) {
            const chunk = allCards.slice(i, i + chunkSize);
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    chunk.forEach(card => {
                        this.cards.push(card);
                        this.indexCard(card);
                        const element = this.createCardElement(card);
                        this.cardElements.set(card.id, element);
                    });
                    resolve();
                });
            });
        }
    }

    indexCard(card) {
        // Indexar por nombre
        const terms = [
            card.name.toLowerCase(),
            card.type.toLowerCase(),
            ...(card.keywords || []).map(k => k.toLowerCase())
        ];

        terms.forEach(term => {
            if (!this.searchIndex.has(term)) {
                this.searchIndex.set(term, new Set());
            }
            this.searchIndex.get(term).add(card.id);
        });
    }

    setupVirtualScroller() {
        const options = {
            itemHeight: 300, // Altura estimada de cada carta
            buffer: 5 // Número de elementos extra a renderizar arriba/abajo
        };

        this.virtualScroller = {
            container: this.container,
            items: [],
            visibleItems: new Set(),
            options,

            updateVisibleItems() {
                const scrollTop = this.container.scrollTop;
                const containerHeight = this.container.clientHeight;
                
                const startIndex = Math.max(0, Math.floor(scrollTop / this.options.itemHeight) - this.options.buffer);
                const endIndex = Math.min(
                    this.items.length,
                    Math.ceil((scrollTop + containerHeight) / this.options.itemHeight) + this.options.buffer
                );

                // Actualizar solo los elementos que cambian
                const newVisibleItems = new Set(this.items.slice(startIndex, endIndex).map(item => item.id));
                
                // Eliminar elementos que ya no son visibles
                for (const id of this.visibleItems) {
                    if (!newVisibleItems.has(id)) {
                        const element = document.getElementById(`card-${id}`);
                        if (element) element.remove();
                    }
                }

                // Añadir nuevos elementos visibles
                newVisibleItems.forEach(id => {
                    if (!this.visibleItems.has(id)) {
                        const card = this.items.find(item => item.id === id);
                        if (card) {
                            const element = library.cardElements.get(id).cloneNode(true);
                            this.container.appendChild(element);
                        }
                    }
                });

                this.visibleItems = newVisibleItems;
            }
        };

        // Configurar scroll listener con throttling
        let ticking = false;
        this.container.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.virtualScroller.updateVisibleItems();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    setupEventListeners() {
        // Debounce para la búsqueda
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterCards(e.target.value.toLowerCase());
            }, 150);
        });

        // Event delegation para los filtros
        document.querySelector('.filter-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.currentFilter = e.target.dataset.filter;
                this.filterCards(this.searchInput.value.toLowerCase());
                
                // Actualizar UI de filtros
                this.filterBtns.forEach(btn => btn.classList.toggle('active', btn === e.target));
            }
        });
    }

    filterCards(searchTerm = '') {
        const startTime = performance.now();

        // Obtener IDs de cartas que coinciden con la búsqueda
        let matchingCardIds = new Set();

        if (searchTerm) {
            // Búsqueda exacta primero
            if (this.searchIndex.has(searchTerm)) {
                this.searchIndex.get(searchTerm).forEach(id => matchingCardIds.add(id));
            }

            // Búsqueda parcial
            this.searchIndex.forEach((cardIds, term) => {
                if (term.includes(searchTerm)) {
                    cardIds.forEach(id => matchingCardIds.add(id));
                }
            });
        } else {
            // Sin término de búsqueda, incluir todas las cartas
            matchingCardIds = new Set(this.cards.map(card => card.id));
        }

        // Aplicar filtro actual
        const filteredCards = this.cards.filter(card => {
            const matchesSearch = matchingCardIds.has(card.id);
            const matchesFilter = this.currentFilter === 'all' || card.type === this.currentFilter;
            return matchesSearch && matchesFilter;
        });

        // Actualizar virtual scroller
        this.virtualScroller.items = filteredCards;
        this.virtualScroller.updateVisibleItems();

        const endTime = performance.now();
        console.log(`Búsqueda completada en ${endTime - startTime}ms`);
    }

    createCardElement(card) {
        const element = document.createElement('div');
        element.className = 'library-card';
        element.id = `card-${card.id}`;
        
        // Usar loading="lazy" para imágenes
        element.innerHTML = `
            <img src="cards/img/big/${card.imageName}" loading="lazy" alt="${card.name}">
            <h3>${card.name}</h3>
        `;

        return element;
    }

    // Helpers para datos de cartas
    getMajorArcana() {
        return majorArcana.map((card, index) => ({
            id: `major-${index}`,
            name: card.name,
            type: 'major',
            imageName: `maj${String(card.number).padStart(2, '0')}.jpg`,
            keywords: [],
            meanings: TarotMeanings[card.name] || {
                up: "Significado por definir",
                rev: "Significado invertido por definir"
            }
        }));
    }

    getMinorArcana() {
        const cards = [];
        minorArcana.forEach(suit => {
            for (let i = 1; i <= 14; i++) {
                cards.push({
                    id: `${suit.suit}-${i}`,
                    name: this.getMinorArcanaName(i, suit.name),
                    type: suit.suit,
                    imageName: `${suit.suit}${String(i).padStart(2, '0')}.jpg`,
                    keywords: [],
                    meanings: TarotMeanings[`${this.getMinorArcanaName(i, suit.name)}`] || {
                        up: "Significado por definir",
                        rev: "Significado invertido por definir"
                    }
                });
            }
        });
        return cards;
    }

    getMinorArcanaName(number, suit) {
        const numbers = ['As', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez', 'Sota', 'Caballero', 'Reina', 'Rey'];
        return `${numbers[number - 1]} de ${suit}`;
    }
}

// Inicializar biblioteca
const library = new CardLibrary();

// Exportar para uso en otros módulos
export default library;