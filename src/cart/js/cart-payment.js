const CART_STATUS = 'reserved';
const VALID_PAYMENT_NETWORKS = ['Visa', 'MasterCard'];
const URL_IMAGE_VISA='../assets/images/visa.png';
const URL_IMAGE_MASTERCARD='../assets/images/mastercard.png';
const CVV_REGEX = /^[0-9]{3,4}$/;
const PAYMENT_METHODS = new Map();

var userId;
var orderId;
var branchId;
var paymentMethodId;

window.onload = function() {
    userId = getInstance().id;
    getAllPaymentMethods();
    loadOrderSummary();
}

function getAllPaymentMethods() {
    let withoutPaymentMessage = document.getElementById('payment-methods-message');
    withoutPaymentMessage.className = 'with-payment-methods';
    axios
        .get(`${API_URL}users/${userId}/payment-methods`)
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
            showToast("Error al cargar los métodos de pago", toastTypes.DANGER);
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

    PAYMENT_METHODS.set(paymentMethod._id, paymentMethod);

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
        paymentMethodId = paymentMethod._id;
        selectPaymentMethod(paymentMethodId);
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
    axios
        .get(`${API_URL}carts/${userId}/total`, {
            params: {
                status: CART_STATUS
            }
        })   
        .then((response) => {
            let cartSummary = response.data.cartSummary;
            if (cartSummary === undefined || cartSummary === null) {
                showToast("Ocurrió un error al recuperar el resumen de su compra", toastTypes.INFO);
                return;
            }
            
            let clientAddress = cartSummary.clientAddresses.find(address => address.isCurrentAddress);
            let branchAddress = cartSummary.branchAddress;
            loadAddressData(clientAddress, branchAddress);

            let totalPrice = cartSummary.totalPrice;
            orderId = cartSummary.orderId;
            branchId = cartSummary.branchId;

            let totalPriceSummary = document.getElementsByClassName('total-price-summary')[0];
            if (totalPriceSummary) {
                totalPriceSummary.textContent = `$${totalPrice.toFixed(2)}`;
            }
        })
        .catch((error) => {
            console.error(error);
            showToast("Error al cargar el resumen de la compra", toastTypes.DANGER);
            window.location.replace('./cart.html');
        });
}

function loadAddressData(clientAddress, branchAddress) {
    let clientAddressP = document.getElementById('client-address');
    let branchAddressP = document.getElementById('branch-address');
    
    if (clientAddress && branchAddress) {    
        clientAddressP.textContent = formatAddress(clientAddress);
        branchAddressP.textContent = formatAddress(branchAddress);
    } else {
        showToast("No se pudo cargar la dirección", toastTypes.WARNING);
    }    
}

function formatAddress(address) {
    if (!address) return 'Dirección no disponible';

    const { street, number, cologne, zipcode, locality, federalEntity } = address;

    const formattedAddress = [
        street && number ? `${street} ${number}` : '',
        cologne || '',
        zipcode || '',
        locality || '',
        federalEntity || ''
    ].filter(Boolean).join(', ');

    return formattedAddress;
}

function doOrder() {
    if (!validatePaymentMethod()) {
        showToast("Debes seleccionar un método de pago", toastTypes.WARNING);
        return;
    }

    validateOrder();    
}

function validateOrder() {
    const paymentMethodFormModalElement = document.getElementById('cvv-form-modal');
    const paymentMethodFormModal = new bootstrap.Modal(paymentMethodFormModalElement);
    paymentMethodFormModal.show();
}

function validateCVV() {
    let cvv = document.getElementById('cvv').value;

    if (cvv) {
        cvv = cvv.trim();
        if (!CVV_REGEX.test(cvv)) {
            showErrorMessage('cvv', 'invalidCvv', 'El cvv debe contener de 3 a 4 dígitos.');
            return false;
        }

        goToFinishCart();

    } else {
        showErrorMessage('cvv', 'invalidCvv', 'Ingresa el cvv de tu tarjeta.');
        return false;
    }
}

function clearConfirmationCVV() {
    document.getElementById('cvv').value = '';
}

function goToFinishCart() {
    reserveCartProducts();
}

function showErrorMessage(fieldId, elementId, message) {
    document.getElementById(fieldId).classList.add("is-invalid");
    const invalidData = document.getElementById(elementId);
    invalidData.textContent = message;
}

function validatePaymentMethod() {
    let radioSelectors = document.querySelectorAll('.radio-selector');
    let selectedPaymentMethod = Array.from(radioSelectors).find(radioSelector => radioSelector.checked);
    return selectedPaymentMethod;
}

function cancelOrder() {
    const MODAL_TITLE = 'Eliminar carrito';
    const MODAL_MESSAGE = `¿Estás seguro que deseas eliminar el carrito? Se perderán los productos seleccionados`;
    const MODAL_PRIMARY_BTN_TEXT = 'Eliminar carrito';

    const { modalInstance, primaryBtn, secondaryBtn } = createConfirmationModal(
        MODAL_TITLE, 
        MODAL_MESSAGE, 
        modalTypes.DANGER, 
        MODAL_PRIMARY_BTN_TEXT
    );
    modalInstance.show();

    primaryBtn.onclick = async function() {
        await deleteCart(orderId);
        modalInstance.hide();
        window.location.replace('./cart.html');
    }

    secondaryBtn.onclick = function() {
        modalInstance.hide();
    }
}

async function deleteCart(orderId) {
    axios
    .delete(`${API_URL}carts/${orderId}`, {
        params: {
            status: CART_STATUS
        }
    })
    .then((response) => {
        showToast(response.data.message, toastTypes.SUCCESS);
    })
    .catch((error) => {
        console.log(error);
        const errorMessage = error.response ? error.response.data.message : DEFAULT_ERROR_MESSAGE;
        showToast(errorMessage, toastTypes.DANGER);
    });
}


async function reserveCartProducts() {
    const paymentMethodSelected = paymentMethodId;
    try {
        const response = await axios.put(
            `${API_URL}orders/${orderId}`, 
            {
                customer: userId,
                branch: branchId,
                paymentMethod: paymentMethodSelected
            },
            {
                params: {
                    status: CART_STATUS
                }
            }
        );

        let orderNumber = response.data.order.orderNumber;

        if (!orderNumber) {
            showToast("Ocurrió un error al realizar la orden", toastTypes.ERROR);
            return;
        }

        const params = new URLSearchParams({
            order: orderNumber
        });

        window.location.replace(`./finish-cart.html?${params.toString()}`);
    } catch (error) {
        console.log(error);
        if (error.response.status == 409) {
            showToast("Ha cambiado el inventario de algunos productos, vuelve a revisarlo. Lamentamos los inconvenientes",
                toastTypes.WARNING);
            setTimeout(() => {
                window.location.replace('./cart.html');
            }, 4000);
            return false;
        }
        showToast(error.response.data.message, toastTypes.WARNING);
    }
}