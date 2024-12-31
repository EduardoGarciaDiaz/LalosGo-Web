const VALID_FULL_NAME  = /^(?!\s)[A-ZÁÉÍÓÚÑ][a-záéíóúñü]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñü]+)*$/;
const VALID_PHONE_NUMBER = /^\+?[0-9]{1,3}[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
const VALID_USERNAME = /^[a-zA-Z][a-zA-Z0-9._]{1,11}[a-zA-Z0-9]$/;

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
    let username = document.getElementById('username_label').value.trim();
    let fullname = document.getElementById('fullName_label').value.trim();
    let birthdate = document.getElementById('birthday_label').value.trim();
    let phone = document.getElementById('cellPhone_label').value.trim();
    let password = document.getElementById('password_label').value.trim();
    let email = document.getElementById('email_label').value.trim();

    var newClient = {
        username: username,
        fullname: fullname,
        birthdate: birthdate,
        phone: phone,
        password: password,
        email: email,
      };

    if(isValidClientAccountt(newClient)){
        sessionStorage.setItem('actionType', 'CreateClientAccount');
        sessionStorage.setItem('creationAccountData', JSON.stringify(newClient));
        window.location.href = "http://127.0.0.1:5500/src/RegisterDeliveryAddress/registerDeliveryAddress.html";
    }
}

function isValidClientAccountt(newClient){
    
    let isValid = true;

    if(!isClientUsernameValid(newClient.username)){
        document.getElementById('username_label').classList.add("is-invalid");
        document.getElementById('userError').style.display = "block";
        isValid = false; 
    }

    if(!isClientNameAndLastNameValid(newClient.fullname)){
        document.getElementById('fullName_label').classList.add("is-invalid");
        document.getElementById('fullNameError').style.display = "block";
        isValid = false;
    }

    if (!newClient.birthdate || !isBirthdateClientValid(newClient.birthdate)) {
        document.getElementById('birthday_label').classList.add("is-invalid");
        document.getElementById('birthdateError').style.display = "block";
        isValid = false;
    }

    if(!isClientCellPhoneValid(newClient.phone)){
        document.getElementById('cellPhone_label').classList.add("is-invalid");
        document.getElementById('phoneNumberError').style.display = "block";
        isValid = false;
    }

    if(!isClientEmailValid(newClient.email)){
        document.getElementById('email_label').classList.add("is-invalid");
        document.getElementById('emailError').style.display = "block";
        isValid = false;
    }

    if(!isClientPasswordValid(newClient.password)){
        document.getElementById('password_label').classList.add("is-invalid");
        document.getElementById('passwordError').style.display = "block";
        isValid = false;
    }

    return isValid;
}

function isClientNameAndLastNameValid (fullname){
    return VALID_FULL_NAME.test(fullname);
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

function isClientPasswordValid (password){
    return VALID_PASSWORD.test(password);
}

function clearErrors(){
    document.getElementById('username_label').classList.remove("is-invalid");
    document.getElementById('fullName_label').classList.remove("is-invalid");
    document.getElementById('birthday_label').classList.remove("is-invalid");
    document.getElementById('cellPhone_label').classList.remove("is-invalid");  
    document.getElementById('email_label').classList.remove("is-invalid");
    document.getElementById('password_label').classList.remove("is-invalid");

    document.getElementById('userError').style.display = "none";
    document.getElementById('fullNameError').style.display = "none";
    document.getElementById('birthdateError').style.display = "none";
    document.getElementById('phoneNumberError').style.display = "none";
    document.getElementById('emailError').style.display = "none";
    document.getElementById('passwordError').style.display = "none";
}