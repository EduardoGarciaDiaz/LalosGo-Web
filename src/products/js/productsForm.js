const API_URL = 'http://127.0.0.1:3000/api/v1/'

let productName
let prodcutDescription
let productCode
let productBarCode
let productPrice
let productWeight
let productCategory
let productUnit
let productLimit
let productExpirationDate
let productImg
let inputImage
let branchesList

document.addEventListener("DOMContentLoaded", () => {
    productDescription = document.getElementById("description-product");
    productCode = document.getElementById("code-product");
    productBarCode = document.getElementById("bar-code-product");
    productPrice = document.getElementById("price-product");
    productWeight = document.getElementById("weight-product");
    productCategory = document.getElementById("category-product");
    productUnit = document.getElementById("unit-product");
    productLimit = document.getElementById("limit-product");
    productExpirationDate = document.getElementById("expiration-product");
    productImg = document.getElementById("image-product");
    inputImage = document.getElementById("image-input")
    branchesList = document.getElementById("branches-list");
    
    productCode.addEventListener("input", generateBarCode)
    inputImage.addEventListener("change", uploadImage)

    
});

window.onload = async function() {
    await loadCategories();
    await loadBranches();
}

async function loadCategories() {
    axios.get(API_URL+'categories/', {
        params: {
            api_key: "00000" //CAMBIAR 
        },
    }).then((response) => {
        response.data.category.forEach((category) => {
            const option = document.createElement('option')
            option.value = category.name
            option.text = category.name
            option.id = category._id
            productCategory.appendChild(option)
        })
    }).catch((error) => {
       showToast("Ocurrio algo inesperado al cargar las categorías. Verirfique su conexión e inténtelo mas tarde.", toastTypes.DANGER);
    })
    
}

async function loadBranches() {
    axios.get(`${API_URL}branches/`, {
        params: {
            recoverProduct: false
        }
    }).then((response) => {
        branchesList.innetHTML = ""
        response.data.branches.forEach(element => {            
            const branchCard = createCheckboxWithNumber(element._id, element.name)
            branchesList.appendChild(branchCard)
        });
    }).catch((error) => {
        console.log(error)
        showToast("Ocurrio algo inesperado al cargar las sucursales. Verirfique su conexión e inténtelo mas tarde", toastTypes.DANGER)
    })
}

function generateBarCode(){
    if(productCode.value.trim() !== ""){
        JsBarcode("#bar-code-product", productCode.value.trim())
    }
    else{
        productBarCode.innerHTML=""
    }
}

function uploadImage(event){
    let file = event.target.files[0]
    if(file){
        let reader = new FileReader();
        reader.onload = function(e) {
            productImg.src = e.target.result
            productImg.style.display = "block"
        }
        reader.readAsDataURL(file)
    }
}


function createCheckboxWithNumber(branchId, branchName) {
    
    const container = document.createElement("div");
    container.className = "checkbox-with-number mb-3";

    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "d-flex align-items-center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-2";
    checkbox.id = branchId;

    const label = document.createElement("label");
    label.className = "form-check-label me-3";
    label.htmlFor = branchId;
    label.textContent = branchName;

    const numberInput = document.createElement("input");
    numberInput.type = "number";
    numberInput.className = "form-control number-input";
    numberInput.placeholder = "0";
    numberInput.min = "0";
    numberInput.max = "999"
    numberInput.disabled = true;

    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            numberInput.disabled = false;
        } else {
            numberInput.disabled = true;
        }
    });

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    container.appendChild(checkboxContainer);
    container.appendChild(numberInput);

    return container;
}






