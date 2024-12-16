window.onload = () => {
    loadProducts();

    const product = {
        imageUrl: 'https://www.claudeusercontent.com/api/placeholder/100/100',
        name: 'Blink Outdoor 4: Cámara de seguridad inalámbrica',
        description: 'Con dos años de duración de la batería, detección de movimiento mejorada',
        price: 300.00,
        quantity: 10
    };
    
    const productCard = createProductCard(product);
    const cartItems = document.getElementById('cart-items')
    cartItems.appendChild(productCard); 
};

function loadProducts() {
    //TODO: Get products from the cart
    let isEmpty = validateEmptyCart();
}

function validateEmptyCart() {
    const productsContainer = document.getElementById('cart-items');
    const productsMessage = document.getElementById('products-message');
    productsMessage.className = 'with-products';

    if (productsContainer.children.length < 0) {
        productsMessage.className = 'without-products';
        return false;
    }
    return true;
}

function goToPayment() {
    //TODO: Validate
    window.location.href = './cart-payment.html';
}

function clearCart() {
    //TODO:
}