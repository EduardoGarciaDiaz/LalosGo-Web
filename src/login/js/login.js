const VALID_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d@$!_%*?&]{8,}$/;
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
        if (user.status === 'Active') {
            if (role === 'Customer') {
                //Mandar a la pantlla principal
                window.location.href = "/src/categories/consultCategories.html";
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
        } else {
            showToast("La cuenta está inactiva", toastTypes.DANGER);
        }
    } catch (error) {
        if (error.response.status === 401) {
            showToast("Usuario y/o Contraseña incorrectos", toastTypes.DANGER);
        } else {
            handleException(error);
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
