const API_URL = 'http://127.0.0.1:3000/api/v1/'

let branch
let categories = []
let products = []
let currentProductInModal

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

let USER_ID = '6765c5403928381d4b030044' //Sacar del SINGLETON



document.addEventListener("DOMContentLoaded", () => {
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
})

window.onload = async function() {
    await loadProductsFromBranch("67622562af767f5440a56cfc")
}

async function loadProductsFromBranch(branchToConsult){
    try {
       let response = await axios.get(`${API_URL}products/${branchToConsult}`)
       if (response.status < 300 && response.status > 199) {
        branch = response.data.branch
        response.data.branch.branchProducts.forEach(element => {
            if (!categories.some(category => category._id === element.product.category._id)) {
                categories.push(element.product.category);
            }
            products.push(element)
        });
        categories.forEach(element => {
            let categorySection = createCategorySection(element)
            let productsOfCategory = products.filter(productBranch => productBranch.product.category._id === element._id)
            productsOfCategory.forEach(proElement => {
                let productCard = createProductCard(proElement)
                let categoryContainer = categorySection.getElementsByClassName("d-flex overflow-auto")[0];
                if (categoryContainer) {
                    categoryContainer.appendChild(productCard);
                }
            });
            document.body.appendChild(categorySection)
        });
        showToast(response.data.message, toastTypes.SUCCESS)
              
        }
        else {
            showToast(response.data.message, toastTypes.WARNING)
        }

    } catch (error) {
        showToast("Ocurrio algo inesperado al realizar la petición. Revise su conexión a internet e inténtelo mas tarde", toastTypes.WARNING)   
    }
}


function createCategorySection(category){
    const categorySection = document.createElement("div")
    categorySection.id = category._id
    categorySection.className = "container-fluid mt-4"

    const categoryTitle = document.createElement("h2")
    categoryTitle.textContent = category.name
    categoryTitle.className = " mb-4"

    const categoryProductsContainer = document.createElement("div")
    categoryProductsContainer.className = "d-flex gap-4 overflow-auto rounded bg-light p-2"

    categorySection.appendChild(categoryTitle)
    categorySection.appendChild(categoryProductsContainer)

    return categorySection
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

    button.addEventListener("click", () =>{
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
        const response = await axios.post(API_URL + 'carts', {
            userId: USER_ID,
            productForCart: {
                _id: product._id,
                quantity: number ?? 1,
                price: Number(product.unitPrice) * Number(number)
            },
            branchId: branch._id
        });

        if (response.status >= 200 && response.status < 300) {
            showToast(response.data.message, toastTypes.SUCCESS);
        } else {
            showToast(response.data.message, toastTypes.WARNING);
        }
    } catch (error) {
        showToast(error.response.data.message || "Error en el servidor", toastTypes.ERROR);
    }
}

function addProductToCartFromModal(){
    if(currentProductInModal.product.limit < modalProdcutQuantity.value){        
        showToast("La cantida debe ser menor al limite por pedido", toastTypes.ERROR);
    }else if( modalProdcutQuantity.value > 0){
        addProductToCart(currentProductInModal.product, modalProdcutQuantity.value)
    }else{
        showToast("La cantidad debe ser mayor a 0", toastTypes.ERROR);
    }
}

function increaseQuantity(){
    modalProdcutQuantity.value =  Number(modalProdcutQuantity.value)+1
}
function deacreaseQuantity(){
    let quantity =  Number(modalProdcutQuantity.value)
    if(quantity > 0){
        modalProdcutQuantity.value = quantity-1
    }
}

function seeDetailsOfProduct(element){
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

function clearModal(){
    currentProductInModal = null
    modalProductName.value =""
    modalProductDescription.value = "" 
    modalProductWeigth.value = ``
    modalProductUnit.value = ``
    modalProductLimit.value = ``
    modalProdcutQuantity.value = 0
    modalProductImage.src = ""
}