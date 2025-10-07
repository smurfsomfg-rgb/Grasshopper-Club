// Sistema de Runas
const RuneSystem = {
    // Definiciones de runas y sus significados
    Runes: {
        "fehu": {
            name: "Fehu",
            meaning: "Ganado, Riqueza",
            description: "Prosperidad, ganancias, éxito material",
            upright: "Éxito, abundancia, nuevas oportunidades",
            reversed: "Pérdida material, estancamiento, fracaso"
        },
        "uruz": {
            name: "Uruz",
            meaning: "Uro, Fuerza",
            description: "Fuerza física y mental, perseverancia",
            upright: "Fuerza, coraje, determinación",
            reversed: "Debilidad, cobardía, falta de motivación"
        }
        // Añadir más runas aquí
    },

    // Tipos de tiradas
    Spreads: {
        "single": {
            name: "Runa Simple",
            description: "Una runa para respuesta directa",
            positions: [{
                pos: "Respuesta",
                meaning: "La respuesta a tu pregunta"
            }]
        },
        "three_runes": {
            name: "Tirada de Tres Runas",
            description: "Pasado, Presente y Futuro",
            positions: [
                {
                    pos: "Pasado",
                    meaning: "Influencias del pasado"
                },
                {
                    pos: "Presente",
                    meaning: "Situación actual"
                },
                {
                    pos: "Futuro",
                    meaning: "Tendencias futuras"
                }
            ]
        }
    },

    // Inicialización del sistema
    init() {
        this.bindEvents();
        this.setupControls();
        Logger.info('RuneSystem initialized');
    },

    // Configurar controles de UI
    setupControls() {
        const controls = `
            <div class="rune-controls">
                <button id="drawRune" class="control-btn glow-effect">Tirar Runa</button>
                <button id="clearRunes" class="control-btn">Limpiar</button>
            </div>
        `;
        document.querySelector('.card').insertAdjacentHTML('beforeend', controls);
    },

    // Vincular eventos
    bindEvents() {
        document.getElementById('drawRune')?.addEventListener('click', () => this.drawRune());
        document.getElementById('clearRunes')?.addEventListener('click', () => this.clearRunes());
    },

    // Tirar una runa
    drawRune() {
        const runes = Object.keys(this.Runes);
        const selectedRune = runes[Math.floor(Math.random() * runes.length)];
        const isReversed = Math.random() > 0.5;
        
        this.displayRune(selectedRune, isReversed);
    },

    // Mostrar runa
    displayRune(runeName, isReversed) {
        const rune = this.Runes[runeName];
        const reading = {
            rune: runeName,
            isReversed,
            meaning: isReversed ? rune.reversed : rune.upright,
            timestamp: new Date().toISOString()
        };

        // Guardar lectura
        ReadingsStorage.saveReading(reading);
        
        // Mostrar en UI
        this.updateUI(reading);
    },

    // Actualizar interfaz
    updateUI(reading) {
        // Implementar visualización de la runa
    },

    // Limpiar tirada
    clearRunes() {
        document.querySelector('.rune-display')?.innerHTML = '';
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => RuneSystem.init());