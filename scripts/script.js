/* ============================================================
   AK FishFarms  Shared JS Engine  |  script.js
   Pages: index.html  cart.html  checkout.html  admin.html
   Backend: Vercel Serverless API
   ============================================================ */

'use strict';

/* 
   CONSTANTS
*/
const WA_NUMBER = '919492045766';
const LS_CART = 'akf_cart';
const LS_COUPON = 'akf_coupon';
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';

let globalProducts = [];
let globalOffers = [];

/* 
   DATA FETCHING (SERVERLESS API)
*/
async function fetchData() {
    try {
        const [pRes, oRes] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/offers')
        ]).catch(() => [null, null]);

        if (pRes && pRes.ok) globalProducts = await pRes.json();
        if (oRes && oRes.ok) globalOffers = await oRes.json();
    } catch (err) {
        console.warn('API connection failed. using local cache if available.');
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
    localStorage.removeItem(LS_COUPON);
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
   WHATSAPP INTEGRATION
*/
function buildWhatsAppURL(custName = '', custPhone = '', custCity = '') {
    const cart = getCart();
    const lines = cart.map((item) =>
        `${item.name} - Qty: ${item.qty} - ₹${item.price}`
    ).join('\n');

    const subtotal = getCartTotal();
    const coupon = getAppliedCoupon();
    let discount = 0;
    if (coupon) {
        if (coupon.discountType === 'percentage') discount = (subtotal * coupon.discountValue / 100);
        else discount = coupon.discountValue;
    }
    const total = Math.max(0, subtotal - discount);

    const customerInfo = custName ? `\n\nCustomer Details:\nName: ${custName}\nPhone: ${custPhone}\nCity: ${custCity}` : '';

    const msg =
        `Order - AK Fish Farms\n` +
        `Items:\n${lines}\n\n` +
        `Subtotal: ₹${subtotal}\n` +
        (coupon ? `Coupon Applied: ${coupon.couponCode}\nDiscount: ₹${discount}\n` : '') +
        `Final Total: ₹${total}${customerInfo}`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* 
   TOAST NOTIFICATIONS
*/
function showToast(msg, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span></span><span>${msg}</span>`;
    root.appendChild(t);
    const remove = () => { t.classList.add('leaving'); setTimeout(() => t.remove(), 320); };
    t.addEventListener('click', remove);
    setTimeout(remove, 3500);
}

/* 
   INDEX.HTML
*/
async function initShopPage() {
    const nav = document.getElementById('navbar');
    if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));

    updateCartBadge();
    await fetchData();
    renderOffers();

    // Show thanks if returning from WA
    if (sessionStorage.getItem('akf_return_thanks')) {
        showToast('Thanks for shopping with AK Fish Farms!', 'success');
        sessionStorage.removeItem('akf_return_thanks');
    }

    const grid = document.getElementById('product-grid');
    const tabRow = document.getElementById('tab-row');
    const countLabel = document.getElementById('product-count');
    let activeTab = 'all';
    let cardQtyMap = {};

    function renderProducts(filter) {
        const products = getProducts();
        const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
        if (countLabel) countLabel.textContent = `${filtered.length} products`;

        grid.innerHTML = filtered.map(p => {
            const qty = cardQtyMap[p.id] || 1;
            return `
        <div class="product-card fiu" data-id="${p.id}">
          <div class="pc-img-wrap">
            <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='${PLACEHOLDER_IMG}'">
          </div>
          <div class="pc-body">
            <div class="pc-name">${p.name}</div>
            <div class="pc-price">₹${p.price.toLocaleString('en-IN')}</div>
            <div class="qty-sel" style="margin:8px 0;">
              <button class="qty-btn card-minus" data-id="${p.id}">-</button>
              <span class="qty-val" id="cqty-${p.id}">${qty}</span>
              <button class="qty-btn card-plus" data-id="${p.id}">+</button>
            </div>
            <button class="atc-btn" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>`;
        }).join('') || '<div class="empty">No products found</div>';

        attachCardEvents();
    }

    function attachCardEvents() {
        grid.querySelectorAll('.qty-btn').forEach(btn => btn.onclick = () => {
            const id = btn.dataset.id;
            const delta = btn.classList.contains('card-plus') ? 1 : -1;
            cardQtyMap[id] = Math.max(1, (cardQtyMap[id] || 1) + delta);
            document.getElementById(`cqty-${id}`).textContent = cardQtyMap[id];
        });
        grid.querySelectorAll('.atc-btn').forEach(btn => btn.onclick = () => {
            const id = btn.dataset.id;
            addToCart(id, cardQtyMap[id] || 1);
            showToast('Added to cart!', 'success');
        });
    }

    if (tabRow) {
        tabRow.onclick = (e) => {
            const tab = e.target.closest('.tab');
            if (tab) {
                activeTab = tab.dataset.cat;
                tabRow.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
                renderProducts(activeTab);
            }
        };
    }
    renderProducts('all');
}

function renderOffers() {
    const grid = document.getElementById('offers-display-grid');
    const section = document.getElementById('special-offers');
    if (!grid || !section) return;

    const activeOffers = globalOffers.filter(o => o.status === 'active' && (!o.expiryDate || new Date(o.expiryDate) >= new Date()));
    if (activeOffers.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    grid.innerHTML = activeOffers.map(o => `
        <div class="offer-card fiu">
            <div class="off-badge">${o.discountType === 'percentage' ? o.discountValue + '% OFF' : '₹' + o.discountValue + ' OFF'}</div>
            <div class="off-title">${o.title}</div>
            <div class="off-banner-txt">${o.bannerText || 'Apply coupon code at checkout'}</div>
            <div class="off-copy-box">
                <span class="off-code-txt">${o.couponCode}</span>
                <button class="off-copy-btn" onclick="copyCoupon('${o.couponCode}')">Copy</button>
            </div>
        </div>
    `).join('');
}

window.copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    showToast('Coupon code copied!', 'success');
};

/* 
   CART.HTML
*/
async function initCartPage() {
    const nav = document.getElementById('navbar');
    if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
    await fetchData();
    renderCartPage();
}

function renderCartPage() {
    const root = document.getElementById('cart-root');
    if (!root) return;

    const cart = getCart();
    const mainEl = document.getElementById('cart-main');
    const emptyEl = document.getElementById('cart-empty');

    if (cart.length === 0) {
        mainEl.style.display = 'none';
        emptyEl.style.display = 'block';
        return;
    }

    mainEl.style.display = 'grid';
    emptyEl.style.display = 'none';

    const itemsEl = document.getElementById('cart-items');
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img class="ci-img" src="${item.img}" onerror="this.src='${PLACEHOLDER_IMG}'">
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">₹${item.price.toLocaleString('en-IN')}</div>
          <div class="ci-controls">
            <div class="qty-sel">
              <button class="qty-btn ci-minus" data-id="${item.id}">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn ci-plus"  data-id="${item.id}">+</button>
            </div>
            <button class="ci-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>`).join('');

    itemsEl.onclick = (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.classList.contains('ci-minus')) changeQty(id, -1);
        else if (btn.classList.contains('ci-plus')) changeQty(id, 1);
        else if (btn.classList.contains('ci-remove')) removeFromCart(id);
        renderCartPage();
    };

    const subtotal = getCartTotal();
    const coupon = getAppliedCoupon();
    let discount = 0;

    if (coupon) {
        // Validate coupon again
        const fresh = globalOffers.find(o => o.couponCode === coupon.couponCode && o.status === 'active');
        if (!fresh || (fresh.minOrder && subtotal < fresh.minOrder) || (fresh.expiryDate && new Date(fresh.expiryDate) < new Date())) {
            localStorage.removeItem(LS_COUPON);
            showToast('Coupon no longer applicable', 'error');
            renderCartPage();
            return;
        }
        if (coupon.discountType === 'percentage') discount = (subtotal * coupon.discountValue / 100);
        else discount = coupon.discountValue;
    }

    document.getElementById('cart-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    const discRow = document.getElementById('discount-row');
    if (discount > 0) {
        discRow.style.display = 'flex';
        document.getElementById('discount-amount').textContent = `-₹${discount.toLocaleString('en-IN')}`;
        document.getElementById('applied-coupon-tag').textContent = coupon.couponCode;
    } else {
        discRow.style.display = 'none';
    }
    document.getElementById('cart-total').textContent = `₹${Math.max(0, subtotal - discount).toLocaleString('en-IN')}`;

    // Smart Suggestion
    const suggestion = document.getElementById('smart-suggestion');
    const best = globalOffers
        .filter(o => o.status === 'active' && (!o.expiryDate || new Date(o.expiryDate) >= new Date()) && (!coupon || o.couponCode !== coupon.couponCode))
        .sort((a, b) => b.discountValue - a.discountValue)
        .find(o => subtotal >= (o.minOrder || 0));

    if (best && suggestion) {
        suggestion.style.display = 'block';
        suggestion.innerHTML = `Apply <strong>${best.couponCode}</strong> for ${best.discountType === 'percentage' ? best.discountValue + '%' : '₹' + best.discountValue} OFF!`;
    } else if (suggestion) {
        suggestion.style.display = 'none';
    }

    document.getElementById('apply-coupon-btn').onclick = () => {
        const code = document.getElementById('coupon-input').value.trim().toUpperCase();
        const off = globalOffers.find(o => o.couponCode === code && o.status === 'active');
        if (!off) {
            showToast('Invalid or expired coupon', 'error');
        } else if (off.minOrder && subtotal < off.minOrder) {
            showToast(`Min order ₹${off.minOrder} required`, 'error');
        } else if (off.expiryDate && new Date(off.expiryDate) < new Date()) {
            showToast('Coupon expired', 'error');
        } else {
            localStorage.setItem(LS_COUPON, JSON.stringify(off));
            showToast('Coupon applied successfully!', 'success');
            renderCartPage();
        }
    };

    document.getElementById('initiate-delivery-btn').onclick = () => {
        window.open(buildWhatsAppURL(), '_blank');
        sessionStorage.setItem('akf_return_thanks', '1');
        clearCart();
        window.location.href = 'index.html';
    };
}

function getAppliedCoupon() {
    try { return JSON.parse(localStorage.getItem(LS_COUPON)) || null; }
    catch { return null; }
}

// Initialization Logic to prevent conflicts
document.addEventListener('DOMContentLoaded', () => {
    // Current page detection
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/') {
        initShopPage();
    } else if (path.includes('cart.html')) {
        initCartPage();
    }
});

export { initShopPage, initCartPage };
