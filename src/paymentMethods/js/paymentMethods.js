const API_URL='http://192.168.100.9:3000/api/v1/users';

const VALID_EMITTERS = ['Visa', 'MasterCard'];
const VALID_TYPES = ['Credit', 'Debit'];
const CARD_OWNER_REGEX = /^[a-zA-Z\s]*$/;
const CARD_NUMBER_REGEX = /^[0-9]{16}$/;
const CVV_REGEX = /^[0-9]{3}$/;
const EMITTER_REGEX = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,      
    masterCard: /^5[1-5][0-9]{14}$/,
};
//TODO: const EXPIRATION_DATE_REGEX = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

//TODO: Get the user id from the session
var userId = '673d13b642cac2011b450a86';

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

    if (!isValidCardEmitter(newPaymentMethod.cardEmitter)) {
        isValid = false;
    }

    if (!isValidCardType(newPaymentMethod.cardType)) {
        isValid = false;
    }

    return isValid;
}

function isValidCardOwner(cardOwner) {
    if (!CARD_OWNER_REGEX.test(cardOwner)) {
        return false;
    }

    return true;
}

function isValidCardNumber(cardNumber) {
    if (!CARD_NUMBER_REGEX.test(cardNumber)) {
        alert("Número de tarjeta inválido");
        return false;
    }    

    return true;
}

function isValidExpirationDate(expirationDate) {
    // TODO:
    // if (!EXPIRATION_DATE_REGEX.test(expirationDate)) {
    //     return false;
    // }

    return true;
}

function isValidCvv(cvv) {
    if (!CVV_REGEX.test(cvv)) {
        return false;
    }
    return true;
}

function isValidCardEmitter(cardEmitter) {
    if (!VALID_EMITTERS.includes(cardEmitter)) {
        return false;
    }

    return true;
}

function isValidCardType(cardType) {
    if (!VALID_TYPES.includes(cardType)) {
        return false;
    }

    return true;
}

async function addPaymentMethod() {
    let cardOwner = document.getElementById('cardOwner').value;
    let cardNumber = document.getElementById('cardNumber').value;
    let expirationDate = document.getElementById('expirationDate').value;
    let cvv = document.getElementById('cvv').value;
    let cardEmitter = '0';
    let cardType = '0';

    if (cardNumber === '' || cardNumber === null || cardNumber === undefined) {
        alert("Número de tarjeta inválido");
        return;
    }

    ({ cardEmitter, cardType } = await calculateCardData(cardNumber)); 

    let newPaymentMethod = {
        cardOwner: cardOwner,
        cardNumber: cardNumber,
        expirationDate: expirationDate,
        cvv: cvv,
        cardType: cardType,
        cardEmitter: cardEmitter
    };

    if (!isValidPaymentMethod(newPaymentMethod)) {
        alert("Datos de la tarjeta inválidos. Revise los datos ingresados.");
        return;
    }
    
    savePaymentMethod(newPaymentMethod);
}

async function calculateCardData(cardNumber) {
    if (cardNumber !== '' && cardNumber !== null && cardNumber !== undefined) {
        let cardEmitter = calculateCardEmitter(cardNumber);
        let cardType = calculateCardType(cardNumber);
        return { cardEmitter, cardType };
    }
}

    
function calculateCardEmitter(cardNumber) {
    if (EMITTER_REGEX.visa.test(cardNumber)) {
        return 'Visa';
    } else if (EMITTER_REGEX.masterCard.test(cardNumber)) {
        return 'MasterCard';
    } else {
        return 'Unknown';
    }
}

function calculateCardType(cardNumber) {
    const creditCardPrefixes = ['4', '5', '37'];
    const debitCardPrefixes = ['6'];

    if (creditCardPrefixes.includes(cardNumber.charAt(0))) {
        return 'Credit';
    } else if (debitCardPrefixes.includes(cardNumber.charAt(0))) {
        return 'Debit';
    } else {
        return 'Unknown';
    }
}

function savePaymentMethod(newPaymentMethod) {
    let request = new XMLHttpRequest();
    request.open('POST', API_URL + '/' + userId + '/payment-methods', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (this.status >= 200 && this.status < 300) {
            createPaymentMethodCard(newPaymentMethod);
            alert("Método de pago registrado");
            addPaymentMethodModal.hide();
            clearPaymentMethodForm();
        } else {
            alert("No se pudo agregar el método de pago. Inténtelo de nuevo.");
        }
    };
    
    request.onerror = function () {
        alert("No se pudo agregar el método de pago. Inténtelo de nuevo.");
    };
    
    request.send(JSON.stringify(newPaymentMethod));
}

function clearPaymentMethodForm() {
    document.getElementById('cardOwner').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expirationDate').value = '';
    document.getElementById('cvv').value = '';
}

function createPaymentMethodCard(newPaymentMethod) {
    let cardNumber = newPaymentMethod.cardNumber;
    let expirationDate = newPaymentMethod.expirationDate;
    let cardEmitter = newPaymentMethod.cardEmitter;
    let cardOwner = newPaymentMethod.cardOwner;

    let imageUrl = '';
    if (cardEmitter === 'Visa') {
        imageUrl = 'assets/visa.png';
    } else if (cardEmitter === 'MasterCard') {
        imageUrl = 'assets/mastercard.png';
    }

    const paymentMethodContainer = document.createElement('div');
    paymentMethodContainer.classList.add('payment-methods-container', 'd-flex', 'justify-content-between', 'align-items-center', 'border', 'p-3', 'mb-3');

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');
    
    const cardEmitterTitle = document.createElement('h4');
    cardEmitterTitle.textContent = cardEmitter;
    cardInfo.appendChild(cardEmitterTitle);

    const cardNumberElement = document.createElement('p');
    cardNumberElement.textContent = `**** ${cardNumber.slice(-4)}`;
    cardInfo.appendChild(cardNumberElement);

    const cardHolderElement = document.createElement('p');
    cardHolderElement.textContent = cardOwner;
    cardInfo.appendChild(cardHolderElement);

    const expirationDateElement = document.createElement('p');
    expirationDateElement.textContent = `Expira: ${expirationDate}`;
    cardInfo.appendChild(expirationDateElement);

    paymentMethodContainer.appendChild(cardInfo);

    const cardOptions = document.createElement('div');
    cardOptions.classList.add('card-options', 'd-flex');
    
    const cardImage = document.createElement('img');
    cardImage.src = imageUrl;
    cardImage.alt = 'Tipo de tarjeta';
    cardOptions.appendChild(cardImage);

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    
    const dropdownButton = document.createElement('button');
    dropdownButton.classList.add('btn', 'btn-light');
    dropdownButton.type = 'button';
    dropdownButton.setAttribute('id', 'dropdownMenuButton');
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.innerHTML = '<i class="bi bi-three-dots"></i>';
    dropdown.appendChild(dropdownButton);
    
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu');
    dropdownMenu.setAttribute('aria-labelledby', 'dropdownMenuButton');
    
    const editOption = document.createElement('li');
    const editLink = document.createElement('a');
    editLink.classList.add('dropdown-item');
    editLink.href = '#';
    editLink.textContent = 'Editar';
    editOption.appendChild(editLink);
    
    const deleteOption = document.createElement('li');
    const deleteLink = document.createElement('a');
    deleteLink.classList.add('dropdown-item');
    deleteLink.href = '#';
    deleteLink.textContent = 'Eliminar';
    deleteOption.appendChild(deleteLink);
    
    const detailsOption = document.createElement('li');
    const detailsLink = document.createElement('a');
    detailsLink.classList.add('dropdown-item');
    detailsLink.href = '#';
    detailsLink.textContent = 'Detalles';
    detailsOption.appendChild(detailsLink);

    dropdownMenu.appendChild(editOption);
    dropdownMenu.appendChild(deleteOption);
    dropdownMenu.appendChild(detailsOption);
    
    dropdown.appendChild(dropdownMenu);

    cardOptions.appendChild(dropdown);

    paymentMethodContainer.appendChild(cardOptions);

    const paymentMethodsContainer = document.getElementById('payment-methods-container');
    paymentMethodsContainer.appendChild(paymentMethodContainer);
}