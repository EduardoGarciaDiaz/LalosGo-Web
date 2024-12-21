const USER_SESSION_KEY = 'Singleton';

function getInstance(newUser) {
    try {
        if (!sessionStorage.getItem(USER_SESSION_KEY) && newUser) {
            sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
            return newUser;
        }

        let user = JSON.parse(sessionStorage.getItem(USER_SESSION_KEY));
        
        if (user === undefined || user === null || !user) {
            showToast("No se ha iniciado sesión", toastTypes.ERROR);
            return;
        }

        return user;
    } catch (error) {
        alert("Error al obtener la información del usuario");
    }
}

function clearSession() {
    sessionStorage.removeItem(USER_SESSION_KEY);
}