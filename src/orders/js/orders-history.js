fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

window.onload = function () {
    loadInitialData();
};

function loadInitialData() {
    loadFilters();
    loadOrders();
}

function loadFilters() {
    let role = getInstance().role;
    switch (role) {
        case roles.CUSTOMER:
            loadCustomerFilters();
            break;
        case roles.SALES_EXECUTIVE:
            loadSalesExecutiveFilters();
            break;
        case roles.DELIVERY_PERSON:
            loadDeliveryPersonFilters();
            break;
        default:
            break;
    }
}

function loadCustomerFilters() {
    const customerFilters = `
        <button class="btn btn-primary badge-filter" data-status="all" onclick="filterOrders('Todos')">Todos</button>
        <button class="btn btn-outline-secondary badge-filter" data-status="pending" onclick="filterOrders('Pendiente')">Pendiente</button>
        <button class="btn btn-outline-secondary badge-filter" data-status="in-transit" onclick="filterOrders('En tránsito')">En tránsito</button>
        <button class="btn btn-outline-secondary badge-filter" data-status="delivered" onclick="filterOrders('Entregado')">Entregado</button>
        <button class="btn btn-outline-secondary badge-filter" data-status="cancelled" onclick="filterOrders('Cancelado')">Cancelado</button>
    `;

    loadFiltersByType(customerFilters);

}

function loadSalesExecutiveFilters() {
    const salesExecutiveFilters = `
        <button class="btn btn-outline-secondary badge-filter" data-status="all" onclick="filterOrders('Todos')">Todos</button>
        <button class="btn btn-outline-primary badge-filter" data-status="pending" onclick="filterOrders('Pendiente')">Pendiente</button>
        <button class="btn btn-outline-warning badge-filter" data-status="in-transit" onclick="filterOrders('En tránsito')">En Tránsito</button>
        <button class="btn btn-outline-success badge-filter" data-status="approved" onclick="filterOrders('Aprobado')">Aprobado</button>
        <button class="btn btn-outline-danger badge-filter" data-status="denied" onclick="filterOrders('Denegado')">Denegado</button>
        <button class="btn btn-outline-success badge-filter" data-status="delivered" onclick="filterOrders('Entregado')">Entregado</button>
        <button class="btn btn-outline-danger badge-filter" data-status="not-delivered" onclick="filterOrders('No Entregado')">No Entregado</button>
        <button class="btn btn-outline-danger badge-filter" data-status="cancelled" onclick="filterOrders('Cancelado')">Cancelado</button>
    `;
    loadFiltersByType(salesExecutiveFilters);
}

function loadDeliveryPersonFilters() {
    const deliveryPersonFilters = `
    
        <button class="btn btn-outline-secondary badge-filter" data-status="all" onclick="filterOrders('Todos')">Todos</button>
        <button class="btn btn-outline-primary badge-filter" data-status="approved" onclick="filterOrders('Aprobado')">Aprobado</button>
        <button class="btn btn-outline-warning badge-filter" data-status="in-transit" onclick="filterOrders('En tránsito')">En Tránsito</button>
        <button class="btn btn-outline-success badge-filter" data-status="delivered" onclick="filterOrders('Entregado')">Entregado</button>
        <button class="btn btn-outline-danger badge-filter" data-status="not-delivered" onclick="filterOrders('No Entregado')">No Entregado</button>
        <button class="btn btn-outline-danger badge-filter" data-status="cancelled" onclick="filterOrders('Cancelado')">Cancelado</button>
    `;
    loadFiltersByType(deliveryPersonFilters);
}

function loadFiltersByType(filters) {
    const filterContainer = document.getElementById('filter-container');

    if (filterContainer) {
        filterContainer.innerHTML = '';

        let filtersHTML = filters;
        filterContainer.innerHTML = filtersHTML;
    }
}

function loadOrders() {
    clearAllOrders();
    getAllOrders();
}

function clearAllOrders() {
    let ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = '';
}

function getAllOrders() {
    let token = getInstance().token;
    let ordersContainer = document.getElementById('orders-container');

    axios
        .get(`${API_URL}orders/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            let orders = response.data.orders;

            if (!orders || orders.length === 0) {
                showToast('No se encontraron pedidos.', toastTypes.WARNING);
                return;
            }

            orders.forEach((order) => {
                const orderCard = createOrderCard(order);
                ordersContainer.appendChild(orderCard);
            });
        })
        .catch((error) => {
            const message = error.response?.data?.message || 'Ocurrió un error al cargar los pedidos.';
            handleException(error, message);
        });
}

function createOrderCard(order) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'container my-4';

    const card = document.createElement('div');
    card.className = 'card shadow-sm';
    cardContainer.appendChild(card);
    
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header d-flex flex-column flex-md-row justify-content-between align-items-center';
    card.appendChild(cardHeader);

    const headerDetails = document.createElement('div');
    headerDetails.innerHTML = `
        <strong>Pedido realizado:</strong> ${new Date(order.orderDate).toLocaleDateString()}<br>
        <strong>Fecha estimada de entrega:</strong> ${order.deliveryDate || 'N/A'}<br>
        <strong>Total a pagar:</strong> $${order.totalPrice.toFixed(2)}
    `;
    cardHeader.appendChild(headerDetails);

    const statusBadge = document.createElement('span');
    statusBadge.className = `badge fs-6 rounded-pill bg-${getStatusColor(order.statusOrder)}`;
    statusBadge.id = 'status-badge';
    statusBadge.textContent = getStatusText(order.statusOrder);
    cardHeader.appendChild(statusBadge);

    // Cuerpo de la tarjeta
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column flex-md-row align-items-center';
    card.appendChild(cardBody);

    // Imagen del producto
    const imageContainer = document.createElement('div');
    imageContainer.className = 'me-md-3 mb-3 mb-md-0';
    const productImage = document.createElement('img');
    productImage.src = order.orderProducts[0]?.product.image || 'placeholder.jpg';
    productImage.alt = 'Imagen del producto';
    productImage.style.width = '90px';
    productImage.style.height = 'auto';
    imageContainer.appendChild(productImage);
    cardBody.appendChild(imageContainer);

    // Descripción del pedido
    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'flex-grow-1 text-center text-md-start';
    descriptionContainer.innerHTML = `
        <h5 class="mb-1">Pedido ${order.orderNumber}</h5>
        <p class="mb-3 mt-0">
            ${order.orderProducts.map(product => product.name).join(', ')}
        </p>
    `;

    const detailsButton = document.createElement('button');
    detailsButton.className = 'btn btn-warning btn-sm mb-3 mb-md-0';
    detailsButton.textContent = 'Ver Detalles';
    detailsButton.onclick = () => showOrderDetails(order);
    descriptionContainer.appendChild(detailsButton);
    cardBody.appendChild(descriptionContainer);

    let role = getInstance().role;
    switch (role) {
        case roles.CUSTOMER:
            cardBody.appendChild(createCustomerActions(order));
            break;
        case roles.SALES_EXECUTIVE:
            cardBody.appendChild(createSalesExecutiveActions(order));
            break;
        case roles.DELIVERY_PERSON:
            cardBody.appendChild(createDeliveryPersonActions(order));
            break;
    }

    return cardContainer;
}

function createCustomerActions(order) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'text-center text-md-end mt-3 mt-md-0';
    if (order.statusOrder === 'delivered') {
        const incidentButton = document.createElement('button');
        incidentButton.className = 'btn btn-secondary btn-sm rounded-pill mb-2 w-100 w-md-auto';
        incidentButton.textContent = 'Reportar incidente';
        incidentButton.onclick = () => reportIncident(order);
        actionsContainer.appendChild(incidentButton);
    }

    if (order.statusOrder !== 'cancelled' && order.statusOrder !== 'delivered' && order.statusOrder !== 'reserved') {

        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-outline-secondary btn-sm rounded-pill w-100 w-md-auto';
        cancelButton.id = 'btn-cancel';
        cancelButton.textContent = 'Cancelar pedido';
        cancelButton.onclick = () => cancelOrder(order.orderNumber, order._id);
        actionsContainer.appendChild(cancelButton);
    }

    return actionsContainer;
}

function createSalesExecutiveActions(order) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'text-center text-md-end mt-3 mt-md-0';
    if (order.statusOrder === 'pending') {
        const approveOrderButton = document.createElement('button');
        approveOrderButton.className = 'btn btn-primary btn-sm rounded-pill mb-2 w-100 w-md-auto';
        approveOrderButton.textContent = 'Aprobar pedido';
        approveOrderButton.onclick = () => approveOrder(order._id);
        actionsContainer.appendChild(approveOrderButton);
        const denyOrderButton = document.createElement('button');
        denyOrderButton.className = 'btn btn-outline-secondary btn-sm rounded-pill w-100 w-md-auto';
        denyOrderButton.id = 'btn-cancel';
        denyOrderButton.textContent = 'Denegar pedido';
        denyOrderButton.onclick = () => changeOrderStatus(order._id, 'denied');
        actionsContainer.appendChild(denyOrderButton);
    }

    return actionsContainer;
}

function createDeliveryPersonActions(order) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'text-center text-md-end mt-3 mt-md-0';
    if (order.statusOrder === 'approved') {
        const inTransitButton = document.createElement('button');
        inTransitButton.className = 'btn btn-primary btn-sm rounded-pill mb-2 w-100 w-md-auto';
        inTransitButton.textContent = 'En tránsito';
        inTransitButton.onclick = () => changeOrderStatus(order._id, 'in transit');
        actionsContainer.appendChild(inTransitButton);
    } else if (order.statusOrder === 'in transit') {
        const deliveredButton = document.createElement('button');
        deliveredButton.className = 'btn btn-success btn-sm rounded-pill mb-2 w-100 w-md-auto';
        deliveredButton.textContent = 'Entregado';
        deliveredButton.onclick = () => changeOrderStatus(order._id, 'delivered');
        actionsContainer.appendChild(deliveredButton);
        const notDeliveredButton = document.createElement('button');
        notDeliveredButton.className = 'btn btn-danger btn-sm rounded-pill mb-2 w-100 w-md-auto';
        notDeliveredButton.textContent = 'No entregado';
        notDeliveredButton.onclick = () => changeOrderStatus(order._id, 'not delivered');
        actionsContainer.appendChild(notDeliveredButton);
    }
    return actionsContainer;
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

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'secondary';
        case 'completed':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'dark';
    }
}

// Función para mostrar detalles del pedido (placeholder)
function showOrderDetails(order) {
    console.log('Detalles del pedido:', order);
    window.location.href = `/src/orders/order.html?${order._id}`;
}

function reportIncident(order) {
    console.log('Reportar incidente:', order);
    window.location.href = `/src/orders/incident.html?${order._id}`;
}


function filterOrders(status) {
    let ordersContainer = document.getElementById('orders-container');
    if (status == 'Todos') {
        showAllOrders();
        return;
    }

    Array.from(ordersContainer.children).forEach(orderCard => {
        let isMatch = false;

        const orderStatus = orderCard.querySelector('#status-badge').textContent;
        isMatch = orderStatus === status;

        if (isMatch) {
            orderCard.classList.remove('not-searched');
            orderCard.classList.add('searched');
        } else {
            orderCard.classList.remove('searched');
            orderCard.classList.add('not-searched');
        }
    });
}

function showAllOrders() {
    let ordersContainer = document.getElementById('orders-container');
    Array.from(ordersContainer.children).forEach(orderCard => {
        orderCard.classList.remove('not-searched', 'searched');
    });
}

async function cancelOrder(orderCode, orderId) {
    const MODAL_TITLE = 'Cancelar pedido';
    const MODAL_MESSAGE = '¿Está seguro que desea cancelar el pedido con código ' + orderCode + '? El reembolso se realizará en la tarjeta con la que se realizó el pago.';
    const MODAL_PRIMARY_BTN_TEXT = 'Confirmar';

    const { modalInstance, primaryBtn, secondaryBtn } = createConfirmationModal(
        MODAL_TITLE,
        MODAL_MESSAGE,
        modalTypes.DANGER,
        MODAL_PRIMARY_BTN_TEXT
    );
    modalInstance.show();

    primaryBtn.onclick = async function () {
        await cancelOrderRequest(orderId);
        modalInstance.hide();
        loadOrders();
    }

    secondaryBtn.onclick = function () {
        modalInstance.hide();
    }
}

async function cancelOrderRequest(orderId) {
    try {
        let token = getInstance().token;
        let orderNewStatus = 'cancelled';
        let response = await axios.post(`${API_URL}orders/${orderId}/${orderNewStatus}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status < 300 && response.status >= 200) {
            showToast('Pedido cancelado correctamente.', toastTypes.SUCCESS);
        } else {
            showToast('Ocurrió un error al cancelar el pedido.', toastTypes.DANGER);
        }
    } catch (error) {
        handleException(error, error.response?.data?.message || 'Ocurrió un error al cancelar el pedido.');
        return;
    }
}