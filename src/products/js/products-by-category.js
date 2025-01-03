let categoryTitle
let searchBar
let productContainer 

let branchId
let categoryId


let productsDetaildModal
let modalProductImage
let modalProductName
let modalProductPrice
let modalProductDescription
let modalProductWeigth
let modalProductUnit
let modalProductStock
let modalProductLimit
let modalProdcutQuantity
let modalLessBtn
let modalMoreBtn

let USER_ID

document.addEventListener("DOMContentLoaded", async () => {
    productsDetaildModal = document.getElementById('productsDetailsModal')
    modalProductImage = document.getElementById('product-image')
    modalProductName = document.getElementById('product-name')
    modalProductPrice = document.getElementById('product-price')
    modalProductDescription = document.getElementById('product-description')
    modalProductWeigth = document.getElementById('product-weigth')
    modalProductUnit = document.getElementById('product-unitMeasure')
    modalProductStock = document.getElementById('product-stock')
    modalProductLimit = document.getElementById('product-limit')
    modalProdcutQuantity = document.getElementById('product-quantity-input')
    modalMoreBtn = document.getElementById('more-btn')
    modalLessBtn = document.getElementById('less-btn')


    categoryTitle = document.getElementById("title-products")
    searchBar = document.getElementById("search-Bar")
    productContainer = document.getElementById("product-container")


    branchId = sessionStorage.getItem('branch-Id-to-consult-products')
    categoryId = sessionStorage.getItem('category-Id-to-consult-products')


    USER_ID = getInstance().id
    await loadFooter()

    await loadProductsOfCategory()

})


async function loadProductsOfCategory(){
    try {
        let token = getInstance().token
        let response = await axios.get(`${API_URL}products/${branchId}/${categoryId}`,{
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.status < 300 && response.status > 199) {
            if(response.data.branch.length == 0){
                showToast("No hay productos disponibles en esta sucursal", toastTypes.SUCCESS)
            }
            response.data.branch.forEach(element => {
                let productCard = createProductCard(element)
                productContainer.appendChild(productCard)
            });
            categoryTitle.innerHTML = response.data.branch[0].product.category.name
            showToast(response.data.message, toastTypes.SUCCESS)
        }
        else {
            showToast(response.data.message, toastTypes.WARNING)
        }
    } catch (error) {    
        handleException(error)
    }
}

function createProductCard(element) {
    const card = document.createElement("div");
    card.id = element.product._id;
    card.className = "card mx-2";
    card.style.minWidth = "200px";

    const img = document.createElement("img");
    img.src = element.product.image;
    img.className = "card-img-top";
    img.alt = "Error al cargar la imagen";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body text-center";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = element.product.name;

    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = `$ ${element.product.unitPrice} MXN`;

    const buttonsContainer = document.createElement("div")
    buttonsContainer.className = "d-grid gap-1"

    const detailsButton = document.createElement("button");
    detailsButton.className = "btn btn-outline-dark btn-sm";
    detailsButton.textContent = "Detalles";

    const button = document.createElement("button");
    button.className = "btn btn-primary ";
    button.textContent = "Agregar al carrito";


    detailsButton.addEventListener("click", () => {
        seeDetailsOfProduct(element)
    })

    button.addEventListener("click", () => {
        addProductToCart(element.product, 1)
    })


    buttonsContainer.appendChild(button);
    buttonsContainer.appendChild(detailsButton);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(buttonsContainer)

    card.appendChild(img);
    card.appendChild(cardBody);

    return card;
}


async function addProductToCart(product, number) {
    try {
        let token = getInstance().token
        const response = await axios.post(API_URL + 'carts', {
            userId: USER_ID,
            productForCart: {
                _id: product._id,
                quantity: number ?? 1,
                price: Number(product.unitPrice) * Number(number)
            },
            branchId: branchId
        },{
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status >= 200 && response.status < 300) {
            showToast(response.data.message, toastTypes.SUCCESS);
        } else {
            showToast(response.data.message, toastTypes.WARNING);
        }
    } catch (error) {
        handleException(error);
    }
}

function addProductToCartFromModal() {
    if (currentProductInModal.product.limit < modalProdcutQuantity.value) {
        showToast("La cantida debe ser menor al limite por pedido", toastTypes.ERROR);
    } else if (modalProdcutQuantity.value > 0) {
        addProductToCart(currentProductInModal.product, modalProdcutQuantity.value)
    } else {
        showToast("La cantidad debe ser mayor a 0", toastTypes.ERROR);
    }
}

function increaseQuantity() {
    modalProdcutQuantity.value = Number(modalProdcutQuantity.value) + 1
}
function deacreaseQuantity() {
    let quantity = Number(modalProdcutQuantity.value)
    if (quantity > 0) {
        modalProdcutQuantity.value = quantity - 1
    }
}

function seeDetailsOfProduct(element) {
    currentProductInModal = element
    modalProductName.innerHTML = element.product.name
    modalProductPrice.innerHTML = `<strong>$ ${element.product.unitPrice} MXN</strong>`;
    modalProductDescription.innerHTML = element.product.description;
    modalProductWeigth.innerHTML = `<strong>Peso:</strong> ${element.product.weight} gramos`;
    modalProductUnit.innerHTML = `<strong>Unidad de medida:</strong> ${element.product.unitMeasure}`;
    modalProductStock.innerHTML = `<strong>Cantidad disponible en tienda:</strong> ${element.quantity}`;
    modalProductLimit.innerHTML = `<strong>Cantidad máxima por pedido:</strong> ${element.product.limit}`;
    modalProdcutQuantity.value = 1
    modalProductImage.src = element.product.image
    showModal()
}

function showModal() {
    let modal = new bootstrap.Modal(productsDetaildModal)
    modal.show()
}

function clearModal() {
    currentProductInModal = null
    modalProductName.value = ""
    modalProductDescription.value = ""
    modalProductWeigth.value = ``
    modalProductUnit.value = ``
    modalProductLimit.value = ``
    modalProdcutQuantity.value = 0
    modalProductImage.src = ""
}

function searchProduct(){

}

async function loadFooter(){
    fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });
}
