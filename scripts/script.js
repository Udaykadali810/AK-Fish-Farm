/* ============================================================
   AK FishFarms  Shared JS Engine  |  script.js
   STABLE VERSION 6.1 - LOCAL HARDENED & VERCEL READY
   ============================================================ */
'use strict';

// Environment Detection
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
if (IS_LOCAL) console.log("%c Main UI Local Mode Activated ", "background: #111; color: #00D4FF; font-weight: bold; padding: 4px;");

const WA_NUMBER = '919492045766';
const LS_CART = 'akf_cart';
const LS_COUPON = 'akf_coupon';
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';

let globalProducts = [];
let globalOffers = [];

// MOCK DATA for Local Mode
const MOCK_PRODUCTS = [
    { id: 1, name: 'Red Dragon Flowerhorn', price: 2500, category: 'special', img: PLACEHOLDER_IMG, status: 'in_stock' },
    { id: 2, name: 'Silver Arowana', price: 1800, category: 'premium', img: PLACEHOLDER_IMG, status: 'in_stock' },
    { id: 3, name: 'Fancy Guppy Pair', price: 450, category: 'guppy', img: PLACEHOLDER_IMG, status: 'in_stock' }
];
const MOCK_OFFERS = [
    { id: 'OFF-1', title: 'Grand Opening', couponCode: 'AKFISH10', discountType: 'percentage', discountValue: 10, minOrder: 500, status: 'active' }
];

/* 
   DATA FETCHING (HARDENED)
*/
async function fetchData() {
    try {
        if (IS_LOCAL) {
            console.log("Local Mode: Using localized product catalog");
            globalProducts = MOCK_PRODUCTS;
            globalOffers = MOCK_OFFERS;
            return;
        }

        const [pRes, oRes] = await Promise.all([
            fetch('/api/products').catch(() => ({ ok: false })),
            fetch('/api/offers').catch(() => ({ ok: false }))
        ]);

        if (pRes && pRes.ok) globalProducts = await pRes.json();
        if (oRes && oRes.ok) globalOffers = await oRes.json();

        globalProducts = (globalProducts && globalProducts.length > 0) ? globalProducts : MOCK_PRODUCTS;
        globalOffers = (globalOffers && globalOffers.length > 0) ? globalOffers : MOCK_OFFERS;
    } catch (err) {
        console.warn('Sync failed. Using fallback data.');
        globalProducts = MOCK_PRODUCTS;
        globalOffers = MOCK_OFFERS;
    }
}

/* 
   CART STORAGE
*/
const getCart = () => { try { return JSON.parse(localStorage.getItem(LS_CART)) || []; } catch { return []; } };
const saveCart = (cart) => localStorage.setItem(LS_CART, JSON.stringify(cart));
const getCartCount = () => getCart().reduce((s, i) => s + i.qty, 0);
const getCartTotal = () => getCart().reduce((s, i) => s + i.price * i.qty, 0);

function addToCart(productId, qty) {
    const products = globalProducts;
    const product = products.find(p => p.id == productId);
    if (!product) return;
    const cart = getCart();
    const idx = cart.findIndex(i => i.id == productId);
    if (idx >= 0) cart[idx].qty += qty;
    else cart.push({ id: productId, qty, name: product.name, price: product.price, img: product.img });
    saveCart(cart);
    updateCartBadge();
}

function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
}

function showToast(msg, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${msg}</span>`;
    root.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3000);
}

/* 
   PAGE CONTROLLERS
*/
async function initShopPage() {
    console.log("Initializing Shop Engine...");
    await fetchData();
    updateCartBadge();

    const grid = document.getElementById('product-grid');
    const tabs = document.querySelectorAll('.tab');
    if (grid) {
        const render = (cat) => {
            const filtered = cat === 'all' ? globalProducts : globalProducts.filter(p => p.category === cat);
            grid.innerHTML = filtered.map(p => `
                <div class="product-card">
                    <img src="${p.img || PLACEHOLDER_IMG}" loading="lazy" onerror="this.src='${PLACEHOLDER_IMG}'">
                    <div class="pc-body">
                        <div class="pc-name">${p.name}</div>
                        <div class="pc-price">₹${p.price.toLocaleString('en-IN')}</div>
                        <button class="atc-btn" onclick="UI.addToCart('${p.id}')">Add to Cart</button>
                    </div>
                </div>
            `).join('') || '<div class="empty">No products found</div>';
        };

        tabs.forEach(t => t.onclick = () => {
            tabs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            render(t.dataset.cat);
        });
        render('all');
    }
}

async function initCartPage() {
    console.log("Initializing Cart Engine...");
    await fetchData();
    renderCart();

    // Bind static buttons
    const btnWhatsApp = document.getElementById('initiate-delivery-btn');
    if (btnWhatsApp) btnWhatsApp.onclick = () => UI.initiateWhatsApp();

    const btnApply = document.getElementById('apply-coupon-btn');
    if (btnApply) btnApply.onclick = () => {
        const code = document.getElementById('coupon-input')?.value.trim().toUpperCase();
        if (code) UI.applyCoupon(code);
    };

    const btnClear = document.getElementById('clear-cart-btn');
    if (btnClear) btnClear.onclick = () => {
        localStorage.removeItem(LS_CART);
        localStorage.removeItem(LS_COUPON);
        renderCart();
        updateCartBadge();
        showToast('Cart cleared');
    };
}

function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    if (!itemsEl) return;
    const cart = getCart();

    const mainWrap = document.getElementById('cart-main');
    const emptyWrap = document.getElementById('cart-empty');

    if (cart.length === 0) {
        if (mainWrap) mainWrap.style.display = 'none';
        if (emptyWrap) emptyWrap.style.display = 'block';
        return;
    }

    if (mainWrap) mainWrap.style.display = 'grid';
    if (emptyWrap) emptyWrap.style.display = 'none';

    itemsEl.innerHTML = cart.map(i => `
        <div class="cart-item">
            <div class="ci-info">
                <div class="ci-name">${i.name}</div>
                <div class="ci-price">₹${(i.price * i.qty).toLocaleString('en-IN')}</div>
            </div>
            <div class="qty-sel">
                <button onclick="UI.updateQty('${i.id}', -1)">-</button>
                <span>${i.qty}</span>
                <button onclick="UI.updateQty('${i.id}', 1)">+</button>
            </div>
        </div>
    `).join('');

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;

    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;
}

/* 
   UI BRIDGE (Global accessible methods)
*/
window.UI = {
    addToCart: (id) => { addToCart(id, 1); showToast('Added to cart!', 'success'); },
    updateQty: (id, d) => {
        const cart = getCart();
        const idx = cart.findIndex(i => i.id == id);
        if (idx >= 0) {
            cart[idx].qty += d;
            if (cart[idx].qty <= 0) cart.splice(idx, 1);
            saveCart(cart);
            renderCart();
            updateCartBadge();
        }
    },
    applyCoupon: (code) => {
        const off = globalOffers.find(o => o.couponCode === code && o.status === 'active');
        if (off) {
            localStorage.setItem(LS_COUPON, JSON.stringify(off));
            showToast('Coupon Applied!', 'success');
            renderCart();
        } else {
            showToast('Invalid Coupon', 'error');
        }
    },
    initiateWhatsApp: () => {
        const cart = getCart();
        if (cart.length === 0) return showToast('Cart is empty', 'error');
        const lines = cart.map((i) => `${i.name} x${i.qty}`).join('\n');
        const msg = `Order from AK Fish Farms:\n${lines}\nTotal: ₹${getCartTotal()}`;
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        localStorage.removeItem(LS_CART);
        window.location.href = 'index.html';
    }
};

/* 
   ENTRY POINT
*/
document.addEventListener('DOMContentLoaded', () => {
    try {
        const p = window.location.pathname.toLowerCase();
        console.log("UI Bridge Ready - Monitoring Path:", p);
        if (p.includes('index.html') || p === '/' || p.endsWith('/')) initShopPage();
        else if (p.includes('cart.html')) initCartPage();
    } catch (e) {
        console.error("UI Module Load Error:", e);
    }
});
