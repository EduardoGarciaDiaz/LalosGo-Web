const API_URL = 'http://127.0.0.1:3000/api/v1/'

let branchName
let branchOpeningTime
let branchClosingTime
let branchStreet
let branchOutNumber
let branchInsideNumber
let branchCP
let branchColony
let branchState
let branchTown
let branchLocality

document.addEventListener("DOMContentLoaded", () => {
    branchName = document.getElementById("branch-name")
    branchOpeningTime = document.getElementById("branch-opentime")
    branchClosingTime = document.getElementById("branch-closetime")
    branchStreet = document.getElementById("branch-street")
    branchOutNumber = document.getElementById("branch-extnumber")
    branchInsideNumber= document.getElementById("branch-intnumber")
    branchColony = document.getElementById("branch-colony")
    branchCP = document.getElementById("branch-postalcode")
    branchState = document.getElementById("branch-state")
    branchTown =  document.getElementById("branch-municipality")
    branchLocality = document.getElementById("branch-locality")
} )

async function saveBranch(isEdition) {
    event.preventDefault();
    if(!checkEmptyFields()){

        return
    }
    if(!checkFieldFormats()){
        return
    }
    if(isEdition){
        await editBranch()
    }else{
       await  createBranch()
    }
}

async function createBranch(){
    let name = branchName.value
    let openingTime = branchOpeningTime.value
    let closingTime = branchClosingTime.value
    let location = {
        type:"Point",
        coordinates: [19.541915036343163, -96.92727810184944]
    }
    let address = {
        street: branchStreet.value,
        number: branchOutNumber.value,
        cologne: branchColony.value,
        zipcode: branchCP.value,
        locality: branchLocality.value,
        municipality: branchTown.value,
        federalEntity: branchState.value,
        internalNumber: branchInsideNumber.value,
        location: location
    }

    try {
        let response = await axios.post(API_URL + 'branches/',{
            name,
            openingTime,
            closingTime,
            address
        })
        if(response.status < 300 && response.status > 199) {
            showToast(response.data.message, toastTypes.SUCCESS)
            clearFields()  
        }
        else{
            showToast(response.data.message, toastTypes.WARNING)
        }
        
    } catch (error) {
        showToast("Ocurrio algo inesperado al realizar la petición. Revise su conexión a internet e inténtelo mas tarde", toastTypes.WARNING)
    }
}



function checkEmptyFields() {
    let areValidFields = true;
    
    let errorBranchName = document.getElementById("error-branch-name");
    let errorBranchOpenTime = document.getElementById("error-branch-opentime");
    let errorBranchCloseTime = document.getElementById("error-branch-closetime");
    let errorBranchStreet = document.getElementById("error-branch-street");
    let errorBranchExtNumber = document.getElementById("error-branch-extnumber");
    let errorBranchIntNumber = document.getElementById("error-branch-intnumber");
    let errorBranchPostalCode = document.getElementById("error-branch-postalcode");
    let errorBranchColony = document.getElementById("error-branch-colony");
    let errorBranchState = document.getElementById("error-branch-state");
    let errorBranchMunicipality = document.getElementById("error-branch-municipality");
    let errorBranchLocality = document.getElementById("error-branch-locality");

    if (!branchName.value) {
        areValidFields = false;
        branchName.classList.add("is-invalid");
        errorBranchName.textContent = "Este campo es obligatorio";
        errorBranchName.className = "text-danger";
    } else {
        errorBranchName.className = "d-none";
        branchName.classList.remove("is-invalid");
    }

    if (!branchOpeningTime.value) {
        areValidFields = false;
        branchOpeningTime.classList.add("is-invalid");
        errorBranchOpenTime.textContent = "Este campo es obligatorio";
        errorBranchOpenTime.className = "text-danger";
    } else {
        errorBranchOpenTime.className = "d-none";
        branchOpeningTime.classList.remove("is-invalid");
    }

    if (!branchClosingTime.value) {
        areValidFields = false;
        branchClosingTime.classList.add("is-invalid");
        errorBranchCloseTime.textContent = "Este campo es obligatorio";
        errorBranchCloseTime.className = "text-danger";
    } else {
        errorBranchCloseTime.className = "d-none";
        branchClosingTime.classList.remove("is-invalid");
    }

    if (!branchStreet.value) {
        areValidFields = false;
        branchStreet.classList.add("is-invalid");
        errorBranchStreet.textContent = "Este campo es obligatorio";
        errorBranchStreet.className = "text-danger";
    } else {
        errorBranchStreet.className = "d-none";
        branchStreet.classList.remove("is-invalid");
    }

    if (!branchOutNumber.value) {
        areValidFields = false;
        branchOutNumber.classList.add("is-invalid");
        errorBranchExtNumber.textContent = "Este campo es obligatorio";
        errorBranchExtNumber.className = "text-danger";
    } else {
        errorBranchExtNumber.className = "d-none";
        branchOutNumber.classList.remove("is-invalid");
    }

    if (!branchInsideNumber.value) {
        areValidFields = false;
        branchInsideNumber.classList.add("is-invalid");
        errorBranchIntNumber.textContent = "Este campo es obligatorio";
        errorBranchIntNumber.className = "text-danger";
    } else {
        errorBranchIntNumber.className = "d-none";
        branchInsideNumber.classList.remove("is-invalid");
    }

    if (!branchCP.value) {
        areValidFields = false;
        branchCP.classList.add("is-invalid");
        errorBranchPostalCode.textContent = "Este campo es obligatorio";
        errorBranchPostalCode.className = "text-danger";
    } else {
        errorBranchPostalCode.className = "d-none";
        branchCP.classList.remove("is-invalid");
    }

    if (!branchColony.value) {
        areValidFields = false;
        branchColony.classList.add("is-invalid");
        errorBranchColony.textContent = "Este campo es obligatorio";
        errorBranchColony.className = "text-danger";
    } else {
        errorBranchColony.className = "d-none";
        branchColony.classList.remove("is-invalid");
    }

    if (!branchState.value) {
        areValidFields = false;
        branchState.classList.add("is-invalid");
        errorBranchState.textContent = "Este campo es obligatorio";
        errorBranchState.className = "text-danger";
    } else {
        errorBranchState.className = "d-none";
        branchState.classList.remove("is-invalid");
    }

    if (!branchTown.value) {
        areValidFields = false;
        branchTown.classList.add("is-invalid");
        errorBranchMunicipality.textContent = "Este campo es obligatorio";
        errorBranchMunicipality.className = "text-danger";
    } else {
        errorBranchMunicipality.className = "d-none";
        branchTown.classList.remove("is-invalid");
    }

    if (!branchLocality.value) {
        areValidFields = false;
        branchLocality.classList.add("is-invalid");
        errorBranchLocality.textContent = "Este campo es obligatorio";
        errorBranchLocality.className = "text-danger";
    } else {
        errorBranchLocality.className = "d-none";
        branchLocality.classList.remove("is-invalid");
    }

    return areValidFields;
}

function checkFieldFormats() {
    let areValidFormats = true;

    let errorBranchOpenTime = document.getElementById("error-branch-opentime");
    let errorBranchCloseTime = document.getElementById("error-branch-closetime");
    let errorBranchExtNumber = document.getElementById("error-branch-extnumber");
    let errorBranchIntNumber = document.getElementById("error-branch-intnumber");
    let errorBranchPostalCode = document.getElementById("error-branch-postalcode");

    const postalCodeRegex = /^\d{5}$/;
    if (!postalCodeRegex.test(branchCP.value)) {
        areValidFormats = false;
        branchCP.classList.add("is-invalid");
        errorBranchPostalCode.textContent = "Código postal inválido (debe ser 5 dígitos)";
        errorBranchPostalCode.className = "text-danger";
    } else {
        errorBranchPostalCode.className = "d-none";
        branchCP.classList.remove("is-invalid");
    }

   const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(branchOpeningTime.value)) {
        areValidFormats = false;
        branchOpeningTime.classList.add("is-invalid");
        errorBranchOpenTime.textContent = "Hora de apertura inválida (formato HH:MM)";
        errorBranchOpenTime.className = "text-danger";
    } else {
        errorBranchOpenTime.className = "d-none";
        branchOpeningTime.classList.remove("is-invalid");
    }

    if (!timeRegex.test(branchClosingTime.value)) {
        areValidFormats = false;
        branchClosingTime.classList.add("is-invalid");
        errorBranchCloseTime.textContent = "Hora de cierre inválida (formato HH:MM)";
        errorBranchCloseTime.className = "text-danger";
    } else {
        errorBranchCloseTime.className = "d-none";
        branchClosingTime.classList.remove("is-invalid");
    }

    const numberRegex = /^[0-9a-zA-Z]+[-\s]?[0-9a-zA-Z]*$/;
    if (!numberRegex.test(branchOutNumber.value)) {
        areValidFormats = false;
        branchOutNumber.classList.add("is-invalid");
        errorBranchExtNumber.textContent = "Número exterior inválido";
        errorBranchExtNumber.className = "text-danger";
    } else {
        errorBranchExtNumber.className = "d-none";
        branchOutNumber.classList.remove("is-invalid");
    }

    if (!numberRegex.test(branchInsideNumber.value)) {
        areValidFormats = false;
        branchInsideNumber.classList.add("is-invalid");
        errorBranchIntNumber.textContent = "Número interior inválido";
        errorBranchIntNumber.className = "text-danger";
    } else {
        errorBranchIntNumber.className = "d-none";
        branchInsideNumber.classList.remove("is-invalid");
    }

    return areValidFormats;
}


function clearFields() {
    branchName.value = '';
    branchOpeningTime.value = '';
    branchClosingTime.value = '';
    branchStreet.value = '';
    branchOutNumber.value = '';
    branchInsideNumber.value = '';
    branchCP.value = '';
    branchColony.value = '';
    branchState.value = '';
    branchTown.value = '';
    branchLocality.value = '';
}

