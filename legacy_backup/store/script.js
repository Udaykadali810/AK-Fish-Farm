/* ============================================================
   AK FishFarms  Shared JS Engine  |  script.js
   Pages: index.html  cart.html  checkout.html  admin.html
   Backend: 100% LocalStorage (FREE)
   ============================================================ */

'use strict';

/* 
   CONSTANTS
    */
const WA_NUMBER = '919492045766';
const ADMIN_PASS = 'AKFish2026';
const LS_CART = 'akf_cart';
const LS_ADMIN_AUTH = 'akf_admin_auth';
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';

// Firebase Database Imports (These will be populated dynamically)
let db, collection, onSnapshot, query, orderBy, addDoc, serverTimestamp;
let globalProducts = [];


/* 
   DEFAULT PRODUCT CATALOGUE  (used on first load)
    */
const DEFAULT_PRODUCTS = [
    /*  AK Special Collection  */
    { id: 1, name: 'Flowerhorn (S)', category: 'special', price: 500, description: 'Baby Flowerhorn  premium hump.', img: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Flowerhorn (B)', category: 'special', price: 1500, description: 'Adult Flowerhorn  vibrant colours.', img: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Arowana (S)', category: 'special', price: 2000, description: 'Silver Arowana  planted tank gem.', img: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Arowana (B)', category: 'special', price: 6000, description: 'Silver Arowana  black background beauty.', img: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Oscar Fish', category: 'special', price: 300, description: 'Tiger Oscar  energetic & bold.', img: 'https://images.unsplash.com/photo-1592419186946-e81df7d4dd5a?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Parrot Fish', category: 'special', price: 250, description: 'Blood Parrot  peaceful cichlid.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
    { id: 7, name: 'Betta Fish', category: 'special', price: 200, description: 'Halfmoon Betta  stunning fins.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 8, name: 'Goldfish', category: 'special', price: 150, description: 'Fancy Goldfish  classic beauty.', img: 'https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?auto=format&fit=crop&w=400&q=80' },
    { id: 9, name: 'Koi', category: 'special', price: 800, description: 'Japanese Koi  pond royalty.', img: 'https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?auto=format&fit=crop&w=400&q=80' },
    /*  AK Premium Collection  */
    { id: 10, name: 'Discus Blue', category: 'premium', price: 1200, description: 'Royal Blue Discus  the King of Aquarium.', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80' },
    { id: 11, name: 'Discus Red', category: 'premium', price: 1400, description: 'Red Discus  fiery & majestic.', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80' },
    { id: 12, name: 'Altum Angelfish', category: 'premium', price: 900, description: 'Altum Angelfish  rare & elegant.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
    { id: 13, name: 'German Ram', category: 'premium', price: 350, description: 'German Blue Ram  jewel of the tank.', img: 'https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?auto=format&fit=crop&w=400&q=80' },
    { id: 14, name: 'Peacock Cichlid', category: 'premium', price: 450, description: 'Aulonocara  African beauty.', img: 'https://images.unsplash.com/photo-1592419186946-e81df7d4dd5a?auto=format&fit=crop&w=400&q=80' },
    { id: 15, name: 'Frontosa Cichlid', category: 'premium', price: 600, description: 'Giant Frontosa  majestic slow swimmer.', img: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=400&q=80' },
    { id: 16, name: 'L-Number Pleco', category: 'premium', price: 750, description: 'Rare L-series Plecostomus.', img: 'https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?auto=format&fit=crop&w=400&q=80' },
    { id: 17, name: 'Electric Blue Acara', category: 'premium', price: 550, description: 'Vibrant blue  beginner friendly.', img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80' },
    { id: 18, name: 'Geophagus', category: 'premium', price: 500, description: 'Earth-eater cichlid  fascinating behaviour.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80' },
    /*  AK Guppy Collection  */
    { id: 19, name: 'Moscow Blue Guppy', category: 'guppy', price: 120, description: 'Stunning Moscow Blue show guppy.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 20, name: 'Flamingo Guppy', category: 'guppy', price: 130, description: 'Pink Flamingo delta-tail guppy.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 21, name: 'Full Red Guppy', category: 'guppy', price: 140, description: 'Albino full-red guppy  show quality.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 22, name: 'Half Black Guppy', category: 'guppy', price: 110, description: 'Classic half-black body guppy.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 23, name: 'Yellow Cobra Guppy', category: 'guppy', price: 125, description: 'Yellow Cobra snake-skin pattern.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 24, name: 'Neon Blue Guppy', category: 'guppy', price: 115, description: 'Striking neon blue delta guppy.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 25, name: 'Platinum White Guppy', category: 'guppy', price: 135, description: 'Metallic platinum white guppy.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 26, name: 'Green Lace Guppy', category: 'guppy', price: 120, description: 'Lace-patterned green delta guppy.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 27, name: 'Endler Guppy', category: 'guppy', price: 90, description: 'Tiny, vivid Endler\'s livebearers.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
    { id: 28, name: 'Tuxedo Guppy', category: 'guppy', price: 100, description: 'Classic tuxedo split-colour guppy.', img: 'https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?auto=format&fit=crop&w=400&q=80' },
];

const CATEGORY_LABELS = {
    all: 'All Collections',
    special: 'AK Special Collection',
    premium: 'AK Premium Collection',
    guppy: 'AK Guppy Collection',
};

/**
 * INITIALIZE FIREBASE & REAL-TIME LISTENERS
 */
async function initFirebase() {
    // Import from our local firebase module
    const fb = await import('./firebase.js');
    db = fb.db;
    collection = fb.collection;
    onSnapshot = fb.onSnapshot;
    query = fb.query;
    orderBy = fb.orderBy;
    addDoc = fb.addDoc;
    serverTimestamp = fb.serverTimestamp;

    // Start listening to products collection
    const qProducts = query(collection(db, "products"), orderBy("updatedAt", "desc"));
    onSnapshot(qProducts, (snapshot) => {
        globalProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // If we are on the shop page, re-render
        const grid = document.getElementById('product-grid');
        if (grid) {
            const activeTab = document.querySelector('.tab.active')?.dataset.cat || 'all';
            window.renderProducts?.(activeTab);
        }
    });
}


/* 
   PRODUCT STORAGE
    */
function getProducts() {
    return globalProducts.length > 0 ? globalProducts : DEFAULT_PRODUCTS;
}

function initProducts() {
    /* Auto-clean existing products in storage from symbols */
    let products = getProducts();
    let changed = false;
    products = products.map(p => {
        const cleanName = p.name.replace(/[^\x00-\x7F]/g, '').trim();
        const cleanDesc = (p.description || '').replace(/[^\x00-\x7F]/g, '').trim();
        if (cleanName !== p.name || cleanDesc !== p.description) {
            p.name = cleanName;
            p.description = cleanDesc;
            changed = true;
        }
        return p;
    });
    if (changed) saveProducts(products);
    if (!localStorage.getItem(LS_PRODUCTS)) saveProducts(DEFAULT_PRODUCTS);
}

/* 
   CART STORAGE
    */
function getCart() {
    try { return JSON.parse(localStorage.getItem(LS_CART)) || []; }
    catch { return []; }
}
function saveCart(cart) {
    localStorage.setItem(LS_CART, JSON.stringify(cart));
}
function getCartCount() {
    return getCart().reduce((s, i) => s + i.qty, 0);
}
function getCartTotal() {
    return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}
function addToCart(productId, qty) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === productId);
    if (idx >= 0) {
        cart[idx].qty += qty;
        cart[idx].name = product.name;
        cart[idx].price = product.price;
        cart[idx].img = product.img;
    } else {
        cart.push({ id: productId, qty, name: product.name, price: product.price, img: product.img });
    }
    saveCart(cart);
    updateCartBadge();
}
function removeFromCart(productId) {
    saveCart(getCart().filter(i => i.id !== productId));
    updateCartBadge();
}
function changeQty(productId, delta) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === productId);
    if (idx < 0) return;
    const newQty = cart[idx].qty + delta;
    if (newQty <= 0) {
        /* Auto-remove when qty reaches 0 */
        cart.splice(idx, 1);
        saveCart(cart);
        updateCartBadge();
    } else {
        cart[idx].qty = newQty;
        saveCart(cart);
    }
}
function clearCart() {
    localStorage.removeItem(LS_CART);
    updateCartBadge();
}
function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.classList.toggle('show', count > 0);
    });
}

/* 
   ORDERS STORAGE
    */
function getOrders() {
    try { return JSON.parse(localStorage.getItem(LS_ORDERS)) || []; }
    catch { return []; }
}
function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
}

/* 
   WHATSAPP  (used by checkout.html)
    */
function buildWhatsAppURL(custName = '', custPhone = '', custCity = '') {
    const cart = getCart();
    const lines = cart.map((item, i) =>
        `${i + 1}. ${item.name} - Qty: ${item.qty} - ₹${item.price}`
    ).join('\n');

    const subtotal = getCartTotal();
    const coupon = getAppliedCoupon();
    let total = subtotal;
    if (coupon) {
        if (coupon.type === 'percent') total -= (subtotal * coupon.val / 100);
        else total -= coupon.val;
    }

    const customerInfo = custName ? `\n\nCustomer Details:\nName: ${custName}\nPhone: ${custPhone}\nCity: ${custCity}` : '';

    const msg =
        `New Order - AK Fish Farms\n\n` +
        `Items:\n\n${lines}\n\n` +
        `Total Amount: ₹${Math.max(0, total)}` +
        customerInfo +
        `\n\nCustomer Order from Website`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* 
   TOAST NOTIFICATIONS
    */
function showToast(msg, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const icons = { success: '', error: '', info: '' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
    root.appendChild(t);
    const remove = () => { t.classList.add('leaving'); setTimeout(() => t.remove(), 320); };
    t.addEventListener('click', remove);
    setTimeout(remove, 3500);
}

/* 
   MODAL UTILITIES
    */
function showModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
}
function hideModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
}

/* 
   NAVBAR  shared init
    */
function initNavbar() {
    updateCartBadge();
    /* Scroll effect */
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
    }
    /* Hamburger */
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobile-menu');
    if (ham && mob) {
        ham.addEventListener('click', () => {
            ham.classList.toggle('open');
            mob.classList.toggle('open');
        });
    }
    /* Check for return thanks */
    if (sessionStorage.getItem('akf_return_thanks')) {
        sessionStorage.removeItem('akf_return_thanks');
        setTimeout(() => {
            showToast('Thank you for shopping with AK Fish Farms ', 'success');
        }, 800);
    }
}

/**
 * Dynamically load hero banner from LocalStorage if user uploaded one
 */
function initHeroBanner() {
    const bannerImg = document.querySelector('.hero-banner-img');
    if (!bannerImg) return;

    const custom = localStorage.getItem('akf_custom_banner');
    if (custom) {
        bannerImg.src = custom;
    }
}

/* 
   SCROLL REVEAL
    */
function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.fiu').forEach(el => el.classList.add('vis'));
        return;
    }
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.07 });
    document.querySelectorAll('.fiu').forEach(el => obs.observe(el));
}

/* 
     INDEX.HTML  Shop Page
    */
async function initShopPage() {
    initNavbar();
    await initFirebase();
    // initProducts(); // No longer needed as we use Firestore
    initHeroBanner();


    const grid = document.getElementById('product-grid');
    const tabRow = document.getElementById('tab-row');
    const countLabel = document.getElementById('product-count');
    let activeTab = 'all';
    let cardQtyMap = {};

    function renderProducts(filter) {
        const products = getProducts();
        window.renderProducts = renderProducts; // Expose for onSnapshot

        const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
        if (countLabel) countLabel.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

        if (!filtered.length) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span class="es-icon"></span><p>No products in this category yet.</p></div>`;
            return;
        }

        grid.innerHTML = filtered.map(p => {
            const qty = cardQtyMap[p.id] || 1;
            return `
        <div class="product-card fiu" data-id="${p.id}">
          <div class="pc-img-wrap">
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80'">
            <span class="pc-cat-badge">${CATEGORY_LABELS[p.category] || p.category}</span>
          </div>
          <div class="pc-body">
            <div class="pc-name">${p.name}</div>
            <div class="pc-desc">${p.description || ''}</div>
            <div class="pc-stars"></div>
            <div class="pc-bottom">
              <div class="pc-price">${p.price.toLocaleString('en-IN')} <small>/ pair</small></div>
            </div>
            <div class="qty-sel" style="margin:8px 0;">
              <button class="qty-btn card-minus" data-id="${p.id}"></button>
              <span class="qty-val" id="cqty-${p.id}">${qty}</span>
              <button class="qty-btn card-plus" data-id="${p.id}">+</button>
            </div>
            <button class="atc-btn" data-id="${p.id}" id="atc-${p.id}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>
          </div>
        </div>`;
        }).join('');

        initScrollReveal();
        attachCardEvents();
    }

    function attachCardEvents() {
        document.querySelectorAll('.card-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = +btn.dataset.id;
                if ((cardQtyMap[id] || 1) > 1) {
                    cardQtyMap[id] = (cardQtyMap[id] || 1) - 1;
                    const el = document.getElementById(`cqty-${id}`);
                    if (el) el.textContent = cardQtyMap[id];
                }
            });
        });
        document.querySelectorAll('.card-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = +btn.dataset.id;
                cardQtyMap[id] = (cardQtyMap[id] || 1) + 1;
                const el = document.getElementById(`cqty-${id}`);
                if (el) el.textContent = cardQtyMap[id];
            });
        });
        document.querySelectorAll('.atc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = +btn.dataset.id;
                const qty = cardQtyMap[id] || 1;
                addToCart(id, qty);
                showToast(' Added to cart!', 'success');
                /* Flash button */
                btn.classList.add('added');
                btn.innerHTML = ' Added!';
                setTimeout(() => {
                    btn.classList.remove('added');
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Add to Cart`;
                }, 1600);
                cardQtyMap[id] = 1;
                const el = document.getElementById(`cqty-${id}`);
                if (el) el.textContent = 1;
            });
        });
    }

    /* Tab switching */
    if (tabRow) {
        tabRow.addEventListener('click', e => {
            const tab = e.target.closest('.tab');
            if (!tab) return;
            activeTab = tab.dataset.cat;
            tabRow.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
            renderProducts(activeTab);
        });
    }

    renderProducts('all');
    initScrollReveal();
}

/* 
     CART.HTML  Cart Page
    */
function initCartPage() {
    initNavbar();
    renderCartPage();
}

function renderCartPage() {
    const root = document.getElementById('cart-root');
    const emptyEl = document.getElementById('cart-empty');
    const mainEl = document.getElementById('cart-main');
    if (!root) return;

    const cart = getCart();

    if (cart.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (mainEl) mainEl.style.display = 'none';
        return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    if (mainEl) mainEl.style.display = 'grid';

    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('item-count');

    if (countEl) countEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
    if (totalEl) totalEl.textContent = `${getCartTotal().toLocaleString('en-IN')}`;

    if (itemsEl) {
        itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item" id="ci-${item.id}">
        <img class="ci-img" src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80'">
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">&#x20B9;${item.price.toLocaleString('en-IN')} / pair</div>
          <div class="ci-controls">
            <div class="qty-sel">
              <button class="qty-btn ci-minus" data-id="${item.id}" aria-label="Decrease quantity">&#x2212;</button>
              <span class="qty-val" id="iqty-${item.id}">${item.qty}</span>
              <button class="qty-btn ci-plus"  data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <span class="ci-subtotal">&#x20B9;${(item.price * item.qty).toLocaleString('en-IN')}</span>
            <button class="ci-remove" data-id="${item.id}" title="Remove">&#x1F5D1;</button>
          </div>
        </div>
      </div>`).join('');

        /*  Single delegated handler  works reliably on mobile  */
        itemsEl.addEventListener('click', function handleCartClick(e) {
            const minusBtn = e.target.closest('.ci-minus');
            const plusBtn = e.target.closest('.ci-plus');
            const removeBtn = e.target.closest('.ci-remove');

            if (minusBtn) {
                const id = +minusBtn.dataset.id;
                changeQty(id, -1);
                renderCartPage();
                return;
            }
            if (plusBtn) {
                const id = +plusBtn.dataset.id;
                changeQty(id, +1);
                renderCartPage();
                return;
            }
            if (removeBtn) {
                removeFromCart(+removeBtn.dataset.id);
                showToast('Item removed from cart', 'error');
                renderCartPage();
            }
        }, { once: true }); /* once:true  re-added after each renderCartPage call */
    }

    /* Clear cart */
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Remove all items from cart?')) {
                clearCart();
                clearCoupon();
                renderCartPage();
                showToast('Cart cleared', 'info');
            }
        });
    }

    initCouponFeature();

    /* Direct WhatsApp Flow */
    const deliveryBtn = document.getElementById('initiate-delivery-btn');
    if (deliveryBtn) {
        deliveryBtn.onclick = () => {
            showModal('delivery-modal');
        };
    }

    const confirmBtn = document.getElementById('confirm-delivery-btn');
    if (confirmBtn) {
        confirmBtn.onclick = async () => {
            const name = document.getElementById('cust-name').value.trim();
            const phone = document.getElementById('cust-phone').value.trim();
            const city = document.getElementById('cust-city').value.trim();

            if (!name || !phone || !city) {
                showToast('Please fill all details', 'error');
                return;
            }
            if (!/^\d{10}$/.test(phone)) {
                showToast('Please enter a valid 10-digit phone number', 'error');
                return;
            }

            const url = buildWhatsAppURL(name, phone, city);

            // Save order to Firebase Cloud
            try {
                const orderData = {
                    customerName: name,
                    phone: phone,
                    city: city,
                    items: getCart(),
                    total: getCartTotal(),
                    status: 'Pending',
                    date: new Date().toISOString(),
                    timestamp: serverTimestamp()
                };
                const docRef = await addDoc(collection(db, "orders"), orderData);

                // Save to local history for "My Orders" page
                const localOrders = JSON.parse(localStorage.getItem('akf_orders') || '[]');
                localOrders.push({ ...orderData, id: docRef.id });
                localStorage.setItem('akf_orders', JSON.stringify(localOrders));

                showToast('Order placed successfully!', 'success');
            } catch (err) {
                console.error("Firebase Order Error:", err);
                showToast('Cloud sync failed, but order sent via WhatsApp', 'warning');
            }

            sessionStorage.setItem('akf_return_thanks', '1');
            window.open(url, '_blank');


            hideModal('delivery-modal');
            clearCart();
            clearCoupon();
            renderCartPage();
        };
    }
}

/* 
   COUPON SYSTEM
    */
const COUPONS = {
    'AK10': { type: 'percent', val: 10 },
    'FISH50': { type: 'flat', val: 50 }
};

function getAppliedCoupon() {
    try { return JSON.parse(localStorage.getItem('akf_coupon')) || null; }
    catch { return null; }
}
function saveCoupon(c) { localStorage.setItem('akf_coupon', JSON.stringify(c)); }
function clearCoupon() { localStorage.removeItem('akf_coupon'); }

function initCouponFeature() {
    const btn = document.getElementById('apply-coupon-btn');
    const input = document.getElementById('coupon-input');
    const msg = document.getElementById('coupon-msg');

    if (!btn || !input) return;

    btn.addEventListener('click', () => {
        const code = input.value.trim().toUpperCase();
        if (!code) return;

        if (COUPONS[code]) {
            saveCoupon(COUPONS[code]);
            input.value = '';
            msg.textContent = `Coupon "${code}" applied successfully!`;
            msg.style.color = '#25D366';
            renderCartPage();
            showToast('Discount applied!', 'success');
        } else {
            msg.textContent = 'Invalid coupon code';
            msg.style.color = '#ff4444';
        }
    });

    /* Refresh UI if coupon exists */
    const applied = getAppliedCoupon();
    if (applied) {
        const row = document.getElementById('discount-row');
        const valEl = document.getElementById('discount-amount');
        const subtotal = getCartTotal();
        let disc = 0;
        if (applied.type === 'percent') disc = (subtotal * applied.val / 100);
        else disc = applied.val;

        if (row && valEl) {
            row.style.display = 'flex';
            valEl.textContent = `-${Math.round(disc).toLocaleString('en-IN')}`;
            const totalEl = document.getElementById('cart-total');
            if (totalEl) totalEl.textContent = `${Math.max(0, subtotal - disc).toLocaleString('en-IN')}`;
        }
    }
}

/* 
     CHECKOUT.HTML  Checkout Page
    */
function initCheckoutPage() {
    initNavbar();

    const cart = getCart();

    /* Redirect if cart empty */
    if (cart.length === 0) {
        window.location.href = '/';
        return;
    }

    /* Render order summary */
    renderOrderSummary(cart);

    /* Form submit */
    const form = document.getElementById('checkout-form');
    if (!form) return;
    form.addEventListener('submit', handlePlaceOrder);
}

function renderOrderSummary(cart) {
    const listEl = document.getElementById('osi-list');
    const totalEl = document.getElementById('os-total-val');
    const countEl = document.getElementById('os-count');
    if (!listEl) return;

    listEl.innerHTML = cart.map(item => `
    <div class="osi">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80'">
      <div class="osi-info">
        <div class="osi-name">${item.name}</div>
        <div class="osi-qty">Qty: ${item.qty}</div>
      </div>
      <div class="osi-price">${(item.price * item.qty).toLocaleString('en-IN')}</div>
    </div>`).join('');

    if (totalEl) totalEl.textContent = `${getCartTotal().toLocaleString('en-IN')}`;
    if (countEl) countEl.textContent = `${cart.reduce((s, i) => s + i.qty, 0)} item(s)`;
}

function handlePlaceOrder(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name');
    const phone = document.getElementById('cust-phone');
    const address = document.getElementById('cust-address');

    /* Validate */
    let ok = true;
    function setErr(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; if (msg) ok = false; }
    function clearErr(id) { setErr(id, ''); }

    clearErr('err-name'); clearErr('err-phone'); clearErr('err-address');

    if (!name.value.trim() || name.value.trim().length < 2) {
        setErr('err-name', 'Please enter your full name (min 2 chars).');
        name.classList.add('error');
    } else { name.classList.remove('error'); }

    if (!/^[6-9]\d{9}$/.test(phone.value.trim())) {
        setErr('err-phone', 'Enter a valid 10-digit Indian mobile number.');
        phone.classList.add('error');
    } else { phone.classList.remove('error'); }

    if (!address.value.trim() || address.value.trim().length < 10) {
        setErr('err-address', 'Enter a complete address (min 10 characters).');
        address.classList.add('error');
    } else { address.classList.remove('error'); }

    if (!ok) return;

    /* Loading state */
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Processing`;

    setTimeout(() => {
        /* Save order */
        const orderId = `AKF-${Date.now().toString(36).toUpperCase()}`;
        const order = {
            id: orderId,
            name: name.value.trim(),
            phone: phone.value.trim(),
            address: address.value.trim(),
            items: getCart(),
            total: getCartTotal(),
            date: new Date().toISOString(),
            status: 'Processing',
        };
        saveOrder(order);

        /* Open WhatsApp */
        const url = buildWhatsAppURL(order.name, order.phone, order.address);
        window.open(url, '_blank');

        /* Clear cart */
        clearCart();

        /* Show success modal */
        const orderIdEl = document.getElementById('success-order-id');
        if (orderIdEl) orderIdEl.textContent = orderId;
        showModal('success-modal');

        /* Reset button */
        btn.disabled = false;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> Place Order via WhatsApp`;
    }, 1600);
}

/* Real-time validation */
function initCheckoutValidation() {
    const fields = [
        { id: 'cust-name', err: 'err-name', fn: v => v.trim().length >= 2 },
        { id: 'cust-phone', err: 'err-phone', fn: v => /^[6-9]\d{9}$/.test(v.trim()) },
        { id: 'cust-address', err: 'err-address', fn: v => v.trim().length >= 10 },
    ];
    fields.forEach(({ id, err, fn }) => {
        const el = document.getElementById(id);
        const eEl = document.getElementById(err);
        if (!el || !eEl) return;
        el.addEventListener('input', () => {
            const valid = fn(el.value);
            el.classList.toggle('error', !valid && el.value.length > 0);
        });
    });
}

/* 
     ADMIN.HTML  Admin Panel
    */

/*  Admin Auth  */
function adminIsLoggedIn() {
    return sessionStorage.getItem(LS_ADMIN_AUTH) === '1';
}
function adminLogin(pwd) {
    if (pwd === ADMIN_PASS) { sessionStorage.setItem(LS_ADMIN_AUTH, '1'); return true; }
    return false;
}
function adminLogout() {
    sessionStorage.removeItem(LS_ADMIN_AUTH);
    showAdminLoginView();
}

function showAdminLoginView() {
    const lv = document.getElementById('admin-login-view');
    const dv = document.getElementById('admin-dashboard-view');
    if (lv) lv.style.display = 'flex';
    if (dv) dv.style.display = 'none';
}
function showAdminDashboardView() {
    const lv = document.getElementById('admin-login-view');
    const dv = document.getElementById('admin-dashboard-view');
    if (lv) lv.style.display = 'none';
    if (dv) dv.style.display = 'flex';
}

function initAdminPage() {
    if (adminIsLoggedIn()) {
        showAdminDashboardView();
        initAdminDashboard();
    } else {
        showAdminLoginView();
    }

    /* Login form */
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const pwd = document.getElementById('admin-pwd').value;
            if (adminLogin(pwd)) {
                showAdminDashboardView();
                initAdminDashboard();
            } else {
                const errEl = document.getElementById('login-err');
                if (errEl) {
                    errEl.textContent = ' Wrong password. Hint: AKFish2026';
                    errEl.classList.add('show');
                    setTimeout(() => errEl.classList.remove('show'), 3500);
                }
                document.getElementById('admin-pwd').value = '';
            }
        });
    }

    /* Logout */
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', adminLogout);
}

/* 
   ADMIN  PRODUCTS MANAGEMENT  (Full rebuild  Modern UI)
    */
let editingId = null;   // null = add mode; number = edit mode
let searchQuery = '';
let currentImgData = '';   // Base64 or URL for the Add/Edit form

/*  CATEGORY LABELS already defined above, but safe alias  */
const CAT_LABEL = k => CATEGORY_LABELS[k] || k;

/*  STOCK STATUS labels  */
const STOCK_LABEL = s => s === 'out_stock' ? '<span class="stock-badge out">Out of Stock</span>'
    : '<span class="stock-badge in">In Stock</span>';

/* 
   INIT
 */
function initAdminDashboard() {
    updateAdminStats();
    renderProductList();
    initAdminPanelForm();
    initAdminSearch();
    initImageUpload();
}

function updateAdminStats() {
    const products = getProducts();
    const orders = getOrders();
    const el = id => document.getElementById(id);
    if (el('stat-products')) el('stat-products').textContent = products.length;
    if (el('stat-orders')) el('stat-orders').textContent = orders.length;
    if (el('stat-special')) el('stat-special').textContent = products.filter(p => p.category === 'special').length;
    if (el('stat-guppy')) el('stat-guppy').textContent = products.filter(p => p.category === 'guppy').length;
}

/* 
   PRODUCT LIST CARDS  ("Current Inventory")
 */
function renderProductList(query) {
    const products = getProducts();
    const q = (query || searchQuery || '').toLowerCase();
    const filtered = q ? products.filter(p =>
        p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)
    ) : products;

    const tbody = document.getElementById('pm-product-list');
    if (!tbody) return;

    /* Update count badge */
    const badge = document.getElementById('pm-count-badge');
    if (badge) badge.textContent = filtered.length;

    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="adm-tbl-empty">No products found. Add one above!</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(p => {
        const imgSrc = p.img || PLACEHOLDER_IMG;
        const stockVal = p.status || 'in_stock';
        const inStock = stockVal === 'in_stock';
        const catLabel = { special: ' Special', premium: ' Premium', guppy: ' Guppy' }[p.category] || p.category;
        return `
        <tr id="pm-row-${p.id}" class="adm-prod-row">
            <!-- Image -->
            <td class="col-img">
                <img class="adm-prod-thumb" id="pm-thumb-${p.id}"
                     src="${imgSrc}" alt="${p.name}"
                     onerror="this.src='${PLACEHOLDER_IMG}'">
            </td>

            <!-- Name -->
            <td class="col-name">
                <input class="adm-tbl-input" type="text"
                       data-field="name" data-id="${p.id}"
                       value="${p.name}" placeholder="Fish name" maxlength="80" />
            </td>

            <!-- Price -->
            <td class="col-price">
                <div class="adm-price-wrap">
                    <span class="adm-rupee"></span>
                    <input class="adm-tbl-input adm-price-input" type="number"
                           data-field="price" data-id="${p.id}"
                           value="${p.price}" placeholder="0" min="1" />
                </div>
            </td>

            <!-- Category -->
            <td class="col-cat">
                <select class="adm-tbl-select" data-field="category" data-id="${p.id}">
                    <option value="special" ${p.category === 'special' ? 'selected' : ''}> Special</option>
                    <option value="premium" ${p.category === 'premium' ? 'selected' : ''}> Premium</option>
                    <option value="guppy"   ${p.category === 'guppy' ? 'selected' : ''}> Guppy</option>
                </select>
            </td>

            <!-- Status -->
            <td class="col-status">
                <label class="adm-toggle" title="Toggle Stock Status">
                    <input type="checkbox" class="adm-toggle-cb" data-id="${p.id}" ${inStock ? 'checked' : ''} />
                    <span class="adm-toggle-slider"></span>
                </label>
                <span class="adm-stock-txt ${inStock ? 'in' : 'out'}" id="pm-slbl-${p.id}">
                    ${inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>

            <!-- Upload Image -->
            <td class="col-upload">
                <label class="adm-upload-row-btn" title="Upload image from device">
                    <input type="file" accept="image/jpeg,image/png,image/webp"
                           class="pm-img-input" data-id="${p.id}" style="display:none;" />
                     Upload
                </label>
            </td>

            <!-- Save -->
            <td class="col-action">
                <button class="adm-save-btn pm-save-row-btn" data-id="${p.id}" title="Save changes">
                     Save
                </button>
            </td>

            <!-- Delete -->
            <td class="col-del">
                <button class="adm-del-btn pm-del-row-btn" data-id="${p.id}" title="Delete product">
                    
                </button>
            </td>
        </tr>`;
    }).join('');

    /*  Attach event listeners  */

    /* Image upload (per row) */
    tbody.querySelectorAll('.pm-img-input').forEach(input => {
        input.addEventListener('change', function () {
            const file = this.files && this.files[0];
            if (!file) return;
            const pid = +this.dataset.id;
            const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
            if (!allowed.includes(file.type)) { showToast('Only JPG, PNG or WEBP allowed.', 'error'); this.value = ''; return; }
            if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2 MB.', 'error'); this.value = ''; return; }
            const reader = new FileReader();
            reader.onload = ev => {
                const b64 = ev.target.result;
                const prods = getProducts();
                const idx = prods.findIndex(p => p.id === pid);
                if (idx >= 0) { prods[idx].img = b64; saveProducts(prods); }
                const thumb = document.getElementById('pm-thumb-' + pid);
                if (thumb) {
                    thumb.style.opacity = '0.4';
                    setTimeout(() => { thumb.src = b64; thumb.style.opacity = '1'; }, 200);
                }
                showToast('\u2705 Image updated!', 'success');
                this.value = '';
            };
            reader.onerror = () => showToast('Could not read file.', 'error');
            reader.readAsDataURL(file);
        });
    });

    /* Stock toggle  update label text + colour */
    tbody.querySelectorAll('.adm-toggle-cb').forEach(tog => {
        tog.addEventListener('change', function () {
            const pid = +this.dataset.id;
            const lbl = document.getElementById('pm-slbl-' + pid);
            if (!lbl) return;
            lbl.textContent = this.checked ? 'In Stock' : 'Out of Stock';
            lbl.className = 'adm-stock-txt ' + (this.checked ? 'in' : 'out');
        });
    });

    /* Save row */
    tbody.querySelectorAll('.pm-save-row-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pid = +btn.dataset.id;
            const row = document.getElementById('pm-row-' + pid);
            if (!row) return;
            const nameEl = row.querySelector('[data-field="name"]');
            const priceEl = row.querySelector('[data-field="price"]');
            const catEl = row.querySelector('[data-field="category"]');
            const togEl = row.querySelector('.adm-toggle-cb');
            const name = nameEl ? nameEl.value.trim() : '';
            const price = priceEl ? parseFloat(priceEl.value) : NaN;
            const category = catEl ? catEl.value : 'special';
            const status = togEl ? (togEl.checked ? 'in_stock' : 'out_stock') : 'in_stock';
            if (!name) { showToast('Name cannot be empty!', 'error'); return; }
            if (isNaN(price) || price <= 0) { showToast('Enter a valid price!', 'error'); return; }
            const prods = getProducts();
            const idx = prods.findIndex(p => p.id === pid);
            if (idx >= 0) {
                prods[idx] = { ...prods[idx], name, price, category, status };
                saveProducts(prods);
                /* Flash the save button green */
                btn.textContent = ' Saved!';
                btn.style.background = '#10B981';
                setTimeout(() => { btn.textContent = ' Save'; btn.style.background = ''; }, 1800);
                showToast('\u2705 Product updated!', 'success');
                updateAdminStats();
            }
        });
    });

    /* Delete row */
    tbody.querySelectorAll('.pm-del-row-btn').forEach(btn => {
        btn.addEventListener('click', () => confirmDeleteProduct(+btn.dataset.id));
    });
}

/* Backwards-compat alias (called by delete modal) */
function renderProductTable(query) { renderProductList(query); }

/* 
   ADD-CARD COLLAPSE TOGGLE
 */
function pmToggleAddCard() {
    const body = document.getElementById('pm-add-body');
    const btn = document.getElementById('pm-collapse-btn');
    if (!body) return;
    const collapsed = body.style.display === 'none';
    body.style.display = collapsed ? '' : 'none';
    if (btn) btn.textContent = collapsed ? '' : '';
}

/* 
   SEARCH
 */
function initAdminSearch() {
    const inp = document.getElementById('search-input');
    if (!inp) return;
    inp.addEventListener('input', () => {
        searchQuery = inp.value.trim();
        renderProductList(searchQuery);
    });
}

/* 
   ADD / EDIT FORM
 */
function initAdminPanelForm() {
    const saveBtn = document.getElementById('save-prod-btn');
    const resetBtn = document.getElementById('reset-prod-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveProduct);
    if (resetBtn) resetBtn.addEventListener('click', resetProductForm);

    /* Delete confirm modal */
    const confirmDel = document.getElementById('confirm-del-btn');
    if (confirmDel) confirmDel.addEventListener('click', () => {
        const id = +document.getElementById('del-product-id').value;
        deleteProduct(id);
        const m = document.getElementById('delete-confirm-modal');
        if (m) m.classList.remove('open');
    });
    const cancelDel = document.getElementById('cancel-del-btn');
    if (cancelDel) cancelDel.addEventListener('click', () => {
        const m = document.getElementById('delete-confirm-modal');
        if (m) m.classList.remove('open');
    });
}

/* 
   IMAGE UPLOAD  FileReader API (100% free, no backend)
    */
function initImageUpload() {
    const fileInput = document.getElementById('prod-img-file');
    const urlInput = document.getElementById('prod-img');
    const zone = document.getElementById('img-upload-zone');
    const clearBtn = document.getElementById('clear-img-btn');
    if (!zone) return;

    zone.addEventListener('click', () => fileInput && fileInput.click());
    if (fileInput) fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) processImageFile(fileInput.files[0]);
    });
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
        e.preventDefault(); zone.classList.remove('dragover');
        const f = e.dataTransfer && e.dataTransfer.files[0];
        if (f) processImageFile(f);
    });
    if (urlInput) urlInput.addEventListener('input', () => {
        const url = urlInput.value.trim();
        if (url) { currentImgData = url; showImagePreview(url); }
        else if (currentImgData && !currentImgData.startsWith('data:')) { currentImgData = ''; hideImagePreview(); }
    });
    if (clearBtn) clearBtn.addEventListener('click', () => {
        currentImgData = '';
        if (urlInput) urlInput.value = '';
        if (fileInput) fileInput.value = '';
        hideImagePreview();
        zone.classList.remove('has-img');
        showToast('Image cleared', 'info');
    });
}

function processImageFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowed.includes(file.type)) { showToast('Only JPG, PNG or WEBP images are allowed.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5 MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
        currentImgData = e.target.result;
        showImagePreview(currentImgData);
        const urlInput = document.getElementById('prod-img');
        if (urlInput) urlInput.value = '';
        showToast('\u2705 Image uploaded successfully!', 'success');
    };
    reader.onerror = () => showToast('Failed to read image file.', 'error');
    reader.readAsDataURL(file);
}

function showImagePreview(src) {
    const preview = document.getElementById('img-preview');
    const previewW = document.getElementById('img-preview-wrap');
    const zone = document.getElementById('img-upload-zone');
    if (preview) preview.src = src;
    if (previewW) previewW.classList.add('has-img');
    if (zone) zone.classList.add('has-img');
}
function hideImagePreview() {
    const preview = document.getElementById('img-preview');
    const previewW = document.getElementById('img-preview-wrap');
    const zone = document.getElementById('img-upload-zone');
    if (preview) preview.src = '';
    if (previewW) previewW.classList.remove('has-img');
    if (zone) zone.classList.remove('has-img');
}

/* 
   LOAD PRODUCT INTO FORM (edit mode)
 */
function loadProductIntoForm(id) {
    const p = getProducts().find(x => x.id === id);
    if (!p) return;
    editingId = id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-cat').value = p.category;
    document.getElementById('prod-desc').value = p.description || '';
    const statusEl = document.getElementById('prod-status');
    if (statusEl) statusEl.value = p.status || 'in_stock';
    currentImgData = p.img || '';
    const urlInput = document.getElementById('prod-img');
    const fileInput = document.getElementById('prod-img-file');
    if (urlInput) urlInput.value = currentImgData.startsWith('data:') ? '' : currentImgData;
    if (fileInput) fileInput.value = '';
    if (currentImgData) showImagePreview(currentImgData);
    const titleEl = document.getElementById('form-mode-title');
    if (titleEl) titleEl.textContent = 'Update Product';
    /* Expand the add card and scroll to it */
    const body = document.getElementById('pm-add-body');
    const colBtn = document.getElementById('pm-collapse-btn');
    if (body) body.style.display = '';
    if (colBtn) colBtn.textContent = '';
    document.getElementById('pm-add-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetProductForm() {
    editingId = null; currentImgData = '';
    ['prod-name', 'prod-price', 'prod-cat', 'prod-desc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = (id === 'prod-cat') ? 'special' : '';
    });
    const statusEl = document.getElementById('prod-status');
    if (statusEl) statusEl.value = 'in_stock';
    const urlInput = document.getElementById('prod-img');
    const fileInput = document.getElementById('prod-img-file');
    if (urlInput) urlInput.value = '';
    if (fileInput) fileInput.value = '';
    hideImagePreview();
    const titleEl = document.getElementById('form-mode-title');
    if (titleEl) titleEl.textContent = 'Add Product';
}

function saveProduct() {
    const name = document.getElementById('prod-name').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const cat = document.getElementById('prod-cat').value;
    const desc = document.getElementById('prod-desc').value.trim();
    const statusEl = document.getElementById('prod-status');
    const status = statusEl ? statusEl.value : 'in_stock';
    const img = (currentImgData || '').trim() || PLACEHOLDER_IMG;
    if (!name) { showToast('Product name is required.', 'error'); return; }
    if (isNaN(price) || price <= 0) { showToast('Enter a valid price.', 'error'); return; }
    const products = getProducts();
    if (editingId !== null) {
        const idx = products.findIndex(p => p.id === editingId);
        if (idx >= 0) {
            products[idx] = { ...products[idx], name, price, img, category: cat, description: desc, status };
            saveProducts(products);
            showToast('\u2705 Product Updated Successfully!', 'success');
        }
    } else {
        const newId = Math.max(0, ...products.map(p => p.id)) + 1;
        products.push({ id: newId, name, price, img, category: cat, description: desc, status });
        saveProducts(products);
        showToast('\u2705 Product Added Successfully!', 'success');
    }
    resetProductForm();
    updateAdminStats();
    renderProductList();
}

/* 
   DELETE
 */
function confirmDeleteProduct(id) {
    document.getElementById('del-product-id').value = id;
    const p = getProducts().find(x => x.id === id);
    const nameEl = document.getElementById('del-product-name');
    if (nameEl) nameEl.textContent = p ? p.name : `Product #${id}`;
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.add('open');
}

function deleteProduct(id) {
    let products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    showToast('\uD83D\uDDD1 Product deleted.', 'error');
    updateAdminStats();
    renderProductList();
    if (editingId === id) resetProductForm();
}
export {
    initShopPage,
    initCartPage,
    initCheckoutPage,
    initNavbar,
    getCart,
    getCartTotal,
    addToCart,
    clearCart,
    buildWhatsAppURL,
    WA_NUMBER,
    CATEGORY_LABELS,
    getProducts
};
