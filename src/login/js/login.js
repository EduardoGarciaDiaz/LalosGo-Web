const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const VALID_USERNAME = /^(?![_-])[a-zA-Z0-9_-]{3,16}(?<![_-])$/;


function login(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    const loginData = {
        username: username,
        password: password
    }

    if (loginIsValid(loginData)) {
        getLogin(loginData);
    } else {
        showToast("Usuario y/o Contraseña incorrectos", toastTypes.DANGER);
    }
}

async function getLogin(loginData) {
    try {
        const response = await axios.post(`${API_URL}auth/`, loginData);
        const role = response.data.role;
        clearSession();
        let user = getInstance(response.data);
        if(user.status === 'Active'){
            if (role === 'Customer') {
                //Mandar a la pantlla principal
                window.location.href = "http://127.0.0.1:5500/src/checkDeliveryAddresses/checkDeliveryAddresses.html";
            } else if (role === 'Manager') {
                //Mandar a la pantalla de manager
            } else if (role === 'Delivery Person') {
                //Mandar a la pantalla de delivery person
            } else if (role === 'Sales Executive') {
                //Mandar a la pantalla de sales executive
                window.location.href = '/src/orders/orders-history.html';
            } else if (role === 'Administrator') {
                //Mandar a la pantalla de administrador 
                window.location.href = '/src/employees/employees.html';
            } else {
                showToast("No hemos podido enviarlo a la pantalla principal. Inténtelo de nuevo", toastTypes.WARNING);
            }
        }else{ 
            showToast("La cuenta está inactiva", toastTypes.DANGER);
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            showToast("Credenciales incorrectas. Verifique su usuario y contraseña.", toastTypes.DANGER);
        } else {
            showToast("Error al iniciar sesión. Inténtelo más tarde.", toastTypes.DANGER);
        }
    }
}

function loginIsValid(login) {
    let isValid = true;

    if (!usernameValidation(login.username)) {
        isValid = false;
    }

    if (!passwordValidation(login.password)) {
        isValid = false;
    }
    return isValid
}

function usernameValidation(username) {
    return VALID_USERNAME.test(username);
}

function passwordValidation(password) {
    return VALID_PASSWORD.test(password);
}
