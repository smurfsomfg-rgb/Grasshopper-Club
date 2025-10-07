// Funciones auxiliares para interpretación avanzada de runas

// Lista de runas que tradicionalmente no se invierten
const NON_REVERSIBLE_RUNES = [
    "Gebo",
    "Hagalaz",
    "Isa",
    "Jera",
    "Eihwaz",
    "Sowilo",
    "Ingwaz",
    "Dagaz"
];

// Función para verificar si una runa se puede invertir
function isRuneReversible(runeName) {
    return !NON_REVERSIBLE_RUNES.includes(runeName);
}

// Función para obtener el significado adecuado de la runa
function getRuneMeaning(rune) {
    if (!isRuneReversible(rune.name)) {
        return {
            meaning: rune.mean,
            description: rune.desc
        };
    }
    
    return {
        meaning: rune.isInverted ? rune.meanInv : rune.mean,
        description: rune.isInverted ? rune.descInv : rune.desc
    };
}

// Analizar la influencia del pasado
function getPastInfluence(runeName, isInverted) {
    if (!isRuneReversible(runeName)) {
        isInverted = false;
    }

    const pastPatterns = {
        "Fehu": {
            normal: "Las experiencias pasadas con recursos y abundancia siguen influyendo en tu percepción actual de la prosperidad. Has construido una base material que continúa beneficiándote.",
            inverted: "Antiguas pérdidas o experiencias de carencia pueden estar limitando tu capacidad actual para manifestar abundancia. Es tiempo de sanar estas heridas."
        },
        "Uruz": {
            normal: "La fuerza y determinación que has cultivado en el pasado han forjado tu carácter actual. Tus luchas anteriores te han fortalecido.",
            inverted: "Experiencias pasadas de debilidad o enfermedad pueden estar afectando tu confianza presente. Es momento de reconocer y superar estos patrones."
        },
        // Se añadirían más patrones específicos para cada runa
    };

    // Patrón por defecto más detallado
    const defaultPattern = {
        normal: "Las experiencias del pasado han establecido una base sólida para tu desarrollo actual. Los aprendizajes previos te sirven como guía y apoyo.",
        inverted: "Hay aspectos del pasado que necesitan ser sanados o integrados para avanzar. La transformación requiere reconocer y liberar patrones antiguos."
    };

    const pattern = pastPatterns[runeName] || defaultPattern;
    return isInverted ? pattern.inverted : pattern.normal;
}

// Analizar el estado presente
function getPresentState(runeName, isInverted) {
    if (!isRuneReversible(runeName)) {
        isInverted = false;
    }

    const presentPatterns = {
        "Fehu": {
            normal: "Es un momento propicio para manifestar abundancia y aprovechar las oportunidades materiales. Los recursos están fluyendo hacia ti.",
            inverted: "Existe tensión o preocupación actual respecto a recursos o seguridad material. Es importante mantener la perspectiva y no dejarse llevar por el miedo."
        },
        "Uruz": {
            normal: "Tu fuerza interior está en su punto máximo para enfrentar los desafíos actuales. Es momento de actuar con determinación.",
            inverted: "Es momento de reconocer y trabajar en áreas de vulnerabilidad. La verdadera fortaleza viene de aceptar nuestras limitaciones."
        },
        // Se añadirían más patrones específicos para cada runa
    };

    const defaultPattern = {
        normal: "El momento presente ofrece oportunidades claras para el crecimiento y desarrollo. Estás en sintonía con las energías que te rodean.",
        inverted: "Hay desafíos actuales que requieren atención y ajustes en tu aproximación. La situación invita a la reflexión y adaptación."
    };

    const pattern = presentPatterns[runeName] || defaultPattern;
    return isInverted ? pattern.inverted : pattern.normal;
}

// Analizar la dirección futura
function getFutureDirection(runeName, isInverted) {
    if (!isRuneReversible(runeName)) {
        isInverted = false;
    }

    const futurePatterns = {
        "Fehu": {
            normal: "Se avecina un período de abundancia y nuevas oportunidades materiales. Tus esfuerzos darán frutos tangibles.",
            inverted: "Es importante prepararse para posibles fluctuaciones en los recursos. La verdadera riqueza vendrá de aprender a adaptarse."
        },
        "Uruz": {
            normal: "Tu fuerza personal continuará creciendo, llevándote a nuevos logros. Los desafíos te fortalecerán aún más.",
            inverted: "Será necesario trabajar en fortalecer tu resistencia y determinación. Los obstáculos servirán como maestros."
        },
        // Se añadirían más patrones específicos para cada runa
    };

    const defaultPattern = {
        normal: "El camino futuro promete desarrollo y crecimiento positivo. Las energías apoyan tus objetivos y aspiraciones.",
        inverted: "Hay aspectos que requerirán atención y ajustes en el futuro. La flexibilidad será tu mejor aliada."
    };

    const pattern = futurePatterns[runeName] || defaultPattern;
    return isInverted ? pattern.inverted : pattern.normal;
}