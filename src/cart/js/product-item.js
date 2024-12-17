function createProductCard(product) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container p-3 card border-1 shadow-sm mb-3';

    cardContainer.innerHTML = `
        <div class="card-body p-0">
            <div class="row align-items-center g-3">
                <!-- Product Image -->
                <div class="col-auto">
                    <img src="${product.imageUrl}" 
                         alt="${product.name}" 
                         class="product-img rounded">
                </div>

                <!-- Product Details -->
                <div class="col">
                    <div class="row align-items-center mb-3">
                        <div class="col-12 col-sm">
                            <h5 class="fs-6 mb-2 mb-sm-1">${product.name}</h5>
                            <p class="small text-muted mb-2 mb-sm-0">${product.description}</p>
                        </div>
                        <div class="col-auto">
                            <span class="h5 mb-0 text-primary">$${product.price.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-center justify-content-end gap-5">
                        <button class="btn-delete btn btn-link text-danger p-0">
                            <i class="icon-delete fas fa-trash me-1"></i>
                            Eliminar
                        </button>
                        
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn-quantity">-</button>
                            <span class="mx-2">${product.quantity}</span>
                            <button class="btn-quantity">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const deleteBtn = cardContainer.querySelector('.btn-delete');
    const minusBtn = cardContainer.querySelector('.btn-quantity:first-of-type');
    const plusBtn = cardContainer.querySelector('.btn-quantity:last-of-type');
    const quantitySpan = cardContainer.querySelector('.mx-2');

    deleteBtn.addEventListener('click', () => {
        cardContainer.remove();
    });

    minusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            quantitySpan.textContent = quantity - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        quantitySpan.textContent = quantity + 1;
    });

    return cardContainer;
}
