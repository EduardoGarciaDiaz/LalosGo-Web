const API_URL = 'http://192.168.100.9:3000/api/v1/users';

const VALID_PAYMENT_NETWORKS = ['Visa', 'MasterCard'];
const VALID_CARD_TYPES = ['Crédito', 'Débito'];
const CARD_OWNER_REGEX = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]{2,100}$/;
const CARD_NUMBER_REGEX = /^[0-9]{16}$/;
const CVV_REGEX = /^[0-9]{3}$/;
const PAYMENT_NETWORKS_REGEX = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    masterCard: /^5[1-5][0-9]{14}$/,
};

//TODO: Get the user id from the session
var userId = '6741260fd2f308dfbeb3e9f2';

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const tenYearsLater = new Date(currentYear + 10, today.getMonth());

    const minDate = `${currentYear}-${currentMonth}`;

    const maxDate = `${tenYearsLater.getFullYear()}-${String(tenYearsLater.getMonth() + 1).padStart(2, '0')}`;

    const expirationDateField = document.getElementById("expirationDate");
    expirationDateField.setAttribute("min", minDate);
    expirationDateField.setAttribute("max", maxDate);
});

function isValidPaymentMethod(newPaymentMethod) {
    let isValid = true;

    if (!isValidCardOwner(newPaymentMethod.cardOwner)) {
        isValid = false;
    }

    if (!isValidCardNumber(newPaymentMethod.cardNumber)) {
        isValid = false;
    }

    if (!isValidExpirationDate(newPaymentMethod.expirationDate)) {
        isValid = false;
    }

    if (!isValidCvv(newPaymentMethod.cvv)) {
        isValid = false;
    }

    if (!isValidPaymentNetwork(newPaymentMethod.paymentNetwork)) {
        showErrorMessage('cardNumber', 'invalidCardNumber', 'Número de tarjeta no válido');
        isValid = false;
    }

    if (!isValidCardType(newPaymentMethod.cardType)) {
        showErrorMessage('cardNumber', 'invalidCardNumber', 'Número de tarjeta no válido');
        isValid = false;
    }

    if (!isValidCardEmitter(newPaymentMethod.cardEmitter)) {
        isValid = false;
    }

    return isValid;
}

function showErrorMessage(fieldId, elementId, message) {
    document.getElementById(fieldId).classList.add("is-invalid");
    const invalidData = document.getElementById(elementId);
    invalidData.textContent = message;
}

function isValidCardOwner(cardOwner) {
    if (!cardOwner) {
        showErrorMessage('cardOwner', 'invalidCardOwner', 'El nombre del titular es obligatorio.');
        return false;
    }

    if (!CARD_OWNER_REGEX.test(cardOwner)) {
        showErrorMessage('cardOwner', 'invalidCardOwner', 'El nombre del titular solo puede contener letras y espacios.');
        return false;
    }

    return true;
}

function isValidCardNumber(cardNumber) {
    if (!cardNumber) {
        showErrorMessage('cardNumber', 'invalidCardNumber', 'El número de tarjeta es obligatorio.');
        return false;
    }

    if (!CARD_NUMBER_REGEX.test(cardNumber)) {
        showErrorMessage('cardNumber', 'invalidCardNumber', 'El número de tarjeta debe contener 16 dígitos.');
        return false;
    }

    return true;
}

function isValidExpirationDate(expirationDate) {
    if (!expirationDate) {
        showErrorMessage('expirationDate', 'invalidExpirationDate', 'La fecha de expiración es obligatoria.');
        return false;
    }

    return true;
}

function isValidCvv(cvv) {
    if (!cvv) {
        showErrorMessage('cvv', 'invalidCvv', 'El cvv es obligatorio.');
        return false;
    }

    if (!CVV_REGEX.test(cvv)) {
        showErrorMessage('cvv', 'invalidCvv', 'El cvv debe contener 3 dígitos.');
        return false;
    }

    return true;
}

function isValidPaymentNetwork(paymentNetwork) {
    return VALID_PAYMENT_NETWORKS.includes(paymentNetwork);
}

function isValidCardType(cardType) {
    return VALID_CARD_TYPES.includes(cardType);
}

function isValidCardEmitter(cardEmitter) {
    if (cardEmitter === '' || cardEmitter === null || cardEmitter === undefined || cardEmitter === 'Seleccione el banco') {
        showErrorMessage('bankSelect', 'invalidBank', 'Selecciona un banco emisor.');
        return false;
    }

    return true;
}

async function savePaymentMethod(isEdit, paymentMethodId) {
    clearErrors();

    let cardOwner = document.getElementById('cardOwner').value;
    let cardNumber = document.getElementById('cardNumber').value;
    let expirationDate = document.getElementById('expirationDate').value;
    let cvv = document.getElementById('cvv').value;
    let cardEmitter = document.getElementById('bankSelect').value;
    let paymentNetwork = '0';
    let cardType = '0';

    if (cardNumber === '' || cardNumber === null || cardNumber === undefined) {
        document.getElementById('cardNumber').classList.add("is-invalid");
        const invalidCardNumber = document.getElementById('invalidCardNumber');
        invalidCardNumber.textContent = 'El número de tarjeta debe contener 16 dígitos.';
        return;
    }

    ({ paymentNetwork, cardType } = await calculateCardData(cardNumber));

    let newPaymentMethod = {
        cardOwner: cardOwner.trim(),
        cardNumber: cardNumber.trim(),
        expirationDate: expirationDate.trim(),
        cvv: cvv.trim(),
        cardEmitter: cardEmitter.trim(),
        cardType: cardType.trim(),
        paymentNetwork: paymentNetwork.trim()
    };

    if (!isValidPaymentMethod(newPaymentMethod)) {
        return;
    }

    if (isEdit) {
        if (!paymentMethodId || paymentMethodId === '' || paymentMethodId === null || paymentMethodId === undefined) {
            alert("No se pudo actualizar el método de pago. Inténtelo de nuevo.");
            return;
        }
        newPaymentMethod._id = paymentMethodId;

        updatePaymentMethod(newPaymentMethod);
    } else {
        addPaymentMethod(newPaymentMethod);
    }
}

async function calculateCardData(cardNumber) {
    if (cardNumber !== '' && cardNumber !== null && cardNumber !== undefined) {
        let paymentNetwork = calculatePaymentNetwork(cardNumber);
        let cardType = calculateCardType(cardNumber);
        return { paymentNetwork, cardType };
    }
}

function calculatePaymentNetwork(cardNumber) {
    if (PAYMENT_NETWORKS_REGEX.visa.test(cardNumber)) {
        return VALID_PAYMENT_NETWORKS[0];
    } else if (PAYMENT_NETWORKS_REGEX.masterCard.test(cardNumber)) {
        return VALID_PAYMENT_NETWORKS[1];
    } else {
        return 'Unknown';
    }
}

function calculateCardType(cardNumber) {
    const creditCardPrefixes = ['4', '5', '37'];
    const debitCardPrefixes = ['6'];

    if (creditCardPrefixes.includes(cardNumber.charAt(0))) {
        return VALID_CARD_TYPES[0];
    } else if (debitCardPrefixes.includes(cardNumber.charAt(0))) {
        return VALID_CARD_TYPES[1];
    } else {
        return 'Unknown';
    }
}

function addPaymentMethod(newPaymentMethod) {
    axios
        .post(`${API_URL}/${userId}/payment-methods`, newPaymentMethod)
        .then((response) => {
            let paymentMethod = createPaymentMethodCard(response.data.newPaymentMethod);
            const paymentMethodsContainer = document.getElementById('payment-methods-container');
            paymentMethodsContainer.appendChild(paymentMethod);
            alert("Método de pago registrado");
            paymentMethodFormModal.hide();
            clearPaymentMethodForm();
            paymentMethodsNumber++;
        })
        .catch((error) => {
            alert("No se pudo agregar el método de pago. Inténtelo de nuevo.");
            console.error(error);
        });
}

function clearErrors() {
    document.getElementById('cardOwner').classList.remove("is-invalid");
    document.getElementById('cardNumber').classList.remove("is-invalid");
    document.getElementById('expirationDate').classList.remove("is-invalid");
    document.getElementById('cvv').classList.remove("is-invalid");
    document.getElementById('bankSelect').classList.remove("is-invalid");
}

function clearPaymentMethodForm() {
    document.getElementById('cardOwner').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expirationDate').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('bankSelect').value = '';

    clearErrors();
}