const DEFAULT_TOAST_TEXT = 'Lalos go está procesando tu solicitud';
const DEFAULT_TOAST_COLOR = 'text-bg-primary';
const DEFAULT_TOAST_AUTO_DISMISS = true;
const DEFAULT_TOAST_TIMEOUT = 3000;

const toastTypes = {
    PRIMARY: DEFAULT_TOAST_COLOR,
    SECONDARY: 'text-bg-secondary',
    SUCCESS: 'text-bg-success',
    DANGER: 'text-bg-danger',
    WARNING: 'text-bg-warning',
    INFO: 'text-bg-info',
    LIGHT: 'text-bg-light', 
    DARK: 'text-bg-dark',
};


function createToast(message, type) {
    let autoDismiss = DEFAULT_TOAST_AUTO_DISMISS;
    let dismissTimeout = DEFAULT_TOAST_TIMEOUT;

    if (!message) {
        message = DEFAULT_TOAST_TEXT;
    }

    if (!type) {
        type = DEFAULT_TOAST_COLOR;
    }

    const toast = document.createElement("div");
    toast.className = `toast align-items-center ${type} border-0`;
    toast.style.position = 'fixed';
    toast.style.top = '1rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.zIndex = '1100';
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    const toastInner = document.createElement("div");
    toastInner.className = "d-flex";

    const toastBody = document.createElement("div");
    toastBody.className = "toast-body";
    toastBody.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.className = "btn-close btn-close-white me-2 m-auto";
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-bs-dismiss", "toast");
    closeButton.setAttribute("aria-label", "Close");

    closeButton.addEventListener("click", () => {
        toast.remove();
    });

    toastInner.appendChild(toastBody);
    toastInner.appendChild(closeButton);
    toast.appendChild(toastInner);

    if (autoDismiss) {
        setTimeout(() => {
            toast.remove();
        }, dismissTimeout);
    }

    return toast;
}

function showToast(message, type) {
    let toast = createToast(message, type);
    let bootstrapToast = new bootstrap.Toast(toast);
    document.body.appendChild(toast);
    bootstrapToast.show();
}