/* ============================================================
   AK FishFarms  Main UI Engine  |  script.js  v7.0
   LocalStorage-first sync  •  Real Coupon Validation
   WhatsApp Order Form  •  Offers Carousel  •  No simulation
   ============================================================ */
'use strict';

/* ── Constants ── */
const WA_NUMBER = '919492045766';
const LS_CART = 'ak_cart';
const LS_COUPON = 'ak_coupon';
const LS_PRODUCTS = 'ak_products';
const LS_OFFERS = 'ak_offers';
const LS_ORDERS = 'ak_orders';
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';

const IS_LOCAL = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname)
    || window.location.hostname.startsWith('192.168.');

/* ── Default data (only used when LocalStorage is empty) ── */
const DEFAULT_PRODUCTS = [
    { id: 'P001', name: 'Red Dragon Flowerhorn', price: 2500, category: 'special', img: PLACEHOLDER_IMG, status: 'in_stock' },
    { id: 'P002', name: 'Silver Arowana', price: 1800, category: 'premium', img: PLACEHOLDER_IMG, status: 'in_stock' },
    { id: 'P003', name: 'Fancy Guppy Pair', price: 450, category: 'guppy', img: PLACEHOLDER_IMG, status: 'in_stock' }
];
const DEFAULT_OFFERS = [
    { id: 'OFF-1', title: 'Grand Opening Sale', couponCode: 'AKFISH10', discountType: 'percentage', discountValue: 10, minOrder: 0, status: 'active', banner: '' }
];

/* ── State ── */
let globalProducts = [];
let globalOffers = [];

/* ════════════════════════════════════════
   DATA SYNC — LocalStorage is master store
════════════════════════════════════════ */
function lsGet(key, def) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.error('LS error', e); }
}

async function fetchData() {
    console.log('[API] Syncing with Global Database...');
    const grid = document.getElementById('product-grid');
    const banner = document.getElementById('live-banner-root');

    if (grid) grid.classList.add('pulse-loading');
    if (banner) banner.classList.add('pulse-loading');

    const sync = async (endpoint, storageKey, setter) => {
        try {
            const r = await fetch(endpoint);
            if (r.ok) {
                const data = await r.json();
                lsSet(storageKey, data);
                setter(data);
                console.log(`[API] ${endpoint} Synced.`);
                return true;
            }
        } catch (e) {
            console.warn(`[API] ${endpoint} Offline Fallback.`);
        }
        return false;
    };

    // Products
    await sync('/api/products', LS_PRODUCTS, (d) => globalProducts = d);

    // Offers
    await sync('/api/offers', LS_OFFERS, (d) => {
        globalOffers = d;
        renderOffersCarousel();
    });

    // Settings (Banner)
    try {
        const r = await fetch('/api/settings');
        if (r.ok) {
            const settings = await r.json();
            if (settings.heroBanner !== undefined) {
                lsSet('ak_hero_banner', settings.heroBanner);
                console.log('[API] Settings Synced.');
            }
        }
    } catch (e) { }

    if (grid) grid.classList.remove('pulse-loading');
    if (banner) banner.classList.remove('pulse-loading');

    // Rendering is handled by page-specific init functions
}
/* ════════════════════════════════════════
   CART HELPERS
════════════════════════════════════════ */
const getCart = () => lsGet(LS_CART, []);
const saveCart = (c) => lsSet(LS_CART, c);
const getCartCount = () => getCart().reduce((s, i) => s + i.qty, 0);
const getCartTotal = () => getCart().reduce((s, i) => s + i.price * i.qty, 0);

function addToCart(productId, qty = 1) {
    const product = globalProducts.find(p => p.id == productId);
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

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
function showToast(msg, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${msg}</span>`;
    root.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3200);
}

/* ════════════════════════════════════════
   OFFERS CAROUSEL — Home page
════════════════════════════════════════ */
function renderOffersCarousel() {
    const root = document.getElementById('live-banner-root');
    if (!root) return;

    const activeOffers = globalOffers.filter(o => o.status === 'active' || !o.status);

    if (!activeOffers.length) {
        root.innerHTML = `
        <div class="offers-carousel-wrap">
            <div class="offers-carousel">
                <div class="offer-carousel-card offer-card-default">
                    <div class="occ-badge">Today's Deals</div>
                    <div class="occ-title">Fresh Fish Offers Available Today</div>
                    <div class="occ-desc">Premium aquarium fish delivered to your doorstep.</div>
                    <a href="#products" class="occ-btn">Shop Now →</a>
                </div>
            </div>
        </div>`;
        return;
    }

    const GRADIENTS = [
        'linear-gradient(135deg,#FF6B00,#FF9500)',
        'linear-gradient(135deg,#6C3FFB,#A855F7)',
        'linear-gradient(135deg,#0EA5E9,#06B6D4)',
        'linear-gradient(135deg,#10B981,#34D399)',
        'linear-gradient(135deg,#F43F5E,#FB7185)',
    ];

    const cards = activeOffers.map((o, i) => {
        const discText = o.discountType === 'percentage'
            ? `${o.discountValue}% OFF`
            : `₹${o.discountValue} OFF`;
        const minText = o.minOrder > 0 ? ` on orders above ₹${o.minOrder}` : '';
        const expiryText = o.expiry ? `Expires: ${o.expiry}` : '';
        const grad = GRADIENTS[i % GRADIENTS.length];
        return `
        <div class="offer-carousel-card" style="background:${grad};" onclick="UI.copyCode('${o.couponCode}')">
            <div class="occ-badge">${discText}</div>
            <div class="occ-title">${escHtml(o.title)}</div>
            <div class="occ-desc">${escHtml(o.banner || `Get ${discText}${minText}`)}</div>
            <div class="occ-code-row">
                <span class="occ-code">${o.couponCode}</span>
                <span class="occ-copy-hint">Tap to copy</span>
            </div>
            ${expiryText ? `<div class="occ-expiry">${expiryText}</div>` : ''}
            <a href="cart.html" class="occ-btn" onclick="event.stopPropagation()">Shop Now →</a>
        </div>`;
    }).join('');

    root.innerHTML = `
    <div class="offers-carousel-wrap">
        <div class="offers-carousel" id="offers-carousel">
            ${cards}
        </div>
        ${activeOffers.length > 1 ? `
        <div class="carousel-dots" id="carousel-dots">
            ${activeOffers.map((_, i) => `<span class="c-dot ${i === 0 ? 'active' : ''}" onclick="scrollCarouselTo(${i})"></span>`).join('')}
        </div>` : ''}
    </div>`;

    /* Touch swipe support */
    enableCarouselSwipe();
}

function scrollCarouselTo(idx) {
    const c = document.getElementById('offers-carousel');
    if (!c) return;
    const card = c.querySelectorAll('.offer-carousel-card')[idx];
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    document.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

function enableCarouselSwipe() {
    const carousel = document.getElementById('offers-carousel');
    if (!carousel) return;
    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            const dots = document.querySelectorAll('.c-dot');
            let active = [...dots].findIndex(d => d.classList.contains('active'));
            if (diff > 0) active = Math.min(active + 1, dots.length - 1);
            else active = Math.max(active - 1, 0);
            scrollCarouselTo(active);
        }
    }, { passive: true });
}

function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ════════════════════════════════════════
   SHOP / HOME PAGE
════════════════════════════════════════ */
async function initShopPage() {
    await fetchData();
    updateCartBadge();
    renderOffersCarousel();

    const grid = document.getElementById('product-grid');
    const tabs = document.querySelectorAll('.tab');
    if (!grid) return;

    const render = (cat) => {
        const list = cat === 'all'
            ? globalProducts.filter(p => p.status !== 'out_stock')
            : globalProducts.filter(p => p.category === cat && p.status !== 'out_stock');
        grid.innerHTML = list.map(p => `
            <div class="product-card">
                <img src="${p.img || PLACEHOLDER_IMG}" loading="lazy"
                     onerror="this.src='${PLACEHOLDER_IMG}'" alt="${escHtml(p.name)}">
                <div class="pc-body">
                    <div class="pc-name">${escHtml(p.name)}</div>
                    <div class="pc-price">₹${Number(p.price).toLocaleString('en-IN')}</div>
                    <button class="atc-btn" onclick="UI.addToCart('${p.id}')">Add to Cart 🛒</button>
                </div>
            </div>`).join('') || '<div class="empty-state">No products in this category right now.</div>';
        const countEl = document.getElementById('product-count');
        if (countEl) countEl.textContent = list.length + ' products · ';
    };

    tabs.forEach(t => t.onclick = () => {
        tabs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        render(t.dataset.cat);
    });
    render('all');

    /* Navbar scroll */
    window.addEventListener('scroll', () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    /* Hamburger */
    document.getElementById('hamburger')?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.toggle('open');
    });
}

/* ════════════════════════════════════════
   CART PAGE
════════════════════════════════════════ */
async function initCartPage() {
    await fetchData();
    renderCart();

    document.getElementById('initiate-delivery-btn')?.addEventListener('click', () => {
        UI.openOrderForm();
    });

    document.getElementById('apply-coupon-btn')?.addEventListener('click', () => {
        const code = document.getElementById('coupon-input')?.value.trim().toUpperCase();
        if (code) UI.applyCoupon(code);
    });

    document.getElementById('coupon-input')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const code = e.target.value.trim().toUpperCase();
            if (code) UI.applyCoupon(code);
        }
    });

    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
        lsSet(LS_CART, []);
        localStorage.removeItem(LS_COUPON);
        renderCart();
        updateCartBadge();
        showToast('Cart cleared', 'info');
    });

    /* Navbar scroll */
    window.addEventListener('scroll', () => {
        document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    /* Hamburger */
    document.getElementById('hamburger')?.addEventListener('click', () => {
        document.getElementById('mobile-menu')?.classList.toggle('open');
    });
}

function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    if (!itemsEl) return;
    const cart = getCart();
    const mainWrap = document.getElementById('cart-main');
    const emptyWrap = document.getElementById('cart-empty');

    if (!cart.length) {
        if (mainWrap) mainWrap.style.display = 'none';
        if (emptyWrap) emptyWrap.style.display = 'block';
        return;
    }
    if (mainWrap) mainWrap.style.display = 'grid';
    if (emptyWrap) emptyWrap.style.display = 'none';

    itemsEl.innerHTML = cart.map(i => `
        <div class="cart-item">
            <img class="cart-item-img" src="${i.img || PLACEHOLDER_IMG}" alt="${escHtml(i.name)}">
            <div class="cart-item-info">
                <div class="cart-item-name">${escHtml(i.name)}</div>
                <div class="cart-item-price">₹${Number(i.price).toLocaleString('en-IN')}</div>
            </div>
            <div class="cart-item-right">
                <div class="qty-row">
                    <button class="qty-btn" onclick="UI.updateQty('${i.id}', -1)">−</button>
                    <span class="qty-num">${i.qty}</span>
                    <button class="qty-btn" onclick="UI.updateQty('${i.id}', 1)">+</button>
                </div>
                <button class="cart-item-del" onclick="UI.updateQty('${i.id}', -${i.qty})" aria-label="Remove">✕</button>
            </div>
        </div>`).join('');

    const total = getCartTotal();
    const coupon = lsGet(LS_COUPON, null);
    let discount = 0;

    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    const countEl = document.getElementById('item-count');
    if (countEl) countEl.textContent = `(${cart.reduce((a, b) => a + b.qty, 0)} Items)`;

    const discRow = document.getElementById('discount-row');
    const discAmt = document.getElementById('discount-amount');
    const couponTag = document.getElementById('applied-coupon-tag');
    const totalEl = document.getElementById('cart-total');

    if (coupon) {
        discount = coupon.discountType === 'percentage'
            ? Math.floor(total * coupon.discountValue / 100)
            : Math.min(coupon.discountValue, total);
        if (discRow) discRow.style.display = 'flex';
        if (discAmt) discAmt.textContent = `-₹${discount.toLocaleString('en-IN')}`;
        if (couponTag) couponTag.textContent = coupon.couponCode;
    } else {
        if (discRow) discRow.style.display = 'none';
    }
    if (totalEl) totalEl.textContent = `₹${(total - discount).toLocaleString('en-IN')}`;
}

/* ════════════════════════════════════════
   ORDER FORM MODAL
════════════════════════════════════════ */
function openOrderFormModal() {
    const cart = getCart();
    if (!cart.length) { showToast('Your cart is empty!', 'error'); return; }

    // Remove existing modal if any
    document.getElementById('order-form-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'order-form-modal';
    modal.className = 'ofm-overlay';
    modal.innerHTML = `
    <div class="ofm-box">
        <div class="ofm-header">
            <div class="ofm-title">🐟 Complete Your Order</div>
            <button class="ofm-close" id="ofm-close-btn">✕</button>
        </div>
        <p class="ofm-sub">Please fill in your details to confirm via WhatsApp</p>

        <div class="ofm-field">
            <label class="ofm-label">Your Name <span class="ofm-req">*</span></label>
            <input type="text" id="ofm-name" class="ofm-input" placeholder="e.g. Ravi Kumar" autocomplete="name">
        </div>
        <div class="ofm-field">
            <label class="ofm-label">Phone Number <span class="ofm-req">*</span></label>
            <input type="tel" id="ofm-phone" class="ofm-input" placeholder="e.g. 9876543210" maxlength="15" autocomplete="tel">
        </div>
        <div class="ofm-field">
            <label class="ofm-label">City / Town <span class="ofm-req">*</span></label>
            <input type="text" id="ofm-city" class="ofm-input" placeholder="e.g. Hyderabad" autocomplete="address-level2">
        </div>

        <div class="ofm-order-preview">
            ${cart.map(i => `<div class="ofm-item"><span>${escHtml(i.name)} × ${i.qty}</span><span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span></div>`).join('')}
            <div class="ofm-total-row">
                <span>Total</span>
                <span>₹${(getCartTotal() - getDiscount()).toLocaleString('en-IN')}</span>
            </div>
        </div>

        <div id="ofm-err" class="ofm-err"></div>

        <button class="ofm-submit-btn" id="ofm-submit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Confirm & Send via WhatsApp
        </button>
    </div>`;

    document.body.appendChild(modal);
    document.getElementById('ofm-name')?.focus();

    document.getElementById('ofm-close-btn').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    document.getElementById('ofm-submit-btn').onclick = () => {
        const name = document.getElementById('ofm-name').value.trim();
        const phone = document.getElementById('ofm-phone').value.trim();
        const city = document.getElementById('ofm-city').value.trim();
        const errEl = document.getElementById('ofm-err');

        if (!name) { errEl.textContent = 'Please enter your name.'; return; }
        if (!phone || phone.length < 7) { errEl.textContent = 'Please enter a valid phone number.'; return; }
        if (!city) { errEl.textContent = 'Please enter your city.'; return; }
        errEl.textContent = '';

        submitWhatsAppOrder({ name, phone, city });
        modal.remove();
    };
}

function getDiscount() {
    const coupon = lsGet(LS_COUPON, null);
    if (!coupon) return 0;
    const total = getCartTotal();
    return coupon.discountType === 'percentage'
        ? Math.floor(total * coupon.discountValue / 100)
        : Math.min(coupon.discountValue, total);
}

async function submitWhatsAppOrder({ name, phone, city }) {
    const submitBtn = document.getElementById('ofm-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader-spinning" style="margin-right:8px;"></span> Syncing with Global Database...';
    }

    const cart = getCart();
    const coupon = lsGet(LS_COUPON, null);
    const subtotal = getCartTotal();
    const discount = getDiscount();
    const total = subtotal - discount;

    const itemLines = cart.map(i => `• ${i.name} × ${i.qty} — ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('\n');
    const msg = [
        `🐟 *New Order — AK Fish Farms*`,
        ``,
        `👤 *Name:* ${name}`,
        `📞 *Phone:* ${phone}`,
        `📍 *City:* ${city}`,
        ``,
        `*Items Ordered:*`,
        itemLines,
        ``,
        coupon ? `🏷 *Coupon Applied:* ${coupon.couponCode} (−₹${discount.toLocaleString('en-IN')})` : null,
        `💰 *Total Amount: ₹${total.toLocaleString('en-IN')}*`,
        ``,
        `Thank you for shopping at AK Fish Farms! 🐟`
    ].filter(l => l !== null).join('\n');

    /* MANDATORY GLOBAL SYNC — Save to Postgres */
    let orderId = 'AKF-' + Date.now().toString(36).toUpperCase();
    try {
        const orderPayload = {
            id: orderId,
            customerName: name,
            phone,
            city,
            items: cart,
            total: total,
            coupon: coupon?.couponCode || '',
            status: 'New'
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });

        if (response.ok) {
            const data = await response.json();
            orderId = data.id || orderId;
            console.log('🐘 Order Saved to Postgres Database:', orderId);

            // Redirect to WhatsApp ONLY after successful DB save
            window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

            // Cleanup
            lsSet(LS_CART, []);
            localStorage.removeItem(LS_COUPON);
            updateCartBadge();
            showThankYouPopup(name, orderId);
        } else {
            throw new Error('Database Sync Failed');
        }
    } catch (e) {
        console.error('❌ Database Connection Error:', e);
        showToast('Database Connection Error. Order not saved. Please check your internet.', 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Retry Order Confirmation';
        }
    }
}

function showThankYouPopup(name, orderId) {
    const pop = document.createElement('div');
    pop.className = 'ofm-overlay';
    pop.innerHTML = `
    <div class="ofm-box thankyou-box">
        <div style="font-size:3rem;margin-bottom:12px;">🎉</div>
        <h2 style="font-size:1.4rem;font-weight:900;margin-bottom:8px;">Thank You, ${escHtml(name)}!</h2>
        <p style="color:#9CA3AF;margin-bottom:16px;font-size:.9rem;">Your order <strong style="color:#FFD84D;">${orderId}</strong> has been sent via WhatsApp. We'll confirm shortly!</p>
        <p style="color:#10B981;font-size:.85rem;margin-bottom:24px;">🐟 Thanks for shopping with AK Fish Farms!</p>
        <a href="index.html" class="occ-btn" style="display:inline-block;text-decoration:none;">Back to Home</a>
    </div>`;
    document.body.appendChild(pop);
    pop.onclick = e => { if (e.target === pop) { pop.remove(); window.location.href = 'index.html'; } };
    setTimeout(() => { pop.remove(); window.location.href = 'index.html'; }, 7000);
}

/* ════════════════════════════════════════
   UI BRIDGE
════════════════════════════════════════ */
window.UI = {
    addToCart: (id) => {
        addToCart(id, 1);
        showToast('Added to cart! 🐟', 'success');
    },
    updateQty: (id, delta) => {
        const cart = getCart();
        const idx = cart.findIndex(i => i.id == id);
        if (idx >= 0) {
            cart[idx].qty += delta;
            if (cart[idx].qty <= 0) cart.splice(idx, 1);
            saveCart(cart);
            renderCart();
            updateCartBadge();
        }
    },
    applyCoupon: async (code) => {
        const msgEl = document.getElementById('coupon-msg');
        const applyBtn = document.getElementById('apply-coupon-btn');
        if (applyBtn) { applyBtn.disabled = true; applyBtn.textContent = 'Checking...'; }

        code = code.trim().toUpperCase();

        // Try global DB (Postgres) first
        let offer = null;
        try {
            const r = await fetch('/api/offers');
            if (r.ok) {
                const allOffers = await r.json();
                lsSet(LS_OFFERS, allOffers); // Update local cache
                offer = allOffers.find(o => (o.couponCode || o.coupon_code) === code && o.status === 'active');
            }
        } catch (e) {
            console.warn('[Coupon] API fetch failed, using local cache:', e.message);
        }

        // Fallback: LocalStorage cache
        if (!offer) {
            const localOffers = lsGet(LS_OFFERS, []);
            offer = localOffers.find(o => (o.couponCode || o.coupon_code) === code && o.status === 'active');
        }

        if (applyBtn) { applyBtn.disabled = false; applyBtn.textContent = 'Apply'; }

        if (!offer) {
            showToast('Invalid or expired coupon code.', 'error');
            if (msgEl) { msgEl.textContent = '❌ Invalid coupon code.'; msgEl.style.color = '#F87171'; }
            return;
        }

        const total = getCartTotal();
        const minOrder = Number(offer.minOrder || offer.min_order) || 0;
        if (minOrder && total < minOrder) {
            showToast(`Minimum order ₹${minOrder} required.`, 'error');
            if (msgEl) { msgEl.textContent = `❌ Min order ₹${minOrder} required.`; msgEl.style.color = '#F87171'; }
            return;
        }

        // Normalize the offer object
        const normalizedOffer = {
            ...offer,
            couponCode: offer.couponCode || offer.coupon_code || code,
            discountType: offer.discountType || offer.discount_type,
            discountValue: Number(offer.discountValue || offer.discount_value)
        };

        lsSet(LS_COUPON, normalizedOffer);
        showToast(`Coupon "${code}" applied! 🎉`, 'success');
        const discText = normalizedOffer.discountType === 'percentage'
            ? `${normalizedOffer.discountValue}%`
            : `₹${normalizedOffer.discountValue}`;
        if (msgEl) { msgEl.textContent = `✅ Coupon applied! Saving ${discText} on your order.`; msgEl.style.color = '#10B981'; }
        renderCart();
    },
    openOrderForm: openOrderFormModal,
    copyCode: (code) => {
        navigator.clipboard?.writeText(code).catch(() => { });
        showToast(`Code "${code}" copied! Apply at checkout.`, 'success');
    }
};

window.scrollCarouselTo = scrollCarouselTo;

/* ════════════════════════════════════════
   ENTRY POINT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    try {
        const p = window.location.pathname.toLowerCase();

        /* Check cart FIRST — before generic home check */
        if (p.includes('cart')) {
            initCartPage();
        } else {
            /* Home/Shop — matches /, /index.html, or any non-.html path */
            initShopPage();
        }

        /* Navbar scroll glow */
        window.addEventListener('scroll', () => {
            document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });

    } catch (e) {
        console.error('UI Boot Error:', e);
    }
});
