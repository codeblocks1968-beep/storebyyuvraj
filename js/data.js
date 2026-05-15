const categories = [
    { id: 1, title: 'Gaming PCs', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 2, title: 'Graphics Cards', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 3, title: 'Processors', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 4, title: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 5, title: 'Accessories', image: 'https://images.unsplash.com/photo-1615663245857-ac1eeb5304ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 6, title: 'Custom Cooling', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 7, title: 'Laptops', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 8, title: 'Keyboards', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 9, title: 'Mice', image: 'https://images.unsplash.com/photo-1527814050087-379381547969?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 10, title: 'Consoles', image: 'https://images.unsplash.com/photo-1605898835373-023bbba1d242?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 11, title: 'VR Headsets', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
    { id: 12, title: 'Printers', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
];

const products = [
    {
        id: 101,
        name: 'Titan RTX 4090 Supreme',
        category: 'Graphics Card',
        price: 1899.99,
        rating: 4.9,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 102,
        name: 'Intel Core i9-14900K',
        category: 'Processor',
        price: 589.99,
        rating: 4.8,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 103,
        name: 'Predator X34 Curved OLED',
        category: 'Monitor',
        price: 999.99,
        rating: 4.7,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 104,
        name: 'TitanCraft Pro Build (AMD)',
        category: 'Gaming PC',
        price: 2499.99,
        rating: 5.0,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 105,
        name: 'Nebula X Extreme (Intel)',
        category: 'Gaming PC',
        price: 3299.99,
        rating: 4.9,
        reviews: 84,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 106,
        name: 'Stealth Mini ITX',
        category: 'Gaming PC',
        price: 1599.99,
        rating: 4.7,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 107,
        name: 'Quantum Creator Workstation',
        category: 'Gaming PC',
        price: 4999.99,
        rating: 5.0,
        reviews: 12,
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 108,
        name: 'Razer Huntsman V2',
        category: 'Keyboard',
        price: 199.99,
        rating: 4.8,
        reviews: 312,
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 109,
        name: 'Logitech G Pro X Superlight',
        category: 'Mouse',
        price: 149.99,
        rating: 4.9,
        reviews: 450,
        image: 'https://images.unsplash.com/photo-1527814050087-379381547969?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 110,
        name: 'Alienware m18 R2',
        category: 'Laptop',
        price: 2799.99,
        rating: 4.6,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 111,
        name: 'Corsair Virtuoso RGB',
        category: 'Accessory',
        price: 209.99,
        rating: 4.5,
        reviews: 189,
        image: 'https://images.unsplash.com/photo-1615663245857-ac1eeb5304ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 112,
        name: 'NZXT Kraken Elite 360',
        category: 'Cooling',
        price: 279.99,
        rating: 4.8,
        reviews: 134,
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 113,
        name: 'AMD Radeon RX 7900 XTX',
        category: 'Graphics Card',
        price: 999.99,
        rating: 4.8,
        reviews: 215,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 114,
        name: 'AMD Ryzen 9 7950X3D',
        category: 'Processor',
        price: 699.99,
        rating: 4.9,
        reviews: 142,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 115,
        name: 'ASUS ROG Swift OLED 27"',
        category: 'Monitor',
        price: 899.99,
        rating: 4.7,
        reviews: 95,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 116,
        name: 'Omen 45L Desktop',
        category: 'Gaming PC',
        price: 2199.99,
        rating: 4.6,
        reviews: 180,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 117,
        name: 'SteelSeries Apex Pro TKL',
        category: 'Keyboard',
        price: 189.99,
        rating: 4.8,
        reviews: 420,
        image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 118,
        name: 'Razer DeathAdder V3 Pro',
        category: 'Mouse',
        price: 139.99,
        rating: 4.7,
        reviews: 310,
        image: 'https://images.unsplash.com/photo-1527814050087-379381547969?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 119,
        name: 'ASUS ROG Zephyrus G14',
        category: 'Laptop',
        price: 1599.99,
        rating: 4.9,
        reviews: 250,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 120,
        name: 'Elgato Stream Deck MK.2',
        category: 'Accessory',
        price: 149.99,
        rating: 4.9,
        reviews: 630,
        image: 'https://images.unsplash.com/photo-1615663245857-ac1eeb5304ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 121,
        name: 'Corsair iCUE H150i Elite',
        category: 'Cooling',
        price: 199.99,
        rating: 4.8,
        reviews: 175,
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 122,
        name: 'Sony PlayStation 5',
        category: 'Console',
        price: 499.99,
        rating: 4.9,
        reviews: 2450,
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 123,
        name: 'Microsoft Xbox Series X',
        category: 'Console',
        price: 499.99,
        rating: 4.8,
        reviews: 1850,
        image: 'https://images.unsplash.com/photo-1605898835373-023bbba1d242?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 124,
        name: 'Meta Quest 3 (Metashot)',
        category: 'VR Headset',
        price: 499.99,
        rating: 4.7,
        reviews: 890,
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 125,
        name: 'HP Color LaserJet Pro',
        category: 'Printer',
        price: 349.99,
        rating: 4.5,
        reviews: 420,
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 126,
        name: 'Epson EcoTank ET-2800',
        category: 'Printer',
        price: 229.99,
        rating: 4.6,
        reviews: 310,
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
];

const pcComponents = {
    cpu: [
        { id: 'c1', name: 'Intel Core i9-14900K', price: 589.99, socket: 'LGA1700', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '24 Cores / 32 Threads, 6.0 GHz' },
        { id: 'c2', name: 'AMD Ryzen 9 7950X3D', price: 699.99, socket: 'AM5', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '16 Cores / 32 Threads, 5.7 GHz' },
        { id: 'c3', name: 'Intel Core i5-13600K', price: 299.99, socket: 'LGA1700', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '14 Cores / 20 Threads, 5.1 GHz' }
    ],
    motherboard: [
        { id: 'm1', name: 'ASUS ROG Maximus Z790 Hero', price: 629.99, socket: 'LGA1700', type: 'DDR5', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'Z790, DDR5, PCIe 5.0' },
        { id: 'm2', name: 'MSI MPG X670E Carbon WiFi', price: 479.99, socket: 'AM5', type: 'DDR5', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'X670E, DDR5, PCIe 5.0' }
    ],
    gpu: [
        { id: 'g1', name: 'NVIDIA GeForce RTX 4090', price: 1599.99, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '24GB GDDR6X, DLSS 3' },
        { id: 'g2', name: 'AMD Radeon RX 7900 XTX', price: 999.99, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '24GB GDDR6, FSR 3' },
        { id: 'g3', name: 'NVIDIA GeForce RTX 4070 Ti', price: 799.99, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '12GB GDDR6X, DLSS 3' }
    ],
    ram: [
        { id: 'r1', name: 'G.Skill Trident Z5 RGB 32GB (2x16)', price: 149.99, type: 'DDR5', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'DDR5-6400 CL32' },
        { id: 'r2', name: 'Corsair Dominator Titanium 64GB', price: 299.99, type: 'DDR5', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'DDR5-6000 CL30' }
    ],
    storage: [
        { id: 's1', name: 'Samsung 990 PRO 2TB', price: 169.99, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'NVMe M.2 PCIe 4.0, 7450 MB/s' },
        { id: 's2', name: 'WD Black SN850X 4TB', price: 299.99, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'NVMe M.2 PCIe 4.0, 7300 MB/s' }
    ],
    power: [
        { id: 'p1', name: 'Corsair RM1000x', price: 189.99, image: 'https://images.unsplash.com/photo-1587202372775-b22f236c9689?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '1000W 80+ Gold Fully Modular' },
        { id: 'p2', name: 'Seasonic Vertex GX-1200', price: 249.99, image: 'https://images.unsplash.com/photo-1587202372775-b22f236c9689?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: '1200W 80+ Gold ATX 3.0' }
    ],
    case: [
        { id: 'cs1', name: 'Lian Li O11 Dynamic EVO', price: 159.99, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'Mid Tower, Tempered Glass' },
        { id: 'cs2', name: 'Corsair 4000D Airflow', price: 104.99, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', specs: 'Mid Tower, High Airflow' }
    ]
};
