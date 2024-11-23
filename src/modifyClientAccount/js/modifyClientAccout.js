const VALID_NAME_LASTNAME  = /^(?!\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñü]+)*$/;
const VALID_PHONE_NUMER = /^\+?[0-9]{1,3}?[-. ]?(\(?\d{1,4}\)?)?[-. ]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const maxDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById("birthday_label").setAttribute("max", maxDate);
  });


function modifyClientAccount() {
    let name = document.getElementById('name_label').value;
    let firstLastName = document.getElementById('firstLastName_label').value;
    let secondLastName = document.getElementById('secondLastName_label').value;
    let birthday = document.getElementById('birthday_label').value;
    let cellPhone = document.getElementById('cellPhone_label').value;
    let password = document.getElementById('password_label').value;
    let email = document.getElementById('email_label').value;
    
    let newClient = {
        name: name,
        firstLastName: firstLastName,
        secondLastName: secondLastName,
        birthdate: birthday,
        cellPhone: cellPhone,
        email, email,
        password: password
    }

    if(isValidClientAccountt(newClient)){
        alert("Cliente modificado exitosamente");
    }
}

function isValidClientAccountt(newClient){
    clearErrors();
    let isValid = true
    if(!isClientNameAndLastNameValid(newClient.name)){
        document.getElementById('name_label').classList.add("is-invalid");
        alert("nombre dle cliente inválido");
        isValid = false;
    }

    if(!isClientNameAndLastNameValid(newClient.firstLastName)){
        document.getElementById('firstLastName_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isClientNameAndLastNameValid(newClient.secondLastName)){
        document.getElementById('secondLastName_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isBirthdateClientValid(newClient.birthdate) || newClient.birthdate === ""){
        document.getElementById('birthday_label').classList.add("is-invalid");
        isValid = false;
    }

    if(!isClientCellPhoneValid(newClient.cellPhone)){
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
    return VALID_NAME_LASTNAME.test(name);
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
    return VALID_PHONE_NUMER.test(cellPhone);
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