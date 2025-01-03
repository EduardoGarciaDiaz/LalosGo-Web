window.onload = function () {
    setupEventListeners();
    loadInitialData();
};

function setupEventListeners() {
    const filterContainer = document.getElementById('filter-container');
    const ordersContainer = document.getElementById('orders-container');
}

function loadInitialData() {
    loadFilters();
    loadOrders();
}

function loadOrders() {
    clearAllOrders();
    getAllOrders();
}

function loadOrders() {
    let token = getInstance().token;

    axios
        .get(`${API_URL}branches/`, {
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
            showToast(message, toastTypes.DANGER);
        });
}

function filterOrders(status){
    let ordersContainer = document.getElementById('orders-container');
    Array.from(ordersContainer.children).forEach(orderCard => {
        let isMatch = false;

        const orderStatus = orderCard.querySelector('.order-status').textContent;
        isMatch = orderStatus === status;

        if(isMatch){
            orderCard.classList.remove('not-searched');
            orderCard.classList.add('searched');
        } else {
            orderCard.classList.remove('searched');
            orderCard.classList.add('not-searched');
        }
    });
}

function showAllOrders(){
    let ordersContainer = document.getElementById('orders-container');
    Array.from(ordersContainer.children).forEach(orderCard => {
        orderCard.classList.remove('not-searched', 'searched');
    });
}

// Función para manejar la cancelación de pedidos
async function cancelOrder(orderCode) {
    const MODAL_TITLE = 'Cancelar pedido';
    const MODAL_MESSAGE = '¿Está seguro que desea cancelar el pedido con código ' + orderCode + '?';
    const MODAL_PRIMARY_BTN_TEXT = 'Confirmar';

    const {modalInstance, primaryBtn, secondaryBtn} = createConfirmationModal(
        MODAL_TITLE,
        MODAL_MESSAGE,
        modalTypes.DANGER,
        MODAL_PRIMARY_BTN_TEXT
    );
    modalInstance.show();

    primaryBtn.onclick = async function (){
        await cancelOrderRequest(orderCode);
        modalInstance.hide();
        loadOrders();
    }

    if (orderCode) {
        const confirmCancel = window.confirm(`¿Está seguro que desea cancelar el pedido con código ${orderCode}?`);
        if (confirmCancel) {
            alert(`Pedido con código ${orderCode} ha sido cancelado.`);
            const modal = button.closest('.modal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            clearCancelOrderForm(button);
        }
    } else {
        console.error('No se pudo obtener el código del pedido');
    }
}

function clearCancelOrderForm(button) {
    const modal = button.closest('.modal');

    if (modal) {
        const cancelReasonInput = modal.querySelector('.cancelReason');
        if (cancelReasonInput) {
            cancelReasonInput.value = '';
        }
    } else {
        console.error('No se encontró el modal contenedor.');
    }
}