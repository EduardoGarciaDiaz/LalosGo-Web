const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.';
const DEFAULT_UNAUTHORIZED_MESSAGE = 'No tiene permisos para realizar esta acción.';
const DEFAULT_NOT_FOUND_MESSAGE = 'No se encontró el recurso solicitado.';
const DEFAULT_CODE = 500;

function handleException(error, customMessage) {
    if (error !== undefined && error) {
        let errorMessage = error.response?.data?.message || DEFAULT_ERROR_MESSAGE;
        let errorCode = error.response?.status || DEFAULT_CODE;

        switch (errorCode) {
            case 400:
                showToast(customMessage || errorMessage, toastTypes.DANGER);
                break;
            case 401:
                manageUnauthorizedError();
                break;
            case 404:
                showToast(customMessage || DEFAULT_NOT_FOUND_MESSAGE, toastTypes.DANGER);
                break;
            default:
                showToast(customMessage || errorMessage, toastTypes.DANGER);
                break;
        }
    }
}

function manageUnauthorizedError() {
    showToast(DEFAULT_UNAUTHORIZED_MESSAGE, toastTypes.DANGER);
    setTimeout(() => redirectToLogin(), 2000);
}