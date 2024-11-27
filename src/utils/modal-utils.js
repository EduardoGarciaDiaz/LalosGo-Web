const DEFAULT_MODAL_TITLE = 'Confirmación';
const DEFAULT_MODAL_MESSAGE = '¿Estás seguro de realizar esta acción?';
const DEFAULT_PRIMARY_BTN_TEXT = 'Aceptar';

const modalTypes = {
    CONFIRMATION: 'btn-primary',
    DANGER: 'btn-danger',
};

function createConfirmationModal(title, message, type, primaryBtnText) {
    if (!type) {
        type = modalTypes.CONFIRMATION;
    }

    if (!title) {
        title = DEFAULT_MODAL_TITLE;
    }

    if (!message) {
        message = DEFAULT_MODAL_MESSAGE;
    }

    if (!primaryBtnText) {
        primaryBtnText = DEFAULT_PRIMARY_BTN_TEXT;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'confirmationModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'confirmationModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'confirmationModalLabel';
    modalTitle.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.id = 'payment-method-to-delete';
    modalBody.textContent = message;

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    const secondaryBtn = document.createElement('button');
    secondaryBtn.type = 'button';
    secondaryBtn.className = 'btn btn-secondary';
    secondaryBtn.setAttribute('data-bs-dismiss', 'modal');
    secondaryBtn.textContent = 'Cancelar';

    const primaryBtn = document.createElement('button');
    primaryBtn.type = 'button';
    primaryBtn.className = `btn ${type}`;
    primaryBtn.id = 'confirm-delete-btn';
    primaryBtn.textContent = primaryBtnText;

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    modalFooter.appendChild(secondaryBtn);
    modalFooter.appendChild(primaryBtn);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    return {
        modalInstance: new bootstrap.Modal(modal),
        primaryBtn,
        secondaryBtn,
    };
}
