const CART_STATUS = 'reserved';
const SHIPPING_COST = 50.00;

var user;
var userId;
var cartItems;
var productsMessage;
var clearBtn;
var orderId;
var branchId;

let role = getInstance().role;
if (role !== roles.CUSTOMER) {
    window.history.back();
}

fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;

        cartItems = document.getElementById('cart-items')
        productsMessage = document.getElementById('products-message');
        clearBtn = document.querySelector('.clear-cart-btn');
        user = getInstance();
        userId = user.id;
        loadProducts();
    });

function loadProducts() {
    clearCartUI();
    getProductsFromCart();
}

function getProductsFromCart() {
    let token = getInstance().token;

    axios
        .get(`${API_URL}carts/${userId}`, {
            params: {
                status: CART_STATUS
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            let cart = response.data.cart;

            if (cart === undefined || cart === null || cart.orderProducts.length === 0) {
                showToast("No hay productos en el carrito", toastTypes.INFO);
                return;
            }

            orderId = cart._id;
            branchId = cart.branch._id;

            showToast(response.data.message, toastTypes.SUCCESS);

            let clientAddress = cart.customer.client.addresses.find(address => address.isCurrentAddress);
            loadAddressData(clientAddress, cart.branch.address);

            cart.orderProducts.forEach(product => {
                const productCard = createProductCard(product);
                cartItems.appendChild(productCard);
            });

            if (!isEmptyCart()) {
                updatePrices();
            }
        })
        .catch((error) => {
            handleException(error);
        });
}

function loadAddressData(clientAddress, branchAddress) {
    let clientAddressP = document.getElementById('client-address');
    let branchAddressP = document.getElementById('branch-address');

    if (clientAddress && branchAddress) {
        clientAddressP.textContent = formatAddress(clientAddress);
        branchAddressP.textContent = formatAddress(branchAddress);
    } else {
        showToast("No se pudo cargar la dirección", toastTypes.WARNING);
    }
}

function formatAddress(address) {
    if (!address) return 'Dirección no disponible';

    const { street, number, cologne, zipcode, locality, federalEntity } = address;

    const formattedAddress = [
        street && number ? `${street} ${number}` : '',
        cologne || '',
        zipcode || '',
        locality || '',
        federalEntity || ''
    ].filter(Boolean).join(', ');

    return formattedAddress;
}

function clearCartUI() {
    const emptyCartTemplate = `
        <p id="products-message" class="text-center without-products">
            Sin Productos Agregados.<br>
            Agrega productos al carrito para realizar tu pedido
        </p>
    `;

    cartItems.innerHTML = emptyCartTemplate;

    if (clearBtn) {
        clearBtn.disabled = true;
    }

    const totalPrice = document.getElementById('total-price');
    const totalPriceProducts = document.getElementById('total-price-products');
    if (totalPrice) totalPrice.textContent = '$0.00';
    if (totalPriceProducts) totalPriceProducts.textContent = '$0.00';
}

function isEmptyCart() {
    productsMessage = document.getElementById('products-message');
    const items = cartItems.children;

    if (items.length > 1) {
        productsMessage.className = 'with-products';
        if (clearBtn) clearBtn.disabled = false;
        return false;
    }

    if (clearBtn) {
        clearBtn.disabled = true;
        productsMessage.className = 'without-products';
    }

    return true;
}

async function goToPayment() {
    if (isEmptyCart()) {
        showToast("Debes tener productos agregados en el carrito para pagar", toastTypes.INFO);
        return;
    }

    try {
        const items = Array.from(cartItems.querySelectorAll('.card-container'));
        let allProductsAvailable = true;

        for (const item of items) {
            const productId = item.getAttribute('product-id');
            const quantity = parseInt(item.querySelector('.quantity').textContent);

            const isAvailable = await validateAvailability(productId, quantity);
            if (!isAvailable) {
                allProductsAvailable = false;
            }
        }

        if (allProductsAvailable) {
            window.location.href = './cart-payment.html';
        }

    } catch (error) {
        handleException(error, "Ocurrió un error al validar el inventario");
    }
}

function clearCart() {
    deleteProductsFromCart();
}

function deleteProductsFromCart() {
    let token = getInstance().token;

    axios
        .delete(`${API_URL}carts/${orderId}`, {
            params: {
                status: CART_STATUS
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            showToast(response.data.message, toastTypes.SUCCESS);
            clearCartUI();
        })
        .catch((error) => {
            handleException(error);
        });
}

function setTotalPrice(totalPrice) {
    const totalPriceProducts = document.getElementById('total-price-products');
    const totalPriceText = document.getElementById('total-price');
    const shippingCostText = document.getElementById('shipping-cost');

    totalPriceProducts.textContent = `$${totalPrice.toFixed(2)}`;
    totalPriceText.textContent = `$${(totalPrice + SHIPPING_COST).toFixed(2)}`;
    shippingCostText.textContent = `$${SHIPPING_COST.toFixed(2)}`;
}

function updatePrices() {
    let totalPrice = 0.00;
    const items = Array.from(cartItems.querySelectorAll('.card-container'));
    items.forEach(item => {
        let price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
        let quantity = parseInt(item.querySelector('.quantity').textContent);
        totalPrice += price * quantity;
    });

    setTotalPrice(totalPrice);
}

async function validateAvailability(productId, newQuantity) {
    let token = getInstance().token;

    try {
        const response = await axios.patch(
            `${API_URL}carts/${orderId}`,
            {
                productId: productId,
                quantity: newQuantity,
                branchId: branchId
            },
            {
                params: {
                    status: CART_STATUS
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        clearCartUI();

        const hasStock = response.data.hasStock;
        if (!hasStock) {
            showToast(
                "Ajustamos algunos productos de acuerdo a el inventario disponible. Lamentamos los inconvenientes",
                toastTypes.WARNING
            );
        }

        if (!response.data.cart.orderProducts) {
            return false;
        }

        response.data.cart.orderProducts.forEach(product => {
            if (product.quantity === 0) return;
            const productCard = createProductCard(product);
            cartItems.appendChild(productCard);
        });

        isEmptyCart();
        updatePrices();

        return hasStock;
    } catch (error) {
        handleException(error, "Ocurrió un error al validar el inventario");
        return false;
    }
}