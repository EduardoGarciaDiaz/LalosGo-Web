const addAuthenticationCodeMethodModalElement = document.getElementById('authenticationCodeModal');
const addAuthenticationCodeModal = new bootstrap.Modal(addAuthenticationCodeMethodModalElement);

addAuthenticationCodeMethodModalElement.addEventListener('shown.bs.modal', () => {
    const authenticationCodeInput = document.getElementById('authenticationCodeInput');
    authenticationCodeInput.focus();
});