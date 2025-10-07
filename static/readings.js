// Sistema de guardado de lecturas
const ReadingsStorage = {
    STORAGE_KEY: 'tarot_readings_history',
    logger: Logger.getContextLogger('ReadingsStorage'),
    
    getAllReadings() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        this.logger.debug('Recuperando lecturas', { stored });
        return stored ? JSON.parse(stored) : [];
    },

    saveReading(reading) {
        this.logger.info('Guardando lectura', reading);
        const readings = this.getAllReadings();
        const newReading = {
            ...reading,
            id: Date.now(),
            date: new Date().toISOString(),
        };
        readings.push(newReading);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(readings));
        return newReading;
    },

    deleteReading(readingId) {
        this.logger.info('Eliminando lectura', { readingId });
        const readings = this.getAllReadings();
        const filtered = readings.filter(r => r.id !== readingId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    },

    exportToJSON() {
        this.logger.info('Exportando a JSON');
        const readings = this.getAllReadings();
        const blob = new Blob([JSON.stringify(readings, null, 2)], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }
};

const ReadingsHistory = {
    logger: Logger.getContextLogger('ReadingsHistory'),

    init() {
        this.logger.info('Inicializando sistema de lecturas');
        const initialized = this.setupHistoryPanel() && this.setupHistoryButton() && this.bindEvents();
        this.logger.debug('Estado de inicialización', { initialized });
        return initialized;
    },

    setupHistoryButton() {
        this.logger.info('Configurando botón de historial');
        try {
            const toggleBtn = document.getElementById('toggleHistory');
            if (!toggleBtn) {
                this.logger.error('Botón de historial no encontrado');
                return false;
            }

            toggleBtn.addEventListener('click', () => {
                try {
                    const panel = document.getElementById('readingsHistory');
                    if (!panel) {
                        this.setupHistoryPanel();
                    }
                    
                    const updatedPanel = document.getElementById('readingsHistory');
                    if (!updatedPanel) {
                        throw new Error('Panel de historial no encontrado');
                    }

                    if (updatedPanel.classList.contains('show')) {
                        this.hideHistory();
                    } else {
                        this.showHistory();
                    }
                } catch (error) {
                    this.logger.error('Error al manejar click del botón', error);
                    UI.showFeedback('Error al mostrar el historial', 'error');
                }
            });

            return true;
        } catch (error) {
            this.logger.error('Error al configurar botón de historial', error);
            UI.showFeedback('Error al configurar el botón de historial', 'error');
            return false;
        }
    },

    setupHistoryPanel() {
        this.logger.info('Configurando panel de historial');
        try {
            if (document.getElementById('readingsHistory')) {
                this.logger.debug('Panel de historial ya existe');
                return true;
            }

            const panel = document.createElement('div');
            panel.id = 'readingsHistory';
            panel.className = 'readings-history-panel';
            panel.innerHTML = `
                <div class="history-header">
                    <h2>Historial de Lecturas</h2>
                    <button id="closeHistory" class="close-btn">×</button>
                </div>
                <div class="history-controls">
                    <input type="text" class="history-search" id="historySearch" placeholder="Buscar en el historial...">
                    <button id="exportAllJSON" class="history-btn">
                        <span class="btn-icon">📥</span> Exportar (JSON)
                    </button>
                    <button id="exportSelectedPDF" class="history-btn">
                        <span class="btn-icon">📄</span> Exportar Selección (PDF)
                    </button>
                </div>
                <div class="readings-list"></div>
            `;
            document.body.appendChild(panel);
            this.logger.debug('Panel de historial creado');
            return true;
        } catch (error) {
            this.logger.error('Error al configurar panel de historial', error);
            UI.showFeedback('Error al crear el panel de historial', 'error');
            ErrorPanel.log('Error al crear el panel de historial: ' + error.message);
            return false;
        }
    },

    bindEvents() {
        this.logger.info('Vinculando eventos del panel de historial');
        try {
            const historyPanel = document.getElementById('readingsHistory');
            if (!historyPanel) {
                throw new Error('Panel de historial no encontrado');
            }

            const closeBtn = historyPanel.querySelector('#closeHistory');
            const exportJSONBtn = historyPanel.querySelector('#exportAllJSON');
            const exportPDFBtn = historyPanel.querySelector('#exportSelectedPDF');
            const searchInput = historyPanel.querySelector('#historySearch');

            // Validar elementos
            if (!closeBtn || !exportJSONBtn || !exportPDFBtn || !searchInput) {
                throw new Error('Elementos requeridos no encontrados');
            }

            closeBtn.addEventListener('click', () => this.hideHistory());
            exportJSONBtn.addEventListener('click', () => this.exportAllToJSON());
            exportPDFBtn.addEventListener('click', () => this.exportSelectedToPDF());

            // Búsqueda con debounce
            let searchTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => this.filterReadings(e.target.value), 300);
            });

            // Delegación para botones de acción
            historyPanel.addEventListener('click', (e) => {
                const btn = e.target.closest('.action-btn');
                if (!btn) return;

                const readingId = Number(btn.dataset.readingId);
                if (!readingId) return;

                if (btn.classList.contains('export-pdf-btn')) {
                    this.exportReadingToPDF(readingId);
                } else if (btn.classList.contains('delete-btn')) {
                    this.deleteReading(readingId);
                }
            });

            this.logger.debug('Eventos vinculados correctamente');
            return true;
        } catch (error) {
            this.logger.error('Error al vincular eventos', error);
            UI.showFeedback('Error al configurar el panel de historial', 'error');
            return false;
        }
    },

    showHistory() {
        const panel = document.getElementById('readingsHistory');
        if (!panel) return;
        
        requestAnimationFrame(() => {
            panel.style.display = 'flex';
            requestAnimationFrame(() => {
                panel.classList.add('show');
                this.updateReadingsList();
            });
        });
    },

    hideHistory() {
        const panel = document.getElementById('readingsHistory');
        if (!panel) return;
        
        panel.classList.remove('show');
        panel.addEventListener('transitionend', function handler() {
            panel.style.display = 'none';
            panel.removeEventListener('transitionend', handler);
        });
    },

    updateReadingsList() {
        const readings = ReadingsStorage.getAllReadings();
        const list = document.querySelector('.readings-list');
        if (!list) return;

        if (readings.length === 0) {
            list.innerHTML = '<div class="no-readings">No hay lecturas guardadas</div>';
            return;
        }

        list.innerHTML = readings.map(reading => this.generateReadingItemHTML(reading)).join('');
    },

    generateReadingItemHTML(reading) {
        return `
            <div class="reading-item" data-id="${reading.id}">
                <div class="reading-info">
                    <div class="reading-header">
                        <div class="reading-date">
                            <span class="icon">📅</span>
                            ${new Date(reading.date).toLocaleString()}
                        </div>
                        <div class="reading-type">
                            <span class="icon">🎴</span>
                            ${reading.spreadType}
                        </div>
                    </div>
                    <div class="reading-cards">
                        ${reading.cards.map(card => `
                            <div class="reading-card">
                                <div class="card-name">
                                    <span class="icon">✨</span>
                                    ${card.name}
                                </div>
                                <div class="card-position">${card.position}</div>
                                <div class="card-meaning-preview">
                                    ${card.meaning.substring(0, 100)}...
                                    <button class="show-more-btn">Ver más</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="reading-actions">
                    <button class="action-btn export-pdf-btn" title="Exportar a PDF" data-reading-id="${reading.id}">
                        📄
                    </button>
                    <button class="action-btn delete-btn" title="Eliminar lectura" data-reading-id="${reading.id}">
                        ❌
                    </button>
                </div>
            </div>
        `;
    },

    filterReadings(searchTerm) {
        const readings = ReadingsStorage.getAllReadings();
        const filtered = readings.filter(reading => {
            const searchText = searchTerm.toLowerCase();
            if (reading.spreadType.toLowerCase().includes(searchText)) return true;
            return reading.cards.some(card => 
                card.name.toLowerCase().includes(searchText) ||
                card.meaning.toLowerCase().includes(searchText) ||
                (card.position && card.position.toLowerCase().includes(searchText))
            );
        });
        
        this.renderReadings(filtered);
    },

    renderReadings(readings) {
        const list = document.querySelector('.readings-list');
        if (!list) return;

        if (readings.length === 0) {
            list.innerHTML = '<div class="no-readings">No se encontraron lecturas</div>';
            return;
        }

        list.innerHTML = readings.map(reading => this.generateReadingItemHTML(reading)).join('');
    },

    exportAllToJSON() {
        this.logger.info('Exportando todas las lecturas a JSON');
        try {
            const url = ReadingsStorage.exportToJSON();
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lecturas-tarot.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            UI.showFeedback('Lecturas exportadas correctamente', 'success');
        } catch (error) {
            this.logger.error('Error al exportar a JSON', error);
            UI.showFeedback('Error al exportar las lecturas', 'error');
        }
    },

    async getImageAsBase64(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('No se pudo cargar la imagen');
            
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            this.logger.error('Error al convertir imagen a base64', { url, error });
            throw error;
        }
    },

    async generatePDFContent(reading) {
        try {
            // Convertir todas las imágenes a base64 en paralelo
            const processedCards = await Promise.all(reading.cards.map(async card => {
                const imagePath = this.getFullImagePath(card.name);
                try {
                    const base64Image = await this.getImageAsBase64(imagePath);
                    return { ...card, imageData: base64Image };
                } catch (error) {
                    this.logger.warn('Error al procesar imagen', { card: card.name, error });
                    // Usar imagen de respaldo
                    const backupImage = await this.getImageAsBase64(window.location.origin + '/cards/img/cover.jpg');
                    return { ...card, imageData: backupImage };
                }
            }));

            // Crear el contenedor del PDF
            const container = document.createElement('div');
            container.style.visibility = 'hidden';
            container.style.position = 'absolute';
            container.style.zIndex = '-1000';

            // Añadir estilos
            container.innerHTML = `
                <style>
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                    .pdf-container {
                        font-family: Arial, sans-serif;
                        max-width: 210mm;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .pdf-header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 20px;
                    }
                    .cards-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    .card-container {
                        border: 1px solid #000;
                        padding: 15px;
                        text-align: center;
                        background: #fff;
                        page-break-inside: avoid;
                    }
                    .card-image {
                        width: 200px;
                        height: 300px;
                        object-fit: contain;
                        margin: 0 auto 15px;
                        border: 1px solid #ccc;
                    }
                    .card-name {
                        font-size: 18px;
                        font-weight: bold;
                        margin: 10px 0;
                    }
                    .card-position {
                        font-style: italic;
                        color: #666;
                        margin: 5px 0;
                    }
                    .card-meaning {
                        text-align: justify;
                        line-height: 1.5;
                        margin-top: 10px;
                        font-size: 14px;
                    }
                </style>
                <div class="pdf-container">
                    <div class="pdf-header">
                        <h1>${reading.spreadType}</h1>
                        <p>${new Date(reading.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    <div class="cards-grid">
                        ${processedCards.map(card => `
                            <div class="card-container">
                                <img class="card-image" 
                                     src="${card.imageData}" 
                                     alt="${card.name}"
                                     ${card.reversed ? 'style="transform: rotate(180deg)"' : ''}>
                                <div class="card-name">${card.name}</div>
                                <div class="card-position">${card.position}</div>
                                <div class="card-meaning">${card.meaning}</div>
                                ${card.posMeaning ? `
                                    <div class="card-meaning">${card.posMeaning}</div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ${reading.summary ? `
                        <div class="pdf-summary">
                            <h2>Resumen de la Lectura</h2>
                            <div>${reading.summary}</div>
                        </div>
                    ` : ''}
                </div>
            `;

            return container;
        } catch (error) {
            this.logger.error('Error al generar contenido del PDF', error);
            throw error;
        }
    },

    getFullImagePath(cardName) {
        // Convertir el nombre de la carta a su nombre de archivo
        const cardNameMap = {
            'El Loco': 'maj00',
            'El Mago': 'maj01',
            'La Sacerdotisa': 'maj02',
            'La Emperatriz': 'maj03',
            'El Emperador': 'maj04',
            'El Hierofante': 'maj05',
            'Los Enamorados': 'maj06',
            'El Carro': 'maj07',
            'La Fuerza': 'maj08',
            'El Ermitaño': 'maj09',
            'La Rueda de la Fortuna': 'maj10',
            'La Justicia': 'maj11',
            'El Colgado': 'maj12',
            'La Muerte': 'maj13',
            'La Templanza': 'maj14',
            'El Diablo': 'maj15',
            'La Torre': 'maj16',
            'La Estrella': 'maj17',
            'La Luna': 'maj18',
            'El Sol': 'maj19',
            'El Juicio': 'maj20',
            'El Mundo': 'maj21'
        };
        
        const suitMap = {
            'Bastos': 'wands',
            'Copas': 'cups',
            'Espadas': 'swords',
            'Oros': 'pents'
        };

        try {
            // Obtener la ruta base absoluta
            const baseUrl = window.location.origin;
            const basePath = baseUrl + '/cards/img/big/';
            const cleanName = cardName.replace(/\s*\(Invertida\)$/, '');

            if (cleanName.startsWith('El ') || cleanName.startsWith('La ') || cleanName.startsWith('Los ')) {
                // Arcano mayor
                const fileCode = cardNameMap[cleanName] || 
                               'maj' + cleanName.match(/\d+/)?.[0]?.padStart(2, '0');
                return basePath + fileCode + '.jpg';
            } else {
                // Arcano menor
                const [number, , suit] = cleanName.split(' ');
                const suitCode = suitMap[suit];
                if (!suitCode) throw new Error(`Palo no reconocido: ${suit}`);

                const numberMap = {
                    'As': '01', 'Dos': '02', 'Tres': '03', 'Cuatro': '04',
                    'Cinco': '05', 'Seis': '06', 'Siete': '07', 'Ocho': '08',
                    'Nueve': '09', 'Diez': '10', 'Sota': '11',
                    'Caballero': '12', 'Reina': '13', 'Rey': '14'
                };

                const numCode = numberMap[number];
                if (!numCode) throw new Error(`Número no reconocido: ${number}`);

                return basePath + suitCode + numCode + '.jpg';
            }
        } catch (error) {
            this.logger.error('Error al generar ruta de imagen', { cardName, error });
            return window.location.origin + '/cards/img/cover.jpg';
        }
    },

    async exportReadingToPDF(readingId) {
        this.logger.info('Iniciando exportación a PDF', { readingId });
        
        try {
            const reading = ReadingsStorage.getAllReadings().find(r => r.id === readingId);
            if (!reading) throw new Error('Lectura no encontrada');

            UI.showFeedback('Generando PDF...', 'info');

            const pdfContainer = await this.generatePDFContent(reading);
            document.body.appendChild(pdfContainer);

            // Esperar a que las imágenes se carguen
            await Promise.all(
                Array.from(pdfContainer.getElementsByTagName('img'))
                    .map(img => new Promise(resolve => {
                        if (img.complete) resolve();
                        else {
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                        }
                    }))
            );

            // Configurar opciones del PDF
            const opt = {
                margin: [10, 10],
                filename: `lectura-tarot-${reading.id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    scrollY: -window.scrollY,
                    logging: false,
                    allowTaint: true,
                    imageTimeout: 0,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                }
            };

            // Generar el PDF
            await html2pdf().set(opt).from(pdfContainer).save();
            document.body.removeChild(pdfContainer);
            
            UI.showFeedback('PDF generado con éxito', 'success');
        } catch (error) {
            this.logger.error('Error al generar PDF', error);
            UI.showFeedback(
                error.message === 'Lectura no encontrada'
                    ? 'No se encontró la lectura'
                    : 'Error al generar el PDF',
                'error'
            );
        }
    },

    async exportSelectedToPDF() {
        this.logger.info('Iniciando exportación múltiple a PDF');
        
        const readings = ReadingsStorage.getAllReadings();
        if (readings.length === 0) {
            UI.showFeedback('No hay lecturas para exportar', 'info');
            return;
        }

        try {
            UI.showFeedback('Preparando PDF...', 'info');

            // Generar contenedor principal
            const mainContainer = document.createElement('div');
            mainContainer.style.visibility = 'hidden';
            mainContainer.style.position = 'absolute';
            mainContainer.style.zIndex = '-1000';

            // Añadir estilos globales
            mainContainer.innerHTML = `
                <style>
                    @media print {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                    .pdf-collection {
                        font-family: Arial, sans-serif;
                        max-width: 210mm;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .collection-header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #000;
                    }
                    .reading-entry {
                        margin-bottom: 40px;
                        page-break-before: always;
                    }
                    .reading-entry:first-child {
                        page-break-before: avoid;
                    }
                </style>
                <div class="pdf-collection">
                    <div class="collection-header">
                        <h1>Historial de Lecturas de Tarot</h1>
                        <p>Generado el ${new Date().toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>
                </div>
            `;

            const collection = mainContainer.querySelector('.pdf-collection');

            // Procesar cada lectura
            for (const reading of readings) {
                const readingContainer = await this.generatePDFContent(reading);
                const readingContent = readingContainer.querySelector('.pdf-container');
                readingContent.classList.add('reading-entry');
                collection.appendChild(readingContent);
            }

            // Añadir al documento y esperar imágenes
            document.body.appendChild(mainContainer);
            await Promise.all(
                Array.from(mainContainer.getElementsByTagName('img'))
                    .map(img => new Promise(resolve => {
                        if (img.complete) resolve();
                        else {
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                        }
                    }))
            );

            // Configurar opciones del PDF
            const opt = {
                margin: [10, 10],
                filename: 'lecturas-tarot.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    scrollY: -window.scrollY,
                    logging: false,
                    allowTaint: true,
                    imageTimeout: 0,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                }
            };

            // Generar PDF
            await html2pdf().set(opt).from(mainContainer).save();
            document.body.removeChild(mainContainer);
            
            UI.showFeedback('PDF generado con éxito', 'success');
        } catch (error) {
            this.logger.error('Error al generar PDF múltiple', error);
            UI.showFeedback('Error al generar el PDF', 'error');
        }
    }
};

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    ReadingsHistory.init();
});