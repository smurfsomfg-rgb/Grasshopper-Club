// Funciones para mostrar las cartas del tarot
function mostrarNuevasCartas(tirada, spread, cardsDiv) {
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

function mostrarTirada() {
    const spreadKey = document.getElementById('spread').value;
    const spread = TarotSpreads[spreadKey];
    const tirada = barajarYRepartir(spread.cards.length);
    const cardsDiv = document.getElementById('cards');
    
    // Efecto de salida para las cartas existentes
    const cartasAnteriores = cardsDiv.querySelectorAll('.card');
    if (cartasAnteriores.length > 0) {
        cartasAnteriores.forEach((carta, i) => {
            carta.style.animation = 'cardFlip 0.5s ease-in reverse';
            carta.style.animationDelay = `${i * 0.1}s`;
            carta.style.animationFillMode = 'forwards';
        });
        
        // Esperar a que terminen las animaciones antes de mostrar las nuevas
        setTimeout(() => {
            cardsDiv.innerHTML = '';
            mostrarNuevasCartas(tirada, spread, cardsDiv);
        }, cartasAnteriores.length * 100 + 500);
    } else {
        cardsDiv.innerHTML = '';
        mostrarNuevasCartas(tirada, spread, cardsDiv);
    }
}

// Exportar funciones
window.mostrarTirada = mostrarTirada;
window.mostrarNuevasCartas = mostrarNuevasCartas;