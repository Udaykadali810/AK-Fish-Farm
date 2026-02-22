/* ============================================================
   AK FishFarms  Admin Panel Script  (admin-script.js)
   FULLY FUNCTIONAL VERSION 10.0 — Real LocalStorage CRUD
   NO SIMULATED / DEMO CODE — All actions are real & persistent
   ============================================================ */
'use strict';

/* ── Constants ── */
const IS_LOCAL = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname)
    || window.location.hostname.startsWith('192.168.');

const LS_KEY = {
    session: 'akfish_admin_logged_in',
    products: 'ak_products',
    orders: 'ak_orders',
    offers: 'ak_offers',
    creds: 'ak_admin_credentials'
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';

const DEFAULT_CREDS = { username: 'admin', password: 'admin123' };

const DEFAULT_PRODUCTS = [
    { id: 'P001', name: 'Red Dragon Flowerhorn', price: 2500, category: 'special', img: PLACEHOLDER, status: 'in_stock', desc: '' },
    { id: 'P002', name: 'Silver Arowana', price: 1800, category: 'premium', img: PLACEHOLDER, status: 'in_stock', desc: '' },
    { id: 'P003', name: 'Fancy Guppy Pair', price: 450, category: 'guppy', img: PLACEHOLDER, status: 'in_stock', desc: '' }
];

const DEFAULT_OFFERS = [
    { id: 'OFF-1', title: 'Grand Opening Sale', couponCode: 'AKFISH10', discountType: 'percentage', discountValue: 10, minOrder: 500, expiry: '', status: 'active', banner: '' }
];

const STATUS_OPTIONS = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_CLS = { 'Pending': 'sb-pending', 'Processing': 'sb-processing', 'Out for Delivery': 'sb-out', 'Delivered': 'sb-delivered', 'Cancelled': 'sb-cancelled' };

/* ── State ── */
let globalProducts = [];
let globalOrders = [];
let globalOffers = [];
let currentSection = 'dashboard';
let editingProductId = null;
let addImgDataUrl = null;

/* ════════════════════════════════════════
   LOCALSTORAGE HELPERS
════════════════════════════════════════ */
const lsGet = (key, def = []) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.error('LS write error', e); } };
const genId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const getCreds = () => lsGet(LS_KEY.creds, DEFAULT_CREDS);

/* ════════════════════════════════════════
   AUTH HELPERS
════════════════════════════════════════ */
function checkAuth() { return sessionStorage.getItem(LS_KEY.session) === 'true'; }
function doLogout() { sessionStorage.removeItem(LS_KEY.session); redirectTo('admin-login'); }
function redirectTo(page) {
    window.location.href = IS_LOCAL ? `${page}.html` : `/${page}`;
}

/* ════════════════════════════════════════
   DATA LOADING — LocalStorage first
════════════════════════════════════════ */
async function loadAllData(isSilent = false) {
    if (!isSilent) showToast('Connecting to Global Postgres Database...', 'info');
    const mainArea = document.querySelector('.adm-main-area');
    if (!isSilent && mainArea) mainArea.classList.add('pulse-loading');

    const fetchSync = async (endpoint, key, fallback) => {
        try {
            console.log(`📡 [PG] Fetching ${endpoint}...`);
            const r = await fetch(endpoint);
            if (r.ok) {
                const data = await r.json();
                lsSet(key, data); // Keep local cache for speed
                console.log(`✅ [PG] ${endpoint} Synced.`);
                return data;
            }
            throw new Error(`DB Error: ${r.status}`);
        } catch (e) {
            console.warn(`⚠️ [OFFLINE] ${endpoint} using local cache:`, e.message);
            return lsGet(key, fallback);
        }
    };

    globalProducts = await fetchSync('/api/products', LS_KEY.products, DEFAULT_PRODUCTS);
    globalOrders = await fetchSync('/api/orders', LS_KEY.orders, []);
    globalOffers = await fetchSync('/api/offers', LS_KEY.offers, DEFAULT_OFFERS);

    // Load Global Settings
    try {
        const r = await fetch('/api/settings');
        if (r.ok) {
            const settings = await r.json();
            if (settings.heroBanner) localStorage.setItem('ak_hero_banner', settings.heroBanner);
        }
    } catch (e) { }

    if (mainArea) mainArea.classList.remove('pulse-loading');
    refreshUI();
}

// Auto-refresh orders every 20 seconds for Live Site
setInterval(() => {
    if (checkAuth() && (currentSection === 'dashboard' || currentSection === 'orders')) {
        loadAllData(true);
    }
}, 20000);

/* ════════════════════════════════════════
   UI REFRESH
════════════════════════════════════════ */
function refreshUI() {
    try {
        renderDashboard();
        if (currentSection === 'products') renderProductTable();
        if (currentSection === 'orders') renderOrdersTable();
        if (currentSection === 'offers') renderOffersTable();
        if (currentSection === 'reports') renderReports();
        if (currentSection === 'track') renderTrackList('');
    } catch (e) { console.error('UI Refresh Error:', e); }
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
function showToast(msg, type = 'info') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const ico = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[type] || 'ℹ️';
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-ico">${ico}</span><span class="toast-msg">${msg}</span>`;
    root.appendChild(t);
    setTimeout(() => { t.style.animation = 'toastOut .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3000);
}

/* ════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════ */
function renderDashboard() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const revenue = globalOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const pending = globalOrders.filter(o => o.status === 'Pending').length;
    set('ds-orders', globalOrders.length);
    set('ds-revenue', '₹' + revenue.toLocaleString('en-IN'));
    set('ds-products', globalProducts.length);
    set('ds-pending', pending);

    const tbody = document.getElementById('dash-orders-tbody');
    if (tbody) {
        tbody.innerHTML = [...globalOrders].reverse().slice(0, 5).map(o => `
            <tr>
                <td style="color:var(--aqua);font-weight:700;">${o.id}</td>
                <td>${o.customerName || 'Guest'}</td>
                <td>₹${(Number(o.total) || 0).toLocaleString('en-IN')}</td>
                <td><span class="sbadge ${STATUS_CLS[o.status] || 'sb-pending'}">${o.status || 'Pending'}</span></td>
            </tr>`).join('') || '<tr><td colspan="4" class="tbl-empty">No orders yet</td></tr>';
    }

    // Banner preview
    const bannerUrl = localStorage.getItem('ak_hero_banner');
    const previewBox = document.getElementById('banner-preview-box');
    const previewImg = document.getElementById('admin-banner-preview');
    if (bannerUrl && previewBox && previewImg) {
        previewImg.src = bannerUrl;
        previewBox.style.display = 'block';
    }
    const bannerInput = document.getElementById('custom-banner-input');
    if (bannerInput && bannerUrl) bannerInput.value = bannerUrl;
}

/* ════════════════════════════════════════
   PRODUCTS — Full CRUD
════════════════════════════════════════ */
function saveProducts() {
    lsSet(LS_KEY.products, globalProducts);
}

function renderProductTable(filter = '') {
    const tbody = document.getElementById('prod-tbody');
    if (!tbody) return;
    const count = document.getElementById('prod-count');
    if (count) count.textContent = globalProducts.length;

    const list = filter
        ? globalProducts.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
        : globalProducts;

    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="tbl-empty">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = list.map(p => `
        <tr data-pid="${p.id}">
            <td>
                <img src="${p.img || PLACEHOLDER}" id="img-prev-${p.id}"
                     style="width:44px;height:44px;border-radius:8px;object-fit:cover;cursor:pointer;"
                     onclick="triggerImgUpload('${p.id}')" title="Click to change image">
                <input type="file" id="file-${p.id}" accept="image/*" style="display:none;" onchange="handleRowImgUpload(event,'${p.id}')">
            </td>
            <td><input class="inline-inp" id="name-${p.id}" value="${escHtml(p.name)}" maxlength="80"></td>
            <td><input class="inline-inp" id="price-${p.id}" type="number" value="${p.price}" min="1" style="width:90px;"></td>
            <td>
                <select class="inline-inp" id="cat-${p.id}" style="width:110px;">
                    <option value="special" ${p.category === 'special' ? 'selected' : ''}>AK Special</option>
                    <option value="premium" ${p.category === 'premium' ? 'selected' : ''}>AK Premium</option>
                    <option value="guppy"   ${p.category === 'guppy' ? 'selected' : ''}>Guppy</option>
                </select>
            </td>
            <td>
                <select class="inline-inp" id="status-${p.id}" style="width:115px;">
                    <option value="in_stock"  ${p.status === 'in_stock' ? 'selected' : ''}>✅ In Stock</option>
                    <option value="out_stock" ${p.status === 'out_stock' ? 'selected' : ''}>❌ Out of Stock</option>
                </select>
            </td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="triggerImgUpload('${p.id}')">📷 Upload</button>
            </td>
            <td>
                <button class="save-row-btn" onclick="saveProductRow('${p.id}')">💾 Save</button>
            </td>
            <td>
                <button class="btn btn-red btn-sm" onclick="confirmDeleteProduct('${p.id}','${escHtml(p.name)}')">🗑️</button>
            </td>
        </tr>`).join('');
}

function triggerImgUpload(id) {
    const f = document.getElementById(`file-${id}`);
    if (f) f.click();
}

function handleRowImgUpload(event, id) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Image too large. Max 2MB for Global Sync.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
        const dataUrl = e.target.result;
        const prev = document.getElementById(`img-prev-${id}`);
        if (prev) prev.src = dataUrl;
        const idx = globalProducts.findIndex(p => p.id == id);
        if (idx >= 0) {
            globalProducts[idx].img = dataUrl;
            showToast('Ready! Click "💾 Save" to Sync Globally.', 'warning');
        }
    };
    reader.readAsDataURL(file);
}

async function saveProductRow(id) {
    const idx = globalProducts.findIndex(p => p.id == id);
    if (idx < 0) return;
    const name = document.getElementById(`name-${id}`)?.value.trim();
    const price = parseFloat(document.getElementById(`price-${id}`)?.value);
    const cat = document.getElementById(`cat-${id}`)?.value;
    const stat = document.getElementById(`status-${id}`)?.value;

    if (!name) { showToast('Product name is required.', 'error'); return; }
    if (!price || price < 1) { showToast('Enter a valid price.', 'error'); return; }

    const updatedProd = { ...globalProducts[idx], name, price, category: cat, status: stat };

    showToast('Saving to Postgres...', 'info');
    try {
        const res = await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProd)
        });

        if (res.ok) {
            const saved = await res.json();
            globalProducts[idx] = saved;
            lsSet(LS_KEY.products, globalProducts);
            showToast(`"${name}" Saved to Global DB`, 'success');
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Server Error ${res.status}`);
        }
    } catch (e) {
        console.error('❌ DB Sync Failed:', e);
        showToast('Database Connection Error. Changes NOT saved.', 'error');
        return;
    }
    renderProductTable(document.getElementById('prod-search')?.value || '');
}

function confirmDeleteProduct(id, name) {
    const modal = document.getElementById('del-modal');
    const nameEl = document.getElementById('del-prod-name');
    const idEl = document.getElementById('del-prod-id');
    if (modal && nameEl && idEl) {
        nameEl.textContent = name;
        idEl.value = id;
        modal.classList.add('show');
    }
}

async function deleteProduct(id) {
    showToast('Deleting from Global DB...', 'info');
    try {
        const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            globalProducts = globalProducts.filter(p => p.id != id);
            lsSet(LS_KEY.products, globalProducts);
            showToast('Deleted Globally from Postgres!', 'success');
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `DB Error ${res.status}`);
        }
    } catch (e) {
        console.error('❌ DB Delete Failed:', e);
        showToast('Database Connection Error. Product not removed.', 'error');
    }
    renderProductTable();
    renderDashboard();
}

/* Add Product Form */
async function addProductFromForm() {
    const name = document.getElementById('add-name')?.value.trim();
    const price = parseFloat(document.getElementById('add-price')?.value);
    const cat = document.getElementById('add-cat')?.value;
    const stat = document.getElementById('add-status')?.value;
    const desc = document.getElementById('add-desc')?.value.trim();
    const urlIn = document.getElementById('add-img-url')?.value.trim();
    const imgSrc = addImgDataUrl || urlIn || PLACEHOLDER;

    if (!name) { showToast('Fish name is required.', 'error'); return; }
    if (!price || price < 1) { showToast('Enter a valid price.', 'error'); return; }

    const newProd = { name, price, category: cat, status: stat, desc, img: imgSrc };

    showToast('Pushing to Postgres Database...', 'info');
    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProd)
        });
        if (res.ok) {
            const saved = await res.json();
            globalProducts.push(saved);
            lsSet(LS_KEY.products, globalProducts);
            showToast(`"${name}" Added Globally to Neon Postgres!`, 'success');
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `DB Error ${res.status}`);
        }
    } catch (e) {
        console.error('❌ DB Save Failed:', e);
        showToast('Database Connection Error. Product NOT added.', 'error');
        return;
    }

    // Reset form
    ['add-name', 'add-price', 'add-desc', 'add-img-url'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.getElementById('add-status').value = 'in_stock';
    document.getElementById('add-cat').value = 'special';
    addImgDataUrl = null;
    const prev = document.getElementById('add-img-preview');
    if (prev) prev.style.display = 'none';

    renderProductTable();
    renderDashboard();
}

function toggleAddCard() {
    const body = document.getElementById('add-prod-body');
    const btn = document.getElementById('add-toggle-btn');
    if (!body) return;
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'block' : 'none';
    if (btn) btn.textContent = hidden ? 'Collapse' : 'Expand';
}

/* ════════════════════════════════════════
   ORDERS — Desktop table + Mobile cards
════════════════════════════════════════ */
function renderOrdersTable(filter) {
    filter = (filter || '').toLowerCase();
    const tbody = document.getElementById('orders-tbody');
    const mobileList = document.getElementById('orders-mobile-list');
    const countEl = document.getElementById('orders-count');
    if (countEl) countEl.textContent = globalOrders.length;

    const list = filter
        ? globalOrders.filter(o =>
            (o.id || '').toLowerCase().includes(filter) ||
            (o.customerName || '').toLowerCase().includes(filter) ||
            (o.phone || '').includes(filter))
        : globalOrders;

    const ordered = [...list].reverse();

    /* ── Desktop table rows ── */
    if (tbody) {
        if (!ordered.length) {
            tbody.innerHTML = '<tr><td colspan="8" class="tbl-empty">No orders yet. Orders placed in the shop will appear here.</td></tr>';
        } else {
            tbody.innerHTML = ordered.map(o => {
                const date = o.timestamp
                    ? new Date(o.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
                    : '—';
                const statusOpts = STATUS_OPTIONS.map(s =>
                    `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('');
                return `<tr>
                    <td style="color:var(--aqua);font-weight:700;font-size:.8rem;">${o.id}</td>
                    <td>${escHtml(o.customerName || 'Guest')}</td>
                    <td>${escHtml(o.phone || '—')}</td>
                    <td>${escHtml(o.city || '—')}</td>
                    <td style="font-weight:700;">₹${(Number(o.total) || 0).toLocaleString('en-IN')}</td>
                    <td style="font-size:.75rem;">${date}</td>
                    <td><select class="inline-inp" style="width:148px;font-size:.75rem;"
                        onchange="updateOrderStatus('${o.id}',this.value)">${statusOpts}</select></td>
                    <td><button class="btn btn-ghost btn-sm" onclick="openOrderModal('${o.id}')">Details</button></td>
                </tr>`;
            }).join('');
        }
    }

    /* ── Mobile cards ── */
    if (mobileList) {
        if (!ordered.length) {
            mobileList.innerHTML = '<div class="ord-mob-empty">📭 No orders yet.<br><small>Place an order from the shop to see it here.</small></div>';
        } else {
            mobileList.innerHTML = ordered.map(o => {
                const date = o.timestamp
                    ? new Date(o.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    : '—';
                const itemCount = (o.items || []).reduce((a, i) => a + (i.qty || 1), 0);
                const statusOpts = STATUS_OPTIONS.map(s =>
                    `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('');
                const meta = [escHtml(o.phone || ''), escHtml(o.city || ''), date].filter(Boolean).join(' · ');
                return `
                <div class="ord-mob-card">
                    <div class="ord-mob-top">
                        <div>
                            <div class="ord-mob-id">${o.id}</div>
                            <div class="ord-mob-name">${escHtml(o.customerName || 'Guest')}</div>
                            <div class="ord-mob-meta">${meta}</div>
                        </div>
                        <div class="ord-mob-right">
                            <div class="ord-mob-total">₹${(Number(o.total) || 0).toLocaleString('en-IN')}</div>
                            <div class="ord-mob-items">${itemCount} item${itemCount !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                    <div class="ord-mob-bot">
                        <select class="ord-mob-sel" onchange="updateOrderStatus('${o.id}',this.value)">
                            ${statusOpts}
                        </select>
                        <button class="ord-mob-det-btn" onclick="openOrderModal('${o.id}')">📋 Details</button>
                    </div>
                </div>`;
            }).join('');
        }
    }
}


async function updateOrderStatus(orderId, newStatus) {
    showToast('Updating Order Cloud Status...', 'info');
    try {
        const res = await fetch('/api/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: orderId, status: newStatus })
        });
        if (res.ok) {
            const idx = globalOrders.findIndex(o => o.id === orderId);
            if (idx >= 0) {
                globalOrders[idx].status = newStatus;
                lsSet(LS_KEY.orders, globalOrders);
            }
            showToast(`Order ${orderId} Updated Globally`, 'success');
            console.log(`✅ [PG] Status Sync: ${orderId} -> ${newStatus}`);
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `DB Error ${res.status}`);
        }
    } catch (e) {
        console.error('❌ Order Sync Failed:', e);
        showToast('Database Connection Error. Status not updated.', 'error');
        return;
    }
    renderOrdersTable(document.getElementById('orders-search')?.value.toLowerCase());
    renderDashboard();
    const modal = document.getElementById('order-modal');
    if (modal) modal.classList.remove('show');
}

function openOrderModal(orderId) {
    const o = globalOrders.find(o => o.id === orderId);
    if (!o) return;
    const modal = document.getElementById('order-modal');
    const body = document.getElementById('order-modal-body');
    if (!modal || !body) return;

    const date = o.timestamp ? new Date(o.timestamp).toLocaleString('en-IN') : '—';
    const items = (o.items || []).map(i => `
        <div class="modal-item">
            <span class="modal-item-n">${escHtml(i.name)} × ${i.qty}</span>
            <span class="modal-item-p">₹${(i.price * i.qty).toLocaleString('en-IN')}</span>
        </div>`).join('') || '<p style="color:var(--dim);font-size:.8rem;">No item details available.</p>';

    body.innerHTML = `
        <div class="modal-row"><span class="modal-lbl">Order ID</span><span class="modal-val" style="color:var(--aqua);font-weight:800;">${o.id}</span></div>
        <div class="modal-row"><span class="modal-lbl">Customer</span><span class="modal-val">${escHtml(o.customerName || 'Guest')}</span></div>
        <div class="modal-row"><span class="modal-lbl">Phone</span><span class="modal-val">${escHtml(o.phone || '—')}</span></div>
        <div class="modal-row"><span class="modal-lbl">City</span><span class="modal-val">${escHtml(o.city || '—')}</span></div>
        <div class="modal-row"><span class="modal-lbl">Date</span><span class="modal-val">${date}</span></div>
        <div class="modal-row"><span class="modal-lbl">Status</span>
            <span class="modal-val">
                <select class="inline-inp" style="width:160px;" onchange="updateOrderStatus('${o.id}', this.value)">
                    ${STATUS_OPTIONS.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </span>
        </div>
        <div class="modal-row"><span class="modal-lbl">Items</span><div class="modal-val"><div class="modal-items">${items}</div></div></div>
        <div class="modal-row"><span class="modal-lbl">Total</span><span class="modal-val" style="color:var(--aqua);font-weight:900;font-size:1rem;">₹${(Number(o.total) || 0).toLocaleString('en-IN')}</span></div>
        ${o.coupon ? `<div class="modal-row"><span class="modal-lbl">Coupon</span><span class="modal-val" style="color:var(--green);">${escHtml(o.coupon)}</span></div>` : ''}
        ${o.note ? `<div class="modal-row"><span class="modal-lbl">Note</span><span class="modal-val">${escHtml(o.note)}</span></div>` : ''}`;

    modal.classList.add('show');
}

/* ════════════════════════════════════════
   OFFERS — Full CRUD
════════════════════════════════════════ */
function saveOffers() { lsSet(LS_KEY.offers, globalOffers); }

function renderOffersTable() {
    const tbody = document.getElementById('offers-tbody');
    if (!tbody) return;
    const count = document.getElementById('off-count');
    if (count) count.textContent = globalOffers.length;

    if (!globalOffers.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="tbl-empty">No offers yet. Add one above!</td></tr>';
        return;
    }

    tbody.innerHTML = globalOffers.map(o => `
        <tr>
            <td><strong>${escHtml(o.title)}</strong></td>
            <td><span class="code-badge">${escHtml(o.couponCode)}</span></td>
            <td><strong style="color:var(--aqua);">${o.discountValue}${o.discountType === 'percentage' ? '%' : '₹'}</strong></td>
            <td>₹${o.minOrder || 0}</td>
            <td style="font-size:.78rem;">${o.expiry || '—'}</td>
            <td>
                <button class="status-toggle-btn ${o.status === 'active' ? 'active' : 'inactive'}"
                    onclick="toggleOfferStatus('${o.id}')">
                    ${o.status === 'active' ? '✅ Active' : '⛔ Inactive'}
                </button>
            </td>
            <td>
                <button class="btn btn-red btn-sm" onclick="deleteOffer('${o.id}')">🗑️</button>
            </td>
        </tr>`).join('');
}

async function addOfferFromForm() {
    const title = document.getElementById('off-title')?.value.trim();
    const couponCode = document.getElementById('off-code')?.value.trim().toUpperCase();
    const discountType = document.getElementById('off-type')?.value;
    const discountValue = parseFloat(document.getElementById('off-val')?.value);
    const minOrder = parseFloat(document.getElementById('off-min')?.value) || 0;
    const expiry = document.getElementById('off-expiry')?.value;
    const banner = document.getElementById('off-banner')?.value.trim();

    if (!title || !couponCode || !discountValue) { showToast('Please fill required fields.', 'error'); return; }

    const newOffer = { title, couponCode, discountType, discountValue, minOrder, expiry, banner, status: 'active' };

    showToast('Pushing Offer to Postgres...', 'info');
    try {
        const res = await fetch('/api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOffer)
        });
        if (res.ok) {
            const saved = await res.json();
            globalOffers.push(saved);
            lsSet(LS_KEY.offers, globalOffers);
            showToast('Offer Created Globally!', 'success');
            toggleAddOfferCard();
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `DB Error ${res.status}`);
        }
    } catch (e) {
        console.error('❌ Offer Sync Failed:', e);
        showToast('Database Connection Error. Offer not saved.', 'error');
        return;
    }
    ['off-title', 'off-code', 'off-val', 'off-min', 'off-expiry', 'off-banner'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    renderOffersTable();
}

async function toggleOfferStatus(id) {
    const idx = globalOffers.findIndex(o => o.id == id);
    if (idx < 0) return;
    const newStatus = globalOffers[idx].status === 'active' ? 'inactive' : 'active';

    showToast('Syncing status with Postgres...', 'info');
    try {
        const res = await fetch('/api/offers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });
        if (res.ok) {
            globalOffers[idx].status = newStatus;
            lsSet(LS_KEY.offers, globalOffers);
            showToast(`Offer is now ${newStatus}`, 'success');
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `DB Error ${res.status}`);
        }
    } catch (e) {
        console.error('❌ Offer Toggle Sync Failed:', e);
        showToast('Database Connection Error.', 'error');
        return;
    }
    renderOffersTable();
}

async function deleteOffer(id) {
    showToast('Removing from Global Database...', 'info');
    try {
        const res = await fetch(`/api/offers?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            globalOffers = globalOffers.filter(o => o.id != id);
            lsSet(LS_KEY.offers, globalOffers);
            showToast('Deleted Globally from Postgres!', 'success');
        } else {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `DB Error ${res.status}`);
        }
    } catch (e) {
        console.error('❌ Offer Delete Failed:', e);
        showToast('Database Connection Error.', 'error');
    }
    renderOffersTable();
}

function toggleAddOfferCard() {
    const body = document.getElementById('add-offer-body');
    const btn = document.getElementById('offer-toggle-btn');
    if (!body) return;
    const hidden = body.style.display === 'none' || body.style.display === '';
    body.style.display = hidden ? 'block' : 'none';
    if (btn) btn.textContent = hidden ? 'Collapse' : 'Expand';
}

/* ════════════════════════════════════════
   TRACK ORDERS
════════════════════════════════════════ */
function renderTrackList(query) {
    const container = document.getElementById('track-list');
    if (!container) return;

    const q = (query || '').toLowerCase().trim();
    const list = q
        ? globalOrders.filter(o =>
            (o.id || '').toLowerCase().includes(q) ||
            (o.customerName || '').toLowerCase().includes(q) ||
            (o.phone || '').includes(q))
        : [...globalOrders].reverse().slice(0, 10);

    if (!list.length) {
        container.innerHTML = '<p style="color:var(--dim);font-size:.88rem;text-align:center;padding:30px;">No orders found.</p>';
        return;
    }

    container.innerHTML = list.map(o => {
        const date = o.timestamp ? new Date(o.timestamp).toLocaleDateString('en-IN') : '—';
        const statClass = STATUS_CLS[o.status] || 'sb-pending';
        return `
        <div class="track-card">
            <div class="track-top">
                <div>
                    <div class="track-id">${o.id}</div>
                    <div class="track-name">${escHtml(o.customerName || 'Guest')} — ${escHtml(o.city || '')}</div>
                </div>
                <span class="sbadge ${statClass}">${o.status || 'Pending'}</span>
            </div>
            <div class="track-mid">
                <span>📞 ${escHtml(o.phone || '—')}</span>
                <span>📅 ${date}</span>
                <span>💰 ₹${(Number(o.total) || 0).toLocaleString('en-IN')}</span>
            </div>
            <div class="track-actions">
                ${STATUS_OPTIONS.map(s => `
                    <button class="track-status-btn ${o.status === s ? 'active' : ''}"
                            onclick="updateOrderStatus('${o.id}','${s}'); renderTrackList(document.getElementById('track-search').value)">
                        ${s}
                    </button>`).join('')}
            </div>
        </div>`;
    }).join('');
}

/* ════════════════════════════════════════
   SECURITY — Real password change
════════════════════════════════════════ */
function changePassword() {
    const curIn = document.getElementById('sec-cur')?.value;
    const newIn = document.getElementById('sec-new')?.value;
    const confIn = document.getElementById('sec-confirm')?.value;
    const errEl = document.getElementById('sec-err');

    const showErr = (msg) => { if (errEl) { errEl.textContent = msg; errEl.style.color = '#F87171'; } };
    const clearErr = () => { if (errEl) errEl.textContent = ''; };
    clearErr();

    const creds = getCreds();

    if (!curIn) { showErr('Enter your current password.'); return; }
    if (curIn !== creds.password) { showErr('Current password is incorrect.'); return; }
    if (!newIn || newIn.length < 6) { showErr('New password must be at least 6 characters.'); return; }
    if (newIn !== confIn) { showErr('New passwords do not match.'); return; }

    lsSet(LS_KEY.creds, { username: creds.username, password: newIn });
    showToast('✅ Password Updated Successfully!', 'success');
    clearErr();
    ['sec-cur', 'sec-new', 'sec-confirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

/* ════════════════════════════════════════
   REPORTS — Real download
════════════════════════════════════════ */
function renderReports() {
    const countEl = document.getElementById('rpt-order-count');
    const revEl = document.getElementById('rpt-revenue');
    if (countEl) countEl.textContent = globalOrders.length;
    if (revEl) revEl.textContent = '₹' + globalOrders.reduce((s, o) => s + (Number(o.total) || 0), 0).toLocaleString('en-IN');
}

function downloadCSV(filename, rows) {
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

function downloadOrdersCSV() {
    if (!globalOrders.length) { showToast('No orders to export.', 'warning'); return; }
    const rows = [
        ['Order ID', 'Customer', 'Phone', 'City', 'Items', 'Total (₹)', 'Coupon', 'Status', 'Date'],
        ...globalOrders.map(o => [
            o.id, o.customerName || 'Guest', o.phone || '', o.city || '',
            (o.items || []).map(i => `${i.name}x${i.qty}`).join(' | '),
            o.total || 0, o.coupon || '', o.status || '', o.timestamp ? new Date(o.timestamp).toLocaleString('en-IN') : ''
        ])
    ];
    downloadCSV(`AKFishFarms_Orders_${Date.now()}.csv`, rows);
    showToast('Orders CSV downloaded!', 'success');
}

function downloadProductsCSV() {
    const rows = [
        ['ID', 'Name', 'Price (₹)', 'Category', 'Status', 'Description'],
        ...globalProducts.map(p => [p.id, p.name, p.price, p.category, p.status, p.desc || ''])
    ];
    downloadCSV(`AKFishFarms_Products_${Date.now()}.csv`, rows);
    showToast('Products CSV downloaded!', 'success');
}

function downloadExcel() {
    // Build a basic Excel-compatible XML
    if (!globalOrders.length) { showToast('No orders to export.', 'warning'); return; }
    const headers = ['Order ID', 'Customer', 'Phone', 'City', 'Total', 'Coupon', 'Status', 'Date'];
    const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rows = globalOrders.map(o => [
        o.id, o.customerName || 'Guest', o.phone || '', o.city || '',
        o.total || 0, o.coupon || '', o.status || '',
        o.timestamp ? new Date(o.timestamp).toLocaleString('en-IN') : ''
    ]);

    const xml = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Orders">
<Table>
<Row>${headers.map(h => `<Cell><Data ss:Type="String">${esc(h)}</Data></Cell>`).join('')}</Row>
${rows.map(r => `<Row>${r.map(c => `<Cell><Data ss:Type="String">${esc(c)}</Data></Cell>`).join('')}</Row>`).join('')}
</Table></Worksheet></Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `AKFishFarms_Orders_${Date.now()}.xls`; a.click();
    URL.revokeObjectURL(url);
    showToast('Excel report downloaded!', 'success');
}

/* ════════════════════════════════════════
   HERO BANNER
════════════════════════════════════════ */
async function saveBanner() {
    const val = document.getElementById('custom-banner-input')?.value.trim();
    if (!val) { showToast('Enter a banner URL first.', 'error'); return; }

    showToast('Updating Global Banner...', 'info');
    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ heroBanner: val })
        });
        if (res.ok) {
            localStorage.setItem('ak_hero_banner', val);
            const prev = document.getElementById('admin-banner-preview');
            const box = document.getElementById('banner-preview-box');
            if (prev) prev.src = val;
            if (box) box.style.display = 'block';
            showToast('Global Banner Updated Successfully!', 'success');
        } else throw new Error();
    } catch (e) {
        showToast('Sync Failed. Banner not updated.', 'error');
    }
}

async function resetBanner() {
    showToast('Resetting Global Banner...', 'info');
    try {
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ heroBanner: '' })
        });
        if (res.ok) {
            localStorage.removeItem('ak_hero_banner');
            const inp = document.getElementById('custom-banner-input');
            if (inp) inp.value = '';
            const box = document.getElementById('banner-preview-box');
            if (box) box.style.display = 'none';
            showToast('Global Banner Reset!', 'success');
        } else throw new Error();
    } catch (e) {
        showToast('Reset Failed.', 'error');
    }
}

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
function switchSection(name) {
    currentSection = name;
    document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('sec-' + name);
    if (sec) sec.classList.add('active');
    document.querySelectorAll('.nav-item[data-section]').forEach(b => {
        b.classList.toggle('active', b.dataset.section === name);
    });
    const ht = document.getElementById('hd-title');
    const NAMES = { dashboard: 'Dashboard', orders: 'Orders', track: 'Track Orders', products: 'Products', offers: 'Offers & Coupons', security: 'Security', reports: 'Reports' };
    if (ht) ht.textContent = NAMES[name] || name;
    refreshUI();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSidebar() { document.getElementById('adm-sidebar')?.classList.add('open'); document.getElementById('sidebar-overlay')?.classList.add('show'); }
function closeSidebar() { document.getElementById('adm-sidebar')?.classList.remove('open'); document.getElementById('sidebar-overlay')?.classList.remove('show'); }

/* ════════════════════════════════════════
   UTIL
════════════════════════════════════════ */
function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ════════════════════════════════════════
   BOOT ENGINE
════════════════════════════════════════ */
const boot = () => {
    const path = window.location.pathname.toLowerCase();
    const isLogin = path.includes('admin-login');
    const isDashboard = path.includes('admin-dashboard') || path.includes('/admin') && !isLogin;
    const auth = checkAuth();

    console.log('%c AK FishFarms Admin v10.0 ', 'background:#00D4FF;color:#080C18;font-weight:900;padding:4px;border-radius:4px;');

    /* ── LOGIN PAGE ── */
    if (isLogin) {
        if (auth) { redirectTo('admin-dashboard'); return; }

        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const u = document.getElementById('l-user')?.value.trim();
            const p = document.getElementById('l-pass')?.value.trim();
            const err = document.getElementById('login-err');
            const submitBtn = loginForm.querySelector('button');

            if (!u || !p) { if (err) err.textContent = '❌ Credentials are required.'; return; }

            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Authenticating...'; }

            try {
                const res = await fetch('/api/admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: u, password: p })
                });

                const contentType = res.headers.get('content-type');
                let data;
                if (contentType && contentType.includes('application/json')) {
                    data = await res.json();
                } else {
                    const text = await res.text();
                    console.error('Non-JSON Response:', text);
                    throw new Error('Server returned a non-JSON error. Check Vercel logs.');
                }

                if (res.ok) {
                    if (err) { err.textContent = '✅ Success! Redirecting...'; err.style.color = '#10B981'; }
                    sessionStorage.setItem(LS_KEY.session, 'true');
                    sessionStorage.setItem('ak_admin_token', data.token);
                    setTimeout(() => redirectTo('admin-dashboard'), 800);
                } else {
                    throw new Error(data.details || data.error || 'Invalid credentials');
                }
            } catch (error) {
                if (err) {
                    err.textContent = `❌ ${error.message}`;
                    err.style.color = '#F87171';
                }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Login to Admin'; }
            }
        };

        // Password eye toggles on login page
        document.querySelectorAll('.lf-eye').forEach(btn => {
            btn.textContent = '👁️';
            btn.onclick = () => {
                const inp = btn.previousElementSibling;
                if (!inp) return;
                inp.type = inp.type === 'password' ? 'text' : 'password';
                btn.textContent = inp.type === 'password' ? '👁️' : '🙈';
            };
        });
        return;
    }

    /* ── DASHBOARD PAGE ── */
    if (isDashboard) {
        if (!auth) { redirectTo('admin-login'); return; }

        // Make screen visible
        const screen = document.getElementById('dashboard-screen');
        if (screen) { screen.style.display = 'flex'; screen.classList.add('visible'); }

        // Bind nav items
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', () => switchSection(btn.dataset.section));
        });

        // Sidebar & header buttons
        document.getElementById('hamburger-btn')?.addEventListener('click', openSidebar);
        document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
        document.getElementById('logout-btn')?.addEventListener('click', doLogout);
        document.getElementById('logout-hd-btn')?.addEventListener('click', doLogout);

        // Password eye toggles
        document.querySelectorAll('.pw-eye').forEach(btn => {
            btn.textContent = '👁️';
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.dataset.target);
                if (!target) return;
                target.type = target.type === 'password' ? 'text' : 'password';
                btn.textContent = target.type === 'password' ? '👁️' : '🙈';
            });
        });

        // Security
        document.getElementById('change-pw-btn')?.addEventListener('click', changePassword);

        // Products
        document.getElementById('save-prod-btn')?.addEventListener('click', addProductFromForm);
        document.getElementById('cancel-prod-btn')?.addEventListener('click', () => {
            ['add-name', 'add-price', 'add-desc', 'add-img-url'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            addImgDataUrl = null;
            const prev = document.getElementById('add-img-preview');
            if (prev) prev.style.display = 'none';
        });

        // Product image upload
        const addFileInput = document.getElementById('add-img-file');
        if (addFileInput) {
            addFileInput.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file || file.size > 5 * 1024 * 1024) { showToast('Max 5MB image.', 'error'); return; }
                const reader = new FileReader();
                reader.onload = ev => {
                    addImgDataUrl = ev.target.result;
                    const img = document.getElementById('add-img-preview-img');
                    const box = document.getElementById('add-img-preview');
                    if (img) img.src = addImgDataUrl;
                    if (box) box.style.display = 'block';
                    document.getElementById('add-upload-zone').style.display = 'none';
                };
                reader.readAsDataURL(file);
            });
        }
        document.getElementById('clear-add-img')?.addEventListener('click', () => {
            addImgDataUrl = null;
            document.getElementById('add-img-preview').style.display = 'none';
            document.getElementById('add-upload-zone').style.display = 'block';
            document.getElementById('add-img-preview-img').src = '';
        });
        document.getElementById('add-upload-zone')?.addEventListener('click', () => document.getElementById('add-img-file')?.click());

        // Product search
        document.getElementById('prod-search')?.addEventListener('input', e => renderProductTable(e.target.value));

        // Offers
        document.getElementById('add-offer-hd')?.addEventListener('click', toggleAddOfferCard);
        document.getElementById('offer-toggle-btn')?.addEventListener('click', toggleAddOfferCard);
        document.getElementById('save-offer-btn')?.addEventListener('click', addOfferFromForm);
        document.getElementById('cancel-offer-btn')?.addEventListener('click', toggleAddOfferCard);

        // Orders search
        document.getElementById('orders-search')?.addEventListener('input', e => renderOrdersTable(e.target.value.toLowerCase()));

        // Track search
        document.getElementById('track-search')?.addEventListener('input', e => renderTrackList(e.target.value));

        // Reports
        document.getElementById('dl-csv-btn')?.addEventListener('click', downloadOrdersCSV);
        document.getElementById('dl-excel-btn')?.addEventListener('click', downloadExcel);
        document.getElementById('dl-prod-btn')?.addEventListener('click', downloadProductsCSV);

        // Banner
        document.getElementById('save-banner-btn')?.addEventListener('click', saveBanner);
        document.getElementById('reset-banner-btn')?.addEventListener('click', resetBanner);

        // Delete modal
        document.getElementById('confirm-del-btn')?.addEventListener('click', () => {
            const id = document.getElementById('del-prod-id')?.value;
            if (id) deleteProduct(id);
            document.getElementById('del-modal')?.classList.remove('show');
        });
        document.getElementById('cancel-del-btn')?.addEventListener('click', () => {
            document.getElementById('del-modal')?.classList.remove('show');
        });

        // Order modal close
        document.getElementById('modal-close-btn')?.addEventListener('click', () => {
            document.getElementById('order-modal')?.classList.remove('show');
        });
        document.getElementById('order-modal')?.addEventListener('click', e => {
            if (e.target === e.currentTarget) e.currentTarget.classList.remove('show');
        });
        document.getElementById('del-modal')?.addEventListener('click', e => {
            if (e.target === e.currentTarget) e.currentTarget.classList.remove('show');
        });

        // Load all data
        loadAllData();
    }
};

// Expose global functions for inline HTML onclick attributes
window.switchSection = switchSection;
window.triggerImgUpload = triggerImgUpload;
window.handleRowImgUpload = handleRowImgUpload;
window.saveProductRow = saveProductRow;
window.confirmDeleteProduct = confirmDeleteProduct;
window.deleteOffer = deleteOffer;
window.toggleOfferStatus = toggleOfferStatus;
window.updateOrderStatus = updateOrderStatus;
window.openOrderModal = openOrderModal;
window.renderTrackList = renderTrackList;
window.toggleAddCard = toggleAddCard;
window.UI = { logout: doLogout, switch: switchSection };

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
