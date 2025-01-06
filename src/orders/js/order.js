fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

window.onload = function () {
    loadOrderData();
};

function loadOrderData() {
    clearProductsContainer();
    getProductsFromOrder();
}

function clearProductsContainer() {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
}

function getProductsFromOrder() {
    let token = getInstance().token;
    let orderId = getOrderIdFromUrl();

    if (orderId !== undefined && orderId) {
        axios
            .get(`${API_URL}orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                let order = response.data.order;

                if (!order || order === undefined) {
                    showToast("No se encontró la orden", toastTypes.INFO);
                    return;
                }

                orderId = order._id;
                branchId = order.branch._id;

                let clientAddress = order.customer.client.addresses.find(address => address.isCurrentAddress);
                loadAddressData(clientAddress, order.branch.address);

                let products = order.orderProducts;
                const productsContainer = document.getElementById('products-container');
                const statusBadge = document.getElementById('status-badge');
                statusBadge.textContent = getStatusText(order.statusOrder);

                products.forEach(product => {
                    const productCard = createProductCard(product);
                    productsContainer.appendChild(productCard);
                });

                updatePrices();
                loadButtons(order.statusOrder);
            })
            .catch((error) => {
                console.error(error);
                handleException(error);
            });
    }
}

function loadButtons(status) {
    let role = getInstance().role;
    switch (role) {
        case roles.DELIVERY_PERSON:
            loadDeliveryButtons(status);
            break;
        case roles.SALES_EXECUTIVE:
            loadSalesExecutiveButtons(status);
            break;
        default:
            break;
    }
}

function loadDeliveryButtons(status) {
    const primaryButton = document.getElementById('primary-button');
    const secondaryButton = document.getElementById('secondary-button');
    
    const averageTime = document.getElementById('average-time');

    averageTime.textContent = 'Tiempo máximo de entrega de 50 minutos';

    if (status === 'approved') {
        primaryButton.textContent = 'En tránsito';
        primaryButton.addEventListener('click', () => {
            updateOrderStatus(orderId,'in transit');
        });
        primaryButton.classList.remove('d-none');
    } else if (status === 'in transit') {
        primaryButton.textContent = 'Entregado';
        primaryButton.addEventListener('click', () => {
            updateOrderStatus(orderId,'delivered');
        });
        primaryButton.classList.remove('d-none');
        secondaryButton.textContent = 'No entregado';
        secondaryButton.addEventListener('click', () => {
            updateOrderStatus(orderId,'not delivered');
        });
        secondaryButton.classList.remove('d-none');
    }
}

function loadSalesExecutiveButtons(status) {
    const primaryButton = document.getElementById('primary-button');
    const secondaryButton = document.getElementById('secondary-button');
    
    const averageTime = document.getElementById('average-time');

    averageTime.textContent = 'Tiempo máximo de entrega de 50 minutos';

    let orderId = getOrderIdFromUrl();

    if (status === 'pending') {
        primaryButton.textContent = 'Aprobar';
        primaryButton.addEventListener('click', () => {
            approveOrder(orderId);
        });
        primaryButton.classList.remove('d-none');
        secondaryButton.textContent = 'Denegar';
        secondaryButton.addEventListener('click', () => {
            updateOrderStatus(orderId,'denied');
        });
        secondaryButton.classList.remove('d-none');
    }
}

function getStatusText(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Pendiente';
        case 'reserved':
            return 'Reservado';
        case 'approved':
            return 'Aprobado';
        case 'denied':
            return 'Denegado';
        case 'in transit':
            return 'En tránsito';
        case 'delivered':
            return 'Entregado';
        case 'not delivered':
            return 'No entregado';
        case 'cancelled':
            return 'Cancelado';
        default:
            return 'Desconocido';
    }
}

const SHIPPING_COST = 50.00;

function setTotalPrice(totalPrice) {
    const totalPriceProducts = document.getElementById('total-price-products');
    const totalPriceText = document.getElementById('total-price');
    const shippingCostText = document.getElementById('shipping-cost');

    totalPriceProducts.textContent = `$${totalPrice.toFixed(2)}`;
    totalPriceText.textContent = `$${(totalPrice + SHIPPING_COST).toFixed(2)}`;
    shippingCostText.textContent = `$${SHIPPING_COST.toFixed(2)}`;
}

function getOrderIdFromUrl() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('orderId');
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

function updatePrices() {
    let totalPrice = 0.00;
    const orderItems = document.getElementById('products-container');
    const items = Array.from(orderItems.querySelectorAll('.card-container'));
    items.forEach(item => {
        let price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
        let quantity = parseInt(item.querySelector('.quantity').dataset.quantity);
        totalPrice += price * quantity;
    });

    setTotalPrice(totalPrice);
}


const DEFAULT_TEXT = "0";

function createProductCard(product) {
    const productDetails = product.product;
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
                        <div class="d-flex align-items-center gap-2">
                            <span class="quantity mx-2 text-secondary" data-quantity="${product.quantity || DEFAULT_TEXT}">Cantidad: ${product.quantity || DEFAULT_TEXT} ${product.quantity === 1 ? 'producto' : 'productos'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return cardContainer;
}
