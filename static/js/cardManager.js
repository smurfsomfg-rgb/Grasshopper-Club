import { ResourceManager, EventBus, StateManager } from './core.js';

class CardManager {
    constructor() {
        this.cards = new Map();
        this.loadingPromise = null;
    }
    
    async initializeCards() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        
        this.loadingPromise = new Promise(async (resolve) => {
            try {
                // Cargar definiciones de cartas
                const cardDefinitions = await this.loadCardDefinitions();
                
                // Precarga de imágenes más comunes
                const commonCards = this.getCommonCards(cardDefinitions);
                await this.preloadImages(commonCards);
                
                // Inicializar cache
                cardDefinitions.forEach(card => {
                    this.cards.set(card.id, {
                        ...card,
                        element: this.createCardElement(card)
                    });
                });
                
                resolve(true);
            } catch (error) {
                console.error('Error initializing cards:', error);
                resolve(false);
            }
        });
        
        return this.loadingPromise;
    }
    
    async loadCardDefinitions() {
        // Implementar carga de definiciones desde módulo separado
        return [];
    }
    
    getCommonCards(cards, limit = 10) {
        // Identificar las cartas más comúnmente usadas
        return cards.slice(0, limit);
    }
    
    async preloadImages(cards) {
        const preloadPromises = cards.map(card => 
            ResourceManager.loadImage(card.imageUrl)
        );
        
        return Promise.all(preloadPromises);
    }
    
    createCardElement(card) {
        const element = document.createElement('div');
        element.className = 'card';
        element.dataset.cardId = card.id;
        
        // Implementar creación del elemento visual
        
        return element;
    }
    
    async drawCards(number) {
        const state = StateManager.getState();
        const availableCards = [...this.cards.values()];
        const drawnCards = [];
        
        while (drawnCards.length < number && availableCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const card = availableCards.splice(randomIndex, 1)[0];
            drawnCards.push(card);
        }
        
        // Actualizar estado
        StateManager.setState({
            currentCards: drawnCards
        });
        
        // Notificar a través del bus de eventos
        EventBus.emit('cardsDrawn', drawnCards);
        
        return drawnCards;
    }
    
    async revealCard(cardId) {
        const card = this.cards.get(cardId);
        if (!card) return;
        
        try {
            // Asegurar que la imagen está cargada
            await ResourceManager.loadImage(card.imageUrl);
            
            // Animar revelación
            card.element.classList.add('revealing');
            
            // Notificar
            EventBus.emit('cardRevealed', card);
        } catch (error) {
            console.error('Error revealing card:', error);
        }
    }
}

export const cardManager = new CardManager();