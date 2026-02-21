/* ============================================================
   AK FishFarms — Admin Panel Script  (admin-script.js)
   All logic: Auth · Orders · Products · Tracking · Reports
   ============================================================ */
'use strict';

/* ══════════════════════════════════════════════════════════
   CONSTANTS & KEYS
══════════════════════════════════════════════════════════ */
const LS = {
    products: 'akf_products',   // matches script.js LS_PRODUCTS
    orders: 'akf_orders',     // matches script.js LS_ORDERS
    creds: 'ak_admin_creds', // admin-only
    session: 'ak_admin_session',
};
const PLACEHOLDER = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80';
const STATUS_LIST = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_CLS = { 'Pending': 'sb-pending', 'Processing': 'sb-processing', 'Out for Delivery': 'sb-out', 'Delivered': 'sb-delivered', 'Cancelled': 'sb-cancelled' };

/* ══════════════════════════════════════════════════════════
   DATA HELPERS
══════════════════════════════════════════════════════════ */
const getProducts = () => { try { return JSON.parse(localStorage.getItem(LS.products)) || []; } catch { return []; } };
const saveProducts = (d) => localStorage.setItem(LS.products, JSON.stringify(d));
const getOrders = () => { try { return JSON.parse(localStorage.getItem(LS.orders)) || []; } catch { return []; } };
const saveOrders = (d) => localStorage.setItem(LS.orders, JSON.stringify(d));
const getCreds = () => {
    try { return JSON.parse(localStorage.getItem(LS.creds)); } catch { return null; }
};
const getDefaultCreds = () => ({ username: 'admin', password: 'AKFish2026' });
const saveCreds = (c) => localStorage.setItem(LS.creds, JSON.stringify(c));

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════════════════ */
function showToast(msg, type = 'success') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-ico">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${msg}</span>`;
    root.appendChild(t);
    setTimeout(() => { t.style.animation = 'toastOut .35s ease forwards'; setTimeout(() => t.remove(), 370); }, 3200);
}

/* ══════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════ */
function checkAuth() {
    return sessionStorage.getItem(LS.session) === '1';
}
function doLogin(username, password) {
    const creds = getCreds() || getDefaultCreds();
    return username.trim() === creds.username && password === creds.password;
}
function doLogout() {
    sessionStorage.removeItem(LS.session);
    location.reload();
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════ */
const SECTION_TITLES = {
    dashboard: '🏠 Dashboard',
    orders: '📋 Orders',
    track: '🚚 Track Orders',
    products: '📦 Products',
    security: '🔒 Security',
    reports: '📊 Reports',
};

let currentSection = 'dashboard';

function switchSection(name) {
    if (!SECTION_TITLES[name]) return;
    currentSection = name;

    /* sections */
    document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('sec-' + name);
    if (sec) sec.classList.add('active');

    /* sidebar nav */
    document.querySelectorAll('.nav-item[data-section]').forEach(b => {
        b.classList.toggle('active', b.dataset.section === name);
    });

    /* bottom nav */
    document.querySelectorAll('.bn-item[data-section]').forEach(b => {
        b.classList.toggle('active', b.dataset.section === name);
    });

    /* header title */
    const ht = document.getElementById('hd-title');
    if (ht) ht.textContent = SECTION_TITLES[name] || name;

    /* load section data */
    if (name === 'dashboard') renderDashboard();
    if (name === 'orders') renderOrders();
    if (name === 'track') renderTrackList();
    if (name === 'products') renderProductTable();
    if (name === 'reports') renderReportStats();

    /* mobile: close sidebar */
    closeSidebar();
    window.scrollTo(0, 0);
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR (MOBILE)
══════════════════════════════════════════════════════════ */
function openSidebar() { document.getElementById('adm-sidebar')?.classList.add('open'); document.getElementById('sidebar-overlay')?.classList.add('show'); }
function closeSidebar() { document.getElementById('adm-sidebar')?.classList.remove('open'); document.getElementById('sidebar-overlay')?.classList.remove('show'); }

/* ══════════════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════════════ */
function animateCounter(el, target, prefix = '', suffix = '') {
    if (!el) return;
    const dur = 900, step = 16;
    let start = 0, startTime = null;
    function update(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(start + (target - start) * ease);
        el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════ */
function renderDashboard() {
    const orders = getOrders();
    const products = getProducts();
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => !o.status || o.status === 'Pending').length;

    animateCounter(document.getElementById('ds-orders'), orders.length);
    animateCounter(document.getElementById('ds-revenue'), revenue, '₹');
    animateCounter(document.getElementById('ds-products'), products.length);
    animateCounter(document.getElementById('ds-pending'), pending);

    /* Recent 5 orders mini-table */
    const tbody = document.getElementById('dash-orders-tbody');
    if (!tbody) return;
    const recent = [...orders].reverse().slice(0, 5);
    if (!recent.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="tbl-empty"><span class="tbl-empty-ico">📭</span>No orders yet</td></tr>';
        return;
    }
    tbody.innerHTML = recent.map(o => {
        const st = o.status || 'Pending';
        const cls = STATUS_CLS[st] || 'sb-pending';
        return `<tr>
      <td style="font-weight:800;color:#00D4FF;">${o.id}</td>
      <td>${o.name || '—'}</td>
      <td><strong>₹${(o.total || 0).toLocaleString('en-IN')}</strong></td>
      <td style="font-size:.76rem;color:#475569;">${fmtDate(o.date)}</td>
      <td><span class="sbadge ${cls}">${st}</span></td>
    </tr>`;
    }).join('');
}

/* ══════════════════════════════════════════════════════════
   ORDERS
══════════════════════════════════════════════════════════ */
let ordersFilter = '';

function renderOrders(query) {
    const q = (query !== undefined ? query : ordersFilter).toLowerCase();
    ordersFilter = q;
    let orders = getOrders();
    const badge = document.getElementById('orders-count');
    if (badge) badge.textContent = orders.length;

    if (q) orders = orders.filter(o =>
        (o.id || '').toLowerCase().includes(q) ||
        (o.name || '').toLowerCase().includes(q) ||
        (o.phone || '').toLowerCase().includes(q) ||
        (o.city || o.address || '').toLowerCase().includes(q)
    );

    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="tbl-empty"><span class="tbl-empty-ico">📭</span>No orders yet</td></tr>';
        return;
    }

    tbody.innerHTML = [...orders].reverse().map(o => {
        const st = o.status || 'Pending';
        const cls = STATUS_CLS[st] || 'sb-pending';
        const opts = STATUS_LIST.map(s => `<option value="${s}" ${s === st ? 'selected' : ''}>${s}</option>`).join('');
        return `<tr id="orow-${o.id}">
      <td style="font-weight:800;color:#00D4FF;font-size:.8rem;">${o.id}</td>
      <td>${o.name || '—'}</td>
      <td>${o.phone || '—'}</td>
      <td style="font-size:.79rem;">${o.city || o.address || '—'}</td>
      <td><strong>₹${(o.total || 0).toLocaleString('en-IN')}</strong></td>
      <td style="font-size:.76rem;color:#475569;white-space:nowrap;">${fmtDate(o.date)}</td>
      <td>
        <select class="status-sel" data-oid="${o.id}">
          ${opts}
        </select>
      </td>
      <td>
        <button class="btn btn-ghost btn-sm view-order-btn" data-oid="${o.id}">👁 View</button>
      </td>
    </tr>`;
    }).join('');

    /* Attach events */
    tbody.querySelectorAll('.status-sel').forEach(sel => {
        sel.addEventListener('change', function () {
            const oid = this.dataset.oid;
            const orders2 = getOrders();
            const idx = orders2.findIndex(o => o.id === oid);
            if (idx >= 0) {
                orders2[idx].status = this.value;
                saveOrders(orders2);
                showToast(`Order ${oid} → ${this.value}`, 'success');
            }
        });
    });
    tbody.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', () => openOrderModal(btn.dataset.oid));
    });
}

/* ── Order Detail Modal ── */
function openOrderModal(oid) {
    const o = getOrders().find(x => x.id === oid);
    if (!o) return;
    const items = (o.items || []).map(i => `
    <div class="modal-item">
      <span class="modal-item-n">${i.name} × ${i.qty || 1}</span>
      <span class="modal-item-p">₹${((i.price || 0) * (i.qty || 1)).toLocaleString('en-IN')}</span>
    </div>`).join('');
    document.getElementById('order-modal-body').innerHTML = `
    <div class="modal-row"><div class="modal-lbl">Order ID</div><div class="modal-val" style="color:#00D4FF;font-weight:800;">${o.id}</div></div>
    <div class="modal-row"><div class="modal-lbl">Customer</div><div class="modal-val">${o.name || '—'}</div></div>
    <div class="modal-row"><div class="modal-lbl">Phone</div><div class="modal-val">${o.phone || '—'}</div></div>
    <div class="modal-row"><div class="modal-lbl">City / Address</div><div class="modal-val">${o.city || o.address || '—'}</div></div>
    <div class="modal-row"><div class="modal-lbl">Status</div><div class="modal-val"><span class="sbadge ${STATUS_CLS[o.status] || 'sb-pending'}">${o.status || 'Pending'}</span></div></div>
    <div class="modal-row"><div class="modal-lbl">Date</div><div class="modal-val">${fmtDate(o.date)}</div></div>
    <div class="modal-row"><div class="modal-lbl">Items</div><div class="modal-val"><div class="modal-items">${items || '—'}</div></div></div>
    <div class="modal-row"><div class="modal-lbl">Total</div><div class="modal-val" style="font-size:1rem;font-weight:900;color:#00D4FF;">₹${(o.total || 0).toLocaleString('en-IN')}</div></div>
  `;
    document.getElementById('order-modal').classList.add('open');
}

/* ══════════════════════════════════════════════════════════
   TRACK ORDERS
══════════════════════════════════════════════════════════ */
let trackFilter = '';

function renderTrackList(query) {
    const q = (query !== undefined ? query : trackFilter).toLowerCase();
    trackFilter = q;
    let orders = getOrders();
    if (q) orders = orders.filter(o =>
        (o.id || '').toLowerCase().includes(q) ||
        (o.name || '').toLowerCase().includes(q)
    );

    const list = document.getElementById('track-list');
    if (!list) return;
    if (!orders.length) {
        list.innerHTML = '<div class="track-empty">📭 No orders found.</div>';
        return;
    }

    list.innerHTML = [...orders].reverse().map(o => {
        const st = o.status || 'Pending';
        const opts = STATUS_LIST.map(s => `<option value="${s}" ${s === st ? 'selected' : ''}>${s}</option>`).join('');
        return `<div class="track-card">
        <div class="track-id">${o.id}</div>
        <div class="track-name">${o.name || '—'} · ₹${(o.total || 0).toLocaleString('en-IN')}</div>
        <div class="track-date">${fmtDate(o.date)}</div>
        <select class="track-sel" data-oid="${o.id}">${opts}</select>
        <button class="track-save-btn" data-oid="${o.id}">💾 Update</button>
      </div>`;
    }).join('');

    list.querySelectorAll('.track-save-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const oid = this.dataset.oid;
            const sel = list.querySelector(`.track-sel[data-oid="${oid}"]`);
            if (!sel) return;
            const newStatus = sel.value;
            const orders2 = getOrders();
            const idx = orders2.findIndex(o => o.id === oid);
            if (idx >= 0) {
                orders2[idx].status = newStatus;
                saveOrders(orders2);
                this.textContent = '✅ Updated!';
                this.style.background = '#10B981';
                setTimeout(() => { this.textContent = '💾 Update'; this.style.background = ''; }, 1800);
                showToast(`${oid} → ${newStatus}`, 'success');
            }
        });
    });
}

/* ══════════════════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════════════════ */
let editingProductId = null;
let addImgData = '';
let prodFilter = '';

function renderProductTable(query) {
    const q = (query !== undefined ? query : prodFilter).toLowerCase();
    prodFilter = q;
    let products = getProducts();
    const badge = document.getElementById('prod-count');
    if (badge) badge.textContent = products.length;
    if (q) products = products.filter(p => (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));

    const tbody = document.getElementById('prod-tbody');
    if (!tbody) return;
    if (!products.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="tbl-empty">No products found. Add one above!</td></tr>';
        return;
    }

    const catLabel = { special: '🏆 Special', premium: '💎 Premium', guppy: '🐟 Guppy' };

    tbody.innerHTML = products.map(p => {
        const imgSrc = p.img || PLACEHOLDER;
        const inStock = (p.status || 'in_stock') === 'in_stock';
        return `<tr id="pr-${p.id}">
      <td><img class="prod-thumb" id="pthumb-${p.id}" src="${imgSrc}" alt="${p.name}" onerror="this.src='${PLACEHOLDER}'"/></td>
      <td><input class="inline-inp" type="text" data-field="name" data-id="${p.id}" value="${escHtml(p.name)}" maxlength="80"/></td>
      <td>
        <div style="display:flex;align-items:center;gap:4px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);border-radius:8px;padding:0 8px;">
          <span style="color:#F59E0B;font-weight:700;font-size:.85rem;">₹</span>
          <input class="inline-inp" type="number" data-field="price" data-id="${p.id}" value="${p.price}" min="1"
            style="background:none;border:none;width:70px;padding:7px 4px;"/>
        </div>
      </td>
      <td>
        <select class="inline-sel" data-field="category" data-id="${p.id}">
          <option value="special" ${p.category === 'special' ? 'selected' : ''}>🏆 Special</option>
          <option value="premium" ${p.category === 'premium' ? 'selected' : ''}>💎 Premium</option>
          <option value="guppy"   ${p.category === 'guppy' ? 'selected' : ''}>🐟 Guppy</option>
        </select>
      </td>
      <td>
        <label class="tgl-wrap">
          <span class="tgl-sw">
            <input type="checkbox" class="tgl-cb" data-id="${p.id}" ${inStock ? 'checked' : ''}/>
            <span class="tgl-slider"></span>
          </span>
          <span class="tgl-txt" id="ptgl-lbl-${p.id}">${inStock ? 'In Stock' : 'Out of Stock'}</span>
        </label>
      </td>
      <td>
        <label class="prod-upload-lbl">
          <input type="file" accept="image/jpeg,image/png,image/webp" class="row-img-inp" data-id="${p.id}" style="display:none;"/>
          📷 Upload
        </label>
      </td>
      <td>
        <button class="save-row-btn" data-id="${p.id}">💾 Save</button>
      </td>
      <td>
        <button class="del-row-btn" data-id="${p.id}" title="Delete">🗑</button>
      </td>
    </tr>`;
    }).join('');

    /* Attach events */

    /* Toggle stock */
    tbody.querySelectorAll('.tgl-cb').forEach(cb => {
        cb.addEventListener('change', function () {
            const lbl = document.getElementById('ptgl-lbl-' + this.dataset.id);
            if (lbl) lbl.textContent = this.checked ? 'In Stock' : 'Out of Stock';
        });
    });

    /* Row image upload */
    tbody.querySelectorAll('.row-img-inp').forEach(inp => {
        inp.addEventListener('change', function () {
            const file = this.files && this.files[0];
            if (!file) return;
            const pid = +this.dataset.id;
            if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) { showToast('Only JPG/PNG/WEBP', 'error'); return; }
            if (file.size > 3 * 1024 * 1024) { showToast('Max 3 MB', 'error'); return; }
            const reader = new FileReader();
            reader.onload = ev => {
                const b64 = ev.target.result;
                const prods = getProducts(); const idx = prods.findIndex(p => p.id === pid);
                if (idx >= 0) { prods[idx].img = b64; saveProducts(prods); }
                const thumb = document.getElementById('pthumb-' + pid);
                if (thumb) { thumb.style.opacity = '.3'; setTimeout(() => { thumb.src = b64; thumb.style.opacity = '1'; }, 200); }
                showToast('✅ Image updated!', 'success');
            };
            reader.readAsDataURL(file);
        });
    });

    /* Save row */
    tbody.querySelectorAll('.save-row-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const pid = +this.dataset.id;
            const row = document.getElementById('pr-' + pid);
            if (!row) return;
            const name = row.querySelector('[data-field="name"]')?.value.trim();
            const price = parseFloat(row.querySelector('[data-field="price"]')?.value);
            const cat = row.querySelector('[data-field="category"]')?.value;
            const tgl = row.querySelector('.tgl-cb');
            const status = tgl?.checked ? 'in_stock' : 'out_stock';
            if (!name) { showToast('Name required!', 'error'); return; }
            if (isNaN(price) || price <= 0) { showToast('Valid price needed!', 'error'); return; }
            const prods = getProducts(); const idx = prods.findIndex(p => p.id === pid);
            if (idx >= 0) {
                prods[idx] = { ...prods[idx], name, price, category: cat, status };
                saveProducts(prods);
                this.textContent = '✅ Saved!'; this.style.background = '#10B981';
                setTimeout(() => { this.textContent = '💾 Save'; this.style.background = ''; }, 1800);
                showToast('Product updated!', 'success');
                renderDashboardStats();
            }
        });
    });

    /* Delete row */
    tbody.querySelectorAll('.del-row-btn').forEach(btn => {
        btn.addEventListener('click', () => openDelModal(+btn.dataset.id));
    });
}

function renderDashboardStats() {
    const orders = getOrders(); const products = getProducts();
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter(o => !o.status || o.status === 'Pending').length;
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setText('ds-orders', orders.length);
    setText('ds-revenue', '₹' + revenue.toLocaleString('en-IN'));
    setText('ds-products', products.length);
    setText('ds-pending', pending);
}

/* ── Add / Edit product form ── */
function initAddProductForm() {
    const saveBtn = document.getElementById('save-prod-btn');
    const cancelBtn = document.getElementById('cancel-prod-btn');
    const fileInp = document.getElementById('add-img-file');
    const urlInp = document.getElementById('add-img-url');
    const zone = document.getElementById('add-upload-zone');
    const clearBtn = document.getElementById('clear-add-img');

    if (fileInp) fileInp.addEventListener('change', () => {
        const f = fileInp.files && fileInp.files[0];
        if (f) processAddImage(f);
    });
    if (zone) {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', e => {
            e.preventDefault(); zone.classList.remove('dragover');
            const f = e.dataTransfer?.files[0]; if (f) processAddImage(f);
        });
    }
    if (urlInp) urlInp.addEventListener('input', () => {
        const url = urlInp.value.trim();
        addImgData = url || '';
        if (url) showAddPreview(url);
    });
    if (clearBtn) clearBtn.addEventListener('click', clearAddImage);
    if (saveBtn) saveBtn.addEventListener('click', saveProduct);
    if (cancelBtn) cancelBtn.addEventListener('click', resetAddForm);
}

function processAddImage(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowed.includes(file.type)) { showToast('Only JPG/PNG/WEBP', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Max 5 MB', 'error'); return; }
    const r = new FileReader();
    r.onload = e => { addImgData = e.target.result; showAddPreview(addImgData); showToast('Image loaded!', 'info'); };
    r.readAsDataURL(file);
}
function showAddPreview(src) {
    const wrap = document.getElementById('add-img-preview');
    const img = document.getElementById('add-img-preview-img');
    if (wrap) wrap.classList.add('show');
    if (img) img.src = src;
}
function clearAddImage() {
    addImgData = '';
    const wrap = document.getElementById('add-img-preview'); if (wrap) wrap.classList.remove('show');
    const fi = document.getElementById('add-img-file'); if (fi) fi.value = '';
    const ui = document.getElementById('add-img-url'); if (ui) ui.value = '';
}

function saveProduct() {
    const name = document.getElementById('add-name')?.value.trim();
    const price = parseFloat(document.getElementById('add-price')?.value);
    const cat = document.getElementById('add-cat')?.value || 'special';
    const status = document.getElementById('add-status')?.value || 'in_stock';
    const desc = document.getElementById('add-desc')?.value.trim();
    const img = addImgData || PLACEHOLDER;
    if (!name) { showToast('Fish name required!', 'error'); return; }
    if (isNaN(price) || price <= 0) { showToast('Valid price required!', 'error'); return; }

    const prods = getProducts();
    if (editingProductId !== null) {
        const idx = prods.findIndex(p => p.id === editingProductId);
        if (idx >= 0) { prods[idx] = { ...prods[idx], name, price, img, category: cat, description: desc, status }; }
        saveProducts(prods);
        showToast('✅ Product updated!', 'success');
    } else {
        const newId = prods.length ? Math.max(...prods.map(p => p.id)) + 1 : 1;
        prods.push({ id: newId, name, price, img, category: cat, description: desc, status });
        saveProducts(prods);
        showToast('✅ Product added!', 'success');
    }
    resetAddForm();
    renderProductTable();
}

function resetAddForm() {
    editingProductId = null; addImgData = '';
    const ids = ['add-name', 'add-price', 'add-desc', 'add-img-url', 'add-img-file'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const cat = document.getElementById('add-cat'); if (cat) cat.value = 'special';
    const st = document.getElementById('add-status'); if (st) st.value = 'in_stock';
    clearAddImage();
    const lbl = document.getElementById('save-prod-lbl'); if (lbl) lbl.textContent = 'Add Product';
}

function toggleAddCard() {
    const body = document.getElementById('add-prod-body');
    const btn = document.getElementById('add-toggle-btn');
    if (!body) return;
    const collapsed = body.style.display === 'none';
    body.style.display = collapsed ? '' : 'none';
    if (btn) btn.textContent = collapsed ? '▲ Collapse' : '▼ Expand';
}

/* Delete modal */
function openDelModal(pid) {
    const p = getProducts().find(x => x.id === pid);
    document.getElementById('del-prod-name').textContent = p ? p.name : 'this product';
    document.getElementById('del-prod-id').value = pid;
    document.getElementById('del-modal').classList.add('open');
}
function closeDelModal() { document.getElementById('del-modal').classList.remove('open'); }

/* ══════════════════════════════════════════════════════════
   SECURITY — CHANGE PASSWORD
══════════════════════════════════════════════════════════ */
function initSecurity() {
    const btn = document.getElementById('change-pw-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const cur = document.getElementById('sec-cur')?.value;
        const newPw = document.getElementById('sec-new')?.value;
        const confirm = document.getElementById('sec-confirm')?.value;
        const errEl = document.getElementById('sec-err');
        const setErr = msg => { if (errEl) errEl.textContent = msg; };
        setErr('');

        const creds = getCreds() || getDefaultCreds();
        if (cur !== creds.password) { setErr('❌ Current password is incorrect.'); return; }
        if (!newPw || newPw.length < 6) { setErr('❌ New password must be at least 6 characters.'); return; }
        if (newPw !== confirm) { setErr('❌ Passwords do not match.'); return; }

        saveCreds({ username: creds.username, password: newPw });
        setErr('');
        ['sec-cur', 'sec-new', 'sec-confirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        showToast('🔒 Password updated successfully!', 'success');
    });

    /* pw-eye toggles */
    document.querySelectorAll('.pw-eye').forEach(eye => {
        eye.addEventListener('click', function () {
            const inp = document.getElementById(this.dataset.target);
            if (!inp) return;
            inp.type = inp.type === 'password' ? 'text' : 'password';
            this.textContent = inp.type === 'password' ? '👁' : '🙈';
        });
    });
}

/* ══════════════════════════════════════════════════════════
   REPORTS — EXCEL / CSV EXPORT
══════════════════════════════════════════════════════════ */
function renderReportStats() {
    const orders = getOrders();
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const rc = document.getElementById('rpt-order-count'); if (rc) rc.textContent = orders.length;
    const rr = document.getElementById('rpt-revenue'); if (rr) rr.textContent = '₹' + revenue.toLocaleString('en-IN');
}

function buildOrdersRows() {
    return getOrders().map(o => ({
        'Order ID': o.id || '',
        'Customer Name': o.name || '',
        'Phone': o.phone || '',
        'City / Address': o.city || o.address || '',
        'Items Ordered': (o.items || []).map(i => `${i.name} x${i.qty || 1}`).join('; '),
        'Total Amount (₹)': o.total || 0,
        'Date & Time': fmtDate(o.date),
        'Status': o.status || 'Pending',
    }));
}

function downloadExcel() {
    const rows = buildOrdersRows();
    if (!rows.length) { showToast('No orders to export!', 'warning'); return; }
    try {
        if (typeof XLSX === 'undefined') throw new Error('SheetJS not loaded');
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        /* Auto column widths */
        const cols = Object.keys(rows[0]).map(k => ({ wch: Math.max(k.length, 18) }));
        ws['!cols'] = cols;
        XLSX.writeFile(wb, 'AK_FishFarms_Orders_Report.xlsx');
        showToast('📥 Excel downloaded!', 'success');
    } catch (e) {
        showToast('Excel failed — downloading CSV instead.', 'warning');
        downloadCSV();
    }
}

function downloadCSV() {
    const rows = buildOrdersRows();
    if (!rows.length) { showToast('No orders to export!', 'warning'); return; }
    const headers = Object.keys(rows[0]);
    const csvLines = [
        headers.join(','),
        ...rows.map(r => headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(','))
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, 'AK_FishFarms_Orders_Report.csv');
    showToast('📄 CSV downloaded!', 'success');
}

function downloadProductsCsv() {
    const products = getProducts();
    if (!products.length) { showToast('No products!', 'warning'); return; }
    const headers = ['ID', 'Name', 'Price (₹)', 'Category', 'Stock Status', 'Description'];
    const catMap = { special: 'AK Special', premium: 'AK Premium', guppy: 'Guppy' };
    const rows = products.map(p => [p.id, p.name, p.price, catMap[p.category] || p.category, p.status === 'in_stock' ? 'In Stock' : 'Out of Stock', p.description || '']);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'AK_FishFarms_Products.csv');
    showToast('📦 Products CSV downloaded!', 'success');
}

function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ══════════════════════════════════════════════════════════
   UTILITY
══════════════════════════════════════════════════════════ */
function fmtDate(d) {
    if (!d) return '—';
    try { return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return d; }
}
function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ══════════════════════════════════════════════════════════
   INITIALISE
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    /* ── Ensure default credentials exist ── */
    if (!getCreds()) saveCreds(getDefaultCreds());

    /* ── AUTH GUARD ── */
    if (checkAuth()) {
        showDashboard();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }

    /* ── LOGIN FORM ── */
    document.getElementById('login-form')?.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('l-user')?.value.trim();
        const password = document.getElementById('l-pass')?.value;
        const errEl = document.getElementById('login-err');
        if (!username || !password) { if (errEl) errEl.textContent = '❌ Enter username and password.'; return; }
        if (doLogin(username, password)) {
            sessionStorage.setItem(LS.session, '1');
            if (errEl) errEl.textContent = '';
            showDashboard();
        } else {
            if (errEl) errEl.textContent = '❌ Wrong username or password.';
            document.getElementById('l-pass').value = '';
            document.getElementById('l-pass').focus();
        }
    });

    /* Login show/hide password */
    document.getElementById('login-eye')?.addEventListener('click', function () {
        const inp = document.getElementById('l-pass');
        if (!inp) return;
        inp.type = inp.type === 'password' ? 'text' : 'password';
        this.textContent = inp.type === 'password' ? '👁' : '🙈';
    });

    /* ── SIDEBAR NAV ── */
    document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    /* ── BOTTOM NAV ── */
    document.querySelectorAll('.bn-item[data-section]').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });

    /* ── LOGOUT ── */
    ['logout-btn', 'logout-hd-btn'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', doLogout);
    });

    /* ── HAMBURGER ── */
    document.getElementById('hamburger-btn')?.addEventListener('click', openSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

    /* ── MODALS ── */
    document.getElementById('modal-close-btn')?.addEventListener('click', () => document.getElementById('order-modal').classList.remove('open'));
    document.getElementById('order-modal')?.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); });
    document.getElementById('cancel-del-btn')?.addEventListener('click', closeDelModal);
    document.getElementById('del-modal')?.addEventListener('click', function (e) { if (e.target === this) closeDelModal(); });
    document.getElementById('confirm-del-btn')?.addEventListener('click', () => {
        const pid = +document.getElementById('del-prod-id').value;
        const prods = getProducts().filter(p => p.id !== pid);
        saveProducts(prods);
        closeDelModal();
        showToast('🗑 Product deleted.', 'error');
        renderProductTable();
    });

    /* ── ORDERS SEARCH ── */
    document.getElementById('orders-search')?.addEventListener('input', function () { renderOrders(this.value); });

    /* ── TRACK SEARCH ── */
    document.getElementById('track-search')?.addEventListener('input', function () { renderTrackList(this.value); });

    /* ── PRODUCT SEARCH ── */
    document.getElementById('prod-search')?.addEventListener('input', function () { renderProductTable(this.value); });

    /* ── PRODUCTS FORM ── */
    initAddProductForm();

    /* ── SECURITY ── */
    initSecurity();

    /* ── REPORTS BUTTONS ── */
    document.getElementById('dl-excel-btn')?.addEventListener('click', downloadExcel);
    document.getElementById('dl-csv-btn')?.addEventListener('click', downloadCSV);
    document.getElementById('dl-prod-btn')?.addEventListener('click', downloadProductsCsv);

    /* ── MOBILE: resize handler ── */
    window.addEventListener('resize', () => { if (window.innerWidth >= 900) closeSidebar(); });
});

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    const dash = document.getElementById('dashboard-screen');
    dash.classList.add('visible');
    /* Set logged-in username in pill */
    const creds = getCreds() || getDefaultCreds();
    const pill = document.getElementById('admin-pill-name');
    if (pill) pill.textContent = creds.username;
    /* Render initial section */
    renderDashboard();
}
