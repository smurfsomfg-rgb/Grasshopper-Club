// Funciones auxiliares para interpretación avanzada de runas

// Analizar la influencia del pasado
function getPastInfluence(runeName, isInverted) {
    // Patrones de influencia del pasado según la runa
    const pastPatterns = {
        "Fehu": {
            normal: "Las experiencias pasadas con recursos y abundancia siguen influyendo en tu percepción actual de la prosperidad.",
            inverted: "Antiguas pérdidas o carencias pueden estar afectando tu relación actual con los recursos materiales."
        },
        "Uruz": {
            normal: "La fuerza y determinación del pasado han forjado tu carácter actual.",
            inverted: "Experiencias pasadas de debilidad pueden estar limitando tu confianza presente."
        },
        // Añadir más runas según sea necesario
    };

    // Patrón por defecto si la runa no está en el catálogo
    const defaultPattern = {
        normal: "Las experiencias pasadas han establecido una base sólida para tu desarrollo actual.",
        inverted: "Hay aspectos del pasado que necesitan ser sanados o integrados para avanzar."
    };

    const pattern = pastPatterns[runeName] || defaultPattern;
    return isInverted ? pattern.inverted : pattern.normal;
}

// Analizar el estado presente
function getPresentState(runeName, isInverted) {
    // Patrones del presente según la runa
    const presentPatterns = {
        "Fehu": {
            normal: "Es un momento propicio para manifestar abundancia y aprovechar las oportunidades materiales.",
            inverted: "Existe tensión o preocupación actual respecto a recursos o seguridad material."
        },
        "Uruz": {
            normal: "Tu fuerza interior está en su punto máximo para enfrentar los desafíos actuales.",
            inverted: "Es momento de reconocer y trabajar en áreas de vulnerabilidad."
        },
        // Añadir más runas según sea necesario
    };

    // Patrón por defecto
    const defaultPattern = {
        normal: "El momento presente ofrece oportunidades claras para el crecimiento y desarrollo.",
        inverted: "Hay desafíos actuales que requieren atención y ajustes en tu aproximación."
    };

    const pattern = presentPatterns[runeName] || defaultPattern;
    return isInverted ? pattern.inverted : pattern.normal;
}

// Analizar la dirección futura
function getFutureDirection(runeName, isInverted) {
    // Patrones de dirección futura según la runa
    const futurePatterns = {
        "Fehu": {
            normal: "Se avecina un período de abundancia y nuevas oportunidades materiales.",
            inverted: "Es importante prepararse para posibles fluctuaciones en los recursos."
        },
        "Uruz": {
            normal: "Tu fuerza personal continuará creciendo, llevándote a nuevos logros.",
            inverted: "Será necesario trabajar en fortalecer tu resistencia y determinación."
        },
        // Añadir más runas según sea necesario
    };

    // Patrón por defecto
    const defaultPattern = {
        normal: "El camino futuro promete desarrollo y crecimiento positivo.",
        inverted: "Hay aspectos que requerirán atención y ajustes en el futuro."
    };

    const pattern = futurePatterns[runeName] || defaultPattern;
    return isInverted ? pattern.inverted : pattern.normal;
}

// Analizar el patrón temporal completo
function analyzeTimePattern(pasado, presente, futuro) {
    let analysis = "";

    // Analizar el flujo de energía
    const invertedCount = [pasado, presente, futuro].filter(r => r.isInverted).length;
    
    if (invertedCount === 0) {
        analysis += "El flujo temporal muestra una progresión natural y armoniosa. ";
    } else if (invertedCount === 3) {
        analysis += "El patrón temporal indica un período de transformación profunda y desafíos significativos. ";
    } else {
        analysis += "Hay una mezcla de energías que sugiere un proceso de transformación en desarrollo. ";
    }

    // Analizar la secuencia y conexiones
    analysis += "\n\nConexiones temporales:\n";
    
    // Pasado a Presente
    analysis += `- La energía de ${pasado.name} del pasado ${pasado.isInverted ? '(invertida) ' : ''}`;
    analysis += `fluye hacia ${presente.name} en el presente ${presente.isInverted ? '(invertida), ' : ', '}`;
    analysis += "creando una dinámica de ";
    if (pasado.isInverted === presente.isInverted) {
        analysis += "continuidad y desarrollo gradual. ";
    } else {
        analysis += "transformación y cambio significativo. ";
    }

    // Presente a Futuro
    analysis += `\n- La transición de ${presente.name} en el presente hacia ${futuro.name} en el futuro `;
    analysis += "sugiere un proceso de ";
    if (presente.isInverted === futuro.isInverted) {
        analysis += "evolución natural y fluida. ";
    } else {
        analysis += "cambio y adaptación importante. ";
    }

    return analysis;
}

// Generar guía y recomendaciones
function generateNornasGuidance(pasado, presente, futuro) {
    let guidance = "Basándonos en el tejido del tiempo revelado por las Nornas:\n\n";

    // Lecciones del Pasado
    guidance += "🌟 <strong>Lecciones de Urd (Pasado):</strong>\n";
    guidance += pasado.isInverted ?
        "- Hay aspectos del pasado que requieren sanación o integración.\n" +
        `- La energía de ${pasado.name} sugiere reflexionar sobre experiencias previas.\n` :
        "- El pasado ofrece una base sólida para el crecimiento.\n" +
        `- La sabiduría de ${pasado.name} puede guiar tus pasos actuales.\n`;

    // Acción en el Presente
    guidance += "\n🌟 <strong>Consejo de Verdandi (Presente):</strong>\n";
    guidance += presente.isInverted ?
        "- Es momento de reevaluar tu aproximación actual.\n" +
        `- ${presente.name} sugiere hacer ajustes en tu camino.\n` :
        "- Las circunstancias actuales son favorables para la acción.\n" +
        `- ${presente.name} indica el mejor curso de acción ahora.\n`;

    // Preparación para el Futuro
    guidance += "\n🌟 <strong>Visión de Skuld (Futuro):</strong>\n";
    guidance += futuro.isInverted ?
        "- Prepárate para posibles desafíos venideros.\n" +
        `- La energía de ${futuro.name} sugiere desarrollar adaptabilidad.\n` :
        "- El futuro promete desarrollos positivos.\n" +
        `- ${futuro.name} ilumina el camino a seguir.\n`;

    return guidance;
}

// Analizar patrones de runas relacionadas
function findRunicRelationships(readingInfo) {
    if (!Array.isArray(readingInfo) || readingInfo.length < 2) {
        return null;
    }

    try {
        let analysis = '';
        const runeNames = readingInfo.map(rune => rune.name);

        // Verificar relaciones utilizando las definiciones de runeRelationships.js
        if (!window.RUNE_RELATIONSHIPS) {
            console.error("RUNE_RELATIONSHIPS no está definido. Asegúrate de incluir runeRelationships.js");
            return null;
        }

        // Buscar oposiciones
        const oppositions = window.RUNE_RELATIONSHIPS.opposites
            .filter(pair => runeNames.includes(pair[0]) && runeNames.includes(pair[1]));

        // Buscar complementos
        const complements = window.RUNE_RELATIONSHIPS.complements
            .filter(pair => runeNames.includes(pair[0]) && runeNames.includes(pair[1]));

        // Buscar refuerzos
        const reinforcements = window.RUNE_RELATIONSHIPS.reinforcing
            .filter(pair => runeNames.includes(pair[0]) && runeNames.includes(pair[1]));

        // Analizar cada tipo de relación
        if (oppositions.length > 0) {
            analysis += "🔄 <strong>Tensiones Dinámicas:</strong>\n";
            oppositions.forEach(pair => {
                analysis += `- ${pair[0]} y ${pair[1]} crean una tensión creativa que impulsa el cambio.\n`;
            });
        }

        if (complements.length > 0) {
            analysis += "\n🤝 <strong>Sinergias Complementarias:</strong>\n";
            complements.forEach(pair => {
                analysis += `- ${pair[0]} y ${pair[1]} trabajan juntas para un desarrollo armónico.\n`;
            });
        }

        if (reinforcements.length > 0) {
            analysis += "\n💫 <strong>Amplificaciones Energéticas:</strong>\n";
            reinforcements.forEach(pair => {
                analysis += `- ${pair[0]} y ${pair[1]} potencian mutuamente sus energías.\n`;
            });
        }

        // Si no se encontraron relaciones
        if (!analysis) {
            analysis = "Las runas presentes trabajan de manera independiente, cada una aportando su mensaje único.";
        }

        return analysis;

    } catch (error) {
        console.error("Error al analizar relaciones rúnicas:", error);
        return null;
    }
}

// Analizar el balance de polaridades
function analyzePolarities(readingInfo) {
    if (!Array.isArray(readingInfo) || readingInfo.length === 0) {
        return null;
    }

    try {
        const invertedCount = readingInfo.filter(rune => rune.isInverted).length;
        const ratio = invertedCount / readingInfo.length;

        let analysis = '🎭 <strong>Balance de Energías:</strong>\n';

        // Analizar el balance general
        if (ratio > 0.7) {
            analysis += "- Las energías transformadoras dominan fuertemente esta lectura.\n";
            analysis += "- Es un momento de profunda transmutación y cambio interno.\n";
            analysis += "- Los desafíos presentes son catalizadores de crecimiento significativo.\n";
        } else if (ratio > 0.5) {
            analysis += "- Hay un ligero predominio de aspectos desafiantes.\n";
            analysis += "- Los retos actuales ofrecen oportunidades de desarrollo consciente.\n";
            analysis += "- La transformación está en proceso, requiriendo atención y paciencia.\n";
        } else if (ratio > 0.3) {
            analysis += "- Existe un balance saludable entre fuerzas constructivas y transformadoras.\n";
            analysis += "- Los desafíos presentes están bien compensados por el apoyo disponible.\n";
            analysis += "- Es un momento propicio para el desarrollo equilibrado.\n";
        } else if (ratio > 0) {
            analysis += "- Las energías son mayormente favorables, con algunos puntos de atención.\n";
            analysis += "- Los pocos desafíos sirven como estímulo para el crecimiento.\n";
            analysis += "- El momento es propicio para avanzar con confianza.\n";
        } else {
            analysis += "- Todas las runas se presentan en su aspecto armónico.\n";
            analysis += "- Es un período excepcionalmente favorable para nuevos comienzos.\n";
            analysis += "- Las energías apoyan plenamente tus intenciones constructivas.\n";
        }

        return analysis;

    } catch (error) {
        console.error("Error al analizar polaridades:", error);
        return null;
    }
}

// Analizar el flujo energético
function analyzeEnergyFlow(readingInfo) {
    if (!Array.isArray(readingInfo) || readingInfo.length === 0) {
        return null;
    }

    try {
        let analysis = '⚡ <strong>Flujo Energético:</strong>\n';
        const flowPatterns = [];

        // Analizar patrones de flujo
        for (let i = 0; i < readingInfo.length - 1; i++) {
            const current = readingInfo[i];
            const next = readingInfo[i + 1];
            
            if (current.isInverted === next.isInverted) {
                flowPatterns.push("continuo");
            } else {
                flowPatterns.push("transformativo");
            }
        }

        // Analizar el inicio
        analysis += "- Punto de Partida: ";
        if (readingInfo[0].isInverted) {
            analysis += "La energía parte de un desafío que busca resolución.\n";
        } else {
            analysis += "El flujo comienza desde una base constructiva.\n";
        }

        // Analizar el patrón dominante
        const continuousFlow = flowPatterns.filter(p => p === "continuo").length;
        const transformativeFlow = flowPatterns.filter(p => p === "transformativo").length;

        analysis += "- Patrón Dominante: ";
        if (continuousFlow > transformativeFlow) {
            analysis += "Desarrollo gradual y sostenido.\n";
        } else if (transformativeFlow > continuousFlow) {
            analysis += "Serie de transformaciones y ajustes.\n";
        } else {
            analysis += "Balance entre estabilidad y cambio.\n";
        }

        // Analizar la conclusión
        analysis += "- Punto de Culminación: ";
        if (readingInfo[readingInfo.length - 1].isInverted) {
            analysis += "El proceso conduce a una transformación final que requiere atención consciente.\n";
        } else {
            analysis += "La energía se resuelve en un estado de armonía y realización.\n";
        }

        return analysis;

    } catch (error) {
        console.error("Error al analizar el flujo energético:", error);
        return null;
    }
}

// Generar recomendaciones prácticas
function generatePracticalAdvice(readingInfo) {
    if (!Array.isArray(readingInfo) || readingInfo.length === 0) {
        return null;
    }

    try {
        let advice = '💡 <strong>Recomendaciones Prácticas:</strong>\n\n';

        // Analizar runas invertidas para desafíos
        const invertedRunes = readingInfo.filter(rune => rune.isInverted);
        if (invertedRunes.length > 0) {
            advice += "Aspectos que requieren atención:\n";
            invertedRunes.forEach(rune => {
                advice += `- ${rune.name}: ${rune.meanInv}\n`;
            });
        }

        // Analizar runas rectas para recursos
        const uprightRunes = readingInfo.filter(rune => !rune.isInverted);
        if (uprightRunes.length > 0) {
            advice += "\nRecursos disponibles:\n";
            uprightRunes.forEach(rune => {
                advice += `- ${rune.name}: ${rune.mean}\n`;
            });
        }

        // Recomendaciones generales basadas en el balance
        advice += "\nConsejo General:\n";
        const ratio = invertedRunes.length / readingInfo.length;
        
        if (ratio > 0.5) {
            advice += "- Dedica tiempo a la introspección y el trabajo interior.\n";
            advice += "- Cultiva la paciencia y la perseverancia.\n";
            advice += "- Busca el aprendizaje en los desafíos presentes.\n";
        } else {
            advice += "- Aprovecha las energías favorables para avanzar.\n";
            advice += "- Materializa tus intenciones con acción decidida.\n";
            advice += "- Construye sobre las bases positivas disponibles.\n";
        }

        return advice;

    } catch (error) {
        console.error("Error al generar consejos prácticos:", error);
        return null;
    }
}