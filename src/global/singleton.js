const USER_SESSION_KEY = 'Singleton';

function getInstance(newUser) {
    try {
        if (!sessionStorage.getItem(USER_SESSION_KEY) && newUser) {
            sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
            return newUser;
        }

        let user = JSON.parse(sessionStorage.getItem(USER_SESSION_KEY));

        if (user === undefined || user === null || !user) {
            showToast("No se ha iniciado sesión", toastTypes.DANGER);
            setTimeout(() => redirectToLogin(), 1000);
            return;
        }

        return user;
    } catch (error) {
        alert("Error al obtener la información del usuario");
        clearSession();
    }
}

function redirectToLogin() {
    clearSession();
    window.location.replace("/src/login/login.html");
    history.pushState(null, null, "/src/login/login.html");
    window.addEventListener('popstate', function() {
        history.pushState(null, null, "/src/login/login.html");
    });
}

function clearSession() {
    sessionStorage.removeItem(USER_SESSION_KEY);
}