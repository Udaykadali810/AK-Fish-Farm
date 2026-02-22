/* ============================================================
   AK FishFarms  Admin Panel Script  (admin-script.js)
   Backend: Vercel Serverless API
   ============================================================ */
'use strict';

const LS = {
    creds: 'ak_admin_creds',
    session: 'ak_admin_session',
};

let globalProducts = [];
let globalOrders = [];
let globalOffers = [];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';
const STATUS_LIST = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_CLS = { 'Pending': 'sb-pending', 'Processing': 'sb-processing', 'Out for Delivery': 'sb-out', 'Delivered': 'sb-delivered', 'Cancelled': 'sb-cancelled' };

let currentSection = 'dashboard';
let addImgData = '';

/* 
   DATA HELPERS
*/
const getProducts = () => globalProducts;
const getOrders = () => globalOrders;
const getCreds = () => {
    try { return JSON.parse(localStorage.getItem(LS.creds)); } catch { return null; }
};
const getDefaultCreds = () => ({ username: 'admin', password: 'admin123' });

async function fetchAllData() {
    try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) globalProducts = await prodRes.json();

        const orderRes = await fetch('/api/orders');
        if (orderRes.ok) globalOrders = await orderRes.json();

        const offerRes = await fetch('/api/offers');
        if (offerRes.ok) globalOffers = await offerRes.json();

        refreshCurrentSection();
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

function refreshCurrentSection() {
    if (currentSection === 'dashboard') renderDashboard();
    if (currentSection === 'products') renderProductTable();
    if (currentSection === 'orders') renderOrdersTable();
    if (currentSection === 'offers') renderOffersTable();
    if (currentSection === 'reports') renderReports();
    if (currentSection === 'track') renderTrackList();
}

function showToast(msg, type = 'success') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span></span><span class="toast-msg">${msg}</span>`;
    root.appendChild(t);
    setTimeout(() => { t.style.animation = 'toastOut .35s ease forwards'; setTimeout(() => t.remove(), 370); }, 3200);
}

function checkAuth() {
    return sessionStorage.getItem(LS.session) === '1';
}

function doLogout() {
    sessionStorage.removeItem(LS.session);
    window.location.href = 'admin-login.html';
}

/* 
   NAVIGATION
*/
async function switchSection(name) {
    currentSection = name;
    document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + name)?.classList.add('active');
    document.querySelectorAll('.nav-item[data-section], .bn-item[data-section]').forEach(b => {
        b.classList.toggle('active', b.dataset.section === name);
    });
    const ht = document.getElementById('hd-title');
    if (ht) ht.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    await fetchAllData();
    closeSidebar();
}

function openSidebar() { document.getElementById('adm-sidebar')?.classList.add('open'); document.getElementById('sidebar-overlay')?.classList.add('show'); }
function closeSidebar() { document.getElementById('adm-sidebar')?.classList.remove('open'); document.getElementById('sidebar-overlay')?.classList.remove('show'); }

/* 
   DASHBOARD
*/
function renderDashboard() {
    const orders = getOrders();
    const products = getProducts();
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'Pending').length;

    document.getElementById('ds-orders').textContent = orders.length;
    document.getElementById('ds-revenue').textContent = revenue.toLocaleString('en-IN');
    document.getElementById('ds-products').textContent = products.length;
    document.getElementById('ds-pending').textContent = pending;

    const tbody = document.getElementById('dash-orders-tbody');
    if (tbody) {
        const recent = [...orders].reverse().slice(0, 5);
        tbody.innerHTML = recent.map(o => `
            <tr>
                <td style="font-weight:800;color:#00D4FF;">${o.id}</td>
                <td>${o.customerName || o.name || ''}</td>
                <td><strong>${(o.total || 0).toLocaleString('en-IN')}</strong></td>
                <td><span class="sbadge ${STATUS_CLS[o.status] || 'sb-pending'}">${o.status || 'Pending'}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="tbl-empty">No orders yet</td></tr>';
    }
}

/* 
   PRODUCTS 
*/
function renderProductTable() {
    const products = getProducts();
    const tbody = document.getElementById('prod-tbody');
    if (!tbody) return;

    document.getElementById('prod-count').textContent = products.length;

    tbody.innerHTML = products.map(p => `
        <tr id="pr-${p.id}">
            <td><img class="prod-thumb" src="${p.img || PLACEHOLDER}" /></td>
            <td><input class="inline-inp" type="text" data-field="name" value="${p.name}" /></td>
            <td><input class="inline-inp" type="number" data-field="price" value="${p.price}" /></td>
            <td>
                <select class="inline-sel" data-field="category">
                    <option value="special" ${p.category === 'special' ? 'selected' : ''}>Special</option>
                    <option value="premium" ${p.category === 'premium' ? 'selected' : ''}>Premium</option>
                    <option value="guppy"   ${p.category === 'guppy' ? 'selected' : ''}>Guppy</option>
                </select>
            </td>
            <td>
                <select class="inline-sel" data-field="status">
                    <option value="in_stock" ${p.status === 'in_stock' ? 'selected' : ''}>In Stock</option>
                    <option value="out_stock" ${p.status === 'out_stock' ? 'selected' : ''}>Out of Stock</option>
                </select>
            </td>
            <td>
                <label class="btn btn-sm btn-ghost">
                    Upload <input type="file" style="display:none" onchange="handleRowImageUpload(this, ${p.id})">
                </label>
            </td>
            <td><button class="save-row-btn" onclick="updateProduct(${p.id})">Save</button></td>
            <td><button class="del-row-btn" onclick="deleteProduct(${p.id})">Delete</button></td>
        </tr>
    `).join('') || '<tr><td colspan="8">No products found</td></tr>';
}

async function handleRowImageUpload(input, id) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = e.target.result;
        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, img })
            });
            if (res.ok) {
                showToast('Image updated successfully');
                fetchAllData();
            }
        } catch (err) {
            showToast('Upload failed', 'error');
        }
    };
    reader.readAsDataURL(file);
}

async function updateProduct(id) {
    const row = document.getElementById('pr-' + id);
    const updates = {
        name: row.querySelector('[data-field="name"]').value,
        price: parseFloat(row.querySelector('[data-field="price"]').value),
        category: row.querySelector('[data-field="category"]').value,
        status: row.querySelector('[data-field="status"]').value,
    };
    const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
    });
    if (res.ok) { showToast('Updated'); fetchAllData(); }
}

async function addProduct() {
    const name = document.getElementById('add-name').value;
    const price = parseFloat(document.getElementById('add-price').value);
    const category = document.getElementById('add-cat').value;
    const img = addImgData || PLACEHOLDER;
    const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, category, img, status: 'in_stock' })
    });
    if (res.ok) { showToast('Added'); fetchAllData(); resetAddForm(); }
}

function resetAddForm() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-price').value = '';
    addImgData = '';
    document.getElementById('add-img-preview').classList.remove('show');
}

async function deleteProduct(id) {
    if (confirm('Delete?')) {
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        fetchAllData();
    }
}

/* 
   ORDERS
*/
function renderOrdersTable() {
    const orders = getOrders();
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    document.getElementById('orders-count').textContent = orders.length;

    tbody.innerHTML = [...orders].reverse().map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${o.customerName || ''}</td>
            <td>${o.phone || ''}</td>
            <td>${o.city || ''}</td>
            <td>${(o.total || 0).toLocaleString('en-IN')}</td>
            <td>${fmtDate(o.timestamp)}</td>
            <td>
                <select onchange="updateOrderStatus('${o.id}', this.value)">
                    ${STATUS_LIST.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </td>
            <td><button onclick="viewOrder('${o.id}')">View</button></td>
        </tr>
    `).join('') || '<tr><td colspan="8">No orders</td></tr>';
}

async function updateOrderStatus(id, status) {
    try {
        const res = await fetch('/api/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
        if (res.ok) {
            showToast(`Order ${id} set to ${status}`);
            fetchAllData();
        } else {
            showToast('Update failed', 'error');
        }
    } catch (err) {
        showToast('Sync error', 'error');
    }
}

/* 
   OFFERS & COUPONS
*/
function renderOffersTable() {
    const offers = globalOffers;
    const tbody = document.getElementById('offers-tbody');
    if (!tbody) return;

    document.getElementById('off-count').textContent = offers.length;

    tbody.innerHTML = offers.map(o => `
        <tr id="off-row-${o.id}">
            <td><input class="inline-inp" type="text" data-field="title" value="${o.title}" style="font-weight:700;" /></td>
            <td><code class="code-badge">${o.couponCode}</code></td>
            <td><input class="inline-inp" type="number" data-field="val" value="${o.discountValue}" style="width:60px;" /></td>
            <td><input class="inline-inp" type="number" data-field="min" value="${o.minOrder || 0}" style="width:80px;" /></td>
            <td><input class="inline-inp" type="date"   data-field="exp" value="${o.expiryDate || ''}" /></td>
            <td>
                <button class="status-toggle-btn ${o.status}" onclick="toggleOfferStatus('${o.id}')">
                    ${o.status === 'active' ? 'Active' : 'Inactive'}
                </button>
            </td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="save-row-btn" onclick="updateOffer('${o.id}')">Save</button>
                    <button class="del-row-btn" onclick="deleteOffer('${o.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="tbl-empty">No offers found</td></tr>';
}

async function updateOffer(id) {
    const row = document.getElementById('off-row-' + id);
    const updates = {
        title: row.querySelector('[data-field="title"]').value.trim(),
        discountValue: parseFloat(row.querySelector('[data-field="val"]').value),
        minOrder: parseFloat(row.querySelector('[data-field="min"]').value) || 0,
        expiryDate: row.querySelector('[data-field="exp"]').value
    };

    if (!updates.title || isNaN(updates.discountValue)) {
        showToast('Invalid inputs', 'error');
        return;
    }

    const res = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
    });

    if (res.ok) {
        showToast('Offer updated');
        fetchAllData();
    }
}

async function addOffer() {
    const title = document.getElementById('off-title').value.trim();
    const couponCode = document.getElementById('off-code').value.trim().toUpperCase();
    const discountType = document.getElementById('off-type').value;
    const discountValue = parseFloat(document.getElementById('off-val').value);
    const minOrder = parseFloat(document.getElementById('off-min').value) || 0;
    const expiryDate = document.getElementById('off-expiry').value;
    const bannerText = document.getElementById('off-banner').value.trim();

    if (!title || !couponCode || isNaN(discountValue)) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title, couponCode, discountType, discountValue,
            minOrder, expiryDate, bannerText, status: 'active'
        })
    });

    if (res.ok) {
        showToast('Offer added successfully');
        resetOfferForm();
        fetchAllData();
    }
}

async function toggleOfferStatus(id) {
    const offer = globalOffers.find(o => o.id === id);
    if (!offer) return;
    const newStatus = offer.status === 'active' ? 'inactive' : 'active';
    const res = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
    });
    if (res.ok) {
        showToast(`Offer set to ${newStatus}`);
        fetchAllData();
    }
}

async function deleteOffer(id) {
    if (confirm('Delete this offer?')) {
        const res = await fetch(`/api/offers?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Offer deleted');
            fetchAllData();
        }
    }
}

function resetOfferForm() {
    document.getElementById('off-title').value = '';
    document.getElementById('off-code').value = '';
    document.getElementById('off-val').value = '';
    document.getElementById('off-min').value = '';
    document.getElementById('off-expiry').value = '';
    document.getElementById('off-banner').value = '';
}

function toggleAddOfferCard() {
    const body = document.getElementById('add-offer-body');
    const btn = document.getElementById('offer-toggle-btn');
    if (body.style.display === 'none') {
        body.style.display = 'block';
        btn.textContent = 'Collapse';
    } else {
        body.style.display = 'none';
        btn.textContent = 'Expand';
    }
}

/* 
   REPORTS
*/
function renderReports() {
    const orders = getOrders();
    document.getElementById('rpt-order-count').textContent = orders.length;
    document.getElementById('rpt-revenue').textContent = orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN');
}

/* 
   MISC
*/
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : ''; }
function closeSidebar() { document.getElementById('adm-sidebar')?.classList.remove('open'); }

// Consolidated Initialization
const init = () => {
    const isLoginPage = window.location.pathname.includes('admin-login.html');

    if (!checkAuth() && !isLoginPage) {
        window.location.href = 'admin-login.html';
        return;
    }

    if (!isLoginPage) {
        fetchAllData();
    }

    // Bind event listeners
    document.getElementById('save-prod-btn')?.addEventListener('click', addProduct);
    document.getElementById('save-offer-btn')?.addEventListener('click', addOffer);
    document.getElementById('logout-btn')?.addEventListener('click', doLogout);
    document.getElementById('logout-hd-btn')?.addEventListener('click', doLogout);
    document.getElementById('hamburger-btn')?.addEventListener('click', openSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

    document.querySelectorAll('[data-section]').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errEl = document.getElementById('login-err');
            if (errEl) errEl.textContent = 'Authenticating...';

            const username = document.getElementById('l-user')?.value.trim();
            const password = document.getElementById('l-pass')?.value.trim();

            if (!username || !password) {
                if (errEl) errEl.textContent = 'Please enter both fields';
                return;
            }

            try {
                const res = await fetch('/api/admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (res.ok) {
                    sessionStorage.setItem(LS.session, '1');
                    window.location.href = 'admin-dashboard.html';
                } else {
                    const data = await res.json();
                    if (errEl) errEl.textContent = data.error || 'Invalid credentials';
                }
            } catch (err) {
                if (errEl) errEl.textContent = 'Server connection failed. Try again.';
            }
        });
    }
};

// Run init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.switchSection = switchSection;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.updateOrderStatus = updateOrderStatus;
window.handleRowImageUpload = handleRowImageUpload;
window.toggleAddOfferCard = toggleAddOfferCard;
window.toggleOfferStatus = toggleOfferStatus;
window.updateOffer = updateOffer;
window.deleteOffer = deleteOffer;
