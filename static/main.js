// Esperar a que todas las imágenes estén cargadas
async function waitForImagesLoaded(container) {
    const images = container.getElementsByTagName('img');
    const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
    });
    await Promise.all(promises);
}

// Convertir imagen a base64 usando canvas
async function imageToBase64(imgElement) {
    return new Promise((resolve, reject) => {
        try {
            // Si la imagen ya está en base64, retornarla directamente
            if (imgElement.src.startsWith('data:')) {
                resolve(imgElement.src);
                return;
            }

            // Crear un canvas del tamaño de la imagen
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Establecer dimensiones
            canvas.width = imgElement.naturalWidth || imgElement.width;
            canvas.height = imgElement.naturalHeight || imgElement.height;

            // Dibujar la imagen en el canvas
            ctx.drawImage(imgElement, 0, 0);

            try {
                // Intentar convertir a base64
                const base64 = canvas.toDataURL('image/jpeg', 0.95);
                resolve(base64);
            } catch (e) {
                // Si falla, cargar la imagen de respaldo
                const backupImg = new Image();
                backupImg.crossOrigin = 'Anonymous';
                backupImg.onload = function() {
                    canvas.width = backupImg.width;
                    canvas.height = backupImg.height;
                    ctx.drawImage(backupImg, 0, 0);
                    try {
                        resolve(canvas.toDataURL('image/jpeg', 0.95));
                    } catch (finalError) {
                        reject(finalError);
                    }
                };
                backupImg.onerror = reject;
                backupImg.src = window.location.origin + '/cards/img/cover.jpg';
            }
        } catch (error) {
            reject(error);
        }
    });
}

// Generar PDF de la tirada
async function guardarTiradaPDF() {
    const cardsArea = document.getElementById('cards');
    const cardElements = cardsArea ? cardsArea.querySelectorAll('.card') : [];
    
    if (!cardsArea || cardElements.length === 0) {
        UI.showFeedback('No se ha realizado ninguna tirada. Por favor, realiza una tirada antes de guardar.', 'warning');
        return;
    }

    // Obtener información de la tirada
    const spreadKey = document.getElementById('spread').value;
    const spread = TarotSpreads[spreadKey];

    // Crear contenedor temporal para el PDF
    const printContainer = document.createElement('div');
    printContainer.style.backgroundColor = 'white';
    printContainer.style.padding = '20mm';
    printContainer.style.color = 'black';
    printContainer.style.fontFamily = 'Times New Roman, serif';
    
    // Agregar título y descripción
    printContainer.innerHTML = `
        <div style="width: 100%; margin-bottom: 30px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #228B22; font-size: 24px; margin-bottom: 10px;">Tirada de Tarot</h1>
                <h2 style="color: #2C8C2C; font-size: 18px;">${spread.name}</h2>
            </div>
            <div style="background: #1a1a1a; border-radius: 10px; padding: 20px;">
                <p style="color: #3C9C3C; text-align: justify; font-size: 14px; line-height: 1.6; margin: 0;">
                    <strong>Descripción de la tirada:</strong><br>
                    ${spread.description}
                </p>
            </div>
        </div>
    `;

    // Contenedor para las cartas
    const cardsContainer = document.createElement('div');
    cardsContainer.style.display = 'flex';
    cardsContainer.style.flexDirection = 'column';
    cardsContainer.style.gap = '20px';

    // Procesar cada carta
    for (const card of cardElements) {
        const cardContainer = document.createElement('div');
        cardContainer.style.backgroundColor = '#1a1a1a';
        cardContainer.style.padding = '15px';
        cardContainer.style.borderRadius = '10px';
        cardContainer.style.marginBottom = '20px';
        cardContainer.style.display = 'flex';
        cardContainer.style.gap = '20px';

        // Obtener elementos de la carta
        const img = card.querySelector('img');
        const title = card.querySelector('.card-title');
        const pos = card.querySelector('.card-pos');
        const meaning = card.querySelector('.card-meaning');
        const posMeaning = card.querySelector('.pos-meaning');

        // Contenedor para la imagen
        const imgContainer = document.createElement('div');
        imgContainer.style.flex = '0 0 120px';
        if (img) {
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.style.width = '120px';
            newImg.style.height = 'auto';
            newImg.style.borderRadius = '5px';
            newImg.style.transform = img.style.transform; // Mantener rotación si está invertida
            newImg.crossOrigin = 'anonymous';
            imgContainer.appendChild(newImg);
        }
        cardContainer.appendChild(imgContainer);

        // Contenedor para el texto
        const textContainer = document.createElement('div');
        textContainer.style.flex = '1';
        textContainer.innerHTML = `
            <h3 style="color: #228B22; margin: 0 0 10px 0;">${title ? title.textContent : ''}</h3>
            <p style="color: #2C8C2C; margin: 0 0 10px 0;"><em>${pos ? pos.textContent : ''}</em></p>
            <p style="color: #fff; margin: 0 0 10px 0;">${meaning ? meaning.textContent : ''}</p>
            <p style="color: #fff; margin: 0;">${posMeaning ? posMeaning.textContent : ''}</p>
        `;
        cardContainer.appendChild(textContainer);
        cardsContainer.appendChild(cardContainer);
    }
    printContainer.appendChild(cardsContainer);

    // Agregar el resumen
    const summary = document.getElementById('summary');
    if (summary) {
        printContainer.innerHTML += `
            <div style="margin-top: 30px; padding: 20px; background: #1a1a1a; border-radius: 10px;">
                <h3 style="color: #2C8C2C; margin-bottom: 15px;">Resumen grupal:</h3>
                <div style="color: #fff;">${summary.innerHTML}</div>
            </div>
        `;
    }

    // Opciones para html2pdf
    const opt = {
        margin: 10,
        filename: 'tirada_tarot.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            letterRendering: true,
            backgroundColor: '#1a1a1a',
            logging: false,
            imageTimeout: 0,
            onclone: function(doc) {
                // Asegurarse de que las imágenes base64 se carguen correctamente
                Array.from(doc.images).forEach(img => {
                    img.crossOrigin = 'Anonymous';
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

    try {
        // Mostrar feedback de carga
        UI.showFeedback('Preparando PDF...', 'info');
        
        // Añadir temporalmente el contenedor al documento
        document.body.appendChild(printContainer);
        
        // Esperar a que todas las imágenes estén cargadas
        UI.showFeedback('Cargando imágenes...', 'info');
        await waitForImagesLoaded(printContainer);
        
        // Generar el PDF
        UI.showFeedback('Generando PDF...', 'info');
        const pdf = await html2pdf().set(opt).from(printContainer).outputPdf();
        
        // Crear blob y descargar
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tirada_tarot.pdf';
        a.click();
        URL.revokeObjectURL(url);
        
        // Limpiar
        document.body.removeChild(printContainer);
        
        // Mostrar mensaje de éxito
        UI.showFeedback('PDF guardado correctamente', 'success');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        UI.showFeedback('Error al generar el PDF. Por favor, inténtalo de nuevo.', 'error');
        if (document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
        }
    }
}

// Utilidad para obtener imagen en base64
function getImageData(url) {
    return new Promise((resolve, reject) => {
        let img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = function() { reject(); };
        img.src = url;
    });
}
// Lógica principal para tiradas de Tarot
// Usa TarotSpreads y TarotMeanings definidos en otros archivos
// Usa imágenes de cartas desde https://github.com/andrewnester/tarot-api-js/tree/master/cards (Rider-Waite)

const CARD_IMG_BASE = 'cards/img/big/';

function getCardImage(cardName) {
    // Arcanos Mayores
    const majorMap = [
        'El Mago','La Sacerdotisa','La Emperatriz','El Emperador','El Papa','Los Enamorados','El Carro','La Fuerza','El Ermitaño','La Rueda de la Fortuna','La Justicia','El Colgado','La Muerte','La Templanza','El Diablo','La Torre','La Estrella','La Luna','El Sol','El Juicio','El Mundo'
    ];
    const majorNames = [
        'Magician','High_Priestess','Empress','Emperor','Hierophant','Lovers','Chariot','Strength','Hermit','Wheel_of_Fortune','Justice','Hanged_Man','Death','Temperance','Devil','Tower','Star','Moon','Sun','Judgement','World'
    ];
    let file = '';
    let idx = majorMap.indexOf(cardName);
    if (idx !== -1) {
        let num = (idx+1).toString().padStart(2,'0');
        file = `maj${num}.jpg`;
        // Ya no usamos major_XX_Name.jpg porque algunos nombres faltan
    } else {
        // Arcanos Menores
        let palo = '';
        if (cardName.includes('Oros')) palo = 'pents';
        else if (cardName.includes('Copas')) palo = 'cups';
        else if (cardName.includes('Espadas')) palo = 'swords';
        else if (cardName.includes('Bastos')) palo = 'wands';
        let num = '';
        if (cardName.startsWith('As')) num = '01';
        else if (cardName.startsWith('Dos')) num = '02';
        else if (cardName.startsWith('Tres')) num = '03';
        else if (cardName.startsWith('Cuatro')) num = '04';
        else if (cardName.startsWith('Cinco')) num = '05';
        else if (cardName.startsWith('Seis')) num = '06';
        else if (cardName.startsWith('Siete')) num = '07';
        else if (cardName.startsWith('Ocho')) num = '08';
        else if (cardName.startsWith('Nueve')) num = '09';
        else if (cardName.startsWith('Diez')) num = '10';
        else if (cardName.startsWith('Sota')) num = '11';
        else if (cardName.startsWith('Caballo')) num = '12';
        else if (cardName.startsWith('Reina')) num = '13';
        else if (cardName.startsWith('Rey')) num = '14';
        if (palo && num) file = `${palo}${num}.jpg`;
    }
    return CARD_IMG_BASE + file;
}

function cargarSpreads() {
    const spreadSelect = document.getElementById('spread');
    spreadSelect.innerHTML = '';
    Object.keys(TarotSpreads).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = TarotSpreads[key].name;
        spreadSelect.appendChild(option);
    });
}

function barajarYRepartir(n) {
    // Baraja y reparte n cartas únicas
    const nombres = Object.keys(TarotMeanings);
    let deck = [...nombres];
    let tirada = [];
    for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * deck.length);
        const name = deck.splice(idx, 1)[0];
        const reversed = Math.random() < 0.5;
        tirada.push({ name, reversed });
    }
    return tirada;
}

function mostrarNuevasCartas(tirada, spread) {
    console.log('Mostrando nuevas cartas:', tirada, spread);
    const cardsDiv = document.getElementById('cards');
    if (!cardsDiv) {
        console.error('No se encontró el contenedor de cartas');
        return;
    }
    cardsDiv.innerHTML = '';
    tirada.forEach((card, i) => {
        const meanings = TarotMeanings[card.name];
        const pos = spread.cards[i];
        const meaningPos = card.reversed ? pos.meaning_rev : pos.meaning_up;
        const meaningCard = card.reversed ? meanings.rev : meanings.up;
        const imgSrc = getCardImage(card.name);
        const div = document.createElement('div');
        div.className = 'card';
        div.style.animationDelay = `${i * 0.2}s`;
        div.innerHTML = `
            <img src='${imgSrc}' alt='${card.name}' style='width:100px;display:block;margin:auto;margin-bottom:8px;${card.reversed ? "transform: rotate(180deg);" : ""}'>
            <div class='card-title'>${card.name} ${card.reversed ? '(Invertida)' : ''}</div>
            <div class='card-pos'><em>${pos.pos}</em></div>
            <div class='card-meaning'><b>Significado de la carta:</b> ${meaningCard}</div>
            <div class='pos-meaning'><b>Significado de la posición:</b> ${meaningPos}</div>
        `;
        cardsDiv.appendChild(div);
    });
    mostrarResumenGrupal(tirada, spread);
}

function mostrarResumenGrupal(tirada, spread) {
    // Síntesis grupal enriquecida
    let resumen = '';
    let temas = [];
    let energias = [];
    let advertencias = [];
    let consejos = [];
    let desenlaces = [];
    tirada.forEach((card, i) => {
        const meanings = TarotMeanings[card.name];
        const pos = spread.cards[i];
        const meaningCard = card.reversed ? meanings.rev : meanings.up;
        const meaningPos = card.reversed ? pos.meaning_rev : pos.meaning_up;
        resumen += `<b>${card.name} (${pos.pos}):</b> ${meaningCard} <br><i>${meaningPos}</i><br><br>`;
        // Análisis temático
        if (meaningCard.toLowerCase().includes('creatividad') || meaningCard.toLowerCase().includes('manifestación')) temas.push('creatividad');
        if (meaningCard.toLowerCase().includes('amor') || meaningCard.toLowerCase().includes('unión')) temas.push('amor');
        if (meaningCard.toLowerCase().includes('liderazgo') || meaningCard.toLowerCase().includes('autoridad')) temas.push('liderazgo');
        if (meaningCard.toLowerCase().includes('espiritualidad') || meaningCard.toLowerCase().includes('sabiduría')) temas.push('espiritualidad');
        if (meaningCard.toLowerCase().includes('confusión') || meaningCard.toLowerCase().includes('bloqueo') || meaningCard.toLowerCase().includes('advertencia')) advertencias.push(card.name);
        if (meaningCard.toLowerCase().includes('oportunidad') || meaningCard.toLowerCase().includes('avance')) desenlaces.push('oportunidad de crecimiento');
        if (meaningCard.toLowerCase().includes('riesgo') || meaningCard.toLowerCase().includes('precaución')) desenlaces.push('posibles obstáculos');
        if (meaningCard.toLowerCase().includes('consejo') || meaningCard.toLowerCase().includes('guía')) consejos.push(meaningCard);
        if (card.reversed) energias.push('invertida');
        else energias.push('derecha');
    });
    // Síntesis grupal
    let sintesis = '<hr><b>Síntesis grupal:</b> ';
    if (advertencias.length > 0) {
        sintesis += `Atención: Hay advertencias importantes en las cartas <b>${advertencias.join(', ')}</b>. `;
    }
    if (temas.length > 0) {
        sintesis += `Los temas predominantes son: <b>${[...new Set(temas)].join(', ')}</b>. `;
    }
    let energiaGlobal = energias.filter(e => e === 'invertida').length > energias.length/2 ? 'predominan energías bloqueadas o invertidas' : 'predominan energías positivas y de avance';
    sintesis += `En conjunto, ${energiaGlobal}. `;
    if (consejos.length > 0) {
        sintesis += `Consejo del tarot: <i>${consejos[0]}</i>. `;
    }
    if (desenlaces.length > 0) {
        sintesis += `Posibles desenlaces: <b>${[...new Set(desenlaces)].join(', ')}</b>. `;
    }
    sintesis += 'La tirada sugiere reflexionar sobre los temas destacados, atender las advertencias y seguir el consejo para lograr el mejor resultado posible.';
    resumen += sintesis;
    document.getElementById('summary').innerHTML = resumen;
}

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    // Cargar spreads disponibles
    cargarSpreads();
    
    // Configurar eventos de botones principales
    const drawBtn = document.getElementById('drawBtn');
    if (drawBtn) {
        drawBtn.addEventListener('click', () => {
            console.log('Botón de tirada clickeado');
            const spreadSelect = document.getElementById('spread');
            if (!spreadSelect || !spreadSelect.value) {
                console.error('No se ha seleccionado una tirada');
                return;
            }
            
            const spread = TarotSpreads[spreadSelect.value];
            if (!spread) {
                console.error('Tirada no válida seleccionada');
                return;
            }
            
            const tirada = barajarYRepartir(spread.cards.length);
            mostrarNuevasCartas(tirada, spread);
        });
    } else {
        console.error('No se encontró el botón de tirada');
    }

    const pdfBtn = document.getElementById('pdfBtn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', async () => {
            await guardarTiradaPDF();
        });
    }

    // Modal para imagen grande de carta
    const cardsDiv = document.getElementById('cards');
    if (cardsDiv) {
        cardsDiv.onclick = function(e) {
            if (e.target.tagName === 'IMG') {
                document.getElementById('modalImg').src = e.target.src;
                document.getElementById('cardModal').style.display = 'flex';
            }
        };
    }
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            document.getElementById('cardModal').style.display = 'none';
        };
    }

    // Sistema de hadas
    function createFairy() {
        const container = document.querySelector('.fairy-container');
        if (!container) return;

        const fairy = document.createElement('div');
        fairy.className = 'fairy';
        
        // Posición inicial aleatoria desde el 20% inferior de la pantalla
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight - (Math.random() * window.innerHeight * 0.2);
        
        // Calcular movimiento aleatorio (tiende hacia arriba y ligeramente a los lados)
        const moveX = (Math.random() - 0.5) * 200; // -100 a 100 píxeles
        const moveY = Math.random() * 150 + 100;   // 100 a 250 píxeles hacia arriba
        
        // Opacidad máxima aleatoria (crea variedad en el brillo)
        const maxOpacity = 0.6 + Math.random() * 0.4; // 0.6 a 1.0
        
        // Duración de animación aleatoria (crea velocidades variadas)
        const duration = 8 + Math.random() * 8; // 8-16 segundos
        
        // Configurar propiedades CSS personalizadas
        fairy.style.setProperty('--move-x', moveX);
        fairy.style.setProperty('--move-y', moveY);
        fairy.style.setProperty('--max-opacity', maxOpacity);
        fairy.style.left = `${startX}px`;
        fairy.style.top = `${startY}px`;
        fairy.style.animationDuration = `${duration}s, 1.5s`;

        container.appendChild(fairy);

        // Remover la luciérnaga después de que termine la animación
        fairy.addEventListener('animationend', (e) => {
            if (e.animationName === 'fairyFloat') {
                fairy.remove();
            }
        });
    }

    // Sistema de luciérnagas
    function startFairySystem() {
        // Crear algunas luciérnagas iniciales
        for (let i = 0; i < 5; i++) {
            setTimeout(createFairy, i * 400);
        }
        
        // Crear luciérnagas periódicamente con intervalo más largo
        setInterval(createFairy, 1200); // Una nueva luciérnaga cada 1.2 segundos
    }

    // Iniciar sistema de hadas
    startFairySystem();

    // Sistema de OVNIs
    function createUFO() {
        const container = document.querySelector('.fairy-container');
        if (!container) return;
        
        const ufo = document.createElement('div');
        ufo.className = 'ufo';
        
        // Añadir el rayo tractor
        const beam = document.createElement('div');
        beam.className = 'beam';
        ufo.appendChild(beam);
        
        // Altura aleatoria entre 15% y 35% desde la parte superior
        const randomHeight = Math.random() * 20 + 15;
        ufo.style.top = `${randomHeight}%`;
        ufo.style.animation = 'ufoFly 15s linear';
        
        container.appendChild(ufo);
        
        // Eliminar el OVNI después de que termine la animación
        setTimeout(() => {
            if (ufo && ufo.parentNode) {
                ufo.remove();
            }
        }, 15000);
    }

    function startUFOSystem() {
        // Crear primer OVNI después de un tiempo aleatorio más largo
        setTimeout(createUFO, Math.random() * 20000);
        
        // Crear un OVNI cada 45-90 segundos con menor probabilidad
        setInterval(() => {
            if (Math.random() < 0.4) { // 40% de probabilidad
                createUFO();
            }
        }, 45000);
    }

    // Iniciar sistema de OVNIs
    startUFOSystem();
});
