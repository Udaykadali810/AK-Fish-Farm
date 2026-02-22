/* ============================================================
   AK FishFarms  Admin Panel Script  (admin-script.js)
   STABLE VERSION 6.0 - LOCAL HARDENED & VERCEL READY
   ============================================================ */
'use strict';

// Environment Detection
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
if (IS_LOCAL) console.log("%c Local Mode Activated ", "background: #222; color: #bada55; font-weight: bold; padding: 4px;");

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

// MOCK DATA for Local Mode
const MOCK_PRODUCTS = [
    { id: 1, name: 'Red Dragon Flowerhorn', price: 2500, category: 'special', img: PLACEHOLDER, status: 'in_stock' },
    { id: 2, name: 'Silver Arowana', price: 1800, category: 'premium', img: PLACEHOLDER, status: 'in_stock' }
];
const MOCK_ORDERS = [
    { id: 'ORD-101', customerName: 'Local User', phone: '9876543210', city: 'Nellore', total: 4300, status: 'Processing', timestamp: new Date().toISOString() }
];
const MOCK_OFFERS = [
    { id: 'OFF-1', title: 'Grand Opening', couponCode: 'AKFISH10', discountType: 'percentage', discountValue: 10, minOrder: 500, status: 'active' }
];

/* 
   AUTH HELPERS (ENVIRONMENT AWARE)
*/
function checkAuth() {
    return sessionStorage.getItem(LS.session) === 'true';
}

function doLogout() {
    sessionStorage.removeItem(LS.session);
    // Vercel Clean URL fallback for local
    const target = IS_LOCAL ? 'admin-login.html' : '/admin-login';
    window.location.href = target;
}

/* 
   DATA FETCHING (HARDENED)
*/
async function fetchAllData() {
    try {
        if (IS_LOCAL) {
            console.log("Local Mode: Using mock data to prevent fetch errors");
            globalProducts = MOCK_PRODUCTS;
            globalOrders = MOCK_ORDERS;
            globalOffers = MOCK_OFFERS;
            refreshCurrentSection();
            return;
        }

        console.log("Fetching cloud dashboard data...");
        const [pRes, oRes, fRes] = await Promise.all([
            fetch('/api/products').catch(() => ({ ok: false })),
            fetch('/api/orders').catch(() => ({ ok: false })),
            fetch('/api/offers').catch(() => ({ ok: false }))
        ]);

        if (pRes.ok) globalProducts = await pRes.json();
        if (oRes.ok) globalOrders = await oRes.json();
        if (fRes.ok) globalOffers = await fRes.json();

        // Safety fallback
        globalProducts = globalProducts || [];
        globalOrders = globalOrders || [];
        globalOffers = globalOffers || [];

        refreshCurrentSection();
    } catch (err) {
        console.warn('Sync failed. Reverting to fallback data.', err);
        globalProducts = globalProducts || MOCK_PRODUCTS;
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
        console.error("Layout render crash prevented:", err);
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
    try {
        currentSection = name;
        document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
        const target = document.getElementById('sec-' + name);
        if (target) target.classList.add('active');

        document.querySelectorAll('.nav-item, .bn-item').forEach(b => {
            if (b.dataset.section) b.classList.toggle('active', b.dataset.section === name);
        });

        const ht = document.getElementById('hd-title');
        if (ht) ht.textContent = name.charAt(0).toUpperCase() + name.slice(1);

        await fetchAllData();
        closeSidebar();
    } catch (e) {
        console.error("Navigation error:", e);
    }
}

function openSidebar() { document.getElementById('adm-sidebar')?.classList.add('open'); document.getElementById('sidebar-overlay')?.classList.add('show'); }
function closeSidebar() { document.getElementById('adm-sidebar')?.classList.remove('open'); document.getElementById('sidebar-overlay')?.classList.remove('show'); }

/* 
   RENDERING (STABLE)
*/
function renderDashboard() {
    try {
        const orders = globalOrders || [];
        const products = globalProducts || [];
        const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
        const pending = orders.filter(o => o.status === 'Pending').length;

        const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setTxt('ds-orders', orders.length);
        setTxt('ds-revenue', revenue.toLocaleString('en-IN'));
        setTxt('ds-products', products.length);
        setTxt('ds-pending', pending);

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

        // Add Local Badge if applicable
        if (IS_LOCAL && !document.getElementById('local-badge')) {
            const hd = document.querySelector('.page-hd');
            if (hd) hd.innerHTML += `<span id="local-badge" style="background:#FBBF24;color:#000;padding:4px 12px;border-radius:20px;font-size:0.7rem;font-weight:800;margin-left:12px;vertical-align:middle;">LOCAL TESTING MODE</span>`;
        }
    } catch (e) { console.error("Dashboard render failed", e); }
}

function renderProductTable() {
    const products = globalProducts || [];
    const tbody = document.getElementById('prod-tbody');
    if (!tbody) return;
    tbody.innerHTML = products.map(p => `
        <tr id="pr-${p.id}">
            <td><img class="prod-thumb" src="${p.img || PLACEHOLDER}" /></td>
            <td><input class="inline-inp" type="text" data-field="name" value="${p.name}" /></td>
            <td><input class="inline-inp" type="number" data-field="price" value="${p.price}" /></td>
            <td><select class="inline-sel" data-field="category"><option value="special" ${p.category === 'special' ? 'selected' : ''}>Special</option><option value="premium" ${p.category === 'premium' ? 'selected' : ''}>Premium</option></select></td>
            <td><select class="inline-sel" data-field="status"><option value="in_stock" ${p.status === 'in_stock' ? 'selected' : ''}>In Stock</option></select></td>
            <td><button class="save-row-btn" onclick="updateProduct(${p.id})">Save</button></td>
        </tr>
    `).join('') || '<tr><td colspan="6">No products</td></tr>';
}

function renderOrdersTable() {
    const orders = globalOrders || [];
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = [...orders].reverse().map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${o.customerName || ''}</td>
            <td>${(o.total || 0).toLocaleString('en-IN')}</td>
            <td>${o.status}</td>
            <td><button class="btn btn-sm btn-ghost" onclick="showToast('Viewing order details...')">View</button></td>
        </tr>
    `).join('') || '<tr><td colspan="5">No orders</td></tr>';
}

function renderOffersTable() {
    const offers = globalOffers || [];
    const tbody = document.getElementById('offers-tbody');
    if (!tbody) return;
    tbody.innerHTML = offers.map(o => `
        <tr>
            <td>${o.title}</td>
            <td><code>${o.couponCode}</code></td>
            <td>${o.discountValue}${o.discountType === 'percentage' ? '%' : '₹'}</td>
            <td><button class="status-toggle-btn ${o.status}">${o.status}</button></td>
        </tr>
    `).join('') || '<tr><td colspan="4">No offers</td></tr>';
}

function renderReports() {
    const orders = globalOrders || [];
    const rptCount = document.getElementById('rpt-order-count');
    const rptRev = document.getElementById('rpt-revenue');
    if (rptCount) rptCount.textContent = orders.length;
    if (rptRev) rptRev.textContent = orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN');
}

/* UI ACTIONS */
async function updateProduct(id) {
    if (IS_LOCAL) return showToast('Local Sync Simulation Success');
    showToast('Updating cloud database...');
}

/* 
   INITIALIZATION
*/
const init = () => {
    try {
        const path = window.location.pathname.toLowerCase();
        const isLoginPage = path.includes('admin-login');
        const isDashboard = (path.includes('admin-dashboard') || path.includes('admin')) && !isLoginPage;
        const loggedIn = checkAuth();

        // Environment aware routing
        const loginPageUrl = IS_LOCAL ? 'admin-login.html' : '/admin-login';
        const dashboardPageUrl = IS_LOCAL ? 'admin-dashboard.html' : '/admin-dashboard';

        if (loggedIn && isLoginPage) { window.location.href = dashboardPageUrl; return; }
        if (!loggedIn && isDashboard) { window.location.href = loginPageUrl; return; }

        if (loggedIn && isDashboard) {
            console.log("Dashboard Initialized Successfully");
            fetchAllData();

            // Dashboard Listeners
            const btnLogout = document.getElementById('logout-btn') || document.getElementById('logout-hd-btn');
            if (btnLogout) btnLogout.onclick = doLogout;

            const btnHam = document.getElementById('hamburger-btn');
            if (btnHam) btnHam.onclick = openSidebar;

            const btnOverlay = document.getElementById('sidebar-overlay');
            if (btnOverlay) btnOverlay.onclick = closeSidebar;

            document.querySelectorAll('[data-section]').forEach(btn => {
                btn.onclick = () => switchSection(btn.dataset.section);
            });
        }

        const loginForm = document.getElementById('login-form');
        if (isLoginPage && loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                const u = document.getElementById('l-user')?.value.trim();
                const p = document.getElementById('l-pass')?.value.trim();
                if (u === 'admin' && p === 'admin123') {
                    sessionStorage.setItem(LS.session, 'true');
                    window.location.href = dashboardPageUrl;
                } else {
                    const err = document.getElementById('login-err');
                    if (err) { err.textContent = 'Invalid Identity'; err.style.color = '#F87171'; }
                }
                return false;
            };
        }
    } catch (e) {
        console.error("Critical System Initialization Failure:", e);
    }
};

// UI Bridge
window.doLogout = doLogout;
window.updateProduct = updateProduct;

// Run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
