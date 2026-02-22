/* ============================================================
   AK FishFarms  Admin Panel Script  (admin-script.js)
   STABLE VERSION 4.0 - NO API DELAYS - VERCEL CLEAN URL READY
   ============================================================ */
'use strict';

console.log("Admin Login script loaded");

const LS = {
    session: 'akfish_admin_logged_in'
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
   AUTH HELPERS
*/
function checkAuth() {
    return sessionStorage.getItem(LS.session) === 'true';
}

function doLogout() {
    sessionStorage.removeItem(LS.session);
    window.location.href = 'admin-login';
}

/* 
   DATA FETCHING (DASHBOARD ONLY)
*/
async function fetchAllData() {
    try {
        const [pRes, oRes, fRes] = await Promise.all([
            fetch('/api/products'),
            fetch('/api/orders'),
            fetch('/api/offers')
        ]);
        if (pRes.ok) globalProducts = await pRes.json();
        if (oRes.ok) globalOrders = await oRes.json();
        if (fRes.ok) globalOffers = await fRes.json();
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
    setTimeout(() => {
        t.style.animation = 'toastOut .35s ease forwards';
        setTimeout(() => t.remove(), 370);
    }, 3200);
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
   DASHBOARD / TABLES (OMITTED FOR BREVITY BUT KEPT IN FINAL FILE)
*/
function renderDashboard() {
    const orders = globalOrders;
    const products = globalProducts;
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

function renderProductTable() {
    const products = globalProducts;
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

/* API CRUD FUNCTIONS */
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

function renderOrdersTable() {
    const orders = globalOrders;
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
            <td>${o.timestamp ? new Date(o.timestamp).toLocaleDateString() : ''}</td>
            <td>
                <select onchange="updateOrderStatus('${o.id}', this.value)">
                    ${STATUS_LIST.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </td>
            <td><button class="btn btn-sm btn-ghost" onclick="viewOrder('${o.id}')">View</button></td>
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
        }
    } catch (err) {
        showToast('Update failed', 'error');
    }
}

function renderOffersTable() {
    const offers = globalOffers;
    const tbody = document.getElementById('offers-tbody');
    if (!tbody) return;
    document.getElementById('off-count').textContent = offers.length;
    tbody.innerHTML = offers.map(o => `
        <tr id="off-row-${o.id}">
            <td><input class="inline-inp" type="text" data-field="title" value="${o.title}" /></td>
            <td><code class="code-badge">${o.couponCode}</code></td>
            <td><input class="inline-inp" type="number" data-field="val" value="${o.discountValue}" /></td>
            <td><input class="inline-inp" type="number" data-field="min" value="${o.minOrder || 0}" /></td>
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
    `).join('') || '<tr><td colspan="7">No offers found</td></tr>';
}

async function updateOffer(id) {
    const row = document.getElementById('off-row-' + id);
    const updates = {
        title: row.querySelector('[data-field="title"]').value.trim(),
        discountValue: parseFloat(row.querySelector('[data-field="val"]').value),
        minOrder: parseFloat(row.querySelector('[data-field="min"]').value) || 0,
        expiryDate: row.querySelector('[data-field="exp"]').value
    };
    const res = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
    });
    if (res.ok) { showToast('Offer updated'); fetchAllData(); }
}

async function addOffer() {
    const title = document.getElementById('off-title').value.trim();
    const couponCode = document.getElementById('off-code').value.trim().toUpperCase();
    const discountType = document.getElementById('off-type').value;
    const discountValue = parseFloat(document.getElementById('off-val').value);
    const minOrder = parseFloat(document.getElementById('off-min').value) || 0;
    const expiryDate = document.getElementById('off-expiry').value;
    const bannerText = document.getElementById('off-banner').value.trim();
    if (!title || !couponCode) return showToast('Fill all fields', 'error');

    const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title, couponCode, discountType, discountValue,
            minOrder, expiryDate, bannerText, status: 'active'
        })
    });
    if (res.ok) { showToast('Added'); fetchAllData(); resetOfferForm(); }
}

function resetOfferForm() {
    document.getElementById('off-title').value = '';
    document.getElementById('off-code').value = '';
    document.getElementById('off-val').value = '';
    document.getElementById('off-min').value = '';
}

function toggleOfferStatus(id) {
    const off = globalOffers.find(o => o.id === id);
    if (!off) return;
    const newStatus = off.status === 'active' ? 'inactive' : 'active';
    fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
    }).then(() => fetchAllData());
}

function deleteOffer(id) {
    if (confirm('Delete?')) {
        fetch(`/api/offers?id=${id}`, { method: 'DELETE' }).then(() => fetchAllData());
    }
}

function renderReports() {
    const orders = globalOrders;
    document.getElementById('rpt-order-count').textContent = orders.length;
    document.getElementById('rpt-revenue').textContent = orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN');
}

function toggleAddOfferCard() {
    const body = document.getElementById('add-offer-body');
    const btn = document.getElementById('offer-toggle-btn');
    if (!body || !btn) return;
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? 'Collapse' : 'Expand';
}

/* 
   INITIALIZATION & AUTH LOOP
*/
const init = () => {
    const path = window.location.pathname.toLowerCase();
    const isLoginPage = path.includes('admin-login');
    const isDashboard = (path.includes('admin-dashboard') || path.includes('admin')) && !isLoginPage;

    const loggedIn = checkAuth();
    console.log("Current path:", path, "Logged in:", loggedIn);

    // 1. Redirect Rules
    if (loggedIn && isLoginPage) {
        console.log("Redirecting logged in user to dashboard");
        window.location.href = '/admin-dashboard';
        return;
    }
    if (!loggedIn && isDashboard) {
        console.log("Redirecting unauthorized user to login");
        window.location.href = '/admin-login';
        return;
    }

    // 2. Login Page Logic
    const loginForm = document.getElementById('login-form');
    if (isLoginPage && loginForm) {
        console.log("Login form detected and ready");

        // Ensure absolutely no other listeners exist by clearing onsubmit if any
        loginForm.onsubmit = async (e) => {
            console.log("Login submission intercepted");
            e.preventDefault();
            e.stopPropagation();

            const errEl = document.getElementById('login-err');
            if (errEl) errEl.textContent = 'Verifying...';

            const u = document.getElementById('l-user')?.value.trim();
            const p = document.getElementById('l-pass')?.value.trim();

            console.log("Attempting login with:", u);

            if (u === 'admin' && p === 'admin123') {
                console.log("Authentication success");
                sessionStorage.setItem(LS.session, 'true');
                if (errEl) errEl.textContent = 'Identity Verified! Redirecting...';

                // Immediate redirect
                window.location.href = '/admin-dashboard';
                return false;
            } else {
                console.log("Authentication failed");
                if (errEl) {
                    errEl.textContent = 'Invalid Identity - Access Denied';
                    errEl.style.color = '#F87171';
                }
                return false;
            }
        };
    }

    // 3. Dashboard Logic
    if (loggedIn && isDashboard) {
        console.log("Initializing Admin Dashboard data");
        fetchAllData();

        // Bind global components
        const bLogout = document.getElementById('logout-btn') || document.getElementById('logout-hd-btn');
        if (bLogout) bLogout.onclick = doLogout;

        const bHam = document.getElementById('hamburger-btn');
        if (bHam) bHam.onclick = openSidebar;

        const bOverlay = document.getElementById('sidebar-overlay');
        if (bOverlay) bOverlay.onclick = closeSidebar;

        document.getElementById('save-prod-btn')?.addEventListener('click', addProduct);
        document.getElementById('save-offer-btn')?.addEventListener('click', addOffer);

        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', () => switchSection(btn.dataset.section));
        });
    }
};

// Final execution entry
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Ensure global accessibility for inline HTML handlers
window.switchSection = switchSection;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.handleRowImageUpload = handleRowImageUpload;
window.toggleAddOfferCard = toggleAddOfferCard;
window.toggleOfferStatus = toggleOfferStatus;
window.updateOffer = updateOffer;
window.deleteOffer = deleteOffer;
window.doLogout = doLogout;
