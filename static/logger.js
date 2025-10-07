// Sistema de logging mejorado
// Asegurar que el Logger está disponible globalmente desde el inicio
window.Logger = {
    levels: {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    },

    colors: {
        DEBUG: '#7f7f7f',  // Gris
        INFO: '#2196F3',   // Azul
        WARN: '#FF9800',   // Naranja
        ERROR: '#F44336'   // Rojo
    },

    currentLevel: 0, // DEBUG por defecto

    formatMessage(level, context, message, data) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}] ${context}:`;
        
        // Estilo para el prefijo
        const style = `color: ${this.colors[level]}; font-weight: bold;`;
        
        if (data) {
            console.groupCollapsed(`%c${prefix} ${message}`, style);
            if (data instanceof Error) {
                console.error(data);
                if (data.stack) {
                    console.log('Stack trace:', data.stack);
                }
            } else {
                console.dir(data);
            }
            console.groupEnd();
        } else {
            console.log(`%c${prefix} ${message}`, style);
        }
    },

    debug(context, message, data) {
        if (this.currentLevel <= this.levels.DEBUG) {
            this.formatMessage('DEBUG', context, message, data);
        }
    },

    info(context, message, data) {
        if (this.currentLevel <= this.levels.INFO) {
            this.formatMessage('INFO', context, message, data);
        }
    },

    warn(context, message, data) {
        if (this.currentLevel <= this.levels.WARN) {
            this.formatMessage('WARN', context, message, data);
        }
    },

    error(context, message, data) {
        if (this.currentLevel <= this.levels.ERROR) {
            this.formatMessage('ERROR', context, message, data);
            // Añadir el error a un registro visible en la UI si existe
            if (typeof UI !== 'undefined' && UI.showFeedback) {
                UI.showFeedback(message, 'error');
            }
        }
    },

    setLevel(level) {
        if (this.levels.hasOwnProperty(level)) {
            this.currentLevel = this.levels[level];
            this.info('Logger', `Nivel de log establecido a: ${level}`);
        }
    },

    // Método para crear un logger específico para un contexto
    getContextLogger(context) {
        return {
            debug: (message, data) => this.debug(context, message, data),
            info: (message, data) => this.info(context, message, data),
            warn: (message, data) => this.warn(context, message, data),
            error: (message, data) => this.error(context, message, data)
        };
    }
};

// Crear un log visual en la UI para errores críticos
window.ErrorPanel = {
    init() {
        if (!document.getElementById('error-panel')) {
            const panel = document.createElement('div');
            panel.id = 'error-panel';
            panel.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                max-width: 400px;
                max-height: 300px;
                overflow-y: auto;
                background: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                z-index: 9999;
                display: none;
            `;
            
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 8px;
                background: #f5f5f5;
                border-bottom: 1px solid #ccc;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            header.innerHTML = `
                <span>Log de Errores</span>
                <button onclick="ErrorPanel.toggle()" style="border: none; background: none; cursor: pointer;">
                    🔄
                </button>
            `;
            
            const content = document.createElement('div');
            content.id = 'error-panel-content';
            content.style.cssText = `
                padding: 8px;
                font-family: monospace;
                font-size: 12px;
            `;
            
            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);
        }
    },

    toggle() {
        const panel = document.getElementById('error-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    },

    log(message, level = 'error') {
        const content = document.getElementById('error-panel-content');
        if (content) {
            const entry = document.createElement('div');
            entry.className = `log-entry log-${level}`;
            entry.innerHTML = `
                <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
                <span class="log-message">${message}</span>
            `;
            content.appendChild(entry);
            content.scrollTop = content.scrollHeight;
            
            // Mostrar el panel
            const panel = document.getElementById('error-panel');
            if (panel) {
                panel.style.display = 'block';
            }
        }
    }
};

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    ErrorPanel.init();
});

// Añadir estilos para el panel de errores
const style = document.createElement('style');
style.textContent = `
    .log-entry {
        margin: 4px 0;
        padding: 4px;
        border-radius: 2px;
    }
    .log-error {
        background-color: #ffebee;
        color: #c62828;
    }
    .log-warn {
        background-color: #fff3e0;
        color: #ef6c00;
    }
    .log-info {
        background-color: #e3f2fd;
        color: #1565c0;
    }
    .log-time {
        color: #666;
        margin-right: 8px;
    }
`;
document.head.appendChild(style);