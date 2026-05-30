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

    // Promo Code Logic
    const promoInput = document.getElementById('promo-input');
    const applyBtn = document.getElementById('apply-promo-btn');
    const promoStatus = document.getElementById('promo-status');
    const discountRow = document.getElementById('discount-row');
    const discountAmount = document.getElementById('discount-amount');
    
    let currentDiscount = 0;

    applyBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        let discountPercent = 0;
        let message = '';

        if (code === 'GAMING50') {
            discountPercent = 0.50;
            message = '50% Discount Applied!';
        } else if (code === 'SAVE10') {
            discountPercent = 0.10;
            message = '10% Discount Applied!';
        } else if (code === 'BOGO') {
            discountPercent = 0.50; // Simplified for BOGO as half price for total cart
            message = 'BOGO Offer Applied!';
        } else if (code === 'SUMMER20') {
            discountPercent = 0.20;
            message = 'Summer Discount Applied!';
        } else if (code === 'WELCOME10') {
            discountPercent = 0.10;
            message = 'Welcome Discount Applied!';
        } else {
            promoStatus.textContent = 'Invalid promo code.';
            promoStatus.style.color = '#ef4444';
            discountRow.style.display = 'none';
            currentDiscount = 0;
            updateFinalTotal();
            return;
        }

        currentDiscount = total * discountPercent;
        promoStatus.textContent = message;
        promoStatus.style.color = 'var(--neon-green)';
        discountRow.style.display = 'flex';
        discountAmount.textContent = `-$${currentDiscount.toFixed(2)}`;
        updateFinalTotal();
    });

    function updateFinalTotal() {
        const finalTotal = total - currentDiscount;
        checkoutTotalPrice.textContent = `$${finalTotal.toFixed(2)}`;
    }
    
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

            // ── Save order to history ──────────────────────────────────────
            const finalTotal = parseFloat(checkoutTotalPrice.textContent.replace('$', ''));
            const orderId = 'GH-' + Math.random().toString(36).substr(2, 8).toUpperCase();

            // Collect customer shipping details
            const inputs = checkoutForm.querySelectorAll('input');
            const customerName    = inputs[0] ? inputs[0].value : '';
            const customerEmail   = inputs[1] ? inputs[1].value : '';
            const customerAddress = inputs[2] ? inputs[2].value : '';
            const customerCity    = inputs[3] ? inputs[3].value : '';
            const customerZip     = inputs[4] ? inputs[4].value : '';

            const newOrder = {
                id: orderId,
                date: new Date().toISOString(),
                status: 'processing',
                total: isNaN(finalTotal) ? total : finalTotal,
                customer: {
                    name: customerName,
                    email: customerEmail,
                    address: customerAddress,
                    city: customerCity,
                    zip: customerZip
                },
                items: cart.map(item => ({
                    name: item.name,
                    category: item.category || 'Hardware',
                    price: item.price,
                    image: item.image
                }))
            };
            const existingOrders = JSON.parse(localStorage.getItem('gamingHub_orders')) || [];
            existingOrders.unshift(newOrder);
            localStorage.setItem('gamingHub_orders', JSON.stringify(existingOrders));
            // ──────────────────────────────────────────────────────────────

            // Show success modal
            successModal.classList.add('active');
            successOverlay.classList.add('active');
            
            // Clear cart
            localStorage.removeItem('gamingHubCart');
            
        }, 1500);
    });

    // Pre-fill user info if logged in
    if (Auth.isAuthenticated()) {
        const user = Auth.getUser();
        const nameInput = checkoutForm.querySelector('input[placeholder="Full Name"]');
        const emailInput = checkoutForm.querySelector('input[placeholder="Email Address"]');
        
        if (nameInput) nameInput.value = user.name;
        if (emailInput) emailInput.value = user.email;
    }
    
    // Return to home
    returnHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
