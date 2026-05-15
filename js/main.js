// DOM Elements
const getEl = (id) => document.getElementById(id);
const queryEl = (sel) => document.querySelector(sel);

// Global UI Elements
const categoryGrid = getEl('category-grid');
const productGrid = getEl('product-grid');
const productFilters = getEl('product-filters');
const componentList = getEl('component-list');
const componentSelection = getEl('component-selection');
const summaryDetails = getEl('summary-details');
const builderTotal = getEl('builder-total');
const compatibilityChecker = getEl('compatibility-checker');
const compatibilityMsg = getEl('compatibility-msg');
const statusIndicator = queryEl('.status-indicator');
const addToCartBtn = getEl('add-build-to-cart');
const cartCount = queryEl('.cart-count');
const cartItemsContainer = getEl('cart-items');
const cartTotalPrice = getEl('cart-total-price');

// State
let cart = JSON.parse(localStorage.getItem('gamingHubCart')) || [];
let builderState = {
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    power: null,
    case: null
};
let activeCategory = 'cpu';

const componentCategories = [
    { id: 'cpu', name: 'Processor (CPU)' },
    { id: 'motherboard', name: 'Motherboard' },
    { id: 'gpu', name: 'Graphics Card (GPU)' },
    { id: 'ram', name: 'Memory (RAM)' },
    { id: 'storage', name: 'Storage' },
    { id: 'power', name: 'Power Supply' },
    { id: 'case', name: 'PC Case' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = queryEl('.cart-btn');
    const cartOverlay = getEl('cart-overlay');
    const cartModal = getEl('cart-modal');
    const closeCartBtn = getEl('close-cart');
    const loginBtn = queryEl('.login-btn');
    const authOverlay = getEl('auth-overlay');
    const authModal = getEl('auth-modal');
    const closeAuthBtn = getEl('close-auth');
    const loginForm = getEl('login-form');
    const searchBar = queryEl('.search-bar');

    renderCategories();
    renderFilters();
    renderProducts();
    initBuilder();
    
    // Search Functionality
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.category.toLowerCase().includes(searchTerm)
            );
            
            // Highlight 'All' filter or clear active filters
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            const allBtn = Array.from(document.querySelectorAll('.filter-btn')).find(b => b.textContent === 'All');
            if (allBtn) allBtn.classList.add('active');

            renderFilteredProducts(filtered);
            
            // Scroll to products if user types
            if (searchTerm.length > 2) {
                const productsSection = getEl('products');
                if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Cart Modal Toggle
    if (cartBtn && cartModal && cartOverlay) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
            cartOverlay.classList.add('active');
        });
        
        const closeCart = () => {
            cartModal.classList.remove('active');
            cartOverlay.classList.remove('active');
        };
        
        if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
    }
    
    // Checkout Redirect
    const checkoutBtn = getEl('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Auth Modal Toggle
    if (loginBtn && authModal && authOverlay) {
        loginBtn.addEventListener('click', () => {
            authModal.classList.add('active');
            authOverlay.classList.add('active');
        });

        const closeAuth = () => {
            authModal.classList.remove('active');
            authOverlay.classList.remove('active');
        };

        if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuth);
        authOverlay.addEventListener('click', closeAuth);
    }

    // Mock Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button');
            btn.textContent = 'Signing in...';
            setTimeout(() => {
                alert('Login successful! Welcome back to Gaming Hub.');
                authModal.classList.remove('active');
                authOverlay.classList.remove('active');
                btn.textContent = 'Sign In';
                loginBtn.textContent = 'My Account';
            }, 1000);
        });
    }
    
    updateCartUI();
});

// Cart Logic
function updateCartUI() {
    // Save to localStorage
    localStorage.setItem('gamingHubCart', JSON.stringify(cart));
    
    const countEl = queryEl('.cart-count');
    const itemsEl = getEl('cart-items');
    const totalEl = getEl('cart-total-price');

    if (countEl) countEl.textContent = cart.length;
    if (itemsEl) {
        itemsEl.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            itemsEl.innerHTML = '<p class="empty-summary">Your cart is empty.</p>';
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
                itemsEl.appendChild(div);
            });
            
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.getAttribute('data-index'));
                    cart.splice(index, 1);
                    updateCartUI();
                });
            });
        }
        
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }
}

// Render Categories
function renderCategories() {
    const grid = getEl('category-grid');
    if (!grid) return;
    grid.innerHTML = '';
    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <img src="${cat.image}" alt="${cat.title}" class="category-img">
            <div class="category-overlay">
                <h3 class="category-title">${cat.title}</h3>
            </div>
        `;
        
        card.addEventListener('click', () => {
            let targetCategory = cat.title;
            if (targetCategory === 'Gaming PCs') targetCategory = 'Gaming PC';
            if (targetCategory === 'Graphics Cards') targetCategory = 'Graphics Card';
            if (targetCategory === 'Processors') targetCategory = 'Processor';
            if (targetCategory === 'Monitors') targetCategory = 'Monitor';
            if (targetCategory === 'Accessories') targetCategory = 'Accessory';
            if (targetCategory === 'Custom Cooling') targetCategory = 'Cooling';
            if (targetCategory === 'Laptops') targetCategory = 'Laptop';
            if (targetCategory === 'Keyboards') targetCategory = 'Keyboard';
            if (targetCategory === 'Mice') targetCategory = 'Mouse';
            if (targetCategory === 'Consoles') targetCategory = 'Console';
            if (targetCategory === 'VR Headsets') targetCategory = 'VR Headset';
            if (targetCategory === 'Printers') targetCategory = 'Printer';
            
            window.location.href = `shop.html?category=${encodeURIComponent(targetCategory)}`;
        });
        
        grid.appendChild(card);
    });
}

// Render Filters
function renderFilters() {
    const filtersEl = getEl('product-filters');
    if (!filtersEl) return;
    const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];
    
    filtersEl.innerHTML = '';
    uniqueCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `btn filter-btn ${cat === 'All' ? 'active' : ''}`;
        btn.textContent = cat;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(cat);
        });
        
        filtersEl.appendChild(btn);
    });
}

// Helper to render a specific array of products (used by search)
function renderFilteredProducts(productsToRender) {
    const grid = getEl('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        grid.innerHTML = '<div class="empty-results"><i class="fas fa-search"></i><p>No products found matching your search.</p></div>';
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
        
        grid.appendChild(card);
    });
}

// Render Products
function renderProducts(filter = 'All') {
    const filtered = filter === 'All' 
        ? products 
        : products.filter(p => p.category === filter);
    
    renderFilteredProducts(filtered);
}

// Builder Logic
function initBuilder() {
    renderBuilderSidebar();
    renderComponentSelection(activeCategory);
    
    const btn = getEl('add-build-to-cart');
    if (btn) {
        btn.addEventListener('click', () => {
            const totalEl = getEl('builder-total');
            const bundlePrice = parseFloat(totalEl.textContent.replace('$', ''));
            const bundleProduct = {
                name: 'Custom Gaming Hub Build',
                price: bundlePrice,
                image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            };
            cart.push(bundleProduct);
            updateCartUI();
            
            const cartModal = getEl('cart-modal');
            const cartOverlay = getEl('cart-overlay');
            if (cartModal && cartOverlay) {
                cartModal.classList.add('active');
                cartOverlay.classList.add('active');
            }
        });
    }
}

function renderBuilderSidebar() {
    const list = getEl('component-list');
    if (!list) return;
    list.innerHTML = '';
    componentCategories.forEach(cat => {
        const li = document.createElement('li');
        li.className = `component-item ${cat.id === activeCategory ? 'active' : ''}`;
        
        const isSelected = builderState[cat.id] !== null;
        
        li.innerHTML = `
            <span>${cat.name}</span>
            <div class="component-status ${isSelected ? 'selected' : ''}"></div>
        `;
        
        li.addEventListener('click', () => {
            activeCategory = cat.id;
            renderBuilderSidebar();
            renderComponentSelection(activeCategory);
        });
        
        list.appendChild(li);
    });
}

function renderComponentSelection(category) {
    const container = getEl('component-selection');
    if (!container) return;
    container.innerHTML = `<h3>Select ${componentCategories.find(c => c.id === category).name}</h3>`;
    
    const items = pcComponents[category];
    const grid = document.createElement('div');
    grid.className = 'selection-grid fade-in';
    
    items.forEach(item => {
        const isSelected = builderState[category] && builderState[category].id === item.id;
        const card = document.createElement('div');
        card.className = `select-card ${isSelected ? 'selected' : ''}`;
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="select-card-img">
            <h4 class="select-card-title">${item.name}</h4>
            <div class="select-card-price">$${item.price.toFixed(2)}</div>
            <div class="select-card-specs">${item.specs}</div>
            ${item.socket ? `<div class="select-card-specs">Socket: ${item.socket}</div>` : ''}
            ${item.type ? `<div class="select-card-specs">Type: ${item.type}</div>` : ''}
        `;
        
        card.addEventListener('click', () => {
            builderState[category] = item;
            renderBuilderSidebar();
            renderComponentSelection(category);
            updateSummary();
            checkCompatibility();
        });
        
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

function updateSummary() {
    const summary = getEl('summary-details');
    const totalEl = getEl('builder-total');
    const btn = getEl('add-build-to-cart');
    if (!summary || !totalEl || !btn) return;

    const selectedItems = Object.entries(builderState).filter(([_, val]) => val !== null);
    
    if (selectedItems.length === 0) {
        summary.innerHTML = '<p class="empty-summary">No components selected yet.</p>';
        totalEl.textContent = '$0.00';
        btn.disabled = true;
        return;
    }
    
    let total = 0;
    summary.innerHTML = '';
    
    selectedItems.forEach(([catId, item]) => {
        const catName = componentCategories.find(c => c.id === catId).name;
        total += item.price;
        
        const div = document.createElement('div');
        div.className = 'summary-item fade-in';
        div.innerHTML = `
            <span style="color: var(--text-secondary); width: 100px; display: inline-block;">${catName}</span>
            <span style="text-align: right; flex: 1;">${item.name}</span>
            <span style="color: var(--neon-blue); font-weight: bold; margin-left: 10px;">$${item.price.toFixed(2)}</span>
        `;
        summary.appendChild(div);
    });
    
    totalEl.textContent = `$${total.toFixed(2)}`;
    
    if (builderState.cpu && builderState.motherboard && builderState.gpu && builderState.ram && builderState.storage && builderState.power && builderState.case) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function checkCompatibility() {
    const indicator = queryEl('.status-indicator');
    const msg = getEl('compatibility-msg');
    const checker = getEl('compatibility-checker');
    const btn = getEl('add-build-to-cart');
    if (!indicator || !msg || !checker || !btn) return;

    let hasError = false;
    let messages = [];
    const { cpu, motherboard, ram } = builderState;
    
    if (cpu && motherboard) {
        if (cpu.socket !== motherboard.socket) {
            hasError = true;
            messages.push(`Socket mismatch: ${cpu.name} (${cpu.socket}) is incompatible with ${motherboard.name} (${motherboard.socket}).`);
        }
    }
    
    if (motherboard && ram) {
        if (motherboard.type !== ram.type) {
            hasError = true;
            messages.push(`Memory mismatch: ${motherboard.name} requires ${motherboard.type} RAM.`);
        }
    }
    
    if (hasError) {
        indicator.className = 'status-indicator error';
        msg.innerHTML = messages.join('<br>');
        checker.style.borderColor = 'rgba(255, 51, 102, 0.5)';
        checker.style.background = 'rgba(255, 51, 102, 0.1)';
        btn.disabled = true;
    } else if (cpu || motherboard || ram) {
        indicator.className = 'status-indicator success';
        msg.textContent = 'All selected components are compatible.';
        checker.style.borderColor = 'rgba(0, 255, 136, 0.3)';
        checker.style.background = 'rgba(0, 0, 0, 0.3)';
    } else {
        indicator.className = 'status-indicator success';
        msg.textContent = 'Select components to check compatibility.';
        checker.style.borderColor = 'rgba(0, 255, 136, 0.3)';
        checker.style.background = 'rgba(0, 0, 0, 0.3)';
    }
}
