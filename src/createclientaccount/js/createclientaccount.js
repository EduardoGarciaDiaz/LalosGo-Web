const VALID_FULL_NAME  = /^(?!\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñü]+)*$/;
const VALID_PHONE_NUMBER = /^\+?[0-9]{1,3}[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const API_URL = 'http://localhost:3000/api/v1/users';

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const maxDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById("birthday_label").setAttribute("max", maxDate);
  });


function createClientAccount() {
    clearErrors();

    let name = document.getElementById('name_label').value.trim();
    let firstLastName = document.getElementById('firstLastName_label').value.trim();
    let secondLastName = document.getElementById('secondLastName_label').value.trim();
    let birthday = document.getElementById('birthday_label').value.trim();
    let cellPhone = document.getElementById('cellPhone_label').value.trim();
    let password = document.getElementById('password_label').value.trim();
    let email = document.getElementById('email_label').value.trim();

    let newClient = {
        fullname: name + " " + firstLastName + " " + secondLastName,
        birthdate: birthday,
        phone: cellPhone,
        email, email,
        password: password
    }

    if(isValidClientAccountt(newClient)){
        newClient.password = hashPassword(newClient.password);
        registerClient(newClient);   
    }
}

function isValidClientAccountt(newClient){
    
    let isValid = true
    if(!isClientNameAndLastNameValid(newClient.fullname)){
        document.getElementById('name_label').classList.add("is-invalid");
        document.getElementById('firstLastName_label').classList.add("is-invalid");
        document.getElementById('secondLastName_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isBirthdateClientValid(newClient.birthdate) || newClient.birthdate === ""){
        document.getElementById('birthday_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isClientCellPhoneValid(newClient.phone)){
        document.getElementById('cellPhone_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isClientEmailValid(newClient.email)){
        document.getElementById('email_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isClientPasswordValid(newClient.password)){
        document.getElementById('password_label').classList.add("is-invalid");
        isValid = false;
    }
    return isValid;
}

function isClientNameAndLastNameValid (name){
    return VALID_FULL_NAME.test(name);
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

function isClientPasswordValid (password){
    return VALID_PASSWORD.test(password);
}

function clearErrors(){
    document.getElementById('name_label').classList.remove("is-invalid");
    document.getElementById('firstLastName_label').classList.remove("is-invalid");
    document.getElementById('secondLastName_label').classList.remove("is-invalid");
    document.getElementById('birthday_label').classList.remove("is-invalid");
    document.getElementById('cellPhone_label').classList.remove("is-invalid");  
    document.getElementById('email_label').classList.remove("is-invalid");
    document.getElementById('password_label').classList.remove("is-invalid");
}

function registerClient(newClient){
    axios
    .post(`${API_URL}/createClientAccount`, newClient)
    .then((response) => {
        alert("El cliente se ha registrado exitosamente");
    })
    .catch((error) => {
        alert("Ha ocurrido un error al registrar el cliente. Inténtelo de nuevo.");
        alert(error);
        console.error(error);
    });
}

function hashPassword(password) {
    var hashObj = new jsSHA("SHA-512", "TEXT", {numRounds: 1});
    hashObj.update(password);
    var hash = hashObj.getHash("HEX");
    return hash;
  }
