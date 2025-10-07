class PDFGenerator {
    static getStyles() {
        return {
            '*': { '-webkit-print-color-adjust': 'exact !important', 'print-color-adjust': 'exact !important' },
            '.reading-export': { fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', color: '#000000', padding: '20px', maxWidth: '210mm', margin: '0 auto' },
            '.reading-header': { textAlign: 'center', marginBottom: '30px', padding: '20px', borderBottom: '2px solid #000000' },
            '.reading-header h1': { fontSize: '24px', margin: '0 0 10px 0', color: '#000000' },
            '.reading-header p': { fontSize: '14px', margin: '0', color: '#333333' },
            '.cards-grid': { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '30px' },
            '.card-entry': { width: '45%', backgroundColor: '#ffffff', border: '1px solid #000000', padding: '15px', marginBottom: '20px', pageBreakInside: 'avoid' },
            '.card-image': { width: '200px', height: '300px', objectFit: 'contain', display: 'block', margin: '0 auto 15px auto', border: '1px solid #cccccc' },
            '.card-name': { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#000000', textAlign: 'center' },
            '.card-position': { fontStyle: 'italic', marginBottom: '10px', color: '#333333', textAlign: 'center' },
            '.card-meaning': { textAlign: 'justify', lineHeight: '1.5', color: '#000000', fontSize: '14px', margin: '0 10px' }
        };
    }

    static generateStyleSheet(styles) {
        return Object.entries(styles)
            .map(([selector, rules]) => 
                `${selector} { ${Object.entries(rules)
                    .map(([prop, value]) => `${prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value};`)
                    .join(' ')} }`
            ).join('\n');
    }

    static generateHTML(reading) {
        return `
            <div class="reading-export">
                <style>${this.generateStyleSheet(this.getStyles())}</style>
                <div class="reading-header">
                    <h1>${reading.spreadType}</h1>
                    <p>Realizada el ${new Date(reading.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                </div>
                <div class="cards-grid">
                    ${reading.cards.map(card => `
                        <div class="card-entry">
                            <img class="card-image" 
                                 src="${card.image || card.imagePath || ''}" 
                                 alt="${card.name}">
                            <h2 class="card-name">${card.name}</h2>
                            <p class="card-position">${card.position}</p>
                            <div class="card-meaning">${card.meaning}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static async generatePDF(reading) {
        const container = document.getElementById('pdfExportContainer');
        if (!container) {
            throw new Error('No se encontró el contenedor para el PDF');
        }

        try {
            // Preparar el contenedor
            container.style.visibility = 'hidden';
            container.style.position = 'absolute';
            container.style.zIndex = '-1000';
            container.innerHTML = this.generateHTML(reading);

            // Convertir imágenes a base64 antes de generar el PDF
            const images = Array.from(container.getElementsByTagName('img'));
            await Promise.all(images.map(async img => {
                try {
                    // Asegurarnos de que la ruta de la imagen sea absoluta
                    const imgPath = img.src.startsWith('http') ? img.src : 
                                  new URL(img.src, window.location.href).href;

                    // Cargar la imagen y convertirla a base64
                    const response = await fetch(imgPath);
                    const blob = await response.blob();
                    const base64 = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                    img.src = base64;
                } catch (error) {
                    console.error('Error al cargar imagen:', error);
                    // Si falla la carga, usar una imagen de respaldo
                    img.src = 'cards/img/cover.jpg';
                }
            }));

            const options = {
                margin: [10, 10],
                filename: `lectura-tarot-${reading.id || Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    scrollY: -window.scrollY,
                    logging: true, // Activar logs para depuración
                    allowTaint: true,
                    imageTimeout: 15000, // Aumentar timeout
                    onclone: function(clonedDoc) {
                        // Asegurarnos de que las imágenes sean visibles en el clon
                        const clonedImages = clonedDoc.getElementsByTagName('img');
                        Array.from(clonedImages).forEach(img => {
                            img.style.display = 'block';
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                        });
                    }
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                }
            };

            // Esperar a que todas las imágenes se carguen
            await Promise.all(images.map(img => new Promise((resolve, reject) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error(`Error al cargar: ${img.src}`));
                    // Establecer un timeout por si la imagen nunca carga
                    setTimeout(() => reject(new Error('Timeout al cargar imagen')), 15000);
                }
            })))
            .catch(error => {
                console.error('Error al cargar imágenes:', error);
                throw new Error('Error al cargar las imágenes de las cartas');
            });

            // Generar el PDF
            await html2pdf().set(options).from(container).save();
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw new Error('Hubo un error al generar el PDF');
        } finally {
            // Limpiar el contenedor
            container.style.visibility = '';
            container.style.position = '';
            container.style.zIndex = '';
            container.innerHTML = '';
        }
    }
}