// Analizar el significado del origen
function analyzeOriginSignificance(origen) {
    let analysis = '';
    
    if (origen.isInverted) {
        analysis += 'Esta situación surge de circunstancias que necesitan ser reexaminadas o sanadas. ';
        analysis += `La inversión de ${origen.name} sugiere que hay aspectos del origen que `;
        analysis += 'pueden estar creando patrones repetitivos o bloqueando el progreso.';
    } else {
        analysis += 'Los cimientos de esta situación son claros y comprensibles. ';
        analysis += `La energía de ${origen.name} proporciona una base `;
        analysis += 'desde la cual se puede construir y avanzar con confianza.';
    }
    
    return analysis;
}

// Analizar bloqueos y su relación con el origen
function analyzeBlockages(bloqueo, origen) {
    let analysis = '<div class="blockage-analysis">';
    
    // Descripción principal del bloqueo
    analysis += '<p class="main-blockage">';
    analysis += bloqueo.description + ' ';
    
    // Relación con el origen
    analysis += 'En relación con el origen, ';
    if (bloqueo.isInverted === origen.isInverted) {
        analysis += 'este bloqueo está profundamente conectado con las circunstancias iniciales. ';
        analysis += 'La transformación requerirá abordar ambos aspectos simultáneamente.';
    } else {
        analysis += 'este obstáculo representa una nueva dinámica que ha emergido. ';
        analysis += 'La solución puede encontrarse al contrastar la situación actual con el punto de partida.';
    }
    analysis += '</p>';
    
    // Naturaleza del bloqueo
    analysis += '<div class="blockage-nature">';
    analysis += '<h4>Naturaleza del Bloqueo:</h4>';
    analysis += '<ul>';
    analysis += `<li>Aspecto Principal: ${bloqueo.meaning}</li>`;
    analysis += `<li>Manifestación: ${bloqueo.isInverted ? 
        'Interna, psicológica o subconsciente' : 
        'Externa, práctica o circunstancial'}</li>`;
    analysis += `<li>Intensidad: ${analyzeBlockageIntensity(bloqueo)}</li>`;
    analysis += '</ul>';
    analysis += '</div>';
    
    analysis += '</div>';
    return analysis;
}

// Analizar la intensidad del bloqueo
function analyzeBlockageIntensity(bloqueo) {
    // Esta es una simplificación. En una implementación real,
    // podrías tener una tabla de intensidades por runa
    const intensityMap = {
        'Thurisaz': 'Alta',
        'Hagalaz': 'Alta',
        'Isa': 'Alta',
        'Nauthiz': 'Media-Alta',
        'Eihwaz': 'Media',
        'Algiz': 'Media-Baja',
        'default': 'Media'
    };
    
    return intensityMap[bloqueo.name] || intensityMap['default'];
}

// Analizar recursos disponibles
function analyzeResources(recurso, bloqueo) {
    if (!recurso || !bloqueo) {
        return '<div class="resource-analysis">No hay suficiente información para analizar los recursos.</div>';
    }

    try {
        let analysis = '<div class="resource-analysis">';
        
        // Descripción principal del recurso con emoji y estilo mejorado
        analysis += '<div class="main-resource">';
        analysis += '<h4>💫 Recursos Disponibles</h4>';
        analysis += `<p><strong>${recurso.name}</strong> ${recurso.isInverted ? '(invertida)' : ''} `;
        analysis += 'representa tu potencial y herramientas. ';
        analysis += recurso.description;
        analysis += '</p></div>';
        
        // Evaluación de efectividad con detalles
        analysis += '<div class="resource-effectiveness">';
        analysis += '<h4>🎯 Potencial y Efectividad</h4>';
        analysis += evaluateResourceEffectiveness(recurso, bloqueo);
        analysis += '</div>';
        
        // Recomendaciones de uso estructuradas
        analysis += '<div class="resource-usage">';
        analysis += '<h4>💡 Estrategias de Aprovechamiento</h4>';
        analysis += generateResourceRecommendations(recurso);
        analysis += '</div>';
        
        // Análisis de sinergias
        analysis += '<div class="resource-synergies">';
        analysis += '<h4>⚡ Sinergias y Potenciadores</h4>';
        analysis += analyzeSynergies(recurso, bloqueo);
        analysis += '</div>';
        
        // Plan de acción práctico
        analysis += '<div class="action-plan">';
        analysis += '<h4>📝 Plan de Acción</h4>';
        analysis += generateActionPlan(recurso, bloqueo);
        analysis += '</div>';
        
        analysis += '</div>';
        return analysis;
    } catch (error) {
        console.error("Error al analizar recursos:", error);
        return '<div class="resource-analysis">Error al analizar los recursos disponibles.</div>';
    }
}

// Evaluar la efectividad de los recursos
function evaluateResourceEffectiveness(recurso, bloqueo) {
    try {
        let evaluation = '<ul class="effectiveness-list">';
        
        // Evaluar compatibilidad elemental
        const elementalMatch = analyzeElementalCompatibility(recurso, bloqueo);
        evaluation += `<li class="elemental-match">
            <strong>Compatibilidad Elemental:</strong> ${elementalMatch}
        </li>`;
        
        // Evaluar potencial de transformación
        const transformativePotential = recurso.isInverted === bloqueo.isInverted ?
            'Alto - Energías alineadas para la transformación' :
            'Moderado - Requiere adaptación y equilibrio';
        evaluation += `<li class="transformation-potential">
            <strong>Potencial Transformador:</strong> ${transformativePotential}
        </li>`;
        
        // Evaluar facilidad de uso
        evaluation += `<li class="ease-of-use">
            <strong>Facilidad de Aplicación:</strong> ${evaluateEaseOfUse(recurso)}
        </li>`;
        
        // Evaluar duración del efecto
        evaluation += `<li class="effect-duration">
            <strong>Duración del Efecto:</strong> ${evaluateEffectDuration(recurso)}
        </li>`;
        
        evaluation += '</ul>';
        return evaluation;
    } catch (error) {
        console.error("Error al evaluar efectividad:", error);
        return '<ul><li>Error al evaluar la efectividad de los recursos.</li></ul>';
    }
}
function evaluateEffectiveness(recurso, bloqueo) {
    try {
        let evaluation = '<ul class="evaluation-list">';
        
        // Potencial básico
        evaluation += '<li>';
        evaluation += '<strong>Potencial Base:</strong> ';
        evaluation += recurso.isInverted ? 
            'Recursos que requieren desarrollo o clarificación' :
            'Recursos inmediatamente disponibles y accesibles';
        evaluation += '</li>';
        
        // Relación con el bloqueo
        evaluation += '<li>';
        evaluation += '<strong>Efectividad contra el Bloqueo:</strong> ';
        if (isResourceEffectiveAgainstBlockage(recurso, bloqueo)) {
            evaluation += 'Estos recursos son particularmente efectivos para superar los obstáculos actuales.';
        } else {
            evaluation += 'Estos recursos pueden requerir adaptación para abordar los desafíos presentes.';
        }
        evaluation += '</li>';
        
        // Sostenibilidad
        evaluation += '<li>';
        evaluation += '<strong>Sostenibilidad:</strong> ';
        evaluation += analyzeResourceSustainability(recurso);
        evaluation += '</li>';
        
        evaluation += '</ul>';
        return evaluation;
    } catch (error) {
        console.error("Error en evaluateEffectiveness:", error);
        return '<ul><li>Error al evaluar la efectividad</li></ul>';
    }
}

// Analizar compatibilidad elemental entre recursos y bloqueos
function analyzeElementalCompatibility(recurso, bloqueo) {
    if (!recurso || !bloqueo) return "Compatibilidad indeterminada";

    try {
        if (!recurso.element || !bloqueo.element) {
            return "Compatibilidad neutral - No hay información elemental";
        }

        // Tabla de compatibilidades elementales
        const compatibilityTable = {
            fuego: { fuego: "neutral", tierra: "desafiante", aire: "potenciador", agua: "restrictivo", espiritu: "catalizador" },
            tierra: { fuego: "restrictivo", tierra: "neutral", aire: "desafiante", agua: "potenciador", espiritu: "estabilizador" },
            aire: { fuego: "potenciador", tierra: "desafiante", aire: "neutral", agua: "restrictivo", espiritu: "amplificador" },
            agua: { fuego: "restrictivo", tierra: "potenciador", aire: "desafiante", agua: "neutral", espiritu: "fluidificador" },
            espiritu: { fuego: "catalizador", tierra: "estabilizador", aire: "amplificador", agua: "fluidificador", espiritu: "transformador" }
        };

        const compatibility = compatibilityTable[recurso.element.toLowerCase()]?.[bloqueo.element.toLowerCase()] || "neutral";
        
        const descriptions = {
            potenciador: "Muy favorable - Los elementos se potencian mutuamente",
            catalizador: "Excelente - Acelera la transformación",
            estabilizador: "Positivo - Proporciona base sólida",
            amplificador: "Favorable - Aumenta la efectividad",
            fluidificador: "Adaptativo - Facilita los cambios",
            neutral: "Neutral - Sin interacción especial",
            desafiante: "Requiere atención - Posible resistencia",
            restrictivo: "Complejo - Necesita trabajo adicional",
            transformador: "Profundo - Cambios significativos"
        };

        return descriptions[compatibility] || "Compatibilidad indeterminada";
    } catch (error) {
        console.error("Error al analizar compatibilidad elemental:", error);
        return "No se pudo determinar la compatibilidad elemental";
    }
}

// Evaluar la facilidad de uso de un recurso
function evaluateEaseOfUse(recurso) {
    try {
        if (recurso.isInverted) {
            return "Requiere práctica y dedicación - El potencial está presente pero necesita desarrollo consciente";
        }

        // Tabla de facilidad de uso por runa (ejemplo simplificado)
        const easeOfUseTable = {
            "Fehu": "Fácil - Recursos materiales directamente accesibles",
            "Uruz": "Moderado - Requiere canalización de energía física",
            "Thurisaz": "Desafiante - Poder que necesita dirección consciente",
            "Ansuz": "Accesible - Comunicación y comprensión fluidas",
            "Raidho": "Moderado - Requiere ritmo y consistencia",
            "Kenaz": "Fácil - Iluminación y claridad natural",
            "Gebo": "Accesible - Intercambio y reciprocidad naturales",
            "Wunjo": "Fácil - Armonía y bienestar naturales",
            // Añadir más runas según sea necesario
        };

        return easeOfUseTable[recurso.name] || "Moderado - Requiere atención y práctica regular";
    } catch (error) {
        console.error("Error al evaluar facilidad de uso:", error);
        return "Moderado - Mantén atención en el proceso";
    }
}

// Evaluar la duración del efecto de un recurso
function evaluateEffectDuration(recurso) {
    try {
        // Tabla de duración de efectos (ejemplo)
        const durationTable = {
            "Fehu": "Temporal - Ligado a ciclos materiales",
            "Uruz": "Duradero - Cambios en la fuerza vital",
            "Thurisaz": "Variable - Depende de la dirección de la energía",
            "Ansuz": "Permanente - Conocimiento integrado",
            "Raidho": "Cíclico - Se renueva con el movimiento",
            "Kenaz": "Progresivo - Crece con la práctica",
            "Gebo": "Sostenido - Basado en el intercambio continuo",
            "Wunjo": "Acumulativo - Se fortalece con el tiempo",
            // Añadir más runas según sea necesario
        };

        return durationTable[recurso.name] || "Variable - Depende de la consistencia en su uso";
    } catch (error) {
        console.error("Error al evaluar duración del efecto:", error);
        return "Duración variable según la aplicación";
    }
}

// Analizar sinergias entre recursos y situación
function analyzeSynergies(recurso, bloqueo) {
    try {
        let synergies = '<ul class="synergy-list">';
        
        // Sinergias elementales
        synergies += '<li class="elemental-synergy">';
        synergies += '<strong>🔮 Sinergia Elemental:</strong><br>';
        synergies += analyzeElementalCompatibility(recurso, bloqueo);
        synergies += '</li>';
        
        // Sinergias de polaridad
        synergies += '<li class="polarity-synergy">';
        synergies += '<strong>⚡ Sinergia de Polaridad:</strong><br>';
        synergies += recurso.isInverted === bloqueo.isInverted ?
            'Energías alineadas - Facilita la transformación directa' :
            'Energías complementarias - Ofrece perspectivas alternativas';
        synergies += '</li>';
        
        // Potenciadores naturales
        synergies += '<li class="natural-enhancers">';
        synergies += '<strong>💫 Potenciadores Naturales:</strong><br>';
        synergies += generateEnhancersList(recurso);
        synergies += '</li>';
        
        synergies += '</ul>';
        return synergies;
    } catch (error) {
        console.error("Error al analizar sinergias:", error);
        return '<ul><li>Mantén atención a las interacciones naturales entre los elementos</li></ul>';
    }
}

// Generar plan de acción práctico
function generateActionPlan(recurso, bloqueo) {
    try {
        let plan = '<ol class="action-steps">';
        
        // Paso 1: Preparación
        plan += '<li class="action-step preparation">';
        plan += '<strong>Preparación:</strong><br>';
        plan += recurso.isInverted ?
            'Realizar trabajo interior de reconocimiento y aceptación' :
            'Identificar y reunir los recursos necesarios';
        plan += '</li>';
        
        // Paso 2: Activación
        plan += '<li class="action-step activation">';
        plan += '<strong>Activación:</strong><br>';
        plan += `Comenzar a trabajar con la energía de ${recurso.name} `;
        plan += recurso.isInverted ?
            'de manera gradual y consciente' :
            'de forma directa y práctica';
        plan += '</li>';
        
        // Paso 3: Aplicación
        plan += '<li class="action-step application">';
        plan += '<strong>Aplicación:</strong><br>';
        plan += 'Dirigir la energía hacia el bloqueo de manera ';
        plan += bloqueo.isInverted ?
            'introspectiva y transformadora' :
            'práctica y resolutiva';
        plan += '</li>';
        
        // Paso 4: Integración
        plan += '<li class="action-step integration">';
        plan += '<strong>Integración:</strong><br>';
        plan += 'Mantener la práctica consistente y observar los cambios';
        plan += '</li>';
        
        plan += '</ol>';
        return plan;
    } catch (error) {
        console.error("Error al generar plan de acción:", error);
        return '<ol><li>Proceder con atención y consciencia</li></ol>';
    }
}

// Generar lista de potenciadores naturales
function generateEnhancersList(recurso) {
    try {
        const enhancers = {
            fuego: ["Visualización activa", "Movimiento físico", "Afirmaciones poderosas"],
            tierra: ["Contacto con la naturaleza", "Rituales prácticos", "Trabajo con cristales"],
            aire: ["Meditación", "Respiración consciente", "Estudio y reflexión"],
            agua: ["Trabajo emocional", "Fluidez y adaptabilidad", "Conexión intuitiva"],
            espiritu: ["Práctica espiritual", "Conexión con guías", "Trabajo energético"]
        };

        const element = recurso.element?.toLowerCase() || "general";
        const elementEnhancers = enhancers[element] || ["Atención consciente", "Práctica regular", "Observación atenta"];

        let list = '<ul class="enhancers">';
        elementEnhancers.forEach(enhancer => {
            list += `<li>${enhancer}</li>`;
        });
        list += '</ul>';
        
        return list;
    } catch (error) {
        console.error("Error al generar lista de potenciadores:", error);
        return '<ul><li>Utiliza los recursos naturales disponibles</li></ul>';
    }
}

// Verificar si el recurso es efectivo contra el bloqueo
function isResourceEffectiveAgainstBlockage(recurso, bloqueo) {
    // Esta es una simplificación. En una implementación real,
    // podrías tener una tabla de efectividad entre runas
    return !recurso.isInverted || bloqueo.isInverted;
}

// Analizar la sostenibilidad del recurso
function analyzeResourceSustainability(recurso) {
    if (recurso.isInverted) {
        return 'Recurso que requiere desarrollo continuo y atención para mantener su efectividad.';
    } else {
        return 'Recurso estable y sostenible que puede ser utilizado de manera consistente.';
    }
}

// Generar recomendaciones de uso de recursos
function generateResourceRecommendations(recurso) {
    let recommendations = '<ul class="usage-recommendations">';
    
    // Recomendación principal
    recommendations += '<li>';
    recommendations += '<strong>Enfoque Principal:</strong> ';
    recommendations += recurso.meaning;
    recommendations += '</li>';
    
    // Método de aplicación
    recommendations += '<li>';
    recommendations += '<strong>Método de Aplicación:</strong> ';
    if (recurso.isInverted) {
        recommendations += 'Trabajar primero en desarrollar y clarificar este recurso antes de aplicarlo.';
    } else {
        recommendations += 'Aplicar directamente este recurso a los desafíos actuales.';
    }
    recommendations += '</li>';
    
    // Precauciones
    recommendations += '<li>';
    recommendations += '<strong>Precauciones:</strong> ';
    recommendations += generateResourcePrecautions(recurso);
    recommendations += '</li>';
    
    recommendations += '</ul>';
    return recommendations;
}

// Generar precauciones para el uso de recursos
function generateResourcePrecautions(recurso) {
    // Esta función podría expandirse con una tabla más completa de precauciones por runa
    return recurso.isInverted ?
        'Evitar forzar el uso del recurso antes de que esté completamente desarrollado.' :
        'No sobreestimar la capacidad del recurso; usarlo de manera equilibrada.';
}

// Analizar aliados y su relación con los recursos
function analyzeAllies(aliado, recurso) {
    let analysis = '<div class="allies-analysis">';
    
    // Descripción principal del aliado
    analysis += '<p class="main-ally">';
    analysis += `<strong>${aliado.name}</strong> ${aliado.isInverted ? '(invertida)' : ''} `;
    analysis += 'representa las energías y apoyos disponibles. ';
    analysis += aliado.description;
    analysis += '</p>';
    
    // Tipo de apoyo
    analysis += '<div class="support-type">';
    analysis += '<h4>Naturaleza del Apoyo:</h4>';
    analysis += analyzeSupportType(aliado);
    analysis += '</div>';
    
    // Sinergia con recursos
    analysis += '<div class="resource-synergy">';
    analysis += '<h4>Sinergia con Recursos:</h4>';
    analysis += analyzeAllySynergy(aliado, recurso);
    analysis += '</div>';
    
    analysis += '</div>';
    return analysis;
}

// Analizar el tipo de apoyo disponible
function analyzeSupportType(aliado) {
    let analysis = '<ul class="support-characteristics">';
    
    // Naturaleza del apoyo
    analysis += '<li>';
    analysis += '<strong>Tipo de Apoyo:</strong> ';
    if (aliado.isInverted) {
        analysis += 'Apoyo que requiere desarrollo o clarificación. ';
        analysis += 'Puede manifestarse de formas inesperadas o no convencionales.';
    } else {
        analysis += 'Apoyo directo y accesible. ';
        analysis += 'Se presenta de manera clara y constructiva.';
    }
    analysis += '</li>';
    
    // Duración o temporalidad
    analysis += '<li>';
    analysis += '<strong>Temporalidad:</strong> ';
    analysis += analyzeSupportDuration(aliado);
    analysis += '</li>';
    
    analysis += '</ul>';
    return analysis;
}

// Analizar la duración del apoyo
function analyzeSupportDuration(aliado) {
    // Esta función podría expandirse con una tabla más completa de duraciones por runa
    return aliado.isInverted ?
        'Apoyo temporal o condicional que requiere cultivo continuo.' :
        'Apoyo estable y duradero que puede ser base para el desarrollo.';
}

// Analizar la sinergia entre aliados y recursos
function analyzeAllySynergy(aliado, recurso) {
    let synergy = '';
    
    if (aliado.isInverted === recurso.isInverted) {
        synergy += 'Existe una conexión natural entre los apoyos disponibles y los recursos. ';
        synergy += 'La combinación puede potenciar ambos aspectos.';
    } else {
        synergy += 'Los apoyos y recursos operan en diferentes niveles o frecuencias. ';
        synergy += 'Será necesario encontrar formas creativas de integrarlos.';
    }
    
    return synergy;
}

// Analizar el aprendizaje y su relación con origen y bloqueos
function analyzeLearning(aprendizaje, origen, bloqueo) {
    let analysis = '<div class="learning-analysis">';
    
    // Lección principal
    analysis += '<p class="main-lesson">';
    analysis += `<strong>${aprendizaje.name}</strong> ${aprendizaje.isInverted ? '(invertida)' : ''} `;
    analysis += 'revela las lecciones clave de esta experiencia. ';
    analysis += aprendizaje.description;
    analysis += '</p>';
    
    // Conexión con el origen
    analysis += '<div class="origin-connection">';
    analysis += '<h4>Relación con el Origen:</h4>';
    analysis += analyzeLearningOriginConnection(aprendizaje, origen);
    analysis += '</div>';
    
    // Superación de bloqueos
    analysis += '<div class="blockage-resolution">';
    analysis += '<h4>Camino de Superación:</h4>';
    analysis += analyzeLearningBlockageResolution(aprendizaje, bloqueo);
    analysis += '</div>';
    
    analysis += '</div>';
    return analysis;
}

// Analizar la conexión entre aprendizaje y origen
function analyzeLearningOriginConnection(aprendizaje, origen) {
    let connection = '';
    
    if (aprendizaje.isInverted === origen.isInverted) {
        connection += 'La lección está directamente relacionada con las circunstancias originales. ';
        connection += 'Existe una continuidad en el proceso de aprendizaje.';
    } else {
        connection += 'La lección representa un cambio o transformación desde el punto de partida. ';
        connection += 'Se está desarrollando una nueva comprensión.';
    }
    
    return connection;
}

// Analizar cómo el aprendizaje ayuda a superar bloqueos
function analyzeLearningBlockageResolution(aprendizaje, bloqueo) {
    let resolution = '<ul class="resolution-steps">';
    
    // Paso 1: Comprensión
    resolution += '<li>';
    resolution += '<strong>Comprensión:</strong> ';
    resolution += aprendizaje.meaning;
    resolution += '</li>';
    
    // Paso 2: Aplicación
    resolution += '<li>';
    resolution += '<strong>Aplicación:</strong> ';
    if (aprendizaje.isInverted === bloqueo.isInverted) {
        resolution += 'La lección proporciona herramientas directas para abordar el bloqueo.';
    } else {
        resolution += 'La lección ofrece una perspectiva alternativa para superar el obstáculo.';
    }
    resolution += '</li>';
    
    resolution += '</ul>';
    return resolution;
}

// Analizar el destino y su relación con el aprendizaje
function analyzeDestiny(destino, aprendizaje) {
    let analysis = '<div class="destiny-analysis">';
    
    // Potencial futuro
    analysis += '<p class="future-potential">';
    analysis += `<strong>${destino.name}</strong> ${destino.isInverted ? '(invertida)' : ''} `;
    analysis += 'muestra el potencial futuro de la situación. ';
    analysis += destino.description;
    analysis += '</p>';
    
    // Integración del aprendizaje
    analysis += '<div class="learning-integration">';
    analysis += '<h4>Integración del Aprendizaje:</h4>';
    analysis += analyzeLearningDestinyIntegration(destino, aprendizaje);
    analysis += '</div>';
    
    // Recomendaciones para el camino
    analysis += '<div class="path-recommendations">';
    analysis += '<h4>💫 Recomendaciones para el Camino:</h4>';
    analysis += generatePathRecommendations(destino);
    analysis += '</div>';

    // Análisis de patrones rúnicos
    analysis += '<div class="runic-patterns">';
    analysis += '<h4>🔮 Patrones Rúnicos:</h4>';
    analysis += analyzeRunicPatterns(destino, aprendizaje);
    analysis += '</div>';

    analysis += '</div>';
    return analysis;
}

// Generar recomendaciones específicas para el camino futuro
function generatePathRecommendations(destino) {
    try {
        let recommendations = '<ul class="path-recommendations-list">';
        
        // Recomendaciones basadas en la polaridad
        if (destino.isInverted) {
            recommendations += `
                <li><strong>🔄 Transformación:</strong> Este camino requiere una transformación consciente.</li>
                <li><strong>🌟 Atención:</strong> Mantén la atención en los aspectos sutiles del proceso.</li>
                <li><strong>💫 Desarrollo:</strong> Trabaja en el desarrollo interior continuo.</li>`;
        } else {
            recommendations += `
                <li><strong>⚡ Acción:</strong> Avanza con confianza en la dirección indicada.</li>
                <li><strong>🎯 Enfoque:</strong> Mantén el enfoque en las metas establecidas.</li>
                <li><strong>✨ Manifestación:</strong> Permite que las energías se manifiesten naturalmente.</li>`;
        }
        
        // Recomendación específica de la runa
        recommendations += `<li><strong>💫 Guía Rúnica:</strong> ${generateRunicGuidance(destino)}</li>`;
        
        recommendations += '</ul>';
        return recommendations;
    } catch (error) {
        console.error("Error al generar recomendaciones del camino:", error);
        return '<ul><li>Mantén la consciencia en tu proceso de desarrollo.</li></ul>';
    }
}

// Analizar patrones rúnicos específicos
function analyzeRunicPatterns(destino, aprendizaje) {
    try {
        let patterns = '<div class="pattern-analysis">';
        
        // Análisis de la relación entre destino y aprendizaje
        patterns += '<section class="pattern-relationship">';
        patterns += '<h5>🔮 Relación de Patrones</h5>';
        patterns += '<ul>';
        
        // Patrón de polaridad
        const polarityMatch = destino.isInverted === aprendizaje.isInverted;
        patterns += `<li><strong>Polaridad:</strong> ${
            polarityMatch ? 
            'Las energías fluyen en la misma dirección' : 
            'Las energías operan en planos complementarios'
        }</li>`;
        
        // Patrón elemental
        patterns += `<li><strong>Elementos:</strong> ${analyzeElementalPattern(destino, aprendizaje)}</li>`;
        
        // Patrón de manifestación
        patterns += `<li><strong>Manifestación:</strong> ${analyzeManifestationPattern(destino, aprendizaje)}</li>`;
        
        patterns += '</ul>';
        patterns += '</section>';
        
        // Ciclos y fases
        patterns += '<section class="cycles-phases">';
        patterns += '<h5>🌀 Ciclos y Fases</h5>';
        patterns += analyzeCyclesAndPhases(destino, aprendizaje);
        patterns += '</section>';
        
        patterns += '</div>';
        return patterns;
    } catch (error) {
        console.error("Error al analizar patrones rúnicos:", error);
        return '<div>Observa los patrones que se revelan en tu camino.</div>';
    }
}

// Generar guía rúnica específica
function generateRunicGuidance(runa) {
    try {
        // Tabla de guía por runa
        const runicGuidance = {
            "Fehu": "Cultiva y comparte la abundancia en todas sus formas",
            "Uruz": "Mantén y desarrolla tu fuerza vital",
            "Thurisaz": "Canaliza tu poder con sabiduría",
            "Ansuz": "Escucha y sigue la sabiduría superior",
            "Raidho": "Avanza en tu camino con propósito",
            "Kenaz": "Ilumina tu camino con conocimiento",
            "Gebo": "Mantén el equilibrio en el dar y recibir",
            "Wunjo": "Cultiva la alegría y la armonía",
            // Añadir más runas según sea necesario
        };

        return runicGuidance[runa.name] || "Sigue tu camino con consciencia y propósito";
    } catch (error) {
        console.error("Error al generar guía rúnica:", error);
        return "Mantén la consciencia en tu desarrollo";
    }
}

// Analizar patrón elemental
function analyzeElementalPattern(runa1, runa2) {
    try {
        if (!runa1.element || !runa2.element) {
            return "Los elementos trabajan en armonía";
        }

        const elementalRelations = {
            fuego: {
                fuego: "Intensificación de la transformación",
                tierra: "Manifestación poderosa",
                aire: "Expansión dinámica",
                agua: "Transmutación profunda",
                espiritu: "Iluminación consciente"
            },
            tierra: {
                fuego: "Activación material",
                tierra: "Estabilidad y crecimiento",
                aire: "Estructuración del pensamiento",
                agua: "Nutrición profunda",
                espiritu: "Materialización sagrada"
            },
            // Añadir más elementos según sea necesario
        };

        const element1 = runa1.element.toLowerCase();
        const element2 = runa2.element.toLowerCase();

        return elementalRelations[element1]?.[element2] || 
               "Los elementos trabajan juntos para tu desarrollo";
    } catch (error) {
        console.error("Error al analizar patrón elemental:", error);
        return "Los elementos fluyen naturalmente";
    }
}

// Analizar patrón de manifestación
function analyzeManifestationPattern(runa1, runa2) {
    try {
        const invertedCount = [runa1, runa2].filter(r => r.isInverted).length;
        
        switch (invertedCount) {
            case 0:
                return "Manifestación directa y natural";
            case 1:
                return "Transformación y adaptación necesaria";
            case 2:
                return "Trabajo interior profundo requerido";
            default:
                return "Proceso de manifestación equilibrado";
        }
    } catch (error) {
        console.error("Error al analizar patrón de manifestación:", error);
        return "Sigue el flujo natural del proceso";
    }
}

// Analizar ciclos y fases
function analyzeCyclesAndPhases(runa1, runa2) {
    try {
        let analysis = '<ul class="cycles-analysis">';
        
        // Fase actual
        analysis += '<li><strong>Fase Actual:</strong> ';
        analysis += runa1.isInverted ?
            'Fase de transformación interior' :
            'Fase de manifestación exterior';
        analysis += '</li>';
        
        // Próxima fase
        analysis += '<li><strong>Próxima Fase:</strong> ';
        analysis += runa2.isInverted ?
            'Movimiento hacia la interiorización' :
            'Movimiento hacia la exteriorización';
        analysis += '</li>';
        
        // Duración del ciclo
        analysis += '<li><strong>Duración del Ciclo:</strong> ';
        analysis += runa1.isInverted === runa2.isInverted ?
            'Ciclo sostenido y estable' :
            'Ciclo de transformación activa';
        analysis += '</li>';
        
        analysis += '</ul>';
        return analysis;
    } catch (error) {
        console.error("Error al analizar ciclos y fases:", error);
        return '<ul><li>Observa y fluye con los ciclos naturales</li></ul>';
    }
}

function analyzeDestiny(destino) {
    try {
        let analysis = '<div class="destiny-analysis">';
        
        // Potencial futuro
        analysis += '<h3>🌟 Potencial y Dirección</h3>';
        analysis += '<p class="future-potential">';
        analysis += generateDestinyPotential(destino);
        analysis += '</p>';
        
        // Recomendaciones para el camino
        analysis += '<div class="path-recommendations">';
        analysis += '<h4>💫 Recomendaciones</h4>';
        analysis += generateDestinyRecommendations(destino);
        analysis += '</div>';
        
        analysis += '</div>';
        return analysis;
    } catch (error) {
        console.error("Error al analizar el destino:", error);
        return '<div class="destiny-analysis">Mantén tu atención en el camino por delante.</div>';
    }
}

function generateDestinyPotential(destino) {
    try {
        return destino.isInverted ?
            'Este camino requiere desarrollo interior y transformación consciente.' :
            'El potencial se manifestará de manera natural y directa.';
    } catch (error) {
        console.error("Error al generar potencial del destino:", error);
        return 'Mantén la atención en tu desarrollo.';
    }
}

// Analizar la integración entre aprendizaje y destino
function analyzeLearningDestinyIntegration(destino, aprendizaje) {
    try {
        let integration = '';
        
        if (destino.isInverted === aprendizaje.isInverted) {
            integration += 'El destino está alineado con las lecciones aprendidas. ';
            integration += 'La integración del aprendizaje conducirá naturalmente hacia el resultado deseado.';
        } else {
            integration += 'El destino requiere una transformación adicional del aprendizaje. ';
            integration += 'Será necesario adaptar las lecciones para alcanzar el potencial completo.';
        }
        
        return integration;
    } catch (error) {
        console.error("Error al analizar integración:", error);
        return "Es necesario integrar las lecciones aprendidas con el destino.";
    }
}

// Generar recomendaciones para el camino hacia el destino
function generateDestinyRecommendations(destino) {
    try {
        let recommendations = '<ul class="destiny-recommendations">';
        
        // Enfoque principal
        recommendations += '<li>';
        recommendations += '<strong>Enfoque:</strong> ';
        recommendations += destino.meaning;
        recommendations += '</li>';
        
        // Actitud recomendada
        recommendations += '<li>';
        recommendations += '<strong>Actitud:</strong> ';
        if (destino.isInverted) {
            recommendations += 'Mantener flexibilidad y apertura a ajustes en el camino.';
        } else {
            recommendations += 'Avanzar con confianza y determinación hacia la meta.';
        }
        recommendations += '</li>';
        
        // Preparación
        recommendations += '<li>';
        recommendations += '<strong>Preparación:</strong> ';
        recommendations += generateDestinyPreparation(destino);
        recommendations += '</li>';
        
        recommendations += '</ul>';
        return recommendations;
    } catch (error) {
        console.error("Error al generar recomendaciones:", error);
        return '<ul><li>Sigue tu camino con atención y consciencia.</li></ul>';
    }
}

// Generar recomendaciones de preparación para el destino
function generateDestinyPreparation(destino) {
    try {
        // Esta función podría expandirse con una tabla más completa de preparaciones por runa
        return destino.isInverted ?
            'Trabajar en la clarificación de metas y la resolución de dudas internas.' :
            'Fortalecer las bases actuales y mantener el rumbo establecido.';
    } catch (error) {
        console.error("Error al generar preparación:", error);
        return 'Mantén la atención en tu proceso de desarrollo.';
    }
}

// Analizar patrones en la tirada de la Aurora
function analyzeAuroraPatterns(readingInfo) {
    let analysis = '<div class="aurora-patterns">';
    
    // Patrones de inversión
    analysis += '<div class="inversion-patterns">';
    analysis += '<h4>Patrones de Transformación:</h4>';
    analysis += analyzeAuroraInversions(readingInfo);
    analysis += '</div>';
    
    // Conexiones entre posiciones
    analysis += '<div class="position-connections">';
    analysis += '<h4>Conexiones Significativas:</h4>';
    analysis += analyzeAuroraConnections(readingInfo);
    analysis += '</div>';
    
    analysis += '</div>';
    return analysis;
}

// Analizar patrones de inversión
function analyzeAuroraInversions(readingInfo) {
    const invertedCount = readingInfo.filter(r => r.isInverted).length;
    let analysis = '<p>';
    
    if (invertedCount > 3) {
        analysis += 'Predominan las energías de transformación y cambio. ';
        analysis += 'El proceso requiere atención consciente y trabajo interno.';
    } else if (invertedCount < 2) {
        analysis += 'Las energías fluyen de manera natural y directa. ';
        analysis += 'El camino se presenta claro y accesible.';
    } else {
        analysis += 'Hay un balance entre las energías de cambio y estabilidad. ';
        analysis += 'El proceso combina aspectos de transformación y continuidad.';
    }
    
    analysis += '</p>';
    return analysis;
}

// Analizar conexiones entre posiciones
function analyzeAuroraConnections(readingInfo) {
    let connections = '<ul class="significant-connections">';
    
    // Origen-Destino
    connections += '<li>';
    connections += '<strong>Conexión Origen-Destino:</strong> ';
    connections += analyzeOriginDestinyConnection(
        readingInfo.find(r => r.position === "Origen"),
        readingInfo.find(r => r.position === "Destino")
    );
    connections += '</li>';
    
    // Recurso-Bloqueo
    connections += '<li>';
    connections += '<strong>Dinámica Recurso-Bloqueo:</strong> ';
    connections += analyzeResourceBlockageConnection(
        readingInfo.find(r => r.position === "Recurso"),
        readingInfo.find(r => r.position === "Bloqueo")
    );
    connections += '</li>';
    
    connections += '</ul>';
    return connections;
}

// Analizar conexión entre origen y destino
function analyzeOriginDestinyConnection(origen, destino) {
    if (origen.isInverted === destino.isInverted) {
        return 'Existe una continuidad entre el punto de partida y el destino. ';
    } else {
        return 'El camino implica una transformación significativa desde el origen hasta el destino. ';
    }
}

// Analizar conexión entre recursos y bloqueos
function analyzeResourceBlockageConnection(recurso, bloqueo) {
    if (recurso.isInverted === bloqueo.isInverted) {
        return 'Los recursos están bien alineados para abordar los bloqueos actuales. ';
    } else {
        return 'Será necesario adaptar los recursos para superar los obstáculos presentes. ';
    }
}

// Generar plan de acción para la tirada de la Aurora
function generateAuroraActionPlan(readingInfo) {
    let plan = '<div class="action-plan">';
    
    // Pasos inmediatos
    plan += '<div class="immediate-steps">';
    plan += '<h4>Pasos Inmediatos:</h4>';
    plan += generateImmediateSteps(readingInfo);
    plan += '</div>';
    
    // Desarrollo a medio plazo
    plan += '<div class="medium-term">';
    plan += '<h4>Desarrollo a Medio Plazo:</h4>';
    plan += generateMediumTermSteps(readingInfo);
    plan += '</div>';
    
    // Visión a largo plazo
    plan += '<div class="long-term">';
    plan += '<h4>Visión a Largo Plazo:</h4>';
    plan += generateLongTermVision(readingInfo);
    plan += '</div>';
    
    plan += '</div>';
    return plan;
}

// Generar pasos inmediatos
function generateImmediateSteps(readingInfo) {
    const bloqueo = readingInfo.find(r => r.position === "Bloqueo");
    const recurso = readingInfo.find(r => r.position === "Recurso");
    
    let steps = '<ul class="immediate-actions">';
    
    // Paso 1: Abordar bloqueos
    steps += '<li>';
    steps += '<strong>Abordar Bloqueos:</strong> ';
    steps += bloqueo.isInverted ?
        'Trabajar en la comprensión y transformación de resistencias internas.' :
        'Tomar acción directa para superar obstáculos externos.';
    steps += '</li>';
    
    // Paso 2: Activar recursos
    steps += '<li>';
    steps += '<strong>Activar Recursos:</strong> ';
    steps += recurso.isInverted ?
        'Desarrollar y clarificar los recursos disponibles antes de aplicarlos.' :
        'Utilizar inmediatamente los recursos identificados.';
    steps += '</li>';
    
    steps += '</ul>';
    return steps;
}

// Generar pasos a medio plazo
function generateMediumTermSteps(readingInfo) {
    const aprendizaje = readingInfo.find(r => r.position === "Aprendizaje");
    const aliado = readingInfo.find(r => r.position === "Aliado");
    
    let steps = '<ul class="medium-term-actions">';
    
    // Paso 1: Integrar aprendizaje
    steps += '<li>';
    steps += '<strong>Integrar Aprendizaje:</strong> ';
    steps += aprendizaje.meaning;
    steps += '</li>';
    
    // Paso 2: Desarrollar alianzas
    steps += '<li>';
    steps += '<strong>Desarrollar Alianzas:</strong> ';
    steps += aliado.isInverted ?
        'Clarificar y fortalecer las conexiones de apoyo.' :
        'Aprovechar activamente el apoyo disponible.';
    steps += '</li>';
    
    steps += '</ul>';
    return steps;
}

// Generar visión a largo plazo
function generateLongTermVision(readingInfo) {
    const destino = readingInfo.find(r => r.position === "Destino");
    
    let vision = '<ul class="long-term-goals">';
    
    // Meta principal
    vision += '<li>';
    vision += '<strong>Meta Principal:</strong> ';
    vision += destino.meaning;
    vision += '</li>';
    
    // Preparación
    vision += '<li>';
    vision += '<strong>Preparación:</strong> ';
    vision += destino.isInverted ?
        'Mantener flexibilidad y apertura a ajustes en el camino.' :
        'Construir sobre las bases establecidas de manera consistente.';
    vision += '</li>';
    
    vision += '</ul>';
    return vision;
}