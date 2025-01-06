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
async function approveOrder(orderId) {
    //Aquí se añade al repartidor y si se añade correctamente se cambia el estado de la orden
    changeOrderStatus(orderId, 'approved');
}