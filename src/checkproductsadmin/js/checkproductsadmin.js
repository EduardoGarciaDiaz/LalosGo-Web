// Contenedor de productos
const productContainer = document.getElementById("product-container");
let USER_ID
let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
    const products = await getProducts()
})

fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(async data => {
        document.getElementById('footer').innerHTML = data;
        const products = await getProducts()
        renderProducts(products);
        await loadCategories();
    });

async function getProducts() {
    try {
        let token = getInstance().token
        const response = await axios.get(`${API_URL}/products`,{
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allProducts = response.data.products.map(product => ({
            ...product,
            simpleName: removeAccents(product.name)
        }));
        return response.data.products;
    } catch (error) {
        handleException(error, "Error al obtener los productos");
    }
} 

async function loadCategories() {
    const categoriesDropdown = document.getElementById('categories');
    categoriesDropdown.innerHTML = '<option value="" selected>Todas las categorías</option>';

    try {
        let token = getInstance().token
        const response = await axios.get(API_URL + 'categories/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        response.data.category.forEach((category) => {
            const option = document.createElement('option');
            option.value = category._id; 
            option.textContent = category.name; 
            categoriesDropdown.appendChild(option); 
        });
    } catch (error) {
        handleException(error,  "Ocurrió algo inesperado al cargar las categorías. Verifique su conexión e inténtelo más tarde.");
    }

    categoriesDropdown.addEventListener("change", onCategoryChange);
}

function onCategoryChange(event) {
    const selectedCategoryId = event.target.value;
    
    if (selectedCategoryId) {
        showCategorieProducts(selectedCategoryId);
    } else {
        renderProducts(allProducts);
    }
}

function renderProducts(products) {
    productContainer.innerHTML = "";
    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    
        card.innerHTML = `
            <div class="card shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title text-primary">$${product.unitPrice.toFixed(2)}</h5>
                    <p class="card-text">${product.name}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline-primary" onclick="viewProduct('${product._id}')">Ver detalles</button>
                        <button class="btn btn-primary" onclick="editProduct('${product._id}')">Editar</button>
                    </div>
                </div>
            </div>
        `;
        productContainer.appendChild(card);
    });
}

function showCategorieProducts(selectedCategoryId) {
    const products = allProducts.filter(product => product.category._id === selectedCategoryId);
    renderProducts(products);
}

function addNewProduct(){
    window.location.href = "/src/products/productsForm.html";
}

function viewProduct(productId) {
    sessionStorage.removeItem('productData');
    sessionStorage.setItem('productData', JSON.stringify(allProducts.find(product => product._id === productId)));
    window.location.href = "/src/checkproductsadmin/checkproductdetails.html";
}

function searchProduct(){
    const searchInput = removeAccents(document.getElementById("searchBar").value.toLowerCase()); 
    let productSearched = [];
    allProducts.forEach(product => {
        if (product.simpleName.includes(searchInput)) {
            productSearched.push(product); 
        } 
    });

    if(productSearched.length === 0){
        showToast("No se encontraron productos", toastTypes.WARNING);
    } else {
        renderProducts(productSearched);
    }
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); 
}

function editProduct(index) {
    sessionStorage.removeItem('productData');
    sessionStorage.setItem('productData', JSON.stringify(allProducts.find(product => product._id === index)));
    window.location.href = "/src/products/edit-product-form.html";
}