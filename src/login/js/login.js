const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const VALID_USERNAME = /^(?![_-])[a-zA-Z0-9_-]{3,16}(?<![_-])$/;

//Cambiar la URL del API
const API_URL = 'http://localhost:3000/api/v1/auth/';


function login(event){
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    alert(username);
    const loginData = {
        username: username,
        password: password
    }

    if(loginIsValid(loginData))
    {
        getLogin(loginData);
    } else{
        showToast("Usuario y/o Contraseña incorrectos", toastTypes.DANGER);
    }
}

async function getLogin(loginData){
    try{
        const response = await axios.post(`${API_URL}`, loginData);
        const role = response.data.role;
        sessionStorage.setItem('Singleton', JSON.stringify(response.data));
        if(role === 'Customer'){
            //Mandar a la pantlla principal
        }else if(role === 'Manager'){
        } else if (role === 'Delivery Person'){
            //Mandar a la pantalla de delivery person
        } else if(role === 'Sales Executive'){
            //Mandar a la pantalla de sales executive
            window.location.href = '/src/orders/orders-history.html';
        } else {
            showToast("No hemos podido enviarlo a la pantalla principal. Inténtelo de nuevo", toastTypes.WARNING);
        }
    }catch (error){
        console.error(error);
        alert(error)
        showToast("Error al iniciar sesión", toastTypes.DANGER);
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
