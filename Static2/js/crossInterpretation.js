// Análisis de la relación entre el desafío y la situación central
function analyzeChallengeRelation(desafio, centro) {
    if (!desafio || !centro) {
        return 'No hay suficiente información para analizar la relación entre el desafío y el centro.';
    }

    try {
        let analysis = '';
        
        // Analizar la relación energética
        if (desafio.isInverted === centro.isInverted) {
            analysis += '🔄 Este desafío está intrínsecamente conectado con la situación central, ';
            analysis += 'sugiriendo que la resolución de uno afectará directamente al otro. ';
            
            // Añadir detalles sobre la naturaleza de la conexión
            if (desafio.isInverted) {
                analysis += 'Ambos aspectos comparten una naturaleza transformadora que requiere trabajo interno. ';
            } else {
                analysis += 'La energía constructiva presente en ambos sugiere un proceso de desarrollo natural. ';
            }
        } else {
            analysis += '⚡ El desafío presenta una dinámica complementaria a la situación central, ';
            analysis += 'lo que requiere un enfoque más dinámico y adaptativo. ';
            
            // Analizar la tensión creativa
            analysis += 'Esta tensión creativa puede ser aprovechada para catalizar el cambio necesario. ';
        }

        // Analizar la naturaleza específica del desafío
        const desafioDesc = desafio.desc?.toLowerCase() || desafio.meaning?.toLowerCase() || 'se presenta un desafío significativo';
        analysis += `\n\n💫 La esencia del desafío indica que ${desafioDesc}. `;
        
        // Añadir recomendación específica
        if (desafio.isInverted) {
            analysis += '\n\n⚠️ Será importante trabajar en: ';
            analysis += desafio.meanInv?.toLowerCase() || 'los aspectos que requieren transformación';
        } else {
            analysis += '\n\n💡 Se puede aprovechar: ';
            analysis += desafio.mean?.toLowerCase() || 'las energías constructivas presentes';
        }

        return analysis;
    } catch (error) {
        console.error("Error al analizar la relación desafío-centro:", error);
        return 'No se pudo completar el análisis de la relación entre el desafío y el centro.';
    }
}

// Generar guía específica basada en la relación entre las runas
function generateCrossGuidance(consejo, centro, desafio) {
    if (!consejo || !centro || !desafio) {
        return 'No hay suficiente información para generar una guía completa.';
    }

    try {
        let guidance = '<div class="cross-guidance">';
        
        // Visión general del consejo
        guidance += '<section class="overview">';
        guidance += '<h4>🎯 Visión General</h4>';
        guidance += `<p>${consejo.desc || consejo.description}</p>`;
        
        // Análisis de la relación consejo-situación
        if (consejo.isInverted) {
            guidance += '<p>🔄 Es importante considerar aspectos menos evidentes o convencionales. ';
            guidance += 'La solución requiere un cambio de perspectiva y trabajo interior.</p>';
        } else {
            guidance += '<p>✨ El camino a seguir se presenta de manera clara y directa. ';
            guidance += 'Las energías apoyan un avance consciente y decidido.</p>';
        }
        guidance += '</section>';

        // Recomendaciones específicas
        guidance += '<section class="recommendations">';
        guidance += '<h4>💫 Recomendaciones Específicas</h4>';
        guidance += '<ul class="guidance-points">';
        
        // 1. Situación Central
        guidance += '<li class="central-situation">';
        guidance += '<strong>Para la Situación Central:</strong><br>';
        guidance += suggestActionForCenter(consejo, centro);
        guidance += '</li>';
        
        // 2. Manejo del Desafío
        guidance += '<li class="challenge-management">';
        guidance += '<strong>Para el Desafío Presente:</strong><br>';
        guidance += suggestActionForChallenge(consejo, desafio);
        guidance += '</li>';
        
        // 3. Balance Energético
        guidance += '<li class="energy-balance">';
        guidance += '<strong>Para el Balance Energético:</strong><br>';
        guidance += analyzeEnergeticBalance([consejo, centro, desafio]);
        guidance += '</li>';

        // 4. Enfoque Práctico
        guidance += '<li class="practical-approach">';
        guidance += '<strong>Enfoque Recomendado:</strong><br>';
        guidance += generatePracticalApproach(consejo, centro, desafio);
        guidance += '</li>';
        
        guidance += '</ul>';
        guidance += '</section>';

        // Puntos de atención especial
        guidance += '<section class="special-considerations">';
        guidance += '<h4>⚠️ Puntos de Atención</h4>';
        guidance += generateAttentionPoints(consejo, centro, desafio);
        guidance += '</section>';

        // Recursos y potenciales
        guidance += '<section class="resources">';
        guidance += '<h4>💪 Recursos Disponibles</h4>';
        guidance += analyzeAvailableResources(consejo, centro, desafio);
        guidance += '</section>';

        guidance += '</div>';
        return guidance;

    } catch (error) {
        console.error("Error al generar guía de la Cruz:", error);
        return 'No se pudo generar la guía completa de la Cruz.';
    }
    
    guidance += '</ul>';
    
    return guidance;
}

// Sugerir acción específica para la situación central
function suggestActionForCenter(consejo, centro) {
    if (!consejo || !centro) return 'Evalúa la situación antes de proceder.';

    try {
        let suggestion = '';
        
        // Analizar la relación energética
        if (consejo.isInverted === centro.isInverted) {
            suggestion += '🔄 Alinea tus acciones con la energía presente:\n';
            if (consejo.isInverted) {
                suggestion += '- Profundiza en el trabajo interior\n';
                suggestion += `- ${centro.meanInv?.toLowerCase() || 'Trabaja en los aspectos que requieren atención'}\n`;
            } else {
                suggestion += '- Sigue el flujo natural de los eventos\n';
                suggestion += `- ${centro.mean?.toLowerCase() || 'Aprovecha las oportunidades presentes'}\n`;
            }
        } else {
            suggestion += '⚡ Busca el equilibrio entre diferentes enfoques:\n';
            suggestion += '- Considera múltiples perspectivas\n';
            suggestion += '- Adapta tu estrategia según sea necesario\n';
        }

        // Añadir consejos específicos
        suggestion += '\nAcciones sugeridas:\n';
        suggestion += `1. ${consejo.mean?.toLowerCase() || 'Sigue la orientación recibida'}\n`;
        suggestion += `2. ${centro.isInverted ? 'Trabaja en: ' + centro.meanInv : 'Desarrolla: ' + centro.mean}\n`;
        
        return suggestion;
    } catch (error) {
        console.error("Error al sugerir acciones para el centro:", error);
        return 'Procede con atención y consciencia.';
    }
}

// Sugerir acción específica para el desafío
function suggestActionForChallenge(consejo, desafio) {
    if (!consejo || !desafio) return 'Analiza cuidadosamente la situación antes de actuar.';

    try {
        let suggestion = '';
        
        // Analizar la relación energética
        if (consejo.isInverted === desafio.isInverted) {
            suggestion += '🔄 Trabaja directamente con la energía presente:\n';
            if (consejo.isInverted) {
                suggestion += '- Enfócate en la transformación interior\n';
                suggestion += `- ${desafio.meanInv?.toLowerCase() || 'Atiende los aspectos que requieren sanación'}\n`;
            } else {
                suggestion += '- Aprovecha el flujo natural de las energías\n';
                suggestion += `- ${desafio.mean?.toLowerCase() || 'Utiliza los recursos disponibles'}\n`;
            }
        } else {
            suggestion += '⚡ Adopta un enfoque adaptativo y flexible:\n';
            suggestion += '- Busca soluciones creativas e innovadoras\n';
            suggestion += '- Integra diferentes perspectivas y aproximaciones\n';
        }

        // Añadir recomendaciones específicas
        suggestion += '\nPasos recomendados:\n';
        suggestion += `1. ${consejo.mean?.toLowerCase() || 'Sigue la guía proporcionada'}\n`;
        suggestion += `2. ${desafio.isInverted ? 'Trabaja en resolver: ' + desafio.meanInv : 'Potencia: ' + desafio.mean}\n`;
        
        return suggestion;
    } catch (error) {
        console.error("Error al sugerir acciones para el desafío:", error);
        return 'Analiza la situación y procede con cautela.';
    }
}

// Analizar las influencias externas
function analyzeExternalInfluences(influencia, centro) {
    let analysis = '';
    
    // Descripción básica
    analysis += influencia.description + ' ';
    
    // Análisis de la interacción
    if (influencia.isInverted) {
        analysis += 'Estas influencias pueden estar creando presión o resistencia. ';
        if (centro.isInverted) {
            analysis += 'La combinación sugiere la necesidad de protección y discernimiento. ';
        } else {
            analysis += 'La situación central es estable a pesar de las influencias desafiantes. ';
        }
    } else {
        analysis += 'El entorno ofrece apoyo y recursos potenciales. ';
        if (centro.isInverted) {
            analysis += 'Estas influencias positivas pueden ayudar a reorientar la situación. ';
        } else {
            analysis += 'Hay una alineación favorable entre las energías internas y externas. ';
        }
    }
    
    return analysis;
}

// Analizar el resultado potencial
function analyzePotentialOutcome(resultado, centro, consejo) {
    let analysis = '';
    
    // Descripción del resultado
    analysis += resultado.description + ' ';
    
    // Análisis de la progresión
    if (resultado.isInverted === centro.isInverted) {
        analysis += 'La situación mantendrá su naturaleza actual, ';
        analysis += resultado.isInverted ? 
            'requiriendo trabajo continuo para su transformación. ' :
            'desarrollándose de manera natural y favorable. ';
    } else {
        analysis += 'Se anticipa un cambio significativo en la dinámica, ';
        analysis += resultado.isInverted ?
            'sugiriendo la necesidad de cautela y preparación. ' :
            'indicando una resolución positiva de los desafíos actuales. ';
    }
    
    // Relación con el consejo
    analysis += 'Si sigues la guía de ' + consejo.name + ', ';
    analysis += resultado.isInverted ?
        'podrás minimizar los aspectos desafiantes del resultado. ' :
        'maximizarás los beneficios del desenlace. ';
    
    return analysis;
}

// Analizar el balance energético de la tirada
function analyzeEnergeticBalance(runas) {
    try {
        const invertedCount = runas.filter(r => r.isInverted).length;
        let analysis = '';
        
        // Analizar el balance general
        analysis += '🌟 Balance energético general:\n';
        if (invertedCount > runas.length / 2) {
            analysis += '- Predomina la energía de transformación y cambio interno\n';
            analysis += '- Enfoque recomendado: trabajo interior y reflexión\n';
        } else if (invertedCount === runas.length / 2) {
            analysis += '- Balance equilibrado entre energías activas y receptivas\n';
            analysis += '- Enfoque recomendado: combinar acción y reflexión\n';
        } else {
            analysis += '- Predomina la energía activa y manifestadora\n';
            analysis += '- Enfoque recomendado: acción directa y desarrollo\n';
        }
        
        // Recomendaciones específicas
        analysis += '\n💫 Para mantener el equilibrio:\n';
        analysis += '- Alternar períodos de actividad y descanso\n';
        analysis += '- Mantener consciencia de ambas polaridades\n';
        analysis += '- Adaptar el enfoque según las necesidades\n';
        
        return analysis;
    } catch (error) {
        console.error("Error al analizar el balance energético:", error);
        return 'Mantén el equilibrio entre acción y reflexión.';
    }
}

// Generar recomendaciones prácticas
function generateCrossRecommendations(readingInfo) {
    const centro = readingInfo.find(r => r.position === "Situación");
    const consejo = readingInfo.find(r => r.position === "Consejo");
    
    let recommendations = '<div class="practical-recommendations">';
    recommendations += '<p>Para aprovechar al máximo esta lectura:</p>';
    recommendations += '<ul class="action-steps">';
    
    // Recomendación 1: Enfoque Principal
    recommendations += '<li class="action-step">';
    recommendations += '<strong>Enfoque Principal:</strong> ';
    recommendations += centro.isInverted ?
        'Trabajar en la clarificación y reorientación de la situación central. ' :
        'Mantener y fortalecer la base actual de la situación. ';
    recommendations += '</li>';
    
    // Recomendación 2: Acción Inmediata
    recommendations += '<li class="action-step">';
    recommendations += '<strong>Acción Inmediata:</strong> ';
    recommendations += consejo.isInverted ?
        'Reflexionar profundamente antes de tomar decisiones importantes. ' :
        'Proceder con confianza siguiendo la guía recibida. ';
    recommendations += '</li>';
    
    // Recomendación 3: Actitud
    recommendations += '<li class="action-step">';
    recommendations += '<strong>Actitud a Mantener:</strong> ';
    recommendations += generateAttitudeRecommendation(readingInfo);
    recommendations += '</li>';
    
    // Recomendación 4: Precauciones
    recommendations += '<li class="action-step">';
    recommendations += '<strong>Precauciones:</strong> ';
    recommendations += generatePrecautionRecommendation(readingInfo);
    recommendations += '</li>';
    
    recommendations += '</ul></div>';
    return recommendations;
}

// Generar recomendación de actitud
function generateAttitudeRecommendation(readingInfo) {
    const invertedCount = readingInfo.filter(r => r.isInverted).length;
    
    if (invertedCount >= 3) {
        return 'Mantener una actitud reflexiva y paciente, dando tiempo a que las transformaciones necesarias ocurran naturalmente.';
    } else {
        return 'Mantener una actitud proactiva y confiada, aprovechando el flujo favorable de las energías.';
    }
}

// Generar recomendación de precauciones
function generatePrecautionRecommendation(readingInfo) {
    const desafio = readingInfo.find(r => r.position === "Desafío");
    const influencia = readingInfo.find(r => r.position === "Influencia");
    
    let precaution = 'Prestar especial atención a ';
    
    if (desafio.isInverted && influencia.isInverted) {
        precaution += 'no dejarse sobrepasar por las presiones externas y mantener el equilibrio interno.';
    } else if (desafio.isInverted) {
        precaution += 'resolver los conflictos internos antes de tomar decisiones importantes.';
    } else if (influencia.isInverted) {
        precaution += 'protegerse de influencias externas que puedan desviar del camino elegido.';
    } else {
        precaution += 'mantener el equilibrio y no subestimar los desafíos a pesar del ambiente favorable.';
    }
    
    return precaution;
}

function generateAttentionPoints(consejo, centro, desafio) {
    try {
        let points = '<ul class="attention-points">';
        
        // Puntos de atención basados en inversiones
        if (consejo.isInverted) {
            points += `<li>⚠️ ${consejo.meanInv || 'Presta atención a aspectos menos evidentes'}</li>`;
        }
        if (centro.isInverted) {
            points += `<li>⚠️ ${centro.meanInv || 'Trabaja en la situación central'}</li>`;
        }
        if (desafio.isInverted) {
            points += `<li>⚠️ ${desafio.meanInv || 'Atiende los desafíos presentes'}</li>`;
        }
        
        // Puntos generales de atención
        points += '<li>🎯 Mantén el enfoque en los objetivos principales</li>';
        points += '<li>⚖️ Busca el balance entre acción y reflexión</li>';
        points += '<li>🔄 Permanece flexible y adaptable</li>';
        
        points += '</ul>';
        return points;
    } catch (error) {
        console.error("Error al generar puntos de atención:", error);
        return '<ul><li>Mantén la atención y consciencia en cada paso</li></ul>';
    }
}

function analyzeAvailableResources(consejo, centro, desafio) {
    try {
        let resources = '<ul class="available-resources">';
        
        // Recursos del consejo
        resources += '<li class="resource-item">';
        resources += '<strong>💫 Guía Disponible:</strong><br>';
        resources += `${consejo.mean || 'Sigue la orientación proporcionada'}</li>`;
        
        // Recursos de la situación central
        resources += '<li class="resource-item">';
        resources += '<strong>🔮 Potencial Central:</strong><br>';
        resources += `${centro.mean || 'Utiliza la energía presente'}</li>`;
        
        // Recursos para el desafío
        resources += '<li class="resource-item">';
        resources += '<strong>⚡ Energía Transformadora:</strong><br>';
        resources += `${desafio.mean || 'Aprovecha la fuerza del desafío'}</li>`;
        
        resources += '</ul>';
        return resources;
    } catch (error) {
        console.error("Error al analizar recursos disponibles:", error);
        return '<ul><li>Utiliza los recursos a tu disposición de manera consciente</li></ul>';
    }
}

function generatePracticalApproach(consejo, centro, desafio) {
    try {
        let approach = '';
        const invertedCount = [consejo, centro, desafio].filter(r => r.isInverted).length;
        
        approach += '📝 Plan de acción recomendado:\n\n';
        
        if (invertedCount >= 2) {
            approach += '1. Período de reflexión y análisis interno\n';
            approach += '2. Identificación de patrones que necesitan cambio\n';
            approach += '3. Transformación gradual y consciente\n';
        } else {
            approach += '1. Acción directa y decidida\n';
            approach += '2. Aprovechamiento de recursos disponibles\n';
            approach += '3. Desarrollo progresivo del potencial\n';
        }
        
        approach += '\n💡 Enfoque específico:\n';
        approach += `- ${consejo.mean?.toLowerCase() || 'Sigue la guía proporcionada'}\n`;
        approach += `- ${centro.isInverted ? 'Trabaja en: ' + centro.meanInv : 'Potencia: ' + centro.mean}\n`;
        
        return approach;
    } catch (error) {
        console.error("Error al generar enfoque práctico:", error);
        return 'Procede con atención y consciencia en cada paso.';
    }
}