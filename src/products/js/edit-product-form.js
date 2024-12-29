let productName
let productDescription
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
var imageData = new FormData()
let branchesList
let errorImageSpan

document.addEventListener("DOMContentLoaded",  () => {
    productName = document.getElementById("name-product")
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
    errorImageSpan = document.getElementById("error-img-product");

    productCode.addEventListener("input", generateBarCode)
    inputImage.addEventListener("change", uploadImage)


});

window.addEventListener("load", async () =>{
    let productData = JSON.parse(sessionStorage.getItem('productData'));   
    if(productData){        
        await loadCategories(productData);    
        loadProductInfo(productData)
        await loadBranches(productData._id);
    }
})

fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
});


async function loadCategories(product) {
    axios.get(API_URL + 'categories/', {
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
        let categoryIndex = Array.from(productCategory.options).findIndex(
            (cat) => cat.id === product.category._id
        );        
        productCategory.selectedIndex = categoryIndex;
    }).catch((error) => {
        showToast("Ocurrio algo inesperado al cargar las categorías. Verirfique su conexión e inténtelo mas tarde.", toastTypes.DANGER);
    })
}

async function loadBranches(productId) {
    let token = getInstance().token;

    axios.get(`${API_URL}branches/${productId}`, {
        headers: {
            'Authorization': `Bearer ${2}`
        }
    }).then((response) => {
        branchesList.innetHTML = ""
        response.data.branches.forEach(element => {
            const branchCard = createCheckboxWithNumber(element)
            branchesList.appendChild(branchCard)
        });
    }).catch((error) => {
        console.log(error)
        showToast("Ocurrio algo inesperado al cargar las sucursales. Verirfique su conexión e inténtelo mas tarde", toastTypes.DANGER)
    })
}

function loadProductInfo(product){
    productName.value = product.name
    productDescription.value = product.description
    productCode.value = product.barCode
    generateBarCode()
    productPrice.value = product.unitPrice
    productWeight.value = product.weight    
    productExpirationDate.value = formatDateToISO(product.expireDate)       
    let unitMeasureIndex = Array.from(productUnit.options).findIndex(
        (unt) => unt.value == product.unitMeasure
    )
    productUnit.selectedIndex = unitMeasureIndex
    productLimit.value = product.limit    
    loadImageFromUrl(product.image)

}


async function saveProduct() {
    if (!checkEmptyFields()) {
        return
    }
    if (!checFieldsFormat()) {
        return
    }
    if (!checkImageSelected()) {
        return
    }
    let selectedBranches = getSelectedBranches()
    if (!checkBranchesSelected(selectedBranches)) {
        return
    }

    try {
        let response = await axios.post(API_URL + 'products/', {
            barCode: productCode.value,
            name: productName.value,
            description: productDescription.value,
            unitPrice: productPrice.value,
            expireDate: productExpirationDate.value,
            weight: productWeight.value,
            limit: productLimit.value,
            productStatus: true,
            unitMeasure: productUnit.value,
            category: productCategory.options[productCategory.selectedIndex].id,
            branches: selectedBranches
        })
        if (response.status < 300 && response.status > 199) {

            showToast(response.data.message, toastTypes.SUCCESS)
            let responseImage = await axios.put(`${API_URL}products/${response.data.product._id}`, imageData)
            if (responseImage.status < 300 && responseImage.status > 199) {
                showToast(responseImage.data.message, toastTypes.SUCCESS)
            }
            else {
                showToast(responseImage.data.message, toastTypes.WARNING)
            }
            clearFields()
        }
        else {
            showToast(response.data.message, toastTypes.WARNING)
        }
    } catch (error) {
        showToast("Ocurrio algo inesperado al realizar la petición. Revise su conexión a internet e inténtelo mas tarde", toastTypes.WARNING)
    }
}



function checkEmptyFields() {
    let isValid = true;
    const errorMessages = {
        productName: document.getElementById("error-name-product"),
        productDescription: document.getElementById("error-description-product"),
        productCode: document.getElementById("error-code-product"),
        productPrice: document.getElementById("error-price-product"),
        productWeight: document.getElementById("error-weight-product"),
        productCategory: document.getElementById("error-category-product"),
        productUnit: document.getElementById("error-unit-product"),
        productLimit: document.getElementById("error-limit-product"),
        productExpirationDate: document.getElementById("error-expiration-product"),
    };

    const productFields = {
        productName: productName.value,
        productDescription: productDescription.value,
        productCode: productCode.value,
        productPrice: productPrice.value,
        productWeight: productWeight.value,
        productCategory: productCategory.value,
        productUnit: productUnit.value,
        productLimit: productLimit.value,
        productExpirationDate: productExpirationDate.value,
    };

    for (const key in productFields) {
        if (productFields[key] === "" || productFields[key] == null) {
            errorMessages[key].textContent = "Este campo es obligatorio.";
            errorMessages[key].classList.remove("is-invalid");
            errorMessages[key].className = "text-danger"
            isValid = false;
        } else {
            errorMessages[key].textContent = "";
            errorMessages[key].classList.add("d-none");
        }
    }

    return isValid;
}

function checFieldsFormat() {
    let isValid = true

    let productNameError = document.getElementById("error-name-product")
    let productDescriptionError = document.getElementById("error-description-product")
    let productCodeError = document.getElementById("error-code-product")
    let productPriceError = document.getElementById("error-price-product")
    let productWeightError = document.getElementById("error-weight-product")
    let productLimitError = document.getElementById("error-limit-product")
    let productExpirationDateError = document.getElementById("error-expiration-product")

    if (!validateInputWithCommonTextReegex(productName.value) || productName.value.trim().length < 2) {
        productNameError.textContent = "El nombre del producto debe ser de al menos 2 caracters y solo puede contener letras, numeros y signos de puntuación comunes.";
        productNameError.classList.add("is-invalid")
        productNameError.className = "text-danger"
        isValid = false;
    } else {
        productNameError.textContent = "";
        productNameError.classList.remove("is-invalid")
        productNameError.className = "d-none"
    }
    if (!validateInputWithCommonTextReegex(productDescription.value) || productDescription.value.trim().length < 10) {
        productDescriptionError.textContent = "La descripción del producto debe contener al menos 10 caracteres y solo puede contener letras, numeros y signos de puntuación comunes.";
        productDescriptionError.classList.add("is-invalid")
        productDescriptionError.className = "text-danger"
        isValid = false;
    } else {
        productDescriptionError.textContent = "";
        productDescriptionError.classList.remove("is-invalid")
        productDescriptionError.className = "d-none"
    }
    if (productCode.value.trim().length !== 12) {
        productCodeError.textContent = "El código del producto debe ser un número único de 12 digitos.";
        productCodeError.classList.add("is-invalid")
        productCodeError.className = "text-danger"
        isValid = false;
    } else {
        productCodeError.textContent = "";
        productCodeError.classList.remove("is-invalid")
        productCodeError.className = "d-none"
    }
    if (!validateNumberWithDot(productPrice.value) || productPrice.value <= 0) {
        productPriceError.textContent = "El precio del producto debe ser un número valido (1111.11) de al menos un digito";
        productPriceError.classList.add("is-invalid")
        productPriceError.className = "text-danger"
        isValid = false;
    } else {
        productPriceError.textContent = "";
        productPriceError.classList.remove("is-invalid")
        productPriceError.className = "d-none"
    }
    if (!validateNumberWithDot(productWeight.value) || productWeight.value <= 0) {
        productWeightError.textContent = "El peso del producto debe ser un número valido (11.11) de al menos un digito";
        productWeightError.classList.add("is-invalid")
        productWeightError.className = "text-danger"
        isValid = false;
    } else {
        productWeightError.textContent = "";
        productWeightError.classList.remove("is-invalid")
        productWeightError.className = "d-none"
    }
    if (!validateEntireNumber(productLimit.value) || productLimit.value <= 0) {
        productLimitError.textContent = "El limite del producto debe ser un número entero valido (11) de al menos un digito";
        productLimitError.classList.add("is-invalid")
        productLimitError.className = "text-danger"
        isValid = false;
    } else {
        productLimitError.textContent = "";
        productLimitError.classList.remove("is-invalid")
        productLimitError.className = "d-none"
    }
    if (!validateDateIsAfter14Days(productExpirationDate.value)) {
        productExpirationDateError.textContent = "La fecha de esxpiración debe ser al menos posterior a dos semanas.";
        productExpirationDateError.classList.add("is-invalid")
        productExpirationDateError.className = "text-danger"
        isValid = false;
    } else {
        productExpirationDateError.textContent = "";
        productExpirationDateError.classList.remove("is-invalid")
        productExpirationDateError.className = "d-none"
    }

    return isValid
}

function checkImageSelected() {
    let isValid = true
    if (!imageData.has('image')) {
        isValid = false
        errorImageSpan.classList.add("is-invalid")
        errorImageSpan.textContent = "Es necesario agregar una imagen"
        errorImageSpan.className = "text-danger"
    } else {
        errorImageSpan.className = "d-none"
        errorImageSpan.classList.remove("is-invalid")
    }
    return isValid
}


function checkBranchesSelected(branches) {
    let areBranchesSelected = true
    let errorBranchSpan = document.getElementById("error-branch-selected")
    if (branches.length <= 0) {
        errorBranchSpan.textContent = "Debes seleccionar al menos una sucursal.";
        errorBranchSpan.classList.remove("is-invalid");
        errorBranchSpan.className = "text-danger"
        areBranchesSelected = false
    }
    else {
        errorBranchSpan.textContent = "";
        errorBranchSpan.classList.add("d-none");
    }
    return areBranchesSelected

}

function getSelectedBranches() {
    const selectedBranches = [];
    const checkboxes = branchesList.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const container = checkbox.closest(".checkbox-with-number");
            const label = container.querySelector("label");
            const numberInput = container.querySelector("input[type='text']");

            selectedBranches.push({
                id: checkbox.id,
                name: label.textContent,
                quantity: Number(numberInput.value) || 0,
            });
        }
    });

    return selectedBranches;
}


function generateBarCode() {
    if (productCode.value.trim() !== "") {
        JsBarcode("#bar-code-product", productCode.value.trim())
    }
    else {
        productBarCode.innerHTML = ""
    }
}

function loadImageFromUrl(url) {
    let img = new Image();
    img.src = url;

    img.onload = () => {
        if (img.width !== 225 || img.height !== 225) {
            errorImageSpan.textContent = "El tamaño de la imagen debe de ser de 225x225.";
            errorImageSpan.className = "text-danger";
            errorImageSpan.classList.add("is-invalid");
            productImg.src = "";
        } else {
            errorImageSpan.className = "d-none";
            errorImageSpan.classList.remove("is-invalid");
            productImg.src = url;
            productImg.style.display = "block";
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    imageData = new FormData();
                    imageData.append('image', blob, "image-from-url.png");
                })
                .catch(err => {
                    console.error("Error al cargar la imagen desde la URL:", err);
                    errorImageSpan.textContent = "No se pudo cargar la imagen desde la URL inicial.";
                    errorImageSpan.className = "text-danger";
                    errorImageSpan.classList.add("is-invalid");
                });
        }
    };

    img.onerror = () => {
        errorImageSpan.textContent = "No se pudo cargar la imagen desde la URL inicial.";
        errorImageSpan.className = "text-danger";
        errorImageSpan.classList.add("is-invalid");
        productImg.src = "";
    };
}

function uploadImage(event) {
    let file = event.target.files ? event.target.files[0] : null;

    const handleImage = (imageSrc, fromFile = false) => {
        let img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            if (img.width !== 225 || img.height !== 225) {
                errorImageSpan.textContent = "El tamaño de la imagen debe de ser de 225x225.";
                errorImageSpan.className = "text-danger";
                errorImageSpan.classList.add("is-invalid");
                productImg.src = "";
                if (fromFile) inputImage.value = "";
                imageData = new FormData();
            } else {
                errorImageSpan.className = "d-none";
                errorImageSpan.classList.remove("is-invalid");
                productImg.src = imageSrc;
                productImg.style.display = "block";

                if (fromFile) {
                    imageData.append('image', file);
                }
            }
        };

        img.onerror = () => {
            errorImageSpan.textContent = "No se pudo cargar la imagen. Verifique el archivo.";
            errorImageSpan.className = "text-danger";
            errorImageSpan.classList.add("is-invalid");
            productImg.src = "";
        };
    };

    if (file) {
        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            errorImageSpan.textContent = "El tamaño de la imagen no debe exceder los 10 MB.";
            errorImageSpan.className = "text-danger";
            errorImageSpan.classList.add("is-invalid");
            productImg.src = "";
            inputImage.value = "";
            imageData = new FormData();
            return;
        } else {
            errorImageSpan.className = "d-none";
            errorImageSpan.classList.remove("is-invalid");
        }

        let reader = new FileReader();
        reader.onload = (e) => {
            handleImage(e.target.result, true);
        };
        reader.readAsDataURL(file);
    }
}



function createCheckboxWithNumber(branch) {
    const container = document.createElement("div");
    container.className = "checkbox-with-number mb-3";

    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "d-flex align-items-center";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input me-2";
    checkbox.id = branch._id;

    const label = document.createElement("label");
    label.className = "form-check-label me-3";
    label.htmlFor = branch._id;
    label.textContent = branch.name;

    const numberInput = document.createElement("input");
    numberInput.id = branch._id + 1
    numberInput.type = "text";
    numberInput.value = branch.branchProducts[0]?.quantity || 0
    numberInput.oninput = function () {
        numberOnly(numberInput.id);
    };
    numberInput.className = "form-control number-input";
    numberInput.placeholder = "0";
    numberInput.maxLength = 5
    numberInput.disabled = true;

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            numberInput.disabled = false;
        } else {
            numberInput.disabled = true;
            numberInput.value = 0
        }
    });

    if(branch.branchProducts.length > 0){
        checkbox.checked = true
        numberInput.disabled = false;
    }

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    container.appendChild(checkboxContainer);
    container.appendChild(numberInput);

    return container;
}


function clearFields() {
    productImg.src = ""
    inputImage.value = ""
    imageData = new FormData()
    productName.value = '';
    productDescription.value = '';
    productCode.value = '';
    productBarCode.innerHTML = '';
    productPrice.value = '';
    productWeight.value = '';
    productCategory.selectedIndex = 0;
    productUnit.selectedIndex= 0;
    productLimit.value = '';
    productExpirationDate.value = '';
    let checkboxes = branchesList.querySelectorAll('.form-check-input');
    let numberInputs = branchesList.querySelectorAll('.number-input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    numberInputs.forEach(input => {
        input.value = 0;
        input.disabled = true;
    });

}


function registryCancelation(){
    let { modalInstance, primaryBtn, secondaryBtn } = createConfirmationModal("Cuidado", "¿Estas seguro que deseass cancelar el registro?, esta acción no se puede desahcer.", modalTypes.DANGER, "Confirmar.")
    modalInstance.show()
    primaryBtn.onclick = function(){
        clearFields()        
        modalInstance.hide()
        //TODO:GO BACK TO CONSULT PRODUCTS
    }
    secondaryBtn.onclick = function() {
        modalInstance.hide()
    }
}
