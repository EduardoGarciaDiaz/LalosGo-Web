const CONTAINER_ID = 'header-container';

function loadHTML(filePath, elementId, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar ${filePath}: ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(elementId);
            if (container) {
                container.innerHTML = html;
                if (callback) callback(); 
            } else {
                showToast(`Error al cargar contenido. Intente nuevamente más tarde.`, toastTypes.DANGER);
            }
        })
        .catch(error => {
            showToast(`Error al cargar contenido. Intente nuevamente más tarde.`, toastTypes.DANGER);
        });
}

async function loadHeaderByRole() {
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

    loadHTML(headerPath, CONTAINER_ID, () => {
        createCategoriesListBoxItems(); 
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadHeaderByRole();
    
});

function createCategoriesListBoxItems(categoriesToProcess, branch) {
    const storedCategories = sessionStorage.getItem('categories');    
    if (!categoriesToProcess) {
        categoriesToProcess = storedCategories ? JSON.parse(storedCategories) : [];
    } else {
        sessionStorage.setItem('categories', JSON.stringify(categoriesToProcess));
    }
    
    let categoriesHeaderDropDown = document.getElementById('dropdown-categories-navbar');
    if(!categoriesHeaderDropDown) return;
    categoriesHeaderDropDown.innerHTML = ''; 
    categoriesToProcess.forEach(element => {
        const liElement = document.createElement("li");
        const aElement = document.createElement("a");

        aElement.className = "dropdown-item";
        aElement.href = "/src/products/product-by-category.html";
        aElement.textContent = element.name;
        liElement.id = element._id;
        liElement.appendChild(aElement);

        liElement.addEventListener("click", () => {
            sessionStorage.removeItem('category-Id-to-consult-products');
            sessionStorage.setItem('category-Id-to-consult-products', element._id);
            
            let branchId = sessionStorage.getItem('branch-Id-to-consult-products')
            if(!branchId){                
                sessionStorage.setItem('branch-Id-to-consult-products', branch._id);
            }else if(branchId != branch._id){
                sessionStorage.removeItem('branch-Id-to-consult-products');
                sessionStorage.setItem('branch-Id-to-consult-products', branch._id);
            }
        });

        categoriesHeaderDropDown.appendChild(liElement);
    });
}
