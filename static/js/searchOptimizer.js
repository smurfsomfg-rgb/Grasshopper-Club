// Funciones de optimización de búsqueda y filtrado
const SearchOptimizer = {
    // Índice invertido para búsqueda rápida
    searchIndex: new Map(),
    
    // Cache de resultados de búsqueda
    searchCache: new Map(),
    
    // Inicializar índice
    initializeIndex(cards) {
        cards.forEach(card => {
            this.indexCard(card);
        });
    },
    
    // Indexar una carta
    indexCard(card) {
        const terms = this.getSearchTerms(card);
        terms.forEach(term => {
            if (!this.searchIndex.has(term)) {
                this.searchIndex.set(term, new Set());
            }
            this.searchIndex.get(term).add(card.id);
        });
    },
    
    // Obtener términos de búsqueda de una carta
    getSearchTerms(card) {
        const terms = new Set();
        
        // Nombre
        card.name.toLowerCase().split(' ').forEach(word => terms.add(word));
        
        // Tipo
        terms.add(card.type.toLowerCase());
        
        // Significados
        if (card.meanings) {
            const meaningText = `${card.meanings.up} ${card.meanings.rev}`.toLowerCase();
            meaningText.split(/\s+/).forEach(word => {
                if (word.length > 3) terms.add(word);
            });
        }
        
        return terms;
    },
    
    // Realizar búsqueda
    search(query, filter = 'all') {
        // Normalizar consulta
        query = query.toLowerCase().trim();
        
        // Verificar cache
        const cacheKey = `${query}:${filter}`;
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey);
        }
        
        // Realizar búsqueda
        let results = this.performSearch(query);
        
        // Aplicar filtro
        if (filter !== 'all') {
            results = results.filter(id => 
                this.getCard(id).type === filter
            );
        }
        
        // Guardar en cache
        this.searchCache.set(cacheKey, results);
        
        return results;
    },
    
    // Realizar búsqueda en el índice
    performSearch(query) {
        if (!query) return Array.from(this.getAllCardIds());
        
        const terms = query.split(/\s+/);
        const results = new Set();
        
        terms.forEach(term => {
            // Búsqueda exacta
            if (this.searchIndex.has(term)) {
                this.searchIndex.get(term).forEach(id => results.add(id));
            }
            
            // Búsqueda parcial
            this.searchIndex.forEach((cardIds, indexTerm) => {
                if (indexTerm.includes(term)) {
                    cardIds.forEach(id => results.add(id));
                }
            });
        });
        
        return Array.from(results);
    },
    
    // Limpiar cache
    clearCache() {
        this.searchCache.clear();
    },
    
    // Obtener todas las IDs de cartas
    getAllCardIds() {
        const ids = new Set();
        this.searchIndex.forEach(cardIds => {
            cardIds.forEach(id => ids.add(id));
        });
        return ids;
    }
};

// Renderizado optimizado
const ViewOptimizer = {
    observer: null,
    visibleCards: new Set(),
    
    initialize() {
        this.setupIntersectionObserver();
    },
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const cardId = entry.target.dataset.cardId;
                    if (entry.isIntersecting) {
                        this.visibleCards.add(cardId);
                        this.loadCardContent(entry.target);
                    } else {
                        this.visibleCards.delete(cardId);
                    }
                });
            },
            {
                root: document.querySelector('.card-library'),
                rootMargin: '50px',
                threshold: 0.1
            }
        );
    },
    
    observeCard(cardElement) {
        this.observer?.observe(cardElement);
    },
    
    loadCardContent(cardElement) {
        if (cardElement.dataset.loaded === 'true') return;
        
        // Cargar imagen
        const img = cardElement.querySelector('img');
        if (img && img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }
        
        cardElement.dataset.loaded = 'true';
    }
};

export { SearchOptimizer, ViewOptimizer };