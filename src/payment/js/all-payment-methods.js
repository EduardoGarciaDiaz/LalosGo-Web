const URL_IMAGE_VISA='../assets/images/visa.png';
const URL_IMAGE_MASTERCARD='../assets/images/mastercard.png';
var paymentMethodsNumber = 0;
var userId;

window.onload = function() {
    userId = getInstance().id;
    getAllPaymentMethods();
    loadBanksOnComboBox();
}

function getAllPaymentMethods() {
    axios
        .get(`${API_URL}users/${userId}/payment-methods`)
        .then((response) => {
            let paymentMethods = response.data.userPaymentMethods;
            if (!paymentMethods || paymentMethods.length === 0) {
                showToast("No se encontraron métodos de pago", toastTypes.PRIMARY);
                return;
            }
            paymentMethods.forEach(paymentMethod => {
                addPaymentMethodToContainer(paymentMethod);
                paymentMethodsNumber++;
            });
        })
        .catch((error) => {
            console.error(error);
            showToast("Error al cargar los métodos de pago", toastTypes.DANGER);
        });
}

const BANKS = [
    { value: "", text: "Seleccione el banco", disabled: true, selected: true },
    { value: "BBVA", text: "BBVA" },
    { value: "Banorte", text: "Banorte" },
    { value: "Banamex", text: "Banamex" },
    { value: "Santander", text: "Santander" },
    { value: "HSBC", text: "HSBC" },
    { value: "Scotiabank", text: "Scotiabank" },
    { value: "Inbursa", text: "Inbursa" },
    { value: "BanBajio", text: "BanBajio" },
    { value: "BanRegio", text: "BanRegio" },
    { value: "BanCoppel", text: "BanCoppel" },
    { value: "BanJercito", text: "BanJercito" },
    { value: "Otro", text: "Otro" },
];

function loadBanksOnComboBox() {
    let bankEmisorSelector = document.getElementById('bankSelect');
    
    BANKS.forEach(bank => {
        const option = document.createElement("option");
        option.value = bank.value;
        option.textContent = bank.text;
    
        if (bank.disabled) option.disabled = true;
        if (bank.selected) option.selected = true;
    
        bankEmisorSelector.appendChild(option);
    });
    
}

function addPaymentMethodToContainer(paymentMethod) {
    let paymentMethodContainer = document.getElementById('payment-methods-container');
    let paymentMethodCard = createPaymentMethodCard(paymentMethod);

    paymentMethodContainer.appendChild(paymentMethodCard);
}

function createPaymentMethodCard(newPaymentMethod) {
    if (!newPaymentMethod) { 
        return;
    }

    let cardNumber = newPaymentMethod.cardNumber;
    let expirationDate = newPaymentMethod.expirationDate;
    let paymentNetwork = newPaymentMethod.paymentNetwork;
    let cardEmitter = newPaymentMethod.cardEmitter;
    let cardOwner = newPaymentMethod.cardOwner;

    let imageUrl = '';
    if (paymentNetwork === VALID_PAYMENT_NETWORKS[0]) {
        imageUrl = URL_IMAGE_VISA;
    } else if (paymentNetwork === VALID_PAYMENT_NETWORKS[1]) {
        imageUrl = URL_IMAGE_MASTERCARD;
    }

    const paymentMethodContainer = document.createElement('div');
    paymentMethodContainer.classList.add(
        'payment-methods-container', 'd-flex', 'justify-content-between',
        'align-items-center', 'border', 'ps-3','pe-3', 'pt-1','pb-1', 'mb-3', 'rounded'
    );
    paymentMethodContainer.id = newPaymentMethod._id;

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');
    
    const cardEmitterTitle = document.createElement('h4');
    cardEmitterTitle.textContent = cardEmitter;
    cardEmitterTitle.id = 'card-emitter';
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

    paymentMethodContainer.appendChild(cardInfo);

    const cardOptions = document.createElement('div');
    cardOptions.classList.add('card-options', 'd-flex');
    
    const cardImage = document.createElement('img');
    cardImage.src = imageUrl;
    cardImage.alt = 'Red de pago: ' + paymentNetwork;
    cardImage.id = 'card-image-network';
    cardOptions.appendChild(cardImage);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'ms-5');
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('id', 'deleteBtn');
    deleteBtn.setAttribute('aria-expanded', 'false');
    deleteBtn.innerHTML = '<i class="bi bi-trash" title="Eliminar método de pago"></i>';

    cardOptions.appendChild(deleteBtn);

    paymentMethodContainer.appendChild(cardOptions);

    deleteBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showDeleteConfirmation(newPaymentMethod);
    });

    return paymentMethodContainer;
}

function showDeleteConfirmation(paymentMethod) {    
    const MODAL_TITLE = 'Eliminar método de pago';
    const MODAL_MESSAGE = `¿Estás seguro que deseas eliminar el método de pago con terminación ${paymentMethod.cardNumber.slice(-4)}?`;
    const MODAL_PRIMARY_BTN_TEXT = 'Eliminar';

    const { modalInstance, primaryBtn, secondaryBtn } = createConfirmationModal(
        MODAL_TITLE, 
        MODAL_MESSAGE, 
        modalTypes.DANGER, 
        MODAL_PRIMARY_BTN_TEXT
    );
    modalInstance.show();

    primaryBtn.onclick = async function() {
        await deletePaymentMethod(paymentMethod._id);
        modalInstance.hide();
    }

    secondaryBtn.onclick = function() {
        modalInstance.hide();
    }
}

async function deletePaymentMethod(paymentMethodId) {
    await axios
        .delete(`${API_URL}users/${userId}/payment-methods/${paymentMethodId}`)
        .then((response) => {
            showToast("Método de pago eliminado", toastTypes.SUCCESS);
            removePaymentMethodFromUI(paymentMethodId);
            paymentMethodsNumber--;
            return true;
        })
        .catch((error) => {
            showToast("No se pudo eliminar el método de pago. Inténtelo de nuevo.", toastTypes.DANGER);
            return false;
        });
}

function removePaymentMethodFromUI(paymentMethodId) {
    const paymentMethodsContainer = document.getElementById('payment-methods-container');
    const paymentMethod = document.getElementById(paymentMethodId);
    paymentMethodsContainer.removeChild(paymentMethod);
}