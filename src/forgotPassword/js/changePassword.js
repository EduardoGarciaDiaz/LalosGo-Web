var USER_ID = sessionStorage.getItem('userId');
const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

function sendAuthenticationCode() {
    clearErrors();
    let password = document.getElementById('newPassword_label').value;
    let repeatPassword = document.getElementById('repeatPassword_label').value;
    if(isPasswordValid(password, repeatPassword)){
        updatedPassword(password, repeatPassword);
    }
}

async function updatedPassword(newPassword, confirmPassword) {
    try {
        const updatePassword = {
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };
        await axios.patch(`${API_URL}/users/${USER_ID}/password`, updatePassword);
        showToast("Se ha actualizado la contraseña", toastTypes.SUCCESS);
        return true;
    } catch (error) {
        alert(error);
        showToast("Error al cambiar la contraseña. Inténtelo más tarde", toastTypes.DANGER);
    }
}

function isPasswordValid(password, repeatPassword) {
    let isValid = true;

    if(!isEmailValid(password)){
        document.getElementById('newPassword_label').classList.add("is-invalid");
        document.getElementById('passwordError').style.display = "block";
        isValid = false;
    }

    if(!isRepeatPasswordValid(password, repeatPassword)){
        document.getElementById('repeatPassword_label').classList.add("is-invalid");
        document.getElementById('repeatPasswordError').style.display = "block";
        isValid = false;
    }

    return isValid
}

function isEmailValid(password) {
    return VALID_PASSWORD.test(password);
}

function isRepeatPasswordValid(password, repeatPassword) {
    let isValid = true;
    if(password !== repeatPassword || repeatPassword === ""){
        isValid = false;
    }
    return isValid;
}

function clearErrors(){
    document.getElementById('newPassword_label').classList.remove("is-invalid");
    document.getElementById('passwordError').style.display = "none";
    document.getElementById('repeatPassword_label').classList.remove("is-invalid");
    document.getElementById('repeatPasswordError').style.display = "none";
}