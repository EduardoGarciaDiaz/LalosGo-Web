const API_URL = 'http://127.0.0.1:3000/api/v1/'
const categoryIdentifierRegex = /^[A-Z]{4}\d{3}$/;

let categorySearchBar 
let categoryContainer 
let modalWindowCategory
let modalRegistryCategoryLabel 
let modalRegistryCategoryBtn 
let modalCancelBtn
let _idCategory =""
let modalCategoryIdentifier
let modalCategoryName
let modalCategoryStatus
let toastWindow
let toastTitle 
let toastMessage  
let errorCategoryIdentifierLabel
let errorCategoryNameLabel  

document.addEventListener("DOMContentLoaded", () => {
    categorySearchBar = document.getElementById("category-search-bar")
    categoryContainer = document.getElementById("categories-container"); 
    errorCategoryIdentifierLabel = document.getElementById("error-category-id")
    errorCategoryNameLabel = document.getElementById("error-category-name")
    
    modalWindowCategory = document.getElementById('register-new-category')
    modalRegistryCategoryLabel = document.getElementById("register-category-label")
    modalRegistryCategoryBtn = document.getElementById("register-btn")
    modalCancelBtn = document.getElementById("cancel-btn")
    modalCategoryIdentifier = document.getElementById("category-id")
    modalCategoryName = document.getElementById("category-name")
    modalCategoryStatus = document.getElementById("category-status-label")

    toastWindow = document.getElementById('success-toast');
    toastTitle =  document.getElementById('toast-title');
    toastMessage = document.getElementById('toast-message');
});

window.onload = async function() {
    await loadCategories()      
}

function showModal() {        
    modalRegistryCategoryLabel.value = "Registrar Categoría"    
    modalRegistryCategoryBtn.onclick = function() {
        saveCategory(false)
    }
}

async function loadCategories() {
    axios.get(API_URL+'categories/', {
        params: {
            api_key: "00000" //CAMBIAR 
        },
    }).then((response) => {
        categoryContainer.innerHTML = '';
        response.data.category.forEach((category) => {
            const card = createCard(category);
            
        })
    }).catch((error) => {
        console.error("Error al cargar las categorías:", error);
        categoryContainer.innerHTML = '<p class="text-danger">Error al cargar las categorías. Inténtalo más tarde.</p>';
    })
    
}

function createCard(category) {
    const categoryCard = document.createElement("div");
    categoryCard.className = "col-md-4 mb-3";

    categoryCard.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${category.name}</h5>
                <p class="card-text">
                    <strong>ID:</strong> ${category.identifier}<br>
                    <strong>Estado:</strong> ${category.categoryStatus}
                </p>
                <div class="d-flex justify-content-end">
                    <i class="bi bi-three-dots" style="cursor: pointer;"></i>
                    <!-- Menú oculto -->
                    <div class="dropdown-menu" style="display: none; position: absolute; right: 0; background-color: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); z-index: 1000;">
                        <a href="#" class="dropdown-item edit-option" >Editar</a>
                        <a href="#" class="dropdown-item change-status-option">Desactivar</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const threeDotsIcon = categoryCard.querySelector(".bi-three-dots");
    const dropdownMenu = categoryCard.querySelector(".dropdown-menu");

    threeDotsIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        const isVisible = dropdownMenu.style.display === "block";
        dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    const editOption = categoryCard.querySelector(".edit-option");
    const changeStatisOption = categoryCard.querySelector(".change-status-option");

    editOption.addEventListener("click", () => {
        editCategory(category)
        modalRegistryCategoryBtn.onclick = function() {
            saveCategory(true)
        }        
        dropdownMenu.style.display = "none"; 
    });

    changeStatisOption.addEventListener("click", () => {
        changeCategoryStatus(category)
        dropdownMenu.style.display = "none"; 
    });

    document.addEventListener("click", (event) => {
        if (!categoryCard.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
    
    categoryContainer.appendChild(categoryCard); 
}


function editCategory(category){
    _idCategory = category._id
    modalCategoryIdentifier.value = category.identifier
    modalCategoryIdentifier.readOnly = true;
    modalCategoryName.value = category.name
    modalCategoryStatus.value = category.categoryStatus ? "Active" : "Inactive";
    modalRegistryCategoryLabel.textContent = "Editar Categoría"
    modalRegistryCategoryBtn.textContent = "Guardar"    
    modalCancelBtn.textContent = "Cancelar edición"
    const modal = new bootstrap.Modal(modalWindowCategory);
    modal.show(); 
}


async function changeCategoryStatus(categoryToChange){
    let categoryStatus;
    let identifier = categoryToChange.identifier
    let name = categoryToChange.name
    if(categoryToChange.categoryStatus){
        categoryStatus = false

    }else{
        categoryStatus = true

    }
    try {
        const response = await axios.put(`${API_URL}categories/${categoryToChange._id}`, 
            {
                identifier,
                name,
                categoryStatus,
            },
            {   
                params: {
                    changeStatus: categoryStatus 
                }
            }  
        );
        loadCategories();   
        showToast("Actualización exitosa", response.data.message, true) 
    } catch (error) {
        showToast("Error", response.data.message, false)  
    }
}


async function saveCategory(isEdition) {
    if(!checkEmptyFields()){
        return
    }
    if(!checkFieldsFormat()){
        return
    }

    let _id = _idCategory
    let identifier = modalCategoryIdentifier.value;
    let name = modalCategoryName.value;
    let categoryStatus = modalCategoryStatus.value === "Active" ? true : false;
       
    try {
        if(isEdition){
            const response = await axios.put(`${API_URL}categories/${_id}`, 
                {
                    identifier,
                    name,
                    categoryStatus,
                }
            );                     
            loadCategories();   
            showToast("Actualización exitosa", response.data.message, true)   
            setTimeout(() => {
                const bootstrapModal = bootstrap.Modal.getInstance(modalWindowCategory);
                bootstrapModal.hide(); 
            }, 1500);
        }else {
            const response = await axios.post(API_URL + 'categories/', {
                _id,
                identifier,
                name,
                categoryStatus
            });
            createCard(response.data.category)
            showToast("Registro exitoso", response.data.message, true)            
        }        
        clearModal();            
        
    } catch (error) {
        showToast("Error", "Ocurrio un error al relaziar la operación, intentelo mas tarde", false)  
    }
}


function checkEmptyFields(){
    let areVlaidFields = true 
    if(modalCategoryIdentifier.value == ""){
        areVlaidFields = false        
        modalCategoryIdentifier.classList.add("is-invalid")
        errorCategoryIdentifierLabel.textContent = "Este campo es obligatorio"
        errorCategoryIdentifierLabel.className ="text-danger"
    }else{
        errorCategoryIdentifierLabel.className ="d-none"
        modalCategoryIdentifier.classList.remove("is-invalid")
    }
    if(modalCategoryName.value == ""){
        areVlaidFields = false              
        modalCategoryName.classList.add("is-invalid")
        errorCategoryNameLabel.textContent = "Este campo es obligatorio"  
        errorCategoryNameLabel.className = "text-danger"
    }else{
        errorCategoryNameLabel.className ="d-none"
        modalCategoryName.classList.remove("is-invalid")
    }
    return areVlaidFields
}

function checkFieldsFormat(){
    if(categoryIdentifierRegex.test(modalCategoryIdentifier.value)){     
        errorCategoryNameLabel.className ="d-none"        
        modalCategoryIdentifier.classList.remove("is-invalid")
        return true
    }else{
        errorCategoryIdentifierLabel.textContent = "El indetificador debe seguir el formato: XXXX000 "
        errorCategoryIdentifierLabel.className = "text-danger"
        modalCategoryIdentifier.classList.add("is-invalid")
        return false
    }
}

function searchCategory() {
    const searchInput = removeAccents(document.getElementById("category-search-bar").value.toLowerCase()); // Obtener texto de búsqueda sin acentos
    const categories = document.querySelectorAll("#categories-container .col-md-4"); // Selecciona todas las tarjetas

    categories.forEach(categoryCard => {
        const categoryName = removeAccents(categoryCard.querySelector(".card-title").textContent.toLowerCase()); // Nombre de la categoría sin acentos
        if (categoryName.includes(searchInput)) {
            categoryCard.style.display = "block"; 
        } else {
            categoryCard.style.display = "none"; 
        }
    });
}
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
}

function clearModal() {
    modalCategoryIdentifier.value = "";
    modalCategoryName.value = "";
    modalCategoryStatus.value = "Active";    
    modalCategoryIdentifier.readOnly = false;
    modalRegistryCategoryLabel.textContent = "Registrar Categoría"
    modalRegistryCategoryBtn.textContent = "Registrar"
    modalCancelBtn.textContent = "Cancelar registro"
    errorCategoryIdentifierLabel.className ="d-none"
    errorCategoryNameLabel.className ="d-none"    
    modalCategoryIdentifier.classList.remove("is-invalid")
    modalCategoryName.classList.remove("is-invalid")
}

function showToast(title, message, isSuccess){
    toastTitle.innerHTML = title;
    toastMessage.innerHTML = message
    if(isSuccess){
        toastWindow.className = "toast align-items-center text-bg-success border-0"
    }else{
        toastWindow.className = "toast align-items-center text-bs-danger-border-subtle border-0"
    }
    toastWindow.style.display = 'flex'; 
    const toast = new bootstrap.Toast(toastWindow);
    toast.show();
}
