document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const productGrid = document.getElementById('shop-product-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const sortSelect = document.getElementById('sort-select');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const shopSearch = document.getElementById('shop-search');
    const categoryTitle = document.getElementById('category-title');
    const resultsCount = document.getElementById('results-count');

    // Cart/Auth elements
    const cartBtn = document.querySelector('.cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const loginBtn = document.querySelector('.login-btn');
    const authOverlay = document.getElementById('auth-overlay');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // State
    let cart = JSON.parse(localStorage.getItem('gamingHubCart')) || [];
    let activeFilters = {
        categories: [],
        maxPrice: 5000,
        search: '',
        sort: 'featured'
    };

    // Parse URL Params
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    if (initialCategory) {
        activeFilters.categories.push(initialCategory);
    }

    // Initialize
    renderCategoryFilters();
    applyFilters();
    initModals();
    updateCartUI();

    // Event Listeners
    priceRange.addEventListener('input', (e) => {
        activeFilters.maxPrice = parseInt(e.target.value);
        priceValue.textContent = `$${activeFilters.maxPrice}`;
        applyFilters();
    });

    sortSelect.addEventListener('change', (e) => {
        activeFilters.sort = e.target.value;
        applyFilters();
    });

    shopSearch.addEventListener('input', (e) => {
        activeFilters.search = e.target.value.toLowerCase();
        applyFilters();
    });

    clearFiltersBtn.addEventListener('click', () => {
        activeFilters = {
            categories: [],
            maxPrice: 5000,
            search: '',
            sort: 'featured'
        };
        priceRange.value = 5000;
        priceValue.textContent = '$5000';
        sortSelect.value = 'featured';
        shopSearch.value = '';
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
        applyFilters();
    });

    // Functions
    function renderCategoryFilters() {
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        categoryFiltersContainer.innerHTML = '';
        
        uniqueCategories.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'checkbox-item';
            div.style.marginBottom = '0.5rem';
            
            const isChecked = activeFilters.categories.includes(cat);
            
            div.innerHTML = `
                <label style="display: flex; align-items: center; cursor: pointer; color: var(--text-secondary);">
                    <input type="checkbox" class="filter-checkbox" value="${cat}" ${isChecked ? 'checked' : ''} style="margin-right: 0.8rem; accent-color: var(--neon-blue);">
                    ${cat}
                </label>
            `;
            
            div.querySelector('input').addEventListener('change', (e) => {
                if (e.target.checked) {
                    activeFilters.categories.push(cat);
                } else {
                    activeFilters.categories = activeFilters.categories.filter(c => c !== cat);
                }
                applyFilters();
            });
            
            categoryFiltersContainer.appendChild(div);
        });
    }

    function applyFilters() {
        let filtered = products.filter(p => {
            const matchCategory = activeFilters.categories.length === 0 || activeFilters.categories.includes(p.category);
            const matchPrice = p.price <= activeFilters.maxPrice;
            const matchSearch = p.name.toLowerCase().includes(activeFilters.search) || p.category.toLowerCase().includes(activeFilters.search);
            return matchCategory && matchPrice && matchSearch;
        });

        // Sorting
        if (activeFilters.sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (activeFilters.sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (activeFilters.sort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        renderProducts(filtered);
        
        // Update header
        if (activeFilters.categories.length === 1) {
            categoryTitle.innerHTML = `${activeFilters.categories[0]} <span class="neon-text">Selection</span>`;
        } else if (activeFilters.categories.length > 1) {
            categoryTitle.innerHTML = `Multiple <span class="neon-text">Categories</span>`;
        } else {
            categoryTitle.innerHTML = `All <span class="neon-text">Hardware</span>`;
        }
        
        resultsCount.textContent = `Showing ${filtered.length} products`;
    }

    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        if (productsToRender.length === 0) {
            productGrid.innerHTML = `
                <div class="empty-results" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--neon-blue); opacity: 0.5; margin-bottom: 1rem;"></i>
                    <p>No products match your current filters.</p>
                </div>
            `;
            return;
        }

        productsToRender.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card glass-panel fade-in';
            card.innerHTML = `
                <div class="product-image-wrap">
                    <img src="${prod.image}" alt="${prod.name}" class="product-image">
                </div>
                <span class="product-category">${prod.category}</span>
                <h3 class="product-title">${prod.name}</h3>
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(prod.rating))}
                    <span>(${prod.reviews})</span>
                </div>
                <div class="product-price">$${prod.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary w-100 add-to-cart-simple">Add to Cart</button>
                </div>
            `;
            
            card.querySelector('.add-to-cart-simple').addEventListener('click', () => {
                cart.push(prod);
                updateCartUI();
                const btn = card.querySelector('.add-to-cart-simple');
                btn.textContent = 'Added!';
                btn.style.background = 'var(--success)';
                btn.style.color = '#000';
                setTimeout(() => {
                    btn.textContent = 'Add to Cart';
                    btn.style.background = '#ffffff';
                    btn.style.color = 'var(--bg-dark)';
                }, 1000);
            });
            
            productGrid.appendChild(card);
        });
    }

    function updateCartUI() {
        localStorage.setItem('gamingHubCart', JSON.stringify(cart));
        if (cartCount) cartCount.textContent = cart.length;
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-summary">Your cart is empty.</p>';
            } else {
                cart.forEach((item, index) => {
                    total += item.price;
                    const div = document.createElement('div');
                    div.className = 'cart-item fade-in';
                    div.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                    `;
                    cartItemsContainer.appendChild(div);
                });
                
                document.querySelectorAll('.remove-item-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.currentTarget.getAttribute('data-index'));
                        cart.splice(index, 1);
                        updateCartUI();
                    });
                });
            }
            if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        }
    }

    function initModals() {
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartModal.classList.add('active');
                cartOverlay.classList.add('active');
            });
        }
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => {
                cartModal.classList.remove('active');
                cartOverlay.classList.remove('active');
            });
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartModal.classList.remove('active');
                cartOverlay.classList.remove('active');
            });
        }
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                authModal.classList.add('active');
                authOverlay.classList.add('active');
            });
        }
        const closeAuth = () => {
            authModal.classList.remove('active');
            authOverlay.classList.remove('active');
        };
        if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuth);
        if (authOverlay) authOverlay.addEventListener('click', closeAuth);
        
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Your cart is empty!');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }
    }
});
