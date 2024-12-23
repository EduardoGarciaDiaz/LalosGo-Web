const VALID_FULL_NAME  = /^(?!\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñü]+)*$/;
const VALID_PHONE_NUMBER = /^\+?[0-9]{1,3}[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_USERNAME = /^[a-zA-Z][a-zA-Z0-9._]{1,11}[a-zA-Z0-9]$/;
var SINGLETON;


document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const maxDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById("birthday_label").setAttribute("max", maxDate);

    SINGLETON = getInstance();
    fillClientData();

});

function fillClientData(){
    const formatteDate = SINGLETON.birthdate.substring(0, 10);
    document.getElementById('fullName_label').value = SINGLETON.fullname;
    document.getElementById('username_label').value = SINGLETON.username;
    document.getElementById('cellPhone_label').value = SINGLETON.phone;
    document.getElementById('birthday_label').value = formatteDate;
    document.getElementById('email_label').value = SINGLETON.email;
}

function modifyClientAccount() {
    clearErrors();
    let username = document.getElementById('username_label').value.trim();
    let fullname = document.getElementById('fullName_label').value.trim();
    let birthdate = document.getElementById('birthday_label').value.trim();
    let phone = document.getElementById('cellPhone_label').value.trim();
    let email = document.getElementById('email_label').value.trim();

    var dataClientUpdate = {
        username: username,
        fullname: fullname,
        birthdate: birthdate,
        phone: phone,
        email: email,
    }
    if(isValidClientAccountt(dataClientUpdate)){
        updateClientAccount(dataClientUpdate);
    }
}

async function updateClientAccount(dataClientUpdate){
    try{
        const response = await axios.put(`${API_URL}users/${SINGLETON.id}`, dataClientUpdate);
        if(response.status === 200 && response.data){
            updateSession(dataClientUpdate);
            SINGLETON = getInstance();
            showToast("Se ha modificado la cuenta correctamente", toastTypes.SUCCESS);
            return true;
        }else {
            throw new Error("Error al modificar la cuenta. Inténtelo de nuevo.");
        }
    }catch(error) {
        showToast("Ha ocurrido un error", toastTypes.DANGER);
        throw error;   
    }
}

function isValidClientAccountt(dataClientUpdate){
    
    let isValid = true;

    if(!isClientUsernameValid(dataClientUpdate.username)){
        document.getElementById('username_label').classList.add("is-invalid");
        isValid = false; 
    }

    if(!isClientNameAndLastNameValid(dataClientUpdate.fullname)){
        document.getElementById('fullName_label').classList.add("is-invalid");
        isValid = false;
    }

    if (!dataClientUpdate.birthdate || !isBirthdateClientValid(dataClientUpdate.birthdate)) {
        document.getElementById('birthday_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isClientCellPhoneValid(dataClientUpdate.phone)){
        document.getElementById('cellPhone_label').classList.add("is-invalid");
        isValid = false;
    }
    return isValid;
}

function isClientNameAndLastNameValid (name){
    return VALID_FULL_NAME.test(name);
}

function isClientUsernameValid(username) {
    return VALID_USERNAME.test(username);
}

function isBirthdateClientValid (birthdate){
    const today = new Date();
    const birthdateInput = new Date(birthdate);
    const age = today.getFullYear() - birthdateInput.getFullYear();

    const hasHadBirthdayThisYear = (
        today.getMonth() > birthdateInput.getMonth() || 
        (today.getMonth() === birthdateInput.getMonth() && today.getDate() >= birthdateInput.getDate())
    );

    const finalAge = hasHadBirthdayThisYear ? age : age - 1;

    let isValid = true;
    if (finalAge < 18) {
        isValid = false;
    }

    return isValid;
}

function isClientCellPhoneValid (cellPhone){
    return VALID_PHONE_NUMBER.test(cellPhone);
}

function isClientEmailValid (email){
    return VALID_EMAIL.test(email);
}

function clearErrors(){
    document.getElementById('username_label').classList.remove("is-invalid");
    document.getElementById('fullName_label').classList.remove("is-invalid");
    document.getElementById('birthday_label').classList.remove("is-invalid");
    document.getElementById('cellPhone_label').classList.remove("is-invalid");
}