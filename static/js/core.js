// Cache y gestión de recursos
const ResourceManager = {
    imageCache: new Map(),
    async loadImage(url) {
        if (this.imageCache.has(url)) {
            return this.imageCache.get(url);
        }
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(url, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    },
    
    clearCache() {
        this.imageCache.clear();
    }
};

// Sistema de eventos optimizado
const EventBus = {
    events: {},
    
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    },
    
    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName]
                .filter(cb => cb !== callback);
        }
    },
    
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                callback(data);
            });
        }
    }
};

// Gestión de estado
const StateManager = {
    state: {
        currentSpread: null,
        currentCards: [],
        searchTerm: '',
        activeFilters: new Set(['all']),
        history: []
    },
    
    listeners: new Set(),
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    },
    
    getState() {
        return { ...this.state };
    },
    
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    },
    
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
};

// Utilidades
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    async generatePDF(spread, cards) {
        // Esta función se ha movido a main.js
        console.warn('generatePDF en core.js está deprecado. Use la función en main.js');
        return null;
    }
};

// Exportar módulos
export {
    ResourceManager,
    EventBus,
    StateManager,
    Utils
};