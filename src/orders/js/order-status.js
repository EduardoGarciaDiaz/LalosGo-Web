const DEFAULT_OPTION_VALUE = 0;

async function changeOrderStatus(orderId, status) {
    try {
        let token = getInstance().token;
        let response = await axios.post(`${API_URL}orders/${orderId}/${status}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status < 300 && response.status >= 200) {
            showToast('El pedido se actualizó correctamente.', toastTypes.SUCCESS);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            showToast('Ocurrió un error al actualizar el pedido.', toastTypes.ERROR);
        }
    } catch (error) {
        handleException(error, error.response?.data?.message || 'Ocurrió un error al actualizar el pedido.');
        return;
    }

}


function loadDeliveryPersonSelect(branchId) {
    let token = getInstance().token;
    const select = document.getElementById('deliverySelect');

    axios.get(`${API_URL}employees/${roles.DELIVERY_PERSON}/branch/${branchId}`,
        {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response) => {
            let deliveryPersons = response.data.employees;

            if (!deliveryPersons || deliveryPersons.length === 0) {
                showToast("No se encontraron repartidores", toastTypes.PRIMARY);
                return;
            }

            let defaultOption = document.createElement('option');
            defaultOption.value = DEFAULT_OPTION_VALUE;
            defaultOption.text = 'Seleccione un repartidor';
            defaultOption.selected = true;
            defaultOption.disabled = true;
            select.add(defaultOption);

            deliveryPersons.forEach(deliveryPerson => {
                let option = document.createElement('option');
                option.value = deliveryPerson._id;
                option.text = deliveryPerson.fullname;
                select.add(option);
            });
        })
        .catch((error) => {
            handleException(error, "Error al cargar los repartidores");
        });
}

async function approveOrder(branchId, orderId) {

    loadDeliveryPersonSelect(branchId);

    try {

        const deliveryPersonModalElement = document.getElementById('deliveryPersonModal');
        const deliveryPersonModal = new bootstrap.Modal(deliveryPersonModalElement);
        const primaryFormButton = document.getElementById('primary-form-btn');

        primaryFormButton.onclick = async () => {
            await assignDelivery(orderId);
        }

        deliveryPersonModal.show();
    } catch (error) {
        handleException(error, error.response?.data?.message || 'Ocurrió un error al aprobar el pedido.');
    }
}

async function assignDelivery(orderId) {

    try {
        let token = getInstance().token;
        let deliveryPersonId = document.getElementById('deliverySelect').value;

        if (deliveryPersonId == DEFAULT_OPTION_VALUE) {
            let deliverySelect = document.getElementById('deliverySelect');
            deliverySelect.classList.add('is-invalid');
            const deliverySelectError = document.getElementById('invalid-delivery');
            deliverySelectError.textContent = 'Seleccione un repartidor.';
            return;
        } else {
            let deliverySelect = document.getElementById('deliverySelect');
            deliverySelect.classList.remove('is-invalid');
            const deliverySelectError = document.getElementById('invalid-delivery');
            deliverySelectError.textContent = '';


            let response = await axios.put(`${API_URL}orders/${orderId}/deliveryPerson/${deliveryPersonId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status < 300 && response.status >= 200) {
                showToast('El repartidor se asignó correctamente.', toastTypes.SUCCESS);
            }
        }
    } catch (error) {
        handleException(error, error.response?.data?.message || 'Ocurrió un error al asignar el repartidor.');
        return;
    }

    await changeOrderStatus(orderId, 'approved');
    deliveryPersonModal.hide();
}
