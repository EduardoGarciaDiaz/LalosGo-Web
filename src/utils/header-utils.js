const CONTAINER_ID = 'header-container';

function loadHTML(filePath, elementId) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar ${filePath}: ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(elementId);
            if (container) {
                container.innerHTML = html;
            } else {
                showToast(`Error al cargar contenido. Intente nuevamente más tarde.`, toastTypes.DANGER);
            }
        })
        .catch(error => {
            showToast(`Error al cargar contenido. Intente nuevamente más tarde.`, toastTypes.DANGER);
        });
}

function loadHeaderByRole() {
    let headerPath;

    let singleton = sessionStorage.getItem('Singleton');
    let role = singleton ? JSON.parse(singleton).role : 'default';
    
    switch (role) {
        case 'Administrator':
            headerPath = '/src/shared/navbar/navbar-admin.html';
            break;
        case 'Manager':
            headerPath = '/src/shared/navbar/navbar-manager.html';
            break;
        case 'Customer':
            headerPath = '/src/shared/navbar/navbar-customer.html';
            break;
        case 'Sales Executive':
            headerPath = '/src/shared/navbar/navbar-sales-executive.html';
            break;
        case 'Delivery Person':
            headerPath = '/src/shared/navbar/navbar-delivery.html';
        default:
            headerPath = '/src/shared/navbar/navbar-default.html';
            break;
    }

    loadHTML(headerPath, CONTAINER_ID);
}


document.addEventListener('DOMContentLoaded', () => {
    loadHeaderByRole();
});
