var paymentMethodsNumber = 0;

window.onload = function() {
    getAllPaymentMethods();
    loadBanksOnComboBox();
}

function getAllPaymentMethods() {
    axios
        .get(`${API_URL}/${userId}/payment-methods`)
        .then((response) => {
            let paymentMethods = response.data.userPaymentMethods;
            paymentMethods.forEach(paymentMethod => {
                addPaymentMethodToContainer(paymentMethod);
                paymentMethodsNumber++;
            });
        })
        .catch((error) => {
            alert('Error al cargar los métodos de pago');
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
    if (newPaymentMethod === null || newPaymentMethod === undefined) { 
        return;
    }

    let cardNumber = newPaymentMethod.cardNumber;
    let expirationDate = newPaymentMethod.expirationDate;
    let paymentNetwork = newPaymentMethod.paymentNetwork;
    let cardEmitter = newPaymentMethod.cardEmitter;
    let cardOwner = newPaymentMethod.cardOwner;

    let imageUrl = '';
    if (paymentNetwork === 'Visa') {
        imageUrl = 'assets/visa.png';
    } else if (paymentNetwork === 'MasterCard') {
        imageUrl = 'assets/mastercard.png';
    }

    const paymentMethodContainer = document.createElement('div');
    paymentMethodContainer.classList.add('payment-methods-container', 'd-flex', 'justify-content-between', 'align-items-center', 'border', 'p-3', 'mb-3');
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
    cardInfo.appendChild(cardNumberElement);

    const cardHolderElement = document.createElement('p');
    cardHolderElement.textContent = cardOwner;
    cardHolderElement.id = 'card-owner';
    cardInfo.appendChild(cardHolderElement);

    const expirationDateElement = document.createElement('p');
    expirationDateElement.textContent = `Expira: ${expirationDate}`;
    expirationDateElement.id = 'expiration-date';
    cardInfo.appendChild(expirationDateElement);

    paymentMethodContainer.appendChild(cardInfo);

    const cardOptions = document.createElement('div');
    cardOptions.classList.add('card-options', 'd-flex');
    
    const cardImage = document.createElement('img');
    cardImage.src = imageUrl;
    cardImage.alt = 'Red de pago: ' + paymentNetwork;
    cardImage.id = 'card-image-network';
    cardOptions.appendChild(cardImage);

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown');
    
    const dropdownButton = document.createElement('button');
    dropdownButton.classList.add('btn', 'btn-light', 'ms-5');
    dropdownButton.type = 'button';
    dropdownButton.setAttribute('id', 'dropdownMenuButton');
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.innerHTML = '<i class="bi bi-three-dots"></i>';
    dropdown.appendChild(dropdownButton);
    
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('dropdown-menu', 'dropdown-menu-start');
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

    dropdownMenu.appendChild(editOption);
    dropdownMenu.appendChild(deleteOption);
    
    dropdown.appendChild(dropdownMenu);

    cardOptions.appendChild(dropdown);

    paymentMethodContainer.appendChild(cardOptions);

    deleteLink.addEventListener('click', function(event) {
        event.preventDefault();
        showDeleteConfirmation(newPaymentMethod);
    });

    editLink.addEventListener('click', function(event) {
        event.preventDefault();
        editPayment(newPaymentMethod);
    });

    return paymentMethodContainer;
}

function showDeleteConfirmation(paymentMethod) {
    const modalMessage = document.getElementById('payment-method-to-delete');
    modalMessage.textContent = `¿Estás seguro que deseas eliminar el método de pago con terminación ${paymentMethod.cardNumber.slice(-4)}?`;

    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    let paymentMethodId = paymentMethod._id;

    confirmDeleteBtn.onclick = async function() {
        await deletePaymentMethod(paymentMethodId);
        confirmationModal.hide();
    };
}

async function deletePaymentMethod(paymentMethodId) {
    await axios
        .delete(`${API_URL}/${userId}/payment-methods/${paymentMethodId}`)
        .then((response) => {
            alert("Método de pago eliminado");
            removePaymentMethodFromUI(paymentMethodId);
            paymentMethodsNumber--;
            return true;
        })
        .catch((error) => {
            alert("No se pudo eliminar el método de pago. Inténtelo de nuevo.");
            return false;
        });
}

function removePaymentMethodFromUI(paymentMethodId) {
    const paymentMethodsContainer = document.getElementById('payment-methods-container');
    const paymentMethod = document.getElementById(paymentMethodId);
    paymentMethodsContainer.removeChild(paymentMethod);
}