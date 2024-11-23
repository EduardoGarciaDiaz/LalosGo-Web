// Función para cargar un archivo HTML en un contenedor
function loadHTML(filePath, containerId) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar ${filePath}: ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar archivo HTML:', error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<p class="text-danger">Error al cargar contenido. Intente nuevamente más tarde.</p>`;
            }
        });
}

// Función para cargar y renderizar órdenes
function loadOrders(orderTemplatePath, ordersContainerId, orders) {
    const container = document.getElementById(ordersContainerId);
    const loading = document.getElementById('loading');

    if (!container) {
        console.error(`Contenedor con ID "${ordersContainerId}" no encontrado.`);
        return;
    }

    fetch(orderTemplatePath)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar plantilla de órdenes: ${response.statusText}`);
            return response.text();
        })
        .then(templateHTML => {
            orders.forEach(order => {
                const orderHTML = templateHTML
                    .replace('{{orderDate}}', order.orderDate || 'N/A')
                    .replace('{{deliveryDate}}', order.deliveryDate || 'N/A')
                    .replace('{{total}}', order.total || '$0 MX')
                    .replace('{{status}}', order.status || 'Pendiente')
                    .replace('{{orderCode}}', order.orderCode || 'Pedido desconocido')
                    .replace('{{productImage}}', order.productImage || 'https://via.placeholder.com/90')
                    .replace('{{orderProducts}}', order.orderProducts || 'No hay productos en este pedido');

                const orderElement = document.createElement('div');
                orderElement.innerHTML = orderHTML;
                container.appendChild(orderElement);

                const acceptButton = orderElement.querySelector('#btn-accept');
                if (acceptButton) {
                    acceptButton.dataset.orderCode = order.orderCode;
                }
            });
        })
        .catch(error => console.error('Error al cargar órdenes:', error))
        .finally(() => {
            if (loading) {
                loading.style.display = 'none';
            }
        });
}

// Función para manejar la cancelación de pedidos
async function cancelOrder(button) {
    const orderCode = button.dataset.orderCode;

    if (orderCode) {
        const confirmCancel = window.confirm(`¿Está seguro que desea cancelar el pedido con código ${orderCode}?`);
        if (confirmCancel) {
            alert(`Pedido con código ${orderCode} ha sido cancelado.`);
            const modal =  button.closest('.modal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
    } else {
        console.error('No se pudo obtener el código del pedido');
    }
}

// Ejemplo de uso al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const headerPath = '/src/shared/navbar/navbar-client.html';
    const filterPath = '/src/shared/orderFilter/filter-client.html';
    const ordersContainerId = 'orders-container';

    // Cargar encabezado y filtros
    loadHTML(headerPath, 'header-container');
    loadHTML(filterPath, 'filter-container');

    // Simulación de datos de órdenes
    const orders = [
        {
            orderDate: '02 octubre de 2024',
            deliveryDate: '08 octubre de 2024',
            total: '$450 MX',
            status: 'Enviado',
            orderCode: 'Pedido 1',
            productImage: 'https://via.placeholder.com/90',
            orderProducts: 'Memoria USB, 2x Audífonos inalámbricos, 1x Cargador portátil'
        },
        {
            orderDate: '15 noviembre de 2024',
            deliveryDate: '20 noviembre de 2024',
            total: '$320 MX',
            status: 'Pendiente',
            orderCode: 'Otro pedido interesante',
            productImage: 'https://via.placeholder.com/90',
            orderProducts: 'Libro de programación, 2x Mouse inalámbrico, 1x Teclado gamer'
        }
    ];

    // Indicador de carga
    const ordersContainer = document.getElementById(ordersContainerId);
    if (ordersContainer) {
        const loading = document.createElement('div');
        loading.id = 'loading';
        loading.className = 'text-center my-4';
        loading.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>`;
        ordersContainer.appendChild(loading);
    }

    // Cargar y renderizar órdenes
    const orderTemplatePath = 'order-card.html';
    loadOrders(orderTemplatePath, ordersContainerId, orders);
});
