// runesCore.js - Funcionalidad principal
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que las runas estén cargadas
    if (!window.RUNES) {
        console.error('Error: RUNES no está definido');
        return;
    }

    // Inicializar funcionalidades principales
    console.log('DOM Cargado, inicializando aplicación...');
    if (typeof window.initRuneApp === 'function') {
        window.initRuneApp();
    }
});

window.initRuneApp = function() {
    const result = document.getElementById("result");
    const drawBtn = document.getElementById("drawBtn");
    const clearBtn = document.getElementById("clearBtn");
    const spreadSel = document.getElementById("spreadSel");
    
    if (!drawBtn || !clearBtn || !result || !spreadSel) {
        console.error("No se pudieron encontrar los elementos");
        return;
    }

    drawBtn.addEventListener("click", window.drawSpread);
    clearBtn.addEventListener("click", () => result.innerHTML = "");
    
    setupModal("infoModal", "infoBtn");
    setupModal("searchModal", "searchBtn");
};

// Seleccionar runas aleatorias sin repetición
window.selectRunes = function(count) {
    const runesArray = [...window.RUNES];
    const selected = [];
    
    // Si se piden más runas de las disponibles, retornar error
    if (count > runesArray.length) {
        throw new Error("No hay suficientes runas para esta tirada");
    }
    
    // Seleccionar runas aleatorias
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * runesArray.length);
        const rune = runesArray.splice(randomIndex, 1)[0];
        // 50% probabilidad de inversión
        rune.isInverted = Math.random() < 0.5;
        selected.push(rune);
    }
    
    return selected;
};

// Renderizar las runas en el contenedor
window.renderRunes = async function(runes, positions, container) {
    // Limpiar el contenedor
    container.innerHTML = '';

    // Crear contenedor principal de la tirada
    const mainContainer = document.createElement("div");
    mainContainer.className = "spread-container";
    container.appendChild(mainContainer);

    // Crear el grid para las runas
    const runesGrid = document.createElement("div");
    runesGrid.className = `spread-grid spread-${positions.length}`;
    mainContainer.appendChild(runesGrid);

    // Crear contenedor de interpretaciones
    const interpretationContainer = document.createElement("div");
    interpretationContainer.className = "interpretation-container";
    mainContainer.appendChild(interpretationContainer);

    // Añadir título de la tirada
    const spreadTitle = document.createElement("div");
    spreadTitle.className = "spread-title";
    spreadTitle.innerHTML = `
        <h2>Interpretación de la Tirada</h2>
        <p class="spread-description">Esta tirada de ${positions.length} runas revelará ${getSpreadDescription(positions)}</p>
    `;
    interpretationContainer.appendChild(spreadTitle);

    // Array para almacenar las runas y sus posiciones para la interpretación general
    const readingInfo = [];

    // Renderizar cada runa
    for (let i = 0; i < runes.length; i++) {
        const rune = runes[i];
        const position = positions[i];

        const runeContainer = document.createElement("div");
        runeContainer.className = "rune-container";
        
        const runeCard = document.createElement("div");
        runeCard.className = "rune-card";
        if (rune.isInverted) runeCard.classList.add("inverted");
        
        const img = document.createElement("img");
        img.src = rune.img;
        img.alt = rune.name;
        img.className = "rune-img";
        runeCard.appendChild(img);
        
        runeContainer.appendChild(runeCard);
        runesGrid.appendChild(runeContainer);
        
        // Interpretación para cada runa
        const interpretation = document.createElement("div");
        interpretation.className = "rune-meaning";
        
        // Crear el título según el tipo de tirada
        let positionTitle = position;
        if (positions.length === 3 && ["Pasado", "Presente", "Futuro"].includes(position)) {
            const titleMap = {
                "Pasado": "Urd - El Pasado",
                "Presente": "Verdandi - El Presente",
                "Futuro": "Skuld - El Futuro"
            };
            positionTitle = titleMap[position];
        }

        interpretation.innerHTML = `
            <h3>${positionTitle}: ${rune.name}</h3>
            <p><strong>${rune.isInverted ? "Invertida" : "Normal"}:</strong> 
               ${rune.isInverted ? rune.meanInv : rune.mean}</p>
            <p><strong>Significado:</strong> ${rune.isInverted ? rune.descInv : rune.desc}</p>
            <p><strong>Interpretación en esta posición:</strong></p>
            ${getPositionInterpretation(position, rune.isInverted)}
        `;
        interpretationContainer.appendChild(interpretation);

        // Almacenar información para la interpretación general
        readingInfo.push({
            name: rune.name,
            position: position,
            isInverted: rune.isInverted,
            meaning: rune.isInverted ? rune.meanInv : rune.mean,
            description: rune.isInverted ? rune.descInv : rune.desc
        });

        // Efecto de revelación gradual
        await new Promise(resolve => setTimeout(resolve, 500));
        runeCard.classList.add("revealed");
    }

    // Añadir interpretación general después de todas las runas
    const generalInterpretation = document.createElement("div");
    generalInterpretation.className = "general-interpretation";
    generalInterpretation.innerHTML = generateGeneralInterpretation(readingInfo, positions.length);
    interpretationContainer.appendChild(generalInterpretation);
};

window.drawSpread = async function() {
    const result = document.getElementById("result");
    const spreadSel = document.getElementById("spreadSel");
    
    try {
        const spreadType = spreadSel.value;
        const spreadConfig = window.SPREADS[spreadType];
        
        if (!spreadConfig || !spreadConfig.slots) {
            throw new Error("Configuración inválida");
        }

        const selectedRunes = window.selectRunes(spreadConfig.slots.length);
        await window.renderRunes(selectedRunes, spreadConfig.slots, result);
    } catch (error) {
        console.error("Error:", error);
        result.innerHTML = "<div class=\"interpretation\"><h3>Error</h3><p>Por favor, intenta de nuevo.</p></div>";
    }
};

// Obtener interpretación específica según la posición
function getPositionInterpretation(position, isInverted) {
    const interpretations = {
        // Interpretaciones para la tirada de las Tres Nornas
        "Pasado": {
            normal: "Esta runa muestra las energías y eventos del pasado que han influido en tu situación actual. Representa las causas y decisiones que te han traído hasta aquí.",
            inverted: "Indica un pasado que aún necesita ser procesado o liberado. Puede haber lecciones inconclusas o patrones que se repiten."
        },
        "Presente": {
            normal: "Revela las energías que están activas en este momento. Muestra cómo puedes trabajar con la situación actual de manera efectiva.",
            inverted: "Sugiere la necesidad de reevaluar tu perspectiva actual. Puede haber aspectos de la situación que no estás viendo claramente."
        },
        "Futuro": {
            normal: "Indica la dirección hacia la que te diriges si mantienes tu curso actual. Muestra potenciales y posibilidades emergentes.",
            inverted: "Advierte sobre posibles obstáculos futuros o la necesidad de cambiar el rumbo actual para obtener mejores resultados."
        },
        // Interpretaciones para la Cruz de 5
        "Situación": {
            normal: "Representa el núcleo de la cuestión y las energías centrales que definen el momento presente. Muestra la esencia de lo que está ocurriendo.",
            inverted: "Sugiere una comprensión incompleta o distorsionada de la situación actual. Puede haber aspectos ocultos o malentendidos."
        },
        "Desafío": {
            normal: "Revela el obstáculo principal que necesitas superar o la lección que debes aprender en esta situación.",
            inverted: "Indica que el verdadero desafío puede estar dentro de ti mismo, o que estás enfrentando el obstáculo desde un ángulo equivocado."
        },
        "Consejo": {
            normal: "Ofrece guía sobre la mejor manera de proceder. Representa la acción o actitud más beneficiosa a adoptar.",
            inverted: "Sugiere la necesidad de buscar consejo adicional o reconsiderar tu aproximación actual al problema."
        },
        "Influencia": {
            normal: "Muestra las fuerzas externas que están afectando la situación, sean personas, circunstancias o energías ambientales.",
            inverted: "Advierte sobre influencias negativas o interferencias externas que pueden estar obstaculizando tu progreso."
        },
        "Resultado": {
            normal: "Indica el probable desenlace si sigues el consejo y manejas apropiadamente los desafíos presentados.",
            inverted: "Sugiere la necesidad de ajustar tu curso de acción para evitar un resultado menos favorable."
        },
        // Interpretaciones para la Herradura de 7
        "Pasado Lejano": {
            normal: "Revela las raíces profundas de la situación actual y patrones ancestrales que pueden estar influyendo.",
            inverted: "Indica la necesidad de liberarte de viejos patrones o creencias heredadas que ya no sirven."
        },
        "Pasado Cercano": {
            normal: "Muestra eventos recientes que han contribuido directamente a la situación presente.",
            inverted: "Sugiere la necesidad de resolver asuntos pendientes del pasado reciente."
        },
        "Presente": {
            normal: "Representa el punto de inflexión actual y las energías que están cristalizando en este momento.",
            inverted: "Indica confusión o resistencia ante las circunstancias presentes."
        },
        "Futuro Cercano": {
            normal: "Revela las tendencias y oportunidades que se están desarrollando en el horizonte inmediato.",
            inverted: "Advierte sobre posibles obstáculos o retrasos en el futuro próximo."
        },
        "Futuro Lejano": {
            normal: "Muestra el potencial a largo plazo y la dirección general del camino elegido.",
            inverted: "Sugiere la necesidad de replantear objetivos a largo plazo o ajustar expectativas."
        },
        "Consejo": {
            normal: "Ofrece sabiduría específica para navegar el camino desde el presente hacia el futuro deseado.",
            inverted: "Indica la necesidad de buscar orientación adicional o meditar más profundamente sobre la situación."
        },
        "Síntesis": {
            normal: "Proporciona una visión unificadora que conecta todos los aspectos de la lectura en un mensaje coherente.",
            inverted: "Sugiere la necesidad de integrar aspectos aparentemente contradictorios de la situación."
        },
        // Interpretaciones para la Aurora de 6
        "Origen": {
            normal: "Revela la fuente o raíz de la situación actual, mostrando dónde y cómo comenzó todo.",
            inverted: "Indica una comprensión incompleta o distorsionada de los orígenes de la situación."
        },
        "Bloqueo": {
            normal: "Identifica el principal obstáculo o resistencia que está impidiendo el progreso.",
            inverted: "Sugiere que el bloqueo puede ser más interno que externo, o que está siendo malinterpretado."
        },
        "Recurso": {
            normal: "Muestra las herramientas, habilidades o ayuda disponible para superar los desafíos.",
            inverted: "Indica recursos que no están siendo utilizados efectivamente o que están siendo subestimados."
        },
        "Aliado": {
            normal: "Señala personas, energías o situaciones que pueden ayudar en el camino.",
            inverted: "Advierte sobre posibles aliados que pueden no ser tan útiles como parecen, o la necesidad de buscar ayuda en lugares inesperados."
        },
        "Aprendizaje": {
            normal: "Revela la lección principal o el crecimiento que se puede obtener de esta situación.",
            inverted: "Sugiere resistencia al aprendizaje o la necesidad de cambiar la perspectiva sobre lo que se debe aprender."
        },
        "Destino": {
            normal: "Muestra el potencial resultado o dirección si se integran todas las lecciones y recursos disponibles.",
            inverted: "Indica la necesidad de revaluar las metas o ajustar las expectativas sobre el resultado deseado."
        }
    };

    if (!interpretations[position]) return "";
    
    const interpretation = interpretations[position];
    return `<p class="position-interpretation"><em>${isInverted ? interpretation.inverted : interpretation.normal}</em></p>`;
}

function getSpreadDescription(positions) {
    const spreadTypes = {
        3: "los aspectos del pasado, presente y futuro de tu consulta.",
        5: "la situación central, desafíos, consejos, influencias y resultado potencial.",
        6: "el origen, bloqueos, recursos, aliados, aprendizajes y destino de tu situación.",
        7: "un panorama completo desde el pasado lejano hasta el futuro, incluyendo consejos y una síntesis final.",
        1: "un mensaje directo y conciso para tu pregunta."
    };
    
    return spreadTypes[positions.length] || "diversos aspectos de tu consulta.";
}

function generateGeneralInterpretation(readingInfo, spreadSize) {
    let generalText = '<h2 class="interpretation-title">Lectura General de la Tirada</h2>';
    
    // Interpretación según el tipo de tirada
    switch(spreadSize) {
        case 3: // Tirada de las Tres Nornas
            generalText += '<div class="general-reading">';
            generalText += '<p>En esta tirada de las Tres Nornas, podemos ver cómo las energías fluyen desde el pasado hacia el futuro:</p>';
            generalText += interpretNornas(readingInfo);
            generalText += '</div>';
            break;
            
        case 5: // Cruz
            generalText += '<div class="general-reading">';
            generalText += '<p>La tirada en Cruz nos revela la dinámica completa de la situación:</p>';
            generalText += interpretCross(readingInfo);
            generalText += '</div>';
            break;
            
        case 7: // Herradura
            generalText += '<div class="general-reading">';
            generalText += '<p>La tirada en Herradura nos muestra el camino completo de la situación:</p>';
            generalText += interpretHorseshoe(readingInfo);
            generalText += '</div>';
            break;
            
        case 6: // Aurora
            generalText += '<div class="general-reading">';
            generalText += '<p>La tirada de la Aurora nos revela las diferentes facetas de tu situación:</p>';
            generalText += interpretAurora(readingInfo);
            generalText += '</div>';
            break;
            
        default:
            generalText += '<div class="general-reading">';
            generalText += '<p>Análisis de las energías presentes en tu tirada:</p>';
            generalText += interpretGeneric(readingInfo);
            generalText += '</div>';
    }
    
    return generalText;
}

function interpretNornas(readingInfo) {
    const pasado = readingInfo.find(r => r.position === "Pasado");
    const presente = readingInfo.find(r => r.position === "Presente");
    const futuro = readingInfo.find(r => r.position === "Futuro");
    
    // Análisis temporal inicial
    let text = '<div class="nornas-interpretation">';
    text += '<h3>Las Tres Nornas - Tejedoras del Destino</h3>';
    
    // Urd - El Pasado
    text += '<div class="nornas-section past">';
    text += `<h4>Urd - La Tejedora del Pasado: ${pasado.name} ${pasado.isInverted ? '(Invertida)' : ''}</h4>`;
    text += '<p class="rune-meaning">';
    text += `<strong>Energía Principal:</strong> ${pasado.meaning}.<br>`;
    text += `<strong>Manifestación:</strong> ${pasado.description}<br>`;
    text += `<strong>Influencia Actual:</strong> ${getPastInfluence(pasado.name, pasado.isInverted)}</p>`;
    text += '</div>';
    
    // Verdandi - El Presente
    text += '<div class="nornas-section present">';
    text += `<h4>Verdandi - La Tejedora del Presente: ${presente.name} ${presente.isInverted ? '(Invertida)' : ''}</h4>`;
    text += '<p class="rune-meaning">';
    text += `<strong>Energía Principal:</strong> ${presente.meaning}.<br>`;
    text += `<strong>Manifestación:</strong> ${presente.description}<br>`;
    text += `<strong>Momento Actual:</strong> ${getPresentState(presente.name, presente.isInverted)}</p>`;
    text += '</div>';
    
    // Skuld - El Futuro
    text += '<div class="nornas-section future">';
    text += `<h4>Skuld - La Tejedora del Futuro: ${futuro.name} ${futuro.isInverted ? '(Invertida)' : ''}</h4>`;
    text += '<p class="rune-meaning">';
    text += `<strong>Energía Principal:</strong> ${futuro.meaning}.<br>`;
    text += `<strong>Potencial:</strong> ${futuro.description}<br>`;
    text += `<strong>Tendencia:</strong> ${getFutureDirection(futuro.name, futuro.isInverted)}</p>`;
    text += '</div>';
    
    // Análisis de Patrones y Conexiones
    text += '<div class="patterns-analysis">';
    text += '<h4>Análisis del Tejido del Tiempo</h4>';
    text += `<p>${analyzeTimePattern(pasado, presente, futuro)}</p>`;
    text += '</div>';
    
    // Recomendaciones y Síntesis
    text += '<div class="nornas-guidance">';
    text += '<h4>Guía de las Nornas</h4>';
    text += `<p>${generateNornasGuidance(pasado, presente, futuro)}</p>`;
    text += '</div>';
    
    text += '</div>';
    return text;
}

function interpretCross(readingInfo) {
    const centro = readingInfo.find(r => r.position === "Situación");
    const desafio = readingInfo.find(r => r.position === "Desafío");
    const consejo = readingInfo.find(r => r.position === "Consejo");
    const influencia = readingInfo.find(r => r.position === "Influencia");
    const resultado = readingInfo.find(r => r.position === "Resultado");
    
    let text = '<div class="cross-interpretation">';
    
    // Situación Central
    text += '<div class="section center">';
    text += '<h3>🌟 Situación Central</h3>';
    text += '<p class="rune-analysis">';
    text += `<strong>${centro.name}</strong> ${centro.isInverted ? '(invertida)' : ''} en el centro de la cruz `;
    text += `revela la esencia de la situación: ${centro.description}. `;
    text += 'Esto significa que las energías dominantes están ';
    text += `${centro.meaning.toLowerCase()}.</p>`;
    text += '</div>';

    // Desafío Principal
    text += '<div class="section challenge">';
    text += '<h3>⚔️ Desafío Principal</h3>';
    text += '<p class="rune-analysis">';
    text += `${desafio.name} ${desafio.isInverted ? '(invertida)' : ''} muestra el obstáculo a superar. `;
    text += `${desafio.description} `;
    text += analyzeChallengeRelation(desafio, centro);
    text += '</p>';
    text += '</div>';

    // Guía y Consejo
    text += '<div class="section guidance">';
    text += '<h3>🎯 Guía y Consejo</h3>';
    text += '<p class="rune-analysis">';
    text += `${consejo.name} ${consejo.isInverted ? '(invertida)' : ''} ofrece la clave para avanzar: `;
    text += generateCrossGuidance(consejo, centro, desafio);
    text += '</p>';
    text += '</div>';

    // Influencias Externas
    text += '<div class="section influences">';
    text += '<h3>🌊 Influencias Externas</h3>';
    text += '<p class="rune-analysis">';
    text += `${influencia.name} ${influencia.isInverted ? '(invertida)' : ''} revela las energías del entorno. `;
    text += analyzeExternalInfluences(influencia, centro);
    text += '</p>';
    text += '</div>';

    // Resultado Potencial
    text += '<div class="section outcome">';
    text += '<h3>🎆 Resultado Potencial</h3>';
    text += '<p class="rune-analysis">';
    text += `${resultado.name} ${resultado.isInverted ? '(invertida)' : ''} muestra el desenlace posible: `;
    text += analyzePotentialOutcome(resultado, centro, consejo);
    text += '</p>';
    text += '</div>';

    // Balance Energético
    text += '<div class="section balance">';
    text += '<h3>☯️ Balance Energético</h3>';
    text += analyzeEnergeticBalance(readingInfo);
    text += '</div>';

    // Recomendaciones Prácticas
    text += '<div class="section recommendations">';
    text += '<h3>💫 Recomendaciones</h3>';
    text += generateCrossRecommendations(readingInfo);
    text += '</div>';

    text += '</div>';
    return text;
}

function interpretHorseshoe(readingInfo) {
    // Verificar que readingInfo es un array válido
    if (!Array.isArray(readingInfo) || readingInfo.length === 0) {
        return '<div class="error-message">Error: No hay información de lectura disponible.</div>';
    }

    const pasadoLejano = readingInfo.find(r => r.position === "Pasado Lejano");
    const pasadoCercano = readingInfo.find(r => r.position === "Pasado Cercano");
    const presente = readingInfo.find(r => r.position === "Presente");
    const futuroCercano = readingInfo.find(r => r.position === "Futuro Cercano");
    const futuroLejano = readingInfo.find(r => r.position === "Futuro Lejano");
    const consejo = readingInfo.find(r => r.position === "Consejo");
    const sintesis = readingInfo.find(r => r.position === "Síntesis");
    
    // Verificar que tenemos todas las runas necesarias
    const posicionesRequeridas = ["Pasado Lejano", "Pasado Cercano", "Presente", "Futuro Cercano", "Futuro Lejano", "Consejo", "Síntesis"];
    const runasEncontradas = readingInfo.map(r => r.position);
    const posicionesFaltantes = posicionesRequeridas.filter(pos => !runasEncontradas.includes(pos));
    
    if (posicionesFaltantes.length > 0) {
        return `<div class="error-message">Error: Faltan las siguientes posiciones en la tirada: ${posicionesFaltantes.join(", ")}</div>`;
    }
    
    let text = '<div class="horseshoe-interpretation">';
    
    // Raíces y Orígenes
    text += '<div class="section origins">';
    text += '<h3>🌲 Raíces y Orígenes</h3>';
    text += '<p class="rune-analysis">' + window.HorseShoeModule.analyzePastTransition(pasadoLejano, pasadoCercano) + '</p>';
    text += '</div>';

    // Momento Presente
    text += '<div class="section present-moment">';
    text += '<h3>✨ Cristalización Presente</h3>';
    text += '<p class="rune-analysis">' + window.HorseShoeModule.analyzePresent(presente, pasadoCercano, futuroCercano) + '</p>';
    text += '</div>';

    // Tendencias Emergentes
    text += '<div class="section emerging">';
    text += '<h3>🌱 Tendencias Emergentes</h3>';
    text += '<p class="rune-analysis">' + window.HorseShoeModule.analyzeNearFuture(futuroCercano, presente, futuroLejano) + '</p>';
    text += '</div>';

    // Potencial Futuro
    text += '<div class="section potential">';
    text += '<h3>🌟 Potencial Futuro</h3>';
    text += '<p class="rune-analysis">' + window.HorseShoeModule.analyzeFarFuture(futuroLejano, futuroCercano) + '</p>';
    text += '</div>';

    // Guía y Consejo
    text += '<div class="section guidance">';
    text += '<h3>🎯 Guía de las Runas</h3>';
    text += window.HorseShoeModule.generateDetailedGuidance(consejo, readingInfo);
    text += '</div>';

    // Síntesis e Integración
    text += '<div class="section synthesis">';
    text += '<h3>🔮 Síntesis del Wyrd</h3>';
    text += '<p class="rune-analysis">' + window.HorseShoeModule.generateSynthesis(sintesis, readingInfo) + '</p>';
    text += '</div>';

    // Análisis de Patrones y Recomendaciones
    text += '<div class="section patterns-and-recommendations">';
    text += '<h3>🕸️ Patrones y Recomendaciones</h3>';
    text += window.HorseShoeModule.analyzeElementalPatterns(readingInfo);
    text += '<br>';
    text += window.HorseShoeModule.findRunicRelationships(readingInfo);
    text += '</div>';

    text += '</div>';
    return text;
}

function interpretAurora(readingInfo) {
    const origen = readingInfo.find(r => r.position === "Origen");
    const bloqueo = readingInfo.find(r => r.position === "Bloqueo");
    const recurso = readingInfo.find(r => r.position === "Recurso");
    const aliado = readingInfo.find(r => r.position === "Aliado");
    const aprendizaje = readingInfo.find(r => r.position === "Aprendizaje");
    const destino = readingInfo.find(r => r.position === "Destino");
    
    let text = '<div class="aurora-interpretation">';
    
    // Origen y Raíces
    text += '<div class="section origin">';
    text += '<h3>🌳 Raíces de la Situación</h3>';
    text += '<p class="rune-analysis">';
    text += `<strong>${origen.name}</strong> ${origen.isInverted ? '(invertida)' : ''} revela el punto de partida: `;
    text += origen.description + ' ';
    text += analyzeOriginSignificance(origen);
    text += '</p>';
    text += '</div>';

    // Desafíos y Bloqueos
    text += '<div class="section blockage">';
    text += '<h3>⚡ Desafíos Actuales</h3>';
    text += '<p class="rune-analysis">';
    text += `${bloqueo.name} ${bloqueo.isInverted ? '(invertida)' : ''} señala los obstáculos principales: `;
    text += analyzeBlockages(bloqueo, origen);
    text += '</p>';
    text += '</div>';

    // Recursos y Fortalezas
    text += '<div class="section resources">';
    text += '<h3>💎 Recursos Disponibles</h3>';
    text += analyzeResources(recurso, bloqueo);
    text += '</div>';

    // Aliados y Apoyo
    text += '<div class="section allies">';
    text += '<h3>🤝 Aliados y Apoyo</h3>';
    text += analyzeAllies(aliado, recurso);
    text += '</div>';

    // Aprendizaje y Crecimiento
    text += '<div class="section learning">';
    text += '<h3>📚 Lecciones y Crecimiento</h3>';
    text += analyzeLearning(aprendizaje, origen, bloqueo);
    text += '</div>';

    // Destino y Potencial
    text += '<div class="section destiny">';
    text += '<h3>🌟 Destino y Potencial</h3>';
    text += analyzeDestiny(destino, aprendizaje);
    text += '</div>';

    // Análisis de Patrones
    text += '<div class="section patterns">';
    text += '<h3>🕸️ Patrones y Conexiones</h3>';
    text += analyzeAuroraPatterns(readingInfo);
    text += '</div>';

    // Plan de Acción
    text += '<div class="section action-plan">';
    text += '<h3>🎯 Plan de Acción</h3>';
    text += generateAuroraActionPlan(readingInfo);
    text += '</div>';

    text += '</div>';
    return text;
}

function interpretGeneric(readingInfo) {
    let text = '<p class="general">';
    text += 'Las runas presentes en esta tirada muestran los siguientes aspectos:</p>';
    text += '<ul class="rune-list">';
    
    readingInfo.forEach(rune => {
        text += `<li><strong>${rune.name}</strong> en posición de ${rune.position} `;
        text += `${rune.isInverted ? '(invertida)' : ''}: ${rune.meaning}</li>`;
    });
    
    text += '</ul>';
    return text;
}

function setupModal(modalId, btnId) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(btnId);
    const closeBtn = modal.querySelector(".modal-close");

    btn.addEventListener("click", () => modal.classList.add("active"));
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            modal.classList.remove("active");
        }
    });
}
