document.addEventListener('DOMContentLoaded', () => {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const checkoutForm = document.getElementById('page-checkout-form');
    const successOverlay = document.getElementById('success-overlay');
    const successModal = document.getElementById('success-modal');
    const returnHomeBtn = document.getElementById('return-home-btn');
    
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('gamingHubCart')) || [];
    
    // Render Order Summary
    let total = 0;
    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p class="empty-summary">Your cart is empty.</p>';
        const placeOrderBtn = document.getElementById('page-place-order-btn');
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Cart is empty';
    } else {
        cart.forEach(item => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item fade-in';
            div.style.paddingBottom = '1rem';
            div.style.marginBottom = '1rem';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
            `;
            checkoutItemsContainer.appendChild(div);
        });
    }
    
    checkoutTotalPrice.textContent = `$${total.toFixed(2)}`;
    
    // Handle Form Submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const placeOrderBtn = document.getElementById('page-place-order-btn');
        const originalText = placeOrderBtn.textContent;
        placeOrderBtn.textContent = 'Processing...';
        placeOrderBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            placeOrderBtn.textContent = originalText;
            
            // Show success modal
            successModal.classList.add('active');
            successOverlay.classList.add('active');
            
            // Clear cart
            localStorage.removeItem('gamingHubCart');
            
        }, 1500);
    });
    
    // Return to home
    returnHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
