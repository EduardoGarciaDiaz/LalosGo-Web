const paymentMethodFormModalElement = document.getElementById('paymentMethodFormModal');
const paymentMethodFormModal = new bootstrap.Modal(paymentMethodFormModalElement);
const addPaymentMethodBtn = document.getElementById("add-payment-method-btn");
const primaryFormBtn = document.getElementById('primary-form-btn');

addPaymentMethodBtn.addEventListener("click", () => {
    primaryFormBtn.textContent = 'Agregar';
    if (paymentMethodsNumber >= 3) {
        showToast("Solo puedes registrar 3 métodos de pago", toastTypes.WARNING);
        return;
    }

    primaryFormBtn.onclick = function () {
        let isEdit = false;
        let paymentMethodId = null;
        savePaymentMethod(isEdit, paymentMethodId);
    }
    paymentMethodFormModal.show();
});

paymentMethodFormModalElement.addEventListener('shown.bs.modal', () => {
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.focus();
});