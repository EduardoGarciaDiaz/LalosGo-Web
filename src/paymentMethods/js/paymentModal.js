const addPaymentMethodModalElement = document.getElementById('addPaymentMethodModal');
const addPaymentMethodModal = new bootstrap.Modal(addPaymentMethodModalElement);

addPaymentMethodModalElement.addEventListener('shown.bs.modal', () => {
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.focus();
});