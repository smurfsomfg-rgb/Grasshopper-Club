// Sistema de modal para cartas
const cardModal = document.createElement('div');
cardModal.className = 'card-modal';
cardModal.innerHTML = `
    <div class="card-modal-content">
        <div class="card-modal-header">
            <h2 class="card-modal-title"></h2>
            <button class="close-modal-btn">×</button>
        </div>
        <div class="card-modal-body">
            <img class="modal-card-image" src="" alt="">
            <div class="modal-card-info">
                <div class="meaning-section">
                    <h4>Significado Derecho</h4>
                    <p class="upright-meaning"></p>
                </div>
                <div class="meaning-section">
                    <h4>Significado Invertido</h4>
                    <p class="reversed-meaning"></p>
                </div>
            </div>
        </div>
    </div>
`;
document.body.appendChild(cardModal);

// Manejadores del modal
const closeModalBtn = cardModal.querySelector('.close-modal-btn');
closeModalBtn.addEventListener('click', () => closeCardModal());
cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) closeCardModal();
});

function showCardModal(card) {
    const title = card.querySelector('h3').textContent;
    const img = card.querySelector('img').src;
    const meaningDiv = card.querySelector('.meaning');
    const meanings = {
        up: meaningDiv.querySelector('p:first-child').textContent.replace('Derecha:', '').trim(),
        rev: meaningDiv.querySelector('p:last-child').textContent.replace('Invertida:', '').trim()
    };

    cardModal.querySelector('.card-modal-title').textContent = title;
    cardModal.querySelector('.modal-card-image').src = img;
    cardModal.querySelector('.upright-meaning').textContent = meanings.up;
    cardModal.querySelector('.reversed-meaning').textContent = meanings.rev;

    cardModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCardModal() {
    cardModal.classList.remove('show');
    document.body.style.overflow = '';
}