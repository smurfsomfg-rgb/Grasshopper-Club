// Módulo de funciones para la interpretación de la tirada en herradura
(function() {
    // Variables y funciones auxiliares
    const elements = {
        fire: ["Fehu", "Kenaz", "Sowilo", "Dagaz"],
        ice: ["Isa", "Hagalaz", "Nauthiz"],
        air: ["Ansuz", "Raidho", "Gebo", "Wunjo"],
        earth: ["Uruz", "Othala", "Ingwaz", "Berkano"],
        water: ["Laguz", "Ehwaz", "Perthro"],
        spirit: ["Thurisaz", "Eihwaz", "Mannaz", "Algiz", "Tiwaz"]
    };

    // Analizar patrones elementales
    function analyzeElementalPatterns(readingInfo) {
        if (!Array.isArray(readingInfo) || readingInfo.length === 0) {
            return "No hay suficiente información para analizar patrones elementales.";
        }

        try {
            // Contar apariciones de elementos
            const elementCounts = {
                fire: 0, ice: 0, air: 0, earth: 0, water: 0, spirit: 0
            };
            
            readingInfo.forEach(rune => {
                if (rune && rune.name) {
                    for (let [element, runes] of Object.entries(elements)) {
                        if (runes.includes(rune.name)) {
                            elementCounts[element]++;
                        }
                    }
                }
            });
            
            // Generar análisis
            let analysis = "Patrones Elementales: ";
            
            const dominantElements = Object.entries(elementCounts)
                .filter(([_, count]) => count > 0)
                .sort(([_, a], [__, b]) => b - a);
            
            if (dominantElements.length > 0) {
                const [primaryElement, primaryCount] = dominantElements[0];
                analysis += `Predomina el elemento ${primaryElement} (${primaryCount} runas), `;
                analysis += "sugiriendo que ";
                
                const elementalMeanings = {
                    fire: "la transformación y la energía creativa son centrales en este momento",
                    ice: "es un período de consolidación y resistencia",
                    air: "la comunicación y el movimiento son fundamentales",
                    earth: "los aspectos prácticos y materiales requieren atención",
                    water: "las emociones y la intuición guían el camino",
                    spirit: "el crecimiento espiritual y la evolución personal son prioritarios"
                };
                
                analysis += elementalMeanings[primaryElement] || "los elementos trabajan en armonía";
            }
            
            return analysis;
        } catch (error) {
            console.error("Error al analizar patrones elementales:", error);
            return "Los elementos se encuentran en movimiento y transformación.";
        }
    }

    // Encontrar relaciones entre runas
    function findRunicRelationships(readingInfo) {
        try {
            if (!Array.isArray(readingInfo)) {
                throw new Error("Datos de lectura inválidos");
            }

            let relationships = "Conexiones Rúnicas: ";
            
            // Buscar runas repetidas
            const runeCounts = {};
            readingInfo.forEach(rune => {
                if (rune && rune.name) {
                    runeCounts[rune.name] = (runeCounts[rune.name] || 0) + 1;
                }
            });
            
            const repeatedRunes = Object.entries(runeCounts)
                .filter(([_, count]) => count > 1);
            
            if (repeatedRunes.length > 0) {
                relationships += "Se observa una resonancia especial con ";
                relationships += repeatedRunes
                    .map(([name, count]) => `${name} (${count} veces)`)
                    .join(", ");
                relationships += ", lo que enfatiza estos aspectos en la lectura. ";
            } else {
                relationships += "No se observan repeticiones significativas de runas.";
            }
            
            return relationships;
        } catch (error) {
            console.error("Error al analizar relaciones rúnicas:", error);
            return "No se pudieron analizar las conexiones rúnicas.";
        }
    }

    // Analizar el momento presente
    function analyzePresent(presente, pasadoCercano, futuroCercano) {
        try {
            if (!presente || !pasadoCercano || !futuroCercano) {
                return "No hay suficiente información para analizar el momento presente.";
            }

            let analysis = `La runa ${presente.name} en el presente indica ${presente.meaning}. `;
            analysis += "Este momento actúa como un puente entre ";
            analysis += `las influencias recientes de ${pasadoCercano.name} `;
            analysis += `y las energías emergentes de ${futuroCercano.name}. `;

            // Analizar la dinámica actual
            const currentDynamics = analyzeDynamics([pasadoCercano, presente, futuroCercano]);
            analysis += currentDynamics;

            return analysis;
        } catch (error) {
            console.error("Error al analizar el momento presente:", error);
            return "El momento presente contiene potenciales significativos para el crecimiento y la transformación.";
        }
    }

    // Analizar el futuro cercano
    function analyzeNearFuture(futuroCercano, presente, futuroLejano) {
        try {
            if (!futuroCercano || !presente || !futuroLejano) {
                return "No hay suficiente información para analizar el futuro cercano.";
            }

            let analysis = `La runa ${futuroCercano.name} sugiere que ${futuroCercano.meaning}. `;
            analysis += `Esta energía emerge del presente (${presente.name}) `;
            analysis += `y se proyecta hacia ${futuroLejano.name} en el futuro distante. `;

            // Analizar las tendencias emergentes
            const emergingTrends = analyzeEmergingTrends([presente, futuroCercano, futuroLejano]);
            analysis += emergingTrends;

            return analysis;
        } catch (error) {
            console.error("Error al analizar el futuro cercano:", error);
            return "Las tendencias emergentes indican un período de cambio y adaptación.";
        }
    }

    // Analizar el futuro lejano
    function analyzeFarFuture(futuroLejano, futuroCercano) {
        try {
            if (!futuroLejano || !futuroCercano) {
                return "No hay suficiente información para analizar el futuro lejano.";
            }

            let analysis = `La runa ${futuroLejano.name} en el horizonte distante sugiere ${futuroLejano.meaning}. `;
            analysis += `Este potencial se desarrolla a través de ${futuroCercano.name}, `;
            analysis += "indicando un camino de desarrollo y transformación. ";

            // Analizar el potencial futuro
            const futurePotential = analyzePotential([futuroCercano, futuroLejano]);
            analysis += futurePotential;

            return analysis;
        } catch (error) {
            console.error("Error al analizar el futuro lejano:", error);
            return "El horizonte futuro contiene potenciales significativos para el crecimiento y la realización.";
        }
    }

    // Generar guía detallada
    function generateDetailedGuidance(consejo, readingInfo) {
        try {
            if (!consejo || !readingInfo) {
                return "No hay suficiente información para generar una guía detallada.";
            }

            let guidance = `<p class="rune-guidance">La runa ${consejo.name} aconseja: ${consejo.meaning}</p>`;
            
            // Añadir recomendaciones prácticas
            guidance += `<p class="practical-advice">Recomendaciones prácticas:</p>`;
            guidance += "<ul>";
            guidance += generatePracticalAdvice(consejo, readingInfo)
                .map(advice => `<li>${advice}</li>`)
                .join("");
            guidance += "</ul>";

            return guidance;
        } catch (error) {
            console.error("Error al generar guía detallada:", error);
            return "La guía de las runas sugiere mantener la atención y la apertura en este momento.";
        }
    }

    // Generar síntesis
    function generateSynthesis(sintesis, readingInfo) {
        try {
            if (!sintesis || !readingInfo) {
                return "No hay suficiente información para generar una síntesis.";
            }

            let synthesis = `La runa ${sintesis.name} como síntesis indica que ${sintesis.meaning}. `;
            
            // Analizar patrones y temas generales
            const patterns = analyzeElementalPatterns(readingInfo);
            const relationships = findRunicRelationships(readingInfo);
            
            synthesis += patterns + " ";
            synthesis += relationships + " ";

            // Añadir conclusión integradora
            synthesis += "Esta configuración de runas sugiere un momento de ";
            synthesis += interpretOverallTheme(readingInfo);

            return synthesis;
        } catch (error) {
            console.error("Error al generar síntesis:", error);
            return "La síntesis del Wyrd revela un momento significativo de transformación y potencial.";
        }
    }

    // Analizar la transición del pasado
    function analyzePastTransition(pasadoLejano, pasadoCercano) {
        try {
            if (!pasadoLejano || !pasadoCercano) {
                return "No hay suficiente información para analizar la transición del pasado.";
            }

            let analysis = `Las runas ${pasadoLejano.name} y ${pasadoCercano.name} revelan una trayectoria desde `;
            analysis += `${pasadoLejano.meaning}. `;
            analysis += `Este camino ha evolucionado hacia ${pasadoCercano.meaning}, `;
            analysis += "mostrando cómo las experiencias pasadas han moldeado el presente. ";

            // Analizar la naturaleza del cambio
            const changeNature = analyzeChangeNature(pasadoLejano, pasadoCercano);
            analysis += changeNature;

            return analysis;
        } catch (error) {
            console.error("Error al analizar la transición del pasado:", error);
            return "La transición del pasado contiene lecciones importantes que continúan influenciando el presente.";
        }
    }

    // Analizar la naturaleza del cambio
    function analyzeChangeNature(rune1, rune2) {
        let element1 = Object.entries(elements).find(([_, runes]) => runes.includes(rune1.name))?.[0];
        let element2 = Object.entries(elements).find(([_, runes]) => runes.includes(rune2.name))?.[0];

        if (element1 === element2) {
            return "Este período muestra una continuidad y profundización de las energías existentes.";
        } else {
            return `La transición desde ${element1 || 'energías iniciales'} hacia ${element2 || 'nuevas energías'} sugiere un período de transformación significativa.`;
        }
    }

    // Analizar dinámicas
    function analyzeDynamics(runes) {
        const elementalFlow = runes.map(rune => {
            return Object.entries(elements).find(([_, runeList]) => runeList.includes(rune.name))?.[0] || "neutral";
        });

        return "La dinámica actual sugiere " + 
               (new Set(elementalFlow).size === 1 ? 
               "un período de estabilidad y consolidación." : 
               "un momento de transformación y ajuste.");
    }

    // Analizar tendencias emergentes
    function analyzeEmergingTrends(runes) {
        const runeElements = runes.map(rune => {
            return Object.entries(elements).find(([_, runeList]) => runeList.includes(rune.name))?.[0] || "neutral";
        });

        const uniqueElements = new Set(runeElements);
        
        if (uniqueElements.size === 1) {
            return "Las tendencias emergentes sugieren un período de profundización y maestría.";
        } else if (uniqueElements.size === 2) {
            return "Se observa una transición gradual hacia nuevas energías y oportunidades.";
        } else {
            return "El futuro cercano trae una diversidad de influencias y posibilidades.";
        }
    }

    // Analizar potencial
    function analyzePotential(runes) {
        if (runes.length < 2) return "El potencial futuro está en desarrollo.";

        const elementalPath = runes.map(rune => {
            return Object.entries(elements).find(([_, runeList]) => runeList.includes(rune.name))?.[0] || "neutral";
        });

        const [current, future] = elementalPath;
        
        if (current === future) {
            return "El camino hacia el futuro sugiere una profundización y maestría de las energías actuales.";
        } else {
            return `La transición desde ${current || 'el presente'} hacia ${future || 'el futuro'} indica un período de transformación y evolución.`;
        }
    }

    // Generar consejos prácticos
    function generatePracticalAdvice(consejo, readingInfo) {
        const consejoElement = Object.entries(elements)
            .find(([_, runes]) => runes.includes(consejo.name))?.[0];

        const advice = [];

        switch (consejoElement) {
            case 'fire':
                advice.push("Toma iniciativa en situaciones que requieren acción");
                advice.push("Cultiva tu creatividad y pasión");
                advice.push("Mantén el momentum pero evita la impulsividad");
                break;
            case 'ice':
                advice.push("Practica la paciencia y la perseverancia");
                advice.push("Utiliza los obstáculos como oportunidades de aprendizaje");
                advice.push("Mantén la calma ante las dificultades");
                break;
            case 'air':
                advice.push("Mejora tus habilidades de comunicación");
                advice.push("Mantén la mente abierta a nuevas ideas");
                advice.push("Busca claridad en tus pensamientos y expresión");
                break;
            case 'earth':
                advice.push("Enfócate en aspectos prácticos y tangibles");
                advice.push("Construye bases sólidas para el futuro");
                advice.push("Mantén el contacto con tu cuerpo y la naturaleza");
                break;
            case 'water':
                advice.push("Confía en tu intuición y emociones");
                advice.push("Fluye con los cambios naturales");
                advice.push("Cultiva la flexibilidad y adaptabilidad");
                break;
            case 'spirit':
                advice.push("Profundiza en tu desarrollo personal");
                advice.push("Mantén el equilibrio entre lo material y lo espiritual");
                advice.push("Cultiva la sabiduría interior");
                break;
            default:
                advice.push("Mantén el equilibrio en todas las áreas de tu vida");
                advice.push("Observa los patrones y ciclos que se manifiestan");
                advice.push("Confía en el proceso de desarrollo personal");
        }

        return advice;
    }

    // Interpretar tema general
    function interpretOverallTheme(readingInfo) {
        const elementalCounts = {
            fire: 0, ice: 0, air: 0, earth: 0, water: 0, spirit: 0
        };

        readingInfo.forEach(rune => {
            if (rune && rune.name) {
                Object.entries(elements).forEach(([element, runes]) => {
                    if (runes.includes(rune.name)) elementalCounts[element]++;
                });
            }
        });

        const dominantElement = Object.entries(elementalCounts)
            .sort(([_, a], [__, b]) => b - a)[0][0];

        const themes = {
            fire: "transformación y crecimiento activo",
            ice: "consolidación y superación de desafíos",
            air: "comunicación y cambio mental",
            earth: "manifestación y estabilidad material",
            water: "evolución emocional y flujo intuitivo",
            spirit: "desarrollo espiritual y sabiduría interior"
        };

        return themes[dominantElement] || "integración y balance de múltiples energías";
    }

    // Exponer módulo al objeto global window
    window.HorseShoeModule = {
        analyzeElementalPatterns,
        findRunicRelationships,
        analyzePastTransition,
        analyzePresent,
        analyzeNearFuture,
        analyzeFarFuture,
        generateDetailedGuidance,
        generateSynthesis,
        analyzeChangeNature,
        analyzeDynamics,
        analyzeEmergingTrends,
        analyzePotential,
        generatePracticalAdvice,
        interpretOverallTheme
    };
})();
