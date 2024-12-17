const API_URL = 'http://192.168.100.9:3000/api/v1/users';
const VALID_PAYMENT_NETWORKS = ['Visa', 'MasterCard'];
const URL_IMAGE_VISA='../assets/images/visa.png';
const URL_IMAGE_MASTERCARD='../assets/images/mastercard.png';

//TODO: Get the user id from the session
var userId = '6741260fd2f308dfbeb3e9f2';

window.onload = function() {
    getAllPaymentMethods();
    loadOrderSummary();
}

function getAllPaymentMethods() {
    let withoutPaymentMessage = document.getElementById('payment-methods-message');
    withoutPaymentMessage.className = 'with-payment-methods';
    axios
        .get(`${API_URL}/${userId}/payment-methods`)
        .then((response) => {
            let paymentMethods = response.data.userPaymentMethods;
            
            if (!paymentMethods || paymentMethods.length === 0) {
                withoutPaymentMessage.className = 'without-payment-methods';
                return;
            }

            paymentMethods.forEach(paymentMethod => {
                addPaymentMethodToContainer(paymentMethod);
            });
        })
        .catch((error) => {
            console.error(error);
            showToast("Error al cargar los métodos de pago", toastTypes.WARNING);
        });
}

function addPaymentMethodToContainer(paymentMethod) {
    let paymentMethodContainer = document.getElementById('payment-methods-container');
    let paymentMethodCard = createPaymentMethodCard(paymentMethod);

    paymentMethodContainer.appendChild(paymentMethodCard);
}

function createPaymentMethodCard(paymentMethod) {
    if (!paymentMethod) { 
        return;
    }

    let {cardNumber, expirationDate, paymentNetwork, cardEmitter, cardOwner} = paymentMethod;

    let imageUrl = '';
    if (paymentNetwork === VALID_PAYMENT_NETWORKS[0]) {
        imageUrl = URL_IMAGE_VISA;
    } else if (paymentNetwork === VALID_PAYMENT_NETWORKS[1]) {
        imageUrl = URL_IMAGE_MASTERCARD;
    }

    const paymentMethodContainer = document.createElement('div');
    paymentMethodContainer.classList.add(
        'payment-methods-container', 
        'd-flex', 
        'align-items-center', 
        'border', 
        'p-3', 
        'mb-3'
    );

    const radioAndInfoContainer = document.createElement('div');
    radioAndInfoContainer.classList.add('d-flex', 'align-items-center', 'flex-grow-1');

    const cardSelector = document.createElement('input');
    cardSelector.type = 'radio';
    cardSelector.id = paymentMethod._id;
    cardSelector.classList.add('radio-selector', 'form-check-input', 'me-3');
    radioAndInfoContainer.appendChild(cardSelector);
    
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const cardEmitterTitle = document.createElement('h4');
    cardEmitterTitle.textContent = cardEmitter;
    cardEmitterTitle.id = 'card-emitter';
    cardEmitterTitle.classList.add('mb-1');
    cardInfo.appendChild(cardEmitterTitle);

    const cardNumberElement = document.createElement('p');
    cardNumberElement.textContent = `**** ${cardNumber.slice(-4)}`;
    cardNumberElement.id = 'card-number';
    cardNumberElement.classList.add('mb-0');
    cardInfo.appendChild(cardNumberElement);

    const cardHolderElement = document.createElement('p');
    cardHolderElement.textContent = cardOwner;
    cardHolderElement.id = 'card-owner';
    cardHolderElement.classList.add('mb-0');
    cardInfo.appendChild(cardHolderElement);

    const expirationDateElement = document.createElement('p');
    expirationDateElement.textContent = `Expira: ${expirationDate}`;
    expirationDateElement.id = 'expiration-date';
    expirationDateElement.classList.add('mb-0');
    cardInfo.appendChild(expirationDateElement);

    radioAndInfoContainer.appendChild(cardInfo);
    paymentMethodContainer.appendChild(radioAndInfoContainer);

    const cardOptions = document.createElement('div');
    cardOptions.classList.add('card-options', 'ms-auto');
    
    const cardImage = document.createElement('img');
    cardImage.src = imageUrl;
    cardImage.alt = 'Red de pago: ' + paymentNetwork;
    cardImage.id = 'card-image-network';
    cardOptions.appendChild(cardImage);

    paymentMethodContainer.appendChild(cardOptions);

    paymentMethodContainer.addEventListener('click', () => {
        selectPaymentMethod(paymentMethod._id);
    });

    return paymentMethodContainer;
}

function selectPaymentMethod(paymentMethodId) {
    clearAllSelections();
    let radioSelector = document.getElementById(paymentMethodId);
    radioSelector.checked = true;
}

function clearAllSelections() {
    let radioSelectors = document.querySelectorAll('.radio-selector');
    radioSelectors.forEach(radioSelector => {
        radioSelector.checked = false;
    });
}

function loadOrderSummary() {
    //TODO: 
}

function doOrder() {
    if (!validatePaymentMethod()) {
        showToast("Debes seleccionar un método de pago", toastTypes.WARNING);
        return;
    }

    window.location.replace('./finish-cart.html')
    // TODO:
}

function validatePaymentMethod() {
    let radioSelectors = document.querySelectorAll('.radio-selector');
    let selectedPaymentMethod = Array.from(radioSelectors).find(radioSelector => radioSelector.checked);
    return selectedPaymentMethod;
}

function cancelOrder() {
    //TODO:
}