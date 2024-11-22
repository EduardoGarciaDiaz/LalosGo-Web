// Función para cargar un archivo HTML en un contenedor
function loadHTML(filePath, containerId) {
    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch(error => console.error('Error al cargar archivo HTML:', error));
}

function loadOrders(orderTemplatePath, ordersContainerId, orders) {
    const container = document.getElementById(ordersContainerId);

    if (!container) {
        return;
    }

    orders.forEach(order => {
        fetch(orderTemplatePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el archivo ${orderTemplatePath}. Código: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const orderHTML = html
                    .replace('{{orderDate}}', order.orderDate || 'N/A')
                    .replace('{{deliveryDate}}', order.deliveryDate || 'N/A')
                    .replace('{{total}}', order.total || '$0 MX')
                    .replace('{{status}}', order.status || 'Pendiente')
                    .replace('{{orderCode}}', order.productTitle || 'Pedido desconocido')
                    .replace('{{productImage}}', order.productImage || 'https://via.placeholder.com/90')
                    .replace('{{orderProducts}}', order.orderProducts || 'No hay productos en este pedido');

                const orderElement = document.createElement('div');
                orderElement.innerHTML = orderHTML;
                container.appendChild(orderElement);
            })
            .catch(error => console.error('Error al cargar una orden:', error));
    });
}

// Ejemplo de uso
document.addEventListener('DOMContentLoaded', () => {
    
    // const userType = 'cliente'; // Comentar las condiciones
    const headerPath = '/src/shared/navbar/navbar-client.html'; // Ruta fija para prueba
    loadHTML(headerPath, 'header-container');

    const filterPath = '/src/shared/orderFilter/filter-client.html'; // Ruta fija para prueba
    loadHTML(filterPath, 'filter-container');

    const orders = [
        {
            orderDate: '02 octubre de 2024',
            deliveryDate: '08 octubre de 2024',
            total: '$450 MX',
            status: 'Enviado',
            productTitle: 'Pedido 1',
            productImage: 'https://via.placeholder.com/90',
            orderProducts: 'Memoria USB, 2x Audífonos inalámbricos, 1x Cargador portátil'
        },
        {
            orderDate: '15 noviembre de 2024',
            deliveryDate: '20 noviembre de 2024',
            total: '$320 MX',
            status: 'Pendiente',
            productTitle: 'Otro pedido interesante',
            productImage: 'https://via.placeholder.com/90',
            orderProducts: 'Libro de programación, 2x Mouse inalámbrico, 1x Teclado gamer'
        }
    ];

    const orderTemplatePath = 'order-card.html';
    loadOrders(orderTemplatePath, 'orders-container', orders);
});

