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
    renderLiveBanner();

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

function renderLiveBanner() {
    const root = document.getElementById('live-banner-root');
    if (!root) return;

    const activeOffer = globalOffers.find(o => o.status === 'active' || !o.status);

    let title = "Fresh Fish Offers Available Today at AK Fish Farms";
    let desc = "Experience premium quality aquarium fish with safe delivery across India.";
    let badge = "Live Deals";

    if (activeOffer) {
        title = activeOffer.title;
        const discText = activeOffer.discountType === 'percentage' ? `${activeOffer.discountValue}% OFF` : `₹${activeOffer.discountValue} OFF`;
        desc = `Exclusive ${discText}! Use code ${activeOffer.couponCode} on your first order.`;
        badge = "Today's Special Deal";
    }

    root.innerHTML = `
        <div class="premium-offer-banner" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">
            <img class="banner-bg-img" src="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200" alt="Farm Banner">
            <div class="banner-glass-overlay"></div>
            <div class="banner-content">
                <div class="banner-badge">${badge}</div>
                <h2 class="banner-h">${title}</h2>
                <p class="banner-p">${desc}</p>
                <div class="banner-cta">
                    Shop Now 
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    `;
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
            <img class="cart-item-img" src="${i.img || PLACEHOLDER_IMG}" alt="${i.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${i.name}</div>
                <div class="cart-item-price">₹${(i.price).toLocaleString('en-IN')}</div>
            </div>
            <div class="cart-item-right">
                <div class="qty-row">
                    <button class="qty-btn" onclick="UI.updateQty('${i.id}', -1)">-</button>
                    <span class="qty-num">${i.qty}</span>
                    <button class="qty-btn" onclick="UI.updateQty('${i.id}', 1)">+</button>
                </div>
                <button class="cart-item-del" onclick="UI.updateQty('${i.id}', -${i.qty})" aria-label="Remove item">✕</button>
            </div>
        </div>
    `).join('');

    const total = getCartTotal();
    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;

    // Item Count Badge
    const countEl = document.getElementById('item-count');
    if (countEl) countEl.textContent = `(${cart.reduce((a, b) => a + b.qty, 0)} Items)`;

    // Coupon logic
    const discRow = document.getElementById('discount-row');
    const discAmt = document.getElementById('discount-amount');
    const couponTag = document.getElementById('applied-coupon-tag');
    const finalTotalEl = document.getElementById('cart-total');

    const coupon = JSON.parse(localStorage.getItem(LS_COUPON) || 'null');
    let discount = 0;

    if (coupon) {
        if (coupon.discountType === 'percentage') {
            discount = Math.floor(total * (coupon.discountValue / 100));
        } else {
            discount = coupon.discountValue;
        }

        if (discRow) discRow.style.display = 'flex';
        if (discAmt) discAmt.textContent = `-₹${discount.toLocaleString('en-IN')}`;
        if (couponTag) couponTag.textContent = coupon.couponCode;
    } else {
        if (discRow) discRow.style.display = 'none';
    }

    if (finalTotalEl) finalTotalEl.textContent = `₹${(total - discount).toLocaleString('en-IN')}`;
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

        // Robust routing for both local and dev/production environments
        if (p === '/' || p.endsWith('/') || p.includes('index.html')) {
            initShopPage();
        } else if (p.includes('cart')) {
            initCartPage();
        }
    } catch (e) {
        console.error("UI Module Load Error:", e);
    }
});
