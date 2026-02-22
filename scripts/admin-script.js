/* ============================================================
   AK FishFarms  Admin Panel Script  (admin-script.js)
   STABLE VERSION 5.0 - LOCAL & VERCEL READY (AUTO-DETECT)
   ============================================================ */
'use strict';

console.log("Admin Script Loaded");

const LS = {
    session: 'akfish_admin_logged_in'
};

// Global Data Holders
let globalProducts = [];
let globalOrders = [];
let globalOffers = [];

const PLACEHOLDER = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';
const STATUS_LIST = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_CLS = { 'Pending': 'sb-pending', 'Processing': 'sb-processing', 'Out for Delivery': 'sb-out', 'Delivered': 'sb-delivered', 'Cancelled': 'sb-cancelled' };

let currentSection = 'dashboard';
let addImgData = '';

/* 
   AUTH HELPERS (LOCAL SAFE)
*/
function checkAuth() {
    return sessionStorage.getItem(LS.session) === 'true';
}

function doLogout() {
    sessionStorage.removeItem(LS.session);
    // Local safe redirect
    window.location.href = 'admin-login.html';
}

/* 
   DATA FETCHING (LOCAL FALLBACK)
*/
async function fetchAllData() {
    try {
        console.log("Fetching dashboard data...");
        const [pRes, oRes, fRes] = await Promise.all([
            fetch('/api/products').catch(() => ({ ok: false })),
            fetch('/api/orders').catch(() => ({ ok: false })),
            fetch('/api/offers').catch(() => ({ ok: false }))
        ]);

        if (pRes.ok) globalProducts = await pRes.json();
        if (oRes.ok) globalOrders = await oRes.json();
        if (fRes.ok) globalOffers = await fRes.json();

        // If no data (local testing without API), use empty arrays to prevent crash
        globalProducts = globalProducts || [];
        globalOrders = globalOrders || [];
        globalOffers = globalOffers || [];

        refreshCurrentSection();
    } catch (err) {
        console.warn('Backend connection unavailable. Running in offline/local mode.', err);
        refreshCurrentSection();
    }
}

function refreshCurrentSection() {
    try {
        if (currentSection === 'dashboard') renderDashboard();
        if (currentSection === 'products') renderProductTable();
        if (currentSection === 'orders') renderOrdersTable();
        if (currentSection === 'offers') renderOffersTable();
        if (currentSection === 'reports') renderReports();
    } catch (err) {
        console.error("Section render error:", err);
    }
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

    document.querySelectorAll('.nav-item, .bn-item').forEach(b => {
        if (b.dataset.section) {
            b.classList.toggle('active', b.dataset.section === name);
        }
    });

    const ht = document.getElementById('hd-title');
    if (ht) ht.textContent = name.charAt(0).toUpperCase() + name.slice(1);

    await fetchAllData();
    closeSidebar();
}

function openSidebar() { document.getElementById('adm-sidebar')?.classList.add('open'); document.getElementById('sidebar-overlay')?.classList.add('show'); }
function closeSidebar() { document.getElementById('adm-sidebar')?.classList.remove('open'); document.getElementById('sidebar-overlay')?.classList.remove('show'); }

/* 
   RENDERING LOGIC (STABILIZED)
*/
function renderDashboard() {
    const orders = globalOrders || [];
    const products = globalProducts || [];
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'Pending').length;

    const elO = document.getElementById('ds-orders');
    const elR = document.getElementById('ds-revenue');
    const elP = document.getElementById('ds-products');
    const elPe = document.getElementById('ds-pending');

    if (elO) elO.textContent = orders.length;
    if (elR) elR.textContent = revenue.toLocaleString('en-IN');
    if (elP) elP.textContent = products.length;
    if (elPe) elPe.textContent = pending;

    const tbody = document.getElementById('dash-orders-tbody');
    if (tbody) {
        const recent = [...orders].reverse().slice(0, 5);
        tbody.innerHTML = recent.map(o => `
            <tr>
                <td style="font-weight:800;color:#00D4FF;">${o.id || 'N/A'}</td>
                <td>${o.customerName || o.name || 'Anonymous'}</td>
                <td><strong>${(o.total || 0).toLocaleString('en-IN')}</strong></td>
                <td><span class="sbadge ${STATUS_CLS[o.status] || 'sb-pending'}">${o.status || 'Pending'}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="tbl-empty">No orders found</td></tr>';
    }
}

function renderProductTable() {
    const products = globalProducts || [];
    const tbody = document.getElementById('prod-tbody');
    if (!tbody) return;

    const count = document.getElementById('prod-count');
    if (count) count.textContent = products.length;

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
    `).join('') || '<tr><td colspan="8" class="tbl-empty">No products yet</td></tr>';
}

function renderOrdersTable() {
    const orders = globalOrders || [];
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;

    const count = document.getElementById('orders-count');
    if (count) count.textContent = orders.length;

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
    `).join('') || '<tr><td colspan="8" class="tbl-empty">No orders found</td></tr>';
}

function renderOffersTable() {
    const offers = globalOffers || [];
    const tbody = document.getElementById('offers-tbody');
    if (!tbody) return;

    const count = document.getElementById('off-count');
    if (count) count.textContent = offers.length;

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
    `).join('') || '<tr><td colspan="7" class="tbl-empty">No offers found</td></tr>';
}

function renderReports() {
    const orders = globalOrders || [];
    const rptCount = document.getElementById('rpt-order-count');
    const rptRev = document.getElementById('rpt-revenue');
    if (rptCount) rptCount.textContent = orders.length;
    if (rptRev) rptRev.textContent = orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN');
}

/* API CRUD (LOCAL SAFE) */
async function updateProduct(id) {
    try {
        const row = document.getElementById('pr-' + id);
        const updates = {
            name: row.querySelector('[data-field="name"]').value,
            price: parseFloat(row.querySelector('[data-field="price"]').value),
            category: row.querySelector('[data-field="category"]').value,
            status: row.querySelector('[data-field="status"]').value,
        };
        await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates })
        });
        showToast('Sync attempted'); fetchAllData();
    } catch (e) { showToast('Local update only - Server busy', 'info'); }
}

async function addProduct() {
    try {
        const name = document.getElementById('add-name').value;
        const price = parseFloat(document.getElementById('add-price').value);
        const category = document.getElementById('add-cat').value;
        if (!name || isNaN(price)) return showToast('Invalid inputs', 'error');

        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, category, img: PLACEHOLDER, status: 'in_stock' })
        });
        showToast('Adding...'); fetchAllData(); resetAddForm();
    } catch (e) { showToast('Add failed - Local environment', 'error'); }
}

function resetAddForm() {
    const n = document.getElementById('add-name');
    const p = document.getElementById('add-price');
    if (n) n.value = '';
    if (p) p.value = '';
}

async function deleteProduct(id) {
    if (confirm('Delete?')) {
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' }).catch(() => { });
        fetchAllData();
    }
}

async function handleRowImageUpload(input, id) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = e.target.result;
        await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, img })
        }).catch(() => { });
        showToast('Upload triggered'); fetchAllData();
    };
    reader.readAsDataURL(file);
}

/* 
   INITIALIZATION LOOP (LOCAL COMPATIBLE)
*/
const init = () => {
    try {
        const path = window.location.pathname.toLowerCase();
        // LOCAL SAFE DETECTION
        const isLoginPage = path.includes('admin-login');
        const isDashboard = (path.includes('admin-dashboard') || path.includes('admin')) && !isLoginPage;

        const loggedIn = checkAuth();
        console.log("Admin Init - Path:", path, "Logged In:", loggedIn);

        // 1. ROUTING GUARDS
        if (loggedIn && isLoginPage) {
            window.location.href = 'admin-dashboard.html';
            return;
        }
        if (!loggedIn && isDashboard) {
            window.location.href = 'admin-login.html';
            return;
        }

        // 2. DASHBOARD SETUP
        if (loggedIn && isDashboard) {
            console.log("Initializing Dashboard Components...");
            const mainContent = document.querySelector('main');
            if (mainContent) mainContent.style.opacity = '1';

            fetchAllData();

            // Bind Events
            const btnLogout = document.getElementById('logout-btn') || document.getElementById('logout-hd-btn');
            if (btnLogout) btnLogout.onclick = doLogout;

            const btnHam = document.getElementById('hamburger-btn');
            if (btnHam) btnHam.onclick = openSidebar;

            const btnOverlay = document.getElementById('sidebar-overlay');
            if (btnOverlay) btnOverlay.onclick = closeSidebar;

            document.getElementById('save-prod-btn')?.addEventListener('click', addProduct);

            document.querySelectorAll('[data-section]').forEach(btn => {
                btn.onclick = () => switchSection(btn.dataset.section);
            });

            console.log("Dashboard Initialized.");
        }

        // 3. LOGIN SETUP
        const loginForm = document.getElementById('login-form');
        if (isLoginPage && loginForm) {
            console.log("Login Form Active.");
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const errEl = document.getElementById('login-err');
                if (errEl) {
                    errEl.textContent = 'Verifying...';
                    errEl.style.color = '#00D4FF';
                }

                const u = document.getElementById('l-user')?.value.trim();
                const p = document.getElementById('l-pass')?.value.trim();

                if (u === 'admin' && p === 'admin123') {
                    console.log("Login Success");
                    sessionStorage.setItem(LS.session, 'true');
                    window.location.href = 'admin-dashboard.html';
                } else {
                    console.warn("Login Failed");
                    if (errEl) {
                        errEl.textContent = 'Incorrect Credentials';
                        errEl.style.color = '#F87171';
                    }
                }
                return false;
            };
        }
    } catch (criticalErr) {
        console.error("CRITICAL SCRIPT ERROR:", criticalErr);
        const root = document.getElementById('login-err') || document.body;
        if (root) root.innerHTML += `<div style="color:red;padding:20px;">System Error: Check Console</div>`;
    }
};

// Global Exposure
window.switchSection = switchSection;
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.handleRowImageUpload = handleRowImageUpload;
window.doLogout = doLogout;

// Run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
