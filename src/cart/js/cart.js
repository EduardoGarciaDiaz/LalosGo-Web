window.onload = () => {
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

