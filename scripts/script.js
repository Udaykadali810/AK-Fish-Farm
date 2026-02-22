/* ============================================================
   AK FishFarms  Shared JS Engine  |  script.js
   STABLE VERSION 5.0 - LOCAL & VERCEL READY
   ============================================================ */
'use strict';

console.log("Main Script Loaded");

const WA_NUMBER = '919492045766';
const LS_CART = 'akf_cart';
const LS_COUPON = 'akf_coupon';
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';

let globalProducts = [];
let globalOffers = [];

/* 
   DATA FETCHING (LOCAL SAFE)
*/
async function fetchData() {
    try {
        const [pRes, oRes] = await Promise.all([
            fetch('/api/products').catch(() => ({ ok: false })),
            fetch('/api/offers').catch(() => ({ ok: false }))
        ]);

        if (pRes.ok) globalProducts = await pRes.json();
        if (oRes.ok) globalOffers = await oRes.json();

        globalProducts = globalProducts || [];
        globalOffers = globalOffers || [];
    } catch (err) {
        console.warn('Backend unavailable (Local Mode)');
    }
}

const getProducts = () => globalProducts;
const getOffers = () => globalOffers;

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
    const product = products.find(p => p.id == productId);
    if (!product) return;
    const cart = getCart();
    const idx = cart.findIndex(i => i.id == productId);
    if (idx >= 0) {
        cart[idx].qty += qty;
    } else {
        cart.push({ id: productId, qty, name: product.name, price: product.price, img: product.img });
    }
    saveCart(cart);
    updateCartBadge();
}

function removeFromCart(productId) {
    saveCart(getCart().filter(i => i.id != productId));
    updateCartBadge();
}

function changeQty(productId, delta) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id == productId);
    if (idx < 0) return;
    const newQty = cart[idx].qty + delta;
    if (newQty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = newQty;
    saveCart(cart);
}

function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.classList.toggle('show', count > 0);
    });
}

function buildWhatsAppURL() {
    const cart = getCart();
    const lines = cart.map((i) => `${i.name} x${i.qty} - ₹${i.price * i.qty}`).join('\n');
    const total = getCartTotal();
    const msg = `Order from AK Fish Farms:\n${lines}\nTotal: ₹${total}`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

function showToast(msg, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${msg}</span>`;
    root.appendChild(t);
    setTimeout(() => { t.classList.add('leaving'); setTimeout(() => t.remove(), 320); }, 3500);
}

/* 
   PAGE CONTROLLERS
*/
async function initShopPage() {
    console.log("Loading Shop...");
    updateCartBadge();
    await fetchData();

    // Category Tabs Logic
    const grid = document.getElementById('product-grid');
    const tabs = document.querySelectorAll('.tab');
    if (grid) {
        const render = (cat) => {
            const filtered = cat === 'all' ? globalProducts : globalProducts.filter(p => p.category === cat);
            grid.innerHTML = filtered.map(p => `
                <div class="product-card">
                    <img src="${p.img || PLACEHOLDER_IMG}">
                    <div class="pc-body">
                        <div class="pc-name">${p.name}</div>
                        <div class="pc-price">₹${p.price}</div>
                        <button class="atc-btn" onclick="UIAddToCart('${p.id}')">Add to Cart</button>
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
    console.log("Loading Cart...");
    await fetchData();
    renderCart();
}

function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    if (!itemsEl) return;
    const cart = getCart();
    if (cart.length === 0) {
        document.getElementById('cart-main').style.display = 'none';
        document.getElementById('cart-empty').style.display = 'block';
        return;
    }
    document.getElementById('cart-main').style.display = 'grid';
    document.getElementById('cart-empty').style.display = 'none';

    itemsEl.innerHTML = cart.map(i => `
        <div class="cart-item">
            <div class="ci-info">
                <div class="ci-name">${i.name}</div>
                <div class="ci-price">₹${i.price}</div>
            </div>
            <div class="qty-sel">
                <button onclick="UIUpdateQty('${i.id}', -1)">-</button>
                <span>${i.qty}</span>
                <button onclick="UIUpdateQty('${i.id}', 1)">+</button>
            </div>
        </div>
    `).join('');

    document.getElementById('cart-total').textContent = `₹${getCartTotal()}`;
}

/* 
   UI BRIDGE FUNCTIONS (Safe for global execution)
*/
window.UIAddToCart = (id) => { addToCart(id, 1); showToast('Added to cart!', 'success'); };
window.UIUpdateQty = (id, d) => { changeQty(id, d); renderCart(); updateCartBadge(); };
window.InitiateWhatsApp = () => {
    window.open(buildWhatsAppURL(), '_blank');
    localStorage.removeItem(LS_CART);
    window.location.href = 'index.html';
};

/* 
   ENTRY POINT
*/
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        initShopPage();
    } else if (path.includes('cart.html')) {
        initCartPage();
    }
});
