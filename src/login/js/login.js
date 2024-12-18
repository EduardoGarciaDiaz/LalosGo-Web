const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const VALID_USERNAME = /^(?![_-])[a-zA-Z0-9_-]{3,16}(?<![_-])$/;

//Cambiar la URL del API
const API_URL = 'http://localhost:3000/api/v1/users/';


function login(){
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let login = {
        username: username,
        password: password
    }

    if(loginIsValid(login))
    {
        //Falta conectar con el API
    } else{
        showToast("Usuario y/o Contraseña incorrectos", "text-bg-danger");
    }


}

function loginIsValid(login){
    let isValid = true;
    
    if(!usernameValidation(login.username)){
        isValid = false;
    }

    if(!passwordValidation(login.password)){
        isValid = false;
    }
    return isValid
}

function usernameValidation(username){
    return VALID_USERNAME.test(username);
}

function passwordValidation(password){
    return VALID_PASSWORD.test(password);
}
