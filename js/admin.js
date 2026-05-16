// Offers State (Keep local for now or move to data.js later)
let offers = [
    { id: 1, name: 'Summer Electronics Bash', code: 'SUMMER20', discount: '20%', status: 'Active', ends: '2026-06-30' },
    { id: 2, name: 'First Purchase Discount', code: 'WELCOME10', discount: '10%', status: 'Active', ends: '2026-12-31' }
];

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initCharts();
    renderLowStock();
    renderProducts();
    renderOffers();
    setupEventListeners();
    updateStats();
    
    // Update Profile UI
    const user = Auth.getUser();
    if (user) {
        const profileName = document.querySelector('.sidebar-link + div p.font-semibold') || document.querySelector('p.text-sm.font-semibold');
        if (profileName) profileName.textContent = user.name;
    }
});

// Event Listeners
function setupEventListeners() {
    // Section Switching
    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            switchSection(sectionId);
            
            // Update Active State
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        document.body.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        document.getElementById('sun-icon').classList.toggle('hidden', isDark);
        document.getElementById('moon-icon').classList.toggle('hidden', !isDark);
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    });

    // Populate Category Selects
    const populateCategories = () => {
        const selects = [document.getElementById('category-filter'), document.querySelector('select[name="category"]')];
        selects.forEach(select => {
            if (!select) return;
            // Keep "All Categories" if it's the filter select
            const hasAll = select.id === 'category-filter';
            select.innerHTML = (hasAll ? '<option value="all">All Categories</option>' : '') + 
                categories.map(c => `<option value="${c.title}">${c.title}</option>`).join('');
        });
    };
    populateCategories();

    // Modal Handling
    const productModal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const closeModal = document.getElementById('close-modal');
    const cancelModal = document.getElementById('cancel-modal');

    addProductBtn.onclick = () => {
        populateCategories(); // Refresh list in case categories were added
        productModal.classList.remove('hidden');
        setTimeout(() => productModal.classList.replace('opacity-0', 'opacity-100'), 10);
    };

    const hideModal = () => {
        productModal.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => productModal.classList.add('hidden'), 300);
    };

    closeModal.onclick = hideModal;
    cancelModal.onclick = hideModal;

    // Form Submission
    document.getElementById('product-form').onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Find max ID to avoid conflicts
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 100;
        
        const newProduct = {
            id: maxId + 1,
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            discountPrice: formData.get('discountPrice') ? parseFloat(formData.get('discountPrice')) : null,
            stock: parseInt(formData.get('stock')),
            status: 'Active',
            rating: 5.0,
            reviews: 0,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' // Generic placeholder
        };

        products.unshift(newProduct);
        syncToStorage();
        
        // Reset filters to show the new product
        document.getElementById('product-search').value = '';
        document.getElementById('category-filter').value = 'all';
        
        renderProducts();
        renderLowStock();
        updateStats();
        hideModal();
        showToast('Product added successfully!');
        e.target.reset();
    };

    // Filters
    document.getElementById('product-search').oninput = (e) => {
        renderProducts(e.target.value, document.getElementById('category-filter').value);
    };

    document.getElementById('category-filter').onchange = (e) => {
        renderProducts(document.getElementById('product-search').value, e.target.value);
    };
}

// UI Rendering Functions
function updateStats() {
    const totalProducts = products.length;
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockItems = products.filter(p => p.stock === 0).length;
    const uniqueCategories = new Set(products.map(p => p.category)).size;

    document.getElementById('stat-total-products').textContent = totalProducts.toLocaleString();
    document.getElementById('stat-inventory-value').textContent = `$${inventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('stat-out-of-stock').textContent = outOfStockItems.toLocaleString();
    document.getElementById('stat-low-stock-count').textContent = `${lowStockItems} Alerts`;
    document.getElementById('stat-total-categories').textContent = uniqueCategories.toLocaleString();
    
    // Update trend color for low stock
    const lowStockSpan = document.getElementById('stat-low-stock-count');
    if (lowStockItems > 0) {
        lowStockSpan.className = 'text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg';
    } else {
        lowStockSpan.className = 'text-xs font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg';
        lowStockSpan.textContent = 'Healthy';
    }
}

function switchSection(sectionId) {
    document.querySelectorAll('#content-area > section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
    
    // Update Header Title
    const titles = {
        'overview': 'Dashboard Overview',
        'products': 'Product Management',
        'offers': 'Offers & Discounts',
        'analytics': 'Sales Analytics'
    };
    document.getElementById('page-title').innerText = titles[sectionId];
}

function renderProducts(search = '', category = 'all') {
    const tbody = document.getElementById('product-table-body');
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'all' || p.category.toLowerCase() === category.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    tbody.innerHTML = filtered.map(p => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <img src="${p.image}" class="w-10 h-10 rounded-lg object-cover" alt="">
                    <span class="font-medium dark:text-white">${p.name}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-slate-500 dark:text-slate-400 capitalize">${p.category}</td>
            <td class="px-6 py-4">
                <div class="flex flex-col">
                    <span class="font-bold dark:text-white">$${p.price}</span>
                    ${p.discountPrice ? `<span class="text-xs text-green-500">$${p.discountPrice}</span>` : ''}
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="font-semibold ${p.stock <= 10 ? 'text-red-500' : 'dark:text-slate-300'}">${p.stock} units</span>
            </td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}">
                    ${p.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="flex gap-2">
                    <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-primary"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                    <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-red-500" onclick="deleteProduct(${p.id})"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    lucide.createIcons();
}

function renderLowStock() {
    const container = document.getElementById('low-stock-list');
    const lowStock = products.filter(p => p.stock <= 10).slice(0, 4);

    container.innerHTML = lowStock.map(p => `
        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
                <img src="${p.image}" class="w-8 h-8 rounded-lg object-cover" alt="">
                <div>
                    <p class="text-xs font-bold dark:text-white">${p.name}</p>
                    <p class="text-[10px] text-slate-500">${p.stock} units left</p>
                </div>
            </div>
            <button class="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-all">Restock</button>
        </div>
    `).join('');
}

function renderOffers() {
    const container = document.getElementById('offers-list');
    container.innerHTML = offers.map(o => `
        <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div class="flex items-center gap-4">
                <div class="p-3 bg-primary/10 text-primary rounded-xl">
                    <i data-lucide="gift" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="font-bold dark:text-white">${o.name}</h4>
                    <p class="text-sm text-slate-500">Code: <span class="font-mono text-primary font-semibold">${o.code}</span> • Ends ${o.ends}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-lg font-bold text-emerald-500">${o.discount} OFF</span>
                <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><i data-lucide="more-vertical" class="w-5 h-5 text-slate-400"></i></button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// Helper Functions
function initCharts() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 45000],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#6366f1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: isDark ? '#334155' : '#f1f5f9' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function generateCoupon() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for(let i=0; i<8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('coupon-code').value = code;
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium animate-fade-in shadow-xl';
    toast.innerHTML = `
        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-500"></i>
        <span class="dark:text-white">${message}</span>
    `;
    container.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function deleteProduct(id) {
    if(confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        syncToStorage();
        renderProducts();
        renderLowStock();
        updateStats();
        showToast('Product deleted');
    }
}
