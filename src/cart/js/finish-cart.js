window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const orden = params.get('order');
    const orderNumber = document.getElementById('order-number');
    orderNumber.textContent = "N° de orden: " + orden;
};

function goToAllOrders() {
    //TODO: window.location.replace("../my-orders.html");
    window.location.replace("./cart.html");
}

function goToHome() {
    //TODO: window.location.replace("../my-orders.html");
}