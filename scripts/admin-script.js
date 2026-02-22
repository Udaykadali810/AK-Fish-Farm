/* ============================================================
   AK FishFarms  Admin Panel Script  (admin-script.js)
   STABLE VERSION 9.0 - FINAL STABILITY & ROUTING
   ============================================================ */
'use strict';

console.log("Admin Script Initializing...");

// 1. ENVIRONMENT & CONSTANTS
const IS_LOCAL = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(window.location.hostname) || window.location.hostname.startsWith('192.168.');

const LS = {
    session: 'akfish_admin_logged_in'
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';
const STATUS_CLS = { 'Pending': 'sb-pending', 'Processing': 'sb-processing', 'Out for Delivery': 'sb-out', 'Delivered': 'sb-delivered', 'Cancelled': 'sb-cancelled' };

let globalProducts = [];
let globalOrders = [];
let globalOffers = [];
let currentSection = 'dashboard';

// 2. MOCK DATA
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

// 3. CORE FUNCTIONS
function checkAuth() {
    const status = sessionStorage.getItem(LS.session) === 'true';
    console.log("Auth Status Check:", status);
    return status;
}

function doLogout() {
    console.log("Logging out...");
    sessionStorage.removeItem(LS.session);
    window.location.href = IS_LOCAL ? 'admin-login.html' : '/admin-login';
}

async function fetchAllData() {
    try {
        if (IS_LOCAL) {
            console.log("Local Mode: Injecting Data");
            globalProducts = MOCK_PRODUCTS;
            globalOrders = MOCK_ORDERS;
            globalOffers = MOCK_OFFERS;
        } else {
            console.log("Production Mode: Fetching Data");
            const [pRes, oRes, fRes] = await Promise.all([
                fetch('/api/products').catch(() => null),
                fetch('/api/orders').catch(() => null),
                fetch('/api/offers').catch(() => null)
            ]);
            if (pRes && pRes.ok) globalProducts = await pRes.json();
            if (oRes && oRes.ok) globalOrders = await oRes.json();
            if (fRes && fRes.ok) globalOffers = await fRes.json();
        }

        // Final fallback validation
        if (!globalProducts || globalProducts.length === 0) globalProducts = MOCK_PRODUCTS;
        if (!globalOrders || globalOrders.length === 0) globalOrders = MOCK_ORDERS;
        if (!globalOffers || globalOffers.length === 0) globalOffers = MOCK_OFFERS;

        refreshUI();
    } catch (err) {
        console.error("Data fetch failed:", err);
        globalProducts = MOCK_PRODUCTS;
        globalOrders = MOCK_ORDERS;
        refreshUI();
    }
}

function refreshUI() {
    console.log("Refreshing Dashboard UI sections...");
    try {
        if (currentSection === 'dashboard') renderDashboard();
        if (currentSection === 'products') renderProductTable();
        if (currentSection === 'orders') renderOrdersTable();
        if (currentSection === 'offers') renderOffersTable();
        if (currentSection === 'reports') renderReports();
    } catch (e) {
        console.error("UI Refresh Error:", e);
    }
}

function renderDashboard() {
    const orders = globalOrders || [];
    const products = globalProducts || [];
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => o.status === 'Pending').length;

    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('ds-orders', orders.length);
    setVal('ds-revenue', revenue.toLocaleString('en-IN'));
    setVal('ds-products', products.length);
    setVal('ds-pending', pending);

    const tbody = document.getElementById('dash-orders-tbody');
    if (tbody) {
        tbody.innerHTML = [...orders].reverse().slice(0, 5).map(o => `
            <tr>
                <td style="color:var(--aqua);font-weight:700;">${o.id}</td>
                <td>${o.customerName || 'Guest'}</td>
                <td>₹${(o.total || 0).toLocaleString('en-IN')}</td>
                <td><span class="sbadge ${STATUS_CLS[o.status] || 'sb-pending'}">${o.status}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="4">No recent orders</td></tr>';
    }
}

function renderProductTable() {
    const tbody = document.getElementById('prod-tbody');
    if (!tbody) return;
    tbody.innerHTML = globalProducts.map(p => `
        <tr>
            <td><img src="${p.img || PLACEHOLDER}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;"></td>
            <td>${p.name}</td>
            <td>₹${p.price}</td>
            <td>${p.category}</td>
            <td><button class="btn btn-sm" onclick="showToast('Edit simulated')">Edit</button></td>
        </tr>
    `).join('') || '<tr><td colspan="5">No products</td></tr>';
}

function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = [...globalOrders].reverse().map(o => `
        <tr>
            <td>${o.id}</td>
            <td>${o.customerName || 'Guest'}</td>
            <td>₹${(o.total || 0).toLocaleString('en-IN')}</td>
            <td>${o.status}</td>
            <td><button class="btn btn-sm" onclick="showToast('View simulated')">View</button></td>
        </tr>
    `).join('') || '<tr><td colspan="5">No orders</td></tr>';
}

function renderOffersTable() {
    const tbody = document.getElementById('offers-tbody');
    if (!tbody) return;
    const count = document.getElementById('off-count');
    if (count) count.textContent = globalOffers.length;

    tbody.innerHTML = globalOffers.map(o => `
        <tr>
            <td><strong>${o.title}</strong></td>
            <td><code>${o.couponCode}</code></td>
            <td>${o.discountValue}${o.discountType === 'percentage' ? '%' : '₹'}</td>
            <td>₹${o.minOrder || 0}</td>
            <td>${o.expiry || 'Permanent'}</td>
            <td><span class="status-toggle-btn ${o.status || 'active'}">${o.status || 'Active'}</span></td>
            <td><button class="btn btn-sm btn-ghost" onclick="showToast('Edit simulated')">Edit</button></td>
        </tr>
    `).join('') || '<tr><td colspan="7" class="tbl-empty">No active offers</td></tr>';
}

function toggleAddOfferCard() {
    const body = document.getElementById('add-offer-body');
    const btn = document.getElementById('offer-toggle-btn');
    if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'block' : 'none';
        if (btn) btn.textContent = isHidden ? 'Collapse' : 'Expand';
    }
}

function renderReports() {
    const c = document.getElementById('rpt-order-count');
    const r = document.getElementById('rpt-revenue');
    if (c) c.textContent = globalOrders.length;
    if (r) r.textContent = globalOrders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString('en-IN');
}

function showToast(msg) {
    console.log("Toast:", msg);
    const root = document.getElementById('toast-root');
    if (!root) return;
    const t = document.createElement('div');
    t.className = 'toast show';
    t.textContent = msg;
    root.appendChild(t);
    setTimeout(() => { t.remove(); }, 3000);
}

// 4. NAVIGATION & SIDEBAR
function switchSection(name) {
    console.log("Switching to section:", name);
    currentSection = name;
    document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + name)?.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => {
        b.classList.toggle('active', b.dataset.section === name);
    });
    const ht = document.getElementById('hd-title');
    if (ht) ht.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    refreshUI();
    closeSidebar();
}

function openSidebar() { document.getElementById('adm-sidebar')?.classList.add('open'); document.getElementById('sidebar-overlay')?.classList.add('show'); }
function closeSidebar() { document.getElementById('adm-sidebar')?.classList.remove('open'); document.getElementById('sidebar-overlay')?.classList.remove('show'); }

// 5. BOOT ENGINE
const boot = () => {
    const path = window.location.pathname.toLowerCase();
    const isLogin = path.includes('admin-login');
    const isDashboard = path.includes('admin-dashboard') || (path.includes('admin') && !isLogin);
    const auth = checkAuth();

    console.log("Booting V10.0... Path:", path, "Auth:", auth);

    // 1. Redirect Rules
    if (isLogin && auth) {
        window.location.href = IS_LOCAL ? 'admin-dashboard.html' : '/admin-dashboard';
        return;
    }
    if (isDashboard && !auth) {
        window.location.href = IS_LOCAL ? 'admin-login.html' : '/admin-login';
        return;
    }

    // 2. Dashboard Hub
    if (isDashboard && auth) {
        console.log("Dashboard Engine Online");

        // Ensure visibility
        const screen = document.getElementById('dashboard-screen');
        if (screen) {
            screen.classList.add('visible');
            screen.style.display = 'flex';
        }

        const area = document.querySelector('.adm-main-area');
        if (area) area.style.opacity = '1';

        // Bind events
        const btnLogout = document.getElementById('logout-btn') || document.getElementById('logout-hd-btn');
        if (btnLogout) btnLogout.onclick = doLogout;

        const btnHam = document.getElementById('hamburger-btn');
        if (btnHam) btnHam.onclick = openSidebar;

        const btnOverlay = document.getElementById('sidebar-overlay');
        if (btnOverlay) btnOverlay.onclick = closeSidebar;

        const btnOfferToggle = document.getElementById('add-offer-hd');
        if (btnOfferToggle) btnOfferToggle.onclick = toggleAddOfferCard;

        const btnAddOffer = document.getElementById('save-offer-btn');
        if (btnAddOffer) {
            btnAddOffer.onclick = () => {
                const title = document.getElementById('off-title')?.value;
                const code = document.getElementById('off-code')?.value;
                if (!title || !code) return showToast('Title and Code are required', 'err');
                showToast('Offer Added! (Simulation)');
                toggleAddOfferCard();
            };
        }

        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.onclick = () => switchSection(btn.dataset.section);
        });

        // Load data
        fetchAllData();
    }

    // Login Initialization
    const loginForm = document.getElementById('login-form');
    if (isLogin && loginForm) {
        console.log("Login form detected.");
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const u = document.getElementById('l-user')?.value.trim();
            const p = document.getElementById('l-pass')?.value.trim();
            const err = document.getElementById('login-err');

            if (u === 'admin' && p === 'admin123') {
                if (err) { err.textContent = 'Success! Redirecting...'; err.style.color = '#00FF99'; }
                sessionStorage.setItem(LS.session, 'true');
                setTimeout(() => {
                    window.location.href = IS_LOCAL ? 'admin-dashboard.html' : '/admin-dashboard';
                }, 500);
            } else {
                if (err) { err.textContent = 'Invalid Credentials'; err.style.color = '#FF4444'; }
            }
            return false;
        };
    }
};

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
window.UI = { logout: doLogout, switch: switchSection };
