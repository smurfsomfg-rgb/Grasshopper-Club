const generatePDF = async (reading) => {
    // Crear el contenedor
    const element = document.createElement('div');
    element.style.cssText = 'font-family: Arial, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20px; background: white;';

    // Crear el encabezado
    const header = document.createElement('div');
    header.style.cssText = 'text-align: center; margin-bottom: 30px; padding: 20px; border-bottom: 2px solid black;';
    
    const title = document.createElement('h1');
    title.style.cssText = 'font-size: 24px; margin: 0 0 10px 0;';
    title.textContent = reading.spreadType;
    header.appendChild(title);

    const date = document.createElement('p');
    date.style.cssText = 'margin: 0; color: #333;';
    date.textContent = 'Realizada el ' + new Date(reading.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    header.appendChild(date);
    element.appendChild(header);

    // Crear la tabla de cartas
    const table = document.createElement('table');
    table.style.cssText = 'width: 100%; border-collapse: collapse;';
    let currentRow = null;

    // Agregar las cartas a la tabla
    reading.cards.forEach((card, index) => {
        if (index % 2 === 0) {
            currentRow = document.createElement('tr');
            table.appendChild(currentRow);
        }

        const cell = document.createElement('td');
        cell.style.cssText = 'width: 50%; padding: 15px; vertical-align: top;';

        const cardDiv = document.createElement('div');
        cardDiv.style.cssText = 'border: 1px solid #ccc; padding: 15px; text-align: center;';

        // Crear la imagen
        const img = document.createElement('img');
        img.style.cssText = 'width: 200px; height: 300px; object-fit: contain; display: block; margin: 0 auto 15px auto;';
        img.src = card.image || card.imagePath || 'cards/cover.jpg';
        img.alt = card.name;
        cardDiv.appendChild(img);

        // Crear el nombre de la carta
        const cardName = document.createElement('h2');
        cardName.style.cssText = 'font-size: 18px; margin: 10px 0;';
        cardName.textContent = card.name;
        cardDiv.appendChild(cardName);

        // Crear la posición
        const position = document.createElement('p');
        position.style.cssText = 'font-style: italic; margin: 10px 0; color: #333;';
        position.textContent = card.position;
        cardDiv.appendChild(position);

        // Crear el significado
        const meaning = document.createElement('div');
        meaning.style.cssText = 'text-align: justify; line-height: 1.5; margin-top: 15px;';
        meaning.textContent = card.meaning;
        cardDiv.appendChild(meaning);

        cell.appendChild(cardDiv);
        currentRow.appendChild(cell);
    });

    element.appendChild(table);
    document.body.appendChild(element);

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
            imageTimeout: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };

    try {
        // Generar el PDF
        await html2pdf().set(opt).from(element).save();
        return true;
    } finally {
        // Limpiar
        document.body.removeChild(element);
    }
};

const generateMultipleReadingsPDF = async (readings) => {
    // Crear el contenedor principal
    const container = document.createElement('div');
    container.style.cssText = 'font-family: Arial, sans-serif; max-width: 210mm; margin: 0 auto;';

    // Crear el encabezado general
    const mainHeader = document.createElement('div');
    mainHeader.style.cssText = 'text-align: center; margin-bottom: 40px; padding: 20px;';
    
    const mainTitle = document.createElement('h1');
    mainTitle.style.cssText = 'font-size: 28px; margin: 0 0 10px 0;';
    mainTitle.textContent = 'Historial de Lecturas de Tarot';
    mainHeader.appendChild(mainTitle);

    const timestamp = document.createElement('p');
    timestamp.style.cssText = 'margin: 0; color: #333;';
    timestamp.textContent = `Generado el ${new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}`;
    mainHeader.appendChild(timestamp);
    container.appendChild(mainHeader);

    // Agregar cada lectura
    readings.forEach((reading, index) => {
        const readingDiv = document.createElement('div');
        readingDiv.style.cssText = `
            margin-bottom: 40px;
            padding: 20px;
            page-break-before: ${index > 0 ? 'always' : 'auto'};
            background: white;
        `;

        // Encabezado de la lectura
        const readingHeader = document.createElement('div');
        readingHeader.style.cssText = 'text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #333;';
        
        const readingTitle = document.createElement('h2');
        readingTitle.style.cssText = 'font-size: 24px; margin: 0 0 10px 0;';
        readingTitle.textContent = reading.spreadType;
        readingHeader.appendChild(readingTitle);

        const readingDate = document.createElement('p');
        readingDate.style.cssText = 'margin: 0; color: #333; font-style: italic;';
        readingDate.textContent = `Realizada el ${new Date(reading.date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
        readingHeader.appendChild(readingDate);
        readingDiv.appendChild(readingHeader);

        // Lista de cartas
        const cardsList = document.createElement('div');
        cardsList.style.cssText = 'display: flex; flex-direction: column; gap: 20px;';

        reading.cards.forEach(card => {
            const cardEntry = document.createElement('div');
            cardEntry.style.cssText = 'padding: 15px; border: 1px solid #ccc; margin-bottom: 10px;';

            const cardName = document.createElement('h3');
            cardName.style.cssText = 'font-size: 18px; margin: 0 0 10px 0;';
            cardName.textContent = card.name;
            cardEntry.appendChild(cardName);

            const cardPosition = document.createElement('p');
            cardPosition.style.cssText = 'font-style: italic; margin: 0 0 10px 0; color: #333;';
            cardPosition.textContent = card.position;
            cardEntry.appendChild(cardPosition);

            const cardMeaning = document.createElement('p');
            cardMeaning.style.cssText = 'text-align: justify; line-height: 1.5; margin: 0;';
            cardMeaning.textContent = card.meaning;
            cardEntry.appendChild(cardMeaning);

            cardsList.appendChild(cardEntry);
        });

        readingDiv.appendChild(cardsList);
        container.appendChild(readingDiv);
    });

    document.body.appendChild(container);

    // Configurar opciones del PDF
    const opt = {
        margin: [15, 15],
        filename: 'lecturas-tarot.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            scrollY: -window.scrollY,
            logging: false,
            allowTaint: true,
            imageTimeout: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };

    try {
        // Generar el PDF
        await html2pdf().set(opt).from(container).save();
        return true;
    } finally {
        // Limpiar
        document.body.removeChild(container);
    }
};

// Exportar las funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generatePDF, generateMultipleReadingsPDF };
} else {
    window.TarotPDF = { generatePDF, generateMultipleReadingsPDF };
}