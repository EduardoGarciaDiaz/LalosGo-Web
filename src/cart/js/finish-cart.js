let role = getInstance().role;
if (role !== roles.CUSTOMER) {
    window.history.back();
}

fetch('/src/shared/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;

        const params = new URLSearchParams(window.location.search);
        const orden = params.get('order');
        const orderNumber = document.getElementById('order-number');
        orderNumber.textContent = "N° de orden: " + (orden || "");
    });

function goToAllOrders() {
    window.location.replace("/src/orders/orders-history.html");
}

function goToHome() {
    window.location.replace("../products/consultProductClient.html");
}