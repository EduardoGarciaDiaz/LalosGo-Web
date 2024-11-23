function editPayment(paymentMethod) {
    paymentMethodFormModal.show();
    primaryFormBtn.textContent = 'Guardar';
    primaryFormBtn.onclick = function() {
        savePaymentMethod(true, paymentMethod._id);
    };

    const cardNumber = document.getElementById('cardNumber');
    const cardOwner = document.getElementById('cardOwner');
    const expirationDate = document.getElementById('expirationDate');
    const cvv = document.getElementById('cvv');
    const cardEmitter = document.getElementById('bankSelect');

    cardNumber.value = paymentMethod.cardNumber;
    cardOwner.value = paymentMethod.cardOwner;
    expirationDate.value = paymentMethod.expirationDate;
    cvv.value = paymentMethod.cvv;
    cardEmitter.value = paymentMethod.cardEmitter;
}

function updatePaymentMethod(paymentMethod) {
    let paymentMethodId = paymentMethod._id;
    
    axios
        .patch(`${API_URL}/${userId}/payment-methods/${paymentMethodId}`, paymentMethod)
        .then((response) => {
            const paymentMethodCard = document.getElementById(paymentMethodId);
            paymentMethodCard.querySelector('#card-number').textContent = `**** ${paymentMethod.cardNumber.slice(-4)}`;
            paymentMethodCard.querySelector('#card-owner').textContent = paymentMethod.cardOwner;
            paymentMethodCard.querySelector('#card-emitter').textContent = paymentMethod.cardEmitter;
            paymentMethodCard.querySelector('#expiration-date').textContent = paymentMethod.expirationDate;

            const cardImage = paymentMethodCard.querySelector('#card-image-network');
            if (paymentMethod.paymentNetwork === VALID_PAYMENT_NETWORKS[0]) {
                cardImage.src = 'assets/visa.png';
            } else if (paymentMethod.paymentNetwork === VALID_PAYMENT_NETWORKS[1]) {
                cardImage.src = 'assets/mastercard.png';
            }            
            
            alert("Método de pago actualizado");
            paymentMethodFormModal.hide();
            clearPaymentMethodForm();
        })
        .catch((error) => {
            alert("No se pudo actualizar el método de pago. Inténtelo de nuevo.");
            console.error(error);
        });
}