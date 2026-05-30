/* ── Orders Page Script ── */

const ORDERS_KEY = 'gamingHub_orders';

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUSES = ['processing', 'shipped', 'delivered'];
const STATUS_ICONS = {
    delivered:  { icon: 'fa-check-circle',  label: 'Delivered'  },
    processing: { icon: 'fa-clock',         label: 'Processing' },
    shipped:    { icon: 'fa-truck',          label: 'Shipped'    },
    cancelled:  { icon: 'fa-times-circle',   label: 'Cancelled'  },
};

/** Assign a random realistic status to a demo order */
function randomStatus() {
    const roll = Math.random();
    if (roll < 0.55) return 'delivered';
    if (roll < 0.75) return 'shipped';
    if (roll < 0.90) return 'processing';
    return 'cancelled';
}

/** Return a formatted date string N days before today */
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
}

// ── Seed demo orders if none exist ───────────────────────────────────────────
function daysFromNow(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString();
}

function seedDemoOrders() {
    const demoOrders = [
        {
            id: 'GH-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            date: daysAgo(2),
            estimatedDelivery: daysFromNow(5),
            status: 'processing',
            total: 2489.97,
            items: [
                { name: 'Titan RTX 4090 Supreme', category: 'Graphic Cards', price: 1899.99, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
                { name: 'Intel Core i9-14900K', category: 'Processor', price: 589.98, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
            ]
        },
        {
            id: 'GH-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            date: daysAgo(9),
            estimatedDelivery: daysFromNow(2),
            status: 'shipped',
            total: 999.99,
            items: [
                { name: 'Predator X34 Curved OLED', category: 'Monitor', price: 999.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
            ]
        },
        {
            id: 'GH-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            date: daysAgo(21),
            estimatedDelivery: daysAgo(3),
            status: 'delivered',
            total: 1498.97,
            items: [
                { name: 'Razer Huntsman V2', category: 'Keyboard', price: 199.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
                { name: 'Logitech G Pro X Superlight', category: 'Mouse', price: 149.99, image: 'https://images.unsplash.com/photo-1527814050087-379381547969?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
                { name: 'Corsair Virtuoso RGB', category: 'Accessory', price: 209.99, image: 'https://images.unsplash.com/photo-1615663245857-ac1eeb5304ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
                { name: 'NZXT Kraken Elite 360', category: 'Cooling', price: 279.99, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
                { name: 'Samsung 990 PRO 2TB', category: 'Storage', price: 169.99, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
                { name: 'Corsair RM1000x', category: 'Power Supply', price: 189.99, image: 'https://images.unsplash.com/photo-1587202372775-b22f236c9689?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
            ]
        },
        {
            id: 'GH-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            date: daysAgo(35),
            estimatedDelivery: daysAgo(14),
            status: 'delivered',
            total: 499.99,
            items: [
                { name: 'Sony PlayStation 5', category: 'Console', price: 499.99, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
            ]
        },
        {
            id: 'GH-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            date: daysAgo(60),
            estimatedDelivery: daysAgo(50),
            status: 'cancelled',
            total: 3299.99,
            items: [
                { name: 'Nebula X Extreme (Intel)', category: 'PCs', price: 3299.99, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
            ]
        },
    ];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(demoOrders));
    return demoOrders;
}

// ── Load orders ───────────────────────────────────────────────────────────────
function loadOrders() {
    let orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
    // Re-seed if empty OR if stored orders are old format (missing estimatedDelivery)
    if (!orders || orders.length === 0 || !orders.some(o => o.estimatedDelivery)) {
        orders = seedDemoOrders();
    }
    // Sort newest first
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ── Date format ───────────────────────────────────────────────────────────────
function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Tracking step index ───────────────────────────────────────────────────────
const TRACK_STEPS = [
    { key: 'ordered',    label: 'Ordered',     icon: 'fa-clipboard-check' },
    { key: 'confirmed',  label: 'Confirmed',   icon: 'fa-thumbs-up'       },
    { key: 'shipped',    label: 'Shipped',     icon: 'fa-truck'            },
    { key: 'delivered',  label: 'Delivered',   icon: 'fa-home'             },
];
const STATUS_TRACK_INDEX = {
    processing: 1,   // confirmed
    shipped:    2,   // shipped
    delivered:  3,   // delivered
    cancelled: -1,
};

function buildTrackingBar(status) {
    if (status === 'cancelled') return '';
    const current = STATUS_TRACK_INDEX[status];

    let html = '<div class="tracking-bar">';
    TRACK_STEPS.forEach((step, i) => {
        let cls = '';
        if (i < current) cls = 'done';
        else if (i === current) cls = 'done current';
        html += `
            <div class="tracking-step ${cls}">
                <div class="tracking-icon"><i class="fas ${step.icon}"></i></div>
                <div class="tracking-label">${step.label}</div>
            </div>`;
    });
    html += '</div>';
    return html;
}

// ── Build order card HTML ─────────────────────────────────────────────────────
function buildOrderCard(order) {
    const statusInfo = STATUS_ICONS[order.status] || STATUS_ICONS.processing;
    const statusCls  = order.status;

    // Items HTML (max 3 shown + overflow badge)
    const MAX_SHOWN = 3;
    const shown = order.items.slice(0, MAX_SHOWN);
    const extra = order.items.length - MAX_SHOWN;

    let itemsHtml = shown.map(item => `
        <div class="order-item-row">
            <img src="${item.image}" alt="${item.name}" class="order-item-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="order-item-icon" style="display:none;"><i class="fas fa-microchip"></i></div>
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-category">${item.category}</div>
            </div>
            <div class="order-item-price">$${item.price.toFixed(2)}</div>
        </div>
    `).join('');

    if (extra > 0) {
        itemsHtml += `
            <div class="order-item-row" style="opacity:0.6; font-size:0.85rem; color:var(--text-secondary); padding-left:0.25rem;">
                <i class="fas fa-plus-circle" style="margin-right:0.5rem; color:var(--primary);"></i>
                ${extra} more item${extra > 1 ? 's' : ''}
            </div>`;
    }

    const trackingHtml = buildTrackingBar(order.status);

    // Delivery date display
    const deliveryDateHtml = order.estimatedDelivery ? (() => {
        const dDate = new Date(order.estimatedDelivery);
        const formatted = dDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        const daysLeft = Math.ceil((dDate - Date.now()) / 86400000);
        const isDelivered = order.status === 'delivered';
        const isCancelled = order.status === 'cancelled';
        let badge = '';
        if (isDelivered) badge = `<span style="background:rgba(0,255,136,0.15);color:#00ff88;border:1px solid rgba(0,255,136,0.3);border-radius:50px;padding:0.2rem 0.7rem;font-size:0.72rem;font-weight:700;">✓ Delivered</span>`;
        else if (isCancelled) badge = `<span style="background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:50px;padding:0.2rem 0.7rem;font-size:0.72rem;font-weight:700;">Cancelled</span>`;
        else if (daysLeft > 0) badge = `<span style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.3);border-radius:50px;padding:0.2rem 0.7rem;font-size:0.72rem;font-weight:700;">${daysLeft} day${daysLeft!==1?'s':''} away</span>`;
        else badge = `<span style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3);border-radius:50px;padding:0.2rem 0.7rem;font-size:0.72rem;font-weight:700;">Arriving today!</span>`;
        return `<div style="display:flex;align-items:center;gap:0.6rem;margin-top:0.4rem;font-size:0.82rem;color:var(--text-secondary);"><i class="fas fa-truck" style="color:#6366f1;"></i><span>Est. Delivery: <strong style="color:#e2e8f0;">${formatted}</strong></span>${badge}</div>`;
    })() : '';

    // Cancel button — only for processing or shipped orders
    const canCancel = order.status === 'processing' || order.status === 'shipped';

    return `
    <div class="order-card status-${statusCls}" data-status="${statusCls}" data-order-id="${order.id}">
        <!-- Header -->
        <div class="order-header">
            <div class="order-id-section">
                <div class="order-id">Order ID: <span>${order.id}</span></div>
                <div class="order-date"><i class="fas fa-calendar-alt"></i>${formatDate(order.date)}</div>
                ${deliveryDateHtml}
            </div>
            <span class="order-status-badge ${statusCls}">
                <span class="status-dot"></span>
                <i class="fas ${statusInfo.icon}" style="font-size:0.75rem;"></i>
                ${statusInfo.label}
            </span>
        </div>

        <!-- Items -->
        <div class="order-items">${itemsHtml}</div>

        <!-- Tracking Bar -->
        ${trackingHtml}

        <!-- Footer -->
        <div class="order-footer">
            <div class="order-total-section">
                <div class="order-total-label">Order Total</div>
                <div class="order-total-value">$${order.total.toFixed(2)}</div>
            </div>
            <div class="order-actions">
                ${order.status !== 'cancelled' ? `
                <button class="btn-order-action" onclick="viewInvoice('${order.id}')">
                    <i class="fas fa-file-invoice"></i> Invoice
                </button>` : ''}
                ${order.status === 'delivered' ? `
                <button class="btn-order-action" onclick="reviewOrder('${order.id}')">
                    <i class="fas fa-star"></i> Review
                </button>` : ''}
                <button class="btn-order-action reorder" onclick="reorder('${order.id}')">
                    <i class="fas fa-redo"></i> Reorder
                </button>
                ${canCancel ? `
                <button class="btn-order-action cancel-btn" onclick="cancelOrder('${order.id}')" style="background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.4);color:#ef4444;">
                    <i class="fas fa-times-circle"></i> Cancel Order
                </button>` : ''}
            </div>
        </div>
    </div>`;
}

// ── Render orders ─────────────────────────────────────────────────────────────
let allOrders = [];

function renderOrders(filter = 'all') {
    const list = document.getElementById('orders-list');
    if (!list) return;

    const filtered = filter === 'all'
        ? allOrders
        : allOrders.filter(o => o.status === filter);

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="orders-empty">
                <i class="fas fa-box-open orders-empty-icon"></i>
                <h2>No ${filter === 'all' ? '' : filter} orders found</h2>
                <p>${filter === 'all' ? "You haven't placed any orders yet." : `No orders with status "${filter}".`}</p>
                <a href="shop.html" class="btn btn-neon" style="display:inline-block;">Shop Now</a>
            </div>`;
        return;
    }

    list.innerHTML = filtered.map((o, i) => {
        const card = buildOrderCard(o);
        // stagger animation delay
        return card.replace('class="order-card', `class="order-card" style="animation-delay:${i * 0.07}s" data-dummy="1" class="order-card`);
    }).join('');

    // Fix: properly inject animation delay
    const cards = list.querySelectorAll('.order-card');
    cards.forEach((card, i) => {
        card.style.animationDelay = `${i * 0.07}s`;
    });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function renderStats() {
    const totalOrders  = allOrders.length;
    const totalSpent   = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const itemsBought  = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.items.length, 0);
    const delivered    = allOrders.filter(o => o.status === 'delivered').length;

    animateCounter('stat-total-orders', totalOrders, false);
    animateCounter('stat-total-spent', totalSpent, true);
    animateCounter('stat-items-bought', itemsBought, false);
    animateCounter('stat-delivered', delivered, false);
}

function animateCounter(id, target, isCurrency) {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const duration = 1000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = isCurrency
            ? '$' + start.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : Math.floor(start).toString();
    }, 16);
}

// ── Action Handlers ───────────────────────────────────────────────────────────
function reorder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    let cart = JSON.parse(localStorage.getItem('gamingHubCart')) || [];
    order.items.forEach(item => cart.push(item));
    localStorage.setItem('gamingHubCart', JSON.stringify(cart));

    // Visual feedback
    const btn = document.querySelector(`[data-order-id="${orderId}"] .btn-order-action.reorder`);
    if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
    }

    // Update cart count in nav
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;
}

function cancelOrder(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    if (order.status !== 'processing' && order.status !== 'shipped') return;

    // Confirm with user
    const confirmed = confirm(`Cancel order ${orderId}?\n\nAre you sure you want to cancel this order? This action cannot be undone.`);
    if (!confirmed) return;

    // Update status in memory and localStorage
    order.status = 'cancelled';
    const stored = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    const idx = stored.findIndex(o => o.id === orderId);
    if (idx !== -1) { stored[idx].status = 'cancelled'; localStorage.setItem(ORDERS_KEY, JSON.stringify(stored)); }

    // Show toast-style feedback
    showOrderToast('Order cancelled successfully.', '#ef4444');

    // Re-render with current filter
    const activeFilter = document.querySelector('.filter-tab.active');
    renderOrders(activeFilter ? activeFilter.dataset.filter : 'all');
    renderStats();
}

function showOrderToast(msg, color) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed;bottom:2rem;right:2rem;z-index:9999;
        background:#1e293b;border:1px solid ${color}44;
        color:${color};padding:1rem 1.5rem;border-radius:14px;
        font-weight:600;font-size:0.95rem;box-shadow:0 8px 32px rgba(0,0,0,0.4);
        display:flex;align-items:center;gap:0.6rem;
        animation:slide-in 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function viewInvoice(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    const deliveryStr = order.estimatedDelivery ? `\nEst. Delivery: ${formatDate(order.estimatedDelivery)}` : '';
    alert(`📄 Invoice for ${order.id}\n\nDate: ${formatDate(order.date)}${deliveryStr}\nStatus: ${order.status.toUpperCase()}\nItems: ${order.items.length}\nTotal: $${order.total.toFixed(2)}\n\n(A full invoice PDF would be emailed to you.)`);
}

function reviewOrder(orderId) {
    const stars = ['★☆☆☆☆','★★☆☆☆','★★★☆☆','★★★★☆','★★★★★'];
    const rating = prompt(`⭐ Rate your order ${orderId}\n\nEnter a rating (1-5):`);
    if (rating && rating >= 1 && rating <= 5) {
        alert(`Thank you for your ${stars[rating-1]} rating! Your feedback helps us improve.`);
    }
}

// ── Filter tabs ───────────────────────────────────────────────────────────────
function initFilters() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderOrders(tab.dataset.filter);
        });
    });
}

// ── Cart Modal (mini shared) ──────────────────────────────────────────────────
function initCartModal() {
    const cartBtn     = document.querySelector('.cart-btn');
    const cartModal   = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart   = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total-price');
    const cartCount   = document.querySelector('.cart-count');

    let cart = JSON.parse(localStorage.getItem('gamingHubCart')) || [];
    if (cartCount) cartCount.textContent = cart.length;

    function renderCart() {
        cart = JSON.parse(localStorage.getItem('gamingHubCart')) || [];
        if (cartCount) cartCount.textContent = cart.length;
        if (!cartItemsEl) return;

        let total = 0;
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-summary">Your cart is empty.</p>';
        } else {
            cartItemsEl.innerHTML = cart.map((item, i) => {
                total += item.price;
                return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="remove-item-btn" data-index="${i}"><i class="fas fa-trash"></i></button>
                </div>`;
            }).join('');

            cartItemsEl.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const idx = parseInt(e.currentTarget.dataset.index);
                    cart.splice(idx, 1);
                    localStorage.setItem('gamingHubCart', JSON.stringify(cart));
                    renderCart();
                });
            });
        }
        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    renderCart();

    if (cartBtn && cartModal && cartOverlay) {
        cartBtn.addEventListener('click', () => {
            renderCart();
            cartModal.classList.add('active');
            cartOverlay.classList.add('active');
        });
        const close = () => { cartModal.classList.remove('active'); cartOverlay.classList.remove('active'); };
        if (closeCart) closeCart.addEventListener('click', close);
        cartOverlay.addEventListener('click', close);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) { alert('Your cart is empty!'); return; }
            window.location.href = 'checkout.html';
        });
    }
}

// ── Auth modal (minimal) ──────────────────────────────────────────────────────
function initAuthModal() {
    const loginBtn     = document.querySelector('.login-btn');
    const authModal    = document.getElementById('auth-modal');
    const authOverlay  = document.getElementById('auth-overlay');
    const closeAuthBtn = document.getElementById('close-auth');

    if (!loginBtn || !authModal) return;

    loginBtn.addEventListener('click', () => {
        authModal.classList.add('active');
        authOverlay.classList.add('active');
    });
    const close = () => { authModal.classList.remove('active'); authOverlay.classList.remove('active'); };
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', close);
    if (authOverlay) authOverlay.addEventListener('click', close);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    allOrders = loadOrders();
    renderStats();
    renderOrders('all');
    initFilters();
    initCartModal();
    initAuthModal();
});
