const DEFAULT_TEXT = "0";
const DELETE_QUANTITY = 0;

function createProductCard(product) {
    const productDetails = product.product;
    const productLimit = product.product.limit;
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container p-3 card border-1 shadow-sm mb-3';
    cardContainer.setAttribute('product-id', product.product._id); 

    cardContainer.innerHTML = `
        <div class="card-body p-0">
            <div class="row align-items-center g-3">
                <!-- Product Image -->
                <div class="col-auto">
                    <img src="${productDetails.image || '../assets/images/default-img-product.jpg'}" 
                        alt="${productDetails.name || DEFAULT_TEXT}" 
                        class="product-img rounded">
                </div>

                <!-- Product Details -->
                <div class="col">
                    <div class="row align-items-center mb-3">
                        <div class="col-12 col-sm">
                            <h5 class="fs-6 mb-2 mb-sm-1">${productDetails.name || DEFAULT_TEXT}</h5>
                            <p class="small text-muted mb-2 mb-sm-0">${productDetails.description}</p>
                        </div>
                        <div class="col-auto">
                            <span class="price h5 mb-0 text-primary">$${productDetails.unitPrice.toFixed(2) || DEFAULT_TEXT}</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-center justify-content-end gap-5">
                        <button class="btn-delete btn btn-link text-danger p-0">
                            <i class="icon-delete fas fa-trash me-1"></i>
                            Eliminar
                        </button>
                        
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn-quantity">-</button>
                            <span class="quantity mx-2">${product.quantity || DEFAULT_TEXT}</span>
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
        deleteItemFromCart(product.product._id);
    });

    minusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
            quantitySpan.textContent = quantity - 1;
        } else {
            minusBtn.disabled = true;
        }

        if (quantity === productLimit) {
            plusBtn.disabled = false;
        }

        updatePrices();
    });

    plusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantitySpan.textContent);

        if (quantity < productLimit) {
            quantitySpan.textContent = quantity + 1;
            if (quantity > 0) {
                minusBtn.disabled = false;
            }
            if (quantity+1 === productLimit) {
                plusBtn.disabled = true;
                showToast(`El limite para este producto es ${productLimit}`, toastTypes.INFO);
            }
        }

        updatePrices();
    });

    return cardContainer;
}

function deleteItemFromCart(productId) {
    axios
        .patch(`${API_URL}carts/${orderId}`, 
            {
                productId: productId,
                quantity: DELETE_QUANTITY
            },
            {
                params: {
                    status: CART_STATUS
                }
            }
        )
        .then((response) => {
            showToast(response.data.message, toastTypes.SUCCESS);
            if (cartItems.children.length <= 1) {
                clearCartUI();
            }
            
            updatePrices();
        })
        .catch((error) => {
            handleException(error);
        });
}