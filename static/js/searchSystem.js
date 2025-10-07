import { Utils, StateManager, EventBus } from './core.js';

class SearchSystem {
    constructor() {
        this.searchIndex = null;
        this.initialized = false;
        this.logger = Logger.getContextLogger('SearchSystem');
    }
    
    async initialize(cards) {
        if (this.initialized) return;

        try {
            this.searchIndex = new Map();
            cards.forEach(card => {
                this.indexCard(card);
            });
            
            this.initialized = true;
            this.setupEventListeners();

            this.logger.info('Sistema de búsqueda inicializado correctamente');
        } catch (error) {
            this.logger.error('Error al inicializar sistema de búsqueda', error);
            throw error;
        }
    }
    
    indexCard(card) {
        // Indexar por nombre
        this.addToIndex(card.name.toLowerCase(), card);
        
        // Indexar por tipo
        this.addToIndex(card.type.toLowerCase(), card);
        
        // Indexar por palabras clave en significados
        const keywords = this.extractKeywords(card.meanings);
        keywords.forEach(keyword => {
            this.addToIndex(keyword, card);
        });
    }
    
    addToIndex(term, card) {
        if (!this.searchIndex.has(term)) {
            this.searchIndex.set(term, new Set());
        }
        this.searchIndex.get(term).add(card);
    }
    
    extractKeywords(meanings) {
        // Implementar extracción inteligente de palabras clave
        return new Set();
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('cardSearch');
        if (!searchInput) return;
        
        // Aplicar debounce para mejor rendimiento
        const debouncedSearch = Utils.debounce((term) => {
            this.performSearch(term);
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value.toLowerCase());
        });
        
        // Escuchar cambios en filtros
        EventBus.on('filterChanged', (filter) => {
            this.applyFilter(filter);
        });
    }
    
    performSearch(term) {
        if (!term) {
            this.showAllCards();
            return;
        }
        
        const results = new Set();
        
        // Buscar coincidencias exactas primero
        if (this.searchIndex.has(term)) {
            this.searchIndex.get(term).forEach(card => results.add(card));
        }
        
        // Buscar coincidencias parciales
        this.searchIndex.forEach((cards, indexTerm) => {
            if (indexTerm.includes(term)) {
                cards.forEach(card => results.add(card));
            }
        });
        
        // Actualizar estado y UI
        StateManager.setState({
            searchResults: Array.from(results)
        });
        
        EventBus.emit('searchCompleted', Array.from(results));
    }
    
    applyFilter(filter) {
        const state = StateManager.getState();
        const activeFilters = new Set(state.activeFilters);
        
        if (filter === 'all') {
            activeFilters.clear();
            activeFilters.add('all');
        } else {
            activeFilters.delete('all');
            if (activeFilters.has(filter)) {
                activeFilters.delete(filter);
                if (activeFilters.size === 0) {
                    activeFilters.add('all');
                }
            } else {
                activeFilters.add(filter);
            }
        }
        
        StateManager.setState({
            activeFilters: activeFilters
        });
        
        this.updateResults();
    }
    
    updateResults() {
        const state = StateManager.getState();
        const filteredResults = this.filterResults(
            state.searchResults || [],
            state.activeFilters
        );
        
        EventBus.emit('resultsUpdated', filteredResults);
    }
    
    filterResults(cards, activeFilters) {
        if (activeFilters.has('all')) {
            return cards;
        }
        
        return cards.filter(card => 
            Array.from(activeFilters).some(filter => 
                card.type.toLowerCase().includes(filter)
            )
        );
    }
    
    showAllCards() {
        const state = StateManager.getState();
        this.updateResults();
    }
}

export const searchSystem = new SearchSystem();