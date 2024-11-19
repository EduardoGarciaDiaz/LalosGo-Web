const addPaymentMethodModal = document.getElementById('addPaymentMethodModal');

addPaymentMethodModal.addEventListener('shown.bs.modal', () => {
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.focus();
})