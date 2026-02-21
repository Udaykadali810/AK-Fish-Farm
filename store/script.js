/* ============================================================
   AK FishFarms — E-Commerce  |  script.js
   Backend: LocalStorage (100% Free)
   WhatsApp: wa.me/919492045766
   ============================================================ */

'use strict';

/* ── Constants ─────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '919492045766';
const STORAGE_KEY = 'akfishfarms_cart';

/* ── Product Catalogue ─────────────────────────────────────── */
const PRODUCTS = [
    // AK Special Collection
    { id: 101, name: 'Molly Pair', category: 'AK Special Collection', price: 40, rating: 4.8, desc: 'Standard hardy aquarium molly pair. Perfect for beginners and community tanks.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80' },
    { id: 102, name: 'Zebra Pair', category: 'AK Special Collection', price: 40, rating: 4.7, desc: 'Classic active zebra danio pair. Adds energy and movement to the mid-water section.', img: 'https://images.unsplash.com/photo-1544551763-47a184117db3?auto=format&fit=crop&w=600&q=80' },
    { id: 103, name: 'Balloon Molly', category: 'AK Special Collection', price: 80, rating: 4.5, desc: 'Exotic rounded body variant with vibrant colors and peaceful temperament.', img: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=600&q=80' },
    { id: 104, name: 'Chocolate Molly', category: 'AK Special Collection', price: 80, rating: 4.9, desc: 'Deep brown elegance for your aquarium. A rare and beautiful color variant.', img: 'https://images.unsplash.com/photo-1524704796826-f66aefed9328?auto=format&fit=crop&w=600&q=80' },
    { id: 105, name: 'Widow Tetra', category: 'AK Special Collection', price: 70, rating: 4.6, desc: 'Classic schooling fish known for its dark translucent fins and hardy nature.', img: 'https://images.unsplash.com/photo-1520990835108-c6de1a3a4ed5?auto=format&fit=crop&w=600&q=80' },
    { id: 106, name: 'Shark', category: 'AK Special Collection', price: 100, rating: 4.7, desc: 'Majestic bottom-dwelling shark variant. Adds an industrial look to large tanks.', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80' },
    { id: 107, name: 'Gourami', category: 'AK Special Collection', price: 100, rating: 4.8, desc: 'Graceful centerpiece fish with vibrant hues and unique bubble-nesting behavior.', img: 'https://images.unsplash.com/photo-1520990735108-c6de1a3a4ed5?auto=format&fit=crop&w=600&q=80' },
    { id: 108, name: 'Veil Tail Zebra', category: 'AK Special Collection', price: 150, rating: 5.0, desc: 'Long-finned elegant zebra danio variant. Glides through water with style.', img: 'https://images.unsplash.com/photo-1520990669985-2c0ce8a4c7c5?auto=format&fit=crop&w=600&q=80' },
    { id: 109, name: 'Small Gold Fish', category: 'AK Special Collection', price: 50, rating: 4.9, desc: 'The timeless classic. Vibrant orange and healthy small goldfish.', img: 'https://images.unsplash.com/photo-1524704796826-f66aefed9328?auto=format&fit=crop&w=600&q=80' },
    { id: 110, name: 'Big Gold Fish', category: 'AK Special Collection', price: 100, rating: 5.0, desc: 'Large, developed goldfish with bold colors and impressive scale patterns.', img: 'https://images.unsplash.com/photo-1520990834044-4750ee7e4187?auto=format&fit=crop&w=600&q=80' },

    // AK Premium Collection
    { id: 201, name: 'Oranda Goldfish Pair', category: 'AK Premium Collection', price: 400, rating: 4.9, desc: 'Distinctive head growth and flowing fins. The peak of premium goldfish breeding.', img: 'https://images.unsplash.com/photo-1524704796526-caee01244bb7?auto=format&fit=crop&w=600&q=80' },
    { id: 202, name: 'Red Ryukin Goldfish Pair', category: 'AK Premium Collection', price: 500, rating: 4.8, desc: 'High-backed variety with intense deep red colors. Premium quality pair.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80' },
    { id: 203, name: 'Lion Head Goldfish Pair', category: 'AK Premium Collection', price: 500, rating: 4.7, desc: 'Unique mane-like growth on the head. A majestic and highly sought premium pair.', img: 'https://images.unsplash.com/photo-1544521848-df840003006d?auto=format&fit=crop&w=600&q=80' },
    { id: 204, name: 'Silver Arowana (Small)', category: 'AK Premium Collection', price: 1500, rating: 4.8, desc: 'Powerful and graceful predator. Symbol of luck and prosperity.', img: 'https://images.unsplash.com/photo-1627309302198-09a50ae1b209?auto=format&fit=crop&w=600&q=80' },
    { id: 205, name: 'Silver Arowana (Medium)', category: 'AK Premium Collection', price: 2000, rating: 5.0, desc: 'Developed silver arowana at medium size. Impressive scale shine and activity.', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80' },
    { id: 206, name: 'Alligator Gar (Small)', category: 'AK Premium Collection', price: 1500, rating: 4.9, desc: 'Prehistoric freshwater giant. A unique and hardy addition for large premium setups.', img: 'https://images.unsplash.com/photo-1524704659698-1fd30bb3a772?auto=format&fit=crop&w=600&q=80' },
    { id: 207, name: 'Flower Horn (Big)', category: 'AK Premium Collection', price: 2000, rating: 5.0, desc: 'Masterpiece quality flowerhorn. Massive kok and vibrant flower markings.', img: 'https://images.unsplash.com/photo-1544551763-47a184117db3?auto=format&fit=crop&w=600&q=80' },
    { id: 208, name: 'Channa Fish', category: 'AK Premium Collection', price: 1000, rating: 4.9, desc: 'Striking patterns and high intelligence. The Channa is a top-tier premium predator.', img: 'https://images.unsplash.com/photo-1524704659698-1fd30bb3a772?auto=format&fit=crop&w=600&q=80' },

    // AK Guppy Collection
    { id: 301, name: 'Mixed Guppy Pair', category: 'AK Guppy Collection', price: 80, rating: 4.5, desc: 'Assorted colorful fancy guppies. A vibrant and active starting pair.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80' },
    { id: 302, name: 'Fancy Mixed Guppy Pair', category: 'AK Guppy Collection', price: 120, rating: 4.7, desc: 'High-grade mixed guppy pair with exotic tail patterns and bright hues.', img: 'https://images.unsplash.com/photo-1544521848-df840003006d?auto=format&fit=crop&w=600&q=80' },
    { id: 303, name: 'Platinum Dumbo Ear Guppy Pair', category: 'AK Guppy Collection', price: 200, rating: 4.8, desc: 'Extra large flowing pectoral fins with a striking platinum shine.', img: 'https://images.unsplash.com/photo-1627309302198-09a50ae1b209?auto=format&fit=crop&w=600&q=80' },
    { id: 304, name: 'Platinum White Guppy Pair', category: 'AK Guppy Collection', price: 200, rating: 4.6, desc: 'Pure pearl-white scales with a metallic platinum glow. Stunningly elegant.', img: 'https://images.unsplash.com/photo-1524704796526-caee01244bb7?auto=format&fit=crop&w=600&q=80' },
    { id: 305, name: 'Red Ear Koi Guppy Pair', category: 'AK Guppy Collection', price: 400, rating: 4.9, desc: 'Unique red ears and koi-like markings. A peaceful and beautiful variety.', img: 'https://images.unsplash.com/photo-1544551763-47a184117db3?auto=format&fit=crop&w=600&q=80' },
    { id: 306, name: 'Purple Berry Dragon Guppy Pair', category: 'AK Guppy Collection', price: 200, rating: 4.7, desc: 'Intense purple body with intricate dragon-scale tail patterns.', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80' },
    { id: 307, name: 'Full Gold Guppy Pair', category: 'AK Guppy Collection', price: 200, rating: 4.8, desc: 'Solid brilliant gold from head to tail. A high-value shimmer in any tank.', img: 'https://images.unsplash.com/photo-1544521848-df840003006d?auto=format&fit=crop&w=600&q=80' },
    { id: 308, name: 'Java Red Rose Guppy Pair', category: 'AK Guppy Collection', price: 200, rating: 4.7, desc: 'Elegant deep red tail that blooms like a rose. The Java Red standard.', img: 'https://images.unsplash.com/photo-1627309302198-09a50ae1b209?auto=format&fit=crop&w=600&q=80' },
    { id: 309, name: 'Albino Full Red Guppy Pair', category: 'AK Guppy Collection', price: 200, rating: 4.6, desc: 'Intense solid red with bright albino eyes. A true collector\'s guppy.', img: 'https://images.unsplash.com/photo-1524704796526-caee01244bb7?auto=format&fit=crop&w=600&q=80' },
    { id: 310, name: 'Yellow Tuxedo Guppy Pair', category: 'AK Guppy Collection', price: 150, rating: 4.8, desc: 'Elegant black body with bright yellow fins. The classic Tuxedo contrast.', img: 'https://images.unsplash.com/photo-1524704659698-1fd30bb3a772?auto=format&fit=crop&w=600&q=80' },
];

/* ── State ─────────────────────────────────────────────────── */
let cart = [];         // Array of { id, qty }
let activeCategory = 'All';
let cardQtyMap = {};         // productId -> qty displayed on card

/* ═══════════════════════════════════════════════════════════
   LOCALSTAGE HELPERS
   ═══════════════════════════════════════════════════════════ */
function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}
function loadCart() {
    try {
        cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        cart = [];
    }
}

/* ═══════════════════════════════════════════════════════════
   CART CORE LOGIC
   ═══════════════════════════════════════════════════════════ */

/** Find existing cart entry by product id */
function findCartEntry(id) {
    return cart.find(e => e.id === id);
}

/** Add product to cart with given qty (merge if exists) */
function addToCart(productId, qty) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = findCartEntry(productId);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: productId, qty });
    }
    saveCart();
    updateCartUI();
}

/** Change quantity of an item in cart */
function changeCartQty(productId, delta) {
    const entry = findCartEntry(productId);
    if (!entry) return;
    entry.qty += delta;
    if (entry.qty < 1) {
        removeFromCart(productId);
        return;
    }
    saveCart();
    renderCartItems();
    updateCartBadge();
}

/** Remove item from cart */
function removeFromCart(productId) {
    cart = cart.filter(e => e.id !== productId);
    saveCart();
    renderCartItems();
    updateCartBadge();
}

/** Calculate total price */
function cartTotal() {
    return cart.reduce((sum, entry) => {
        const p = PRODUCTS.find(p => p.id === entry.id);
        return sum + (p ? p.price * entry.qty : 0);
    }, 0);
}

/** Total item count */
function cartCount() {
    return cart.reduce((sum, e) => sum + e.qty, 0);
}

/* ═══════════════════════════════════════════════════════════
   RENDERING — PRODUCTS
   ═══════════════════════════════════════════════════════════ */

function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

function renderProducts(category = 'All') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = category === 'All'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === category);

    // Reset card qty map for newly rendered cards
    cardQtyMap = {};
    filtered.forEach(p => { cardQtyMap[p.id] = 1; });

    grid.innerHTML = filtered.map(p => `
    <article class="product-card fade-in-up" data-id="${p.id}">
      <div class="card-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80'">
        <span class="card-badge-cat">${p.category.replace('AK ', '')}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-rating">
          <span class="stars">${getStars(p.rating)}</span>
          <span>${p.rating.toFixed(1)}</span>
        </div>
        <div class="card-bottom">
          <span class="card-price">₹${p.price} <span>/ pair</span></span>
          <div class="qty-selector" aria-label="Select quantity">
            <button class="qty-btn card-qty-minus" data-id="${p.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-display" id="card-qty-${p.id}">1</span>
            <button class="qty-btn card-qty-plus"  data-id="${p.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="add-to-cart-btn" id="atc-${p.id}" data-id="${p.id}" aria-label="Add ${p.name} to cart">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          Add to Cart
        </button>
      </div>
    </article>
  `).join('');

    // Attach events to new elements
    attachProductCardEvents();

    // Trigger scroll animations
    requestAnimationFrame(() => {
        document.querySelectorAll('.fade-in-up').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 60);
        });
    });
}

function attachProductCardEvents() {
    /* ── Card qty minus ── */
    document.querySelectorAll('.card-qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            if (cardQtyMap[id] > 1) {
                cardQtyMap[id]--;
                const el = document.getElementById(`card-qty-${id}`);
                if (el) el.textContent = cardQtyMap[id];
            }
        });
    });

    /* ── Card qty plus ── */
    document.querySelectorAll('.card-qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            cardQtyMap[id] = (cardQtyMap[id] || 1) + 1;
            const el = document.getElementById(`card-qty-${id}`);
            if (el) el.textContent = cardQtyMap[id];
        });
    });

    /* ── Add to Cart ── */
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            const qty = cardQtyMap[id] || 1;

            addToCart(id, qty);
            showToast(`🐟 Added to cart!`, 'success');
            animateAddToCart(btn);

            // Reset card qty display to 1
            cardQtyMap[id] = 1;
            const qtyEl = document.getElementById(`card-qty-${id}`);
            if (qtyEl) qtyEl.textContent = 1;
        });
    });
}

function animateAddToCart(btn) {
    btn.classList.add('added');
    btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    Added!`;
    setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
      Add to Cart`;
    }, 1500);
}

/* ═══════════════════════════════════════════════════════════
   RENDERING — CART
   ═══════════════════════════════════════════════════════════ */

function updateCartUI() {
    renderCartItems();
    updateCartBadge();
}

function updateCartBadge() {
    const count = cartCount();
    const badge = document.getElementById('cart-badge');
    const navText = document.getElementById('cart-nav-count');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
    if (navText) navText.textContent = count > 0 ? `(${count})` : '';
}

function renderCartItems() {
    const body = document.getElementById('cart-items-body');
    const emptyEl = document.getElementById('cart-empty-state');
    const totalEl = document.getElementById('cart-total-display');
    const footerEl = document.getElementById('cart-footer');
    if (!body) return;

    if (cart.length === 0) {
        body.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'flex';
        if (footerEl) footerEl.style.display = 'none';
        if (totalEl) totalEl.textContent = '₹0';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'flex';

    body.innerHTML = cart.map(entry => {
        const p = PRODUCTS.find(pr => pr.id === entry.id);
        if (!p) return '';
        const subtotal = p.price * entry.qty;
        return `
      <div class="cart-item" data-id="${p.id}">
        <img class="cart-item-img" src="${p.img}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=60&q=80'">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">₹${p.price} each</div>
          <div class="cart-item-controls">
            <div class="qty-selector">
              <button class="qty-btn ci-minus" data-id="${p.id}" aria-label="Decrease quantity">−</button>
              <span class="qty-display">${entry.qty}</span>
              <button class="qty-btn ci-plus"  data-id="${p.id}" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-item-subtotal">₹${subtotal}</span>
            <button class="cart-remove-btn" data-id="${p.id}" aria-label="Remove ${p.name}">🗑</button>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Attach events
    body.querySelectorAll('.ci-minus').forEach(btn => {
        btn.addEventListener('click', () => changeCartQty(Number(btn.dataset.id), -1));
    });
    body.querySelectorAll('.ci-plus').forEach(btn => {
        btn.addEventListener('click', () => changeCartQty(Number(btn.dataset.id), +1));
    });
    body.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(Number(btn.dataset.id));
            showToast('Item removed from cart', 'error');
        });
    });

    if (totalEl) totalEl.textContent = `₹${cartTotal()}`;
}

/* ═══════════════════════════════════════════════════════════
   CART DRAWER
   ═══════════════════════════════════════════════════════════ */
function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartItems();
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
    // Hide checkout form when closing
    const form = document.getElementById('checkout-form-section');
    if (form) form.classList.remove('visible');
}

/* ═══════════════════════════════════════════════════════════
   CHECKOUT FORM & INITIATE DELIVERY
   ═══════════════════════════════════════════════════════════ */

function showCheckoutForm() {
    if (cart.length === 0) {
        showToast('🛒 Your cart is empty! Add items first.', 'error');
        return;
    }
    const form = document.getElementById('checkout-form-section');
    if (!form) return;
    form.classList.add('visible');
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function validateField(id, errorId, rule) {
    const input = document.getElementById(id);
    const errEl = document.getElementById(errorId);
    const val = input ? input.value.trim() : '';
    const valid = rule(val);
    if (input) input.classList.toggle('error', !valid);
    if (errEl) errEl.textContent = valid ? '' : errEl.dataset.msg;
    return valid;
}

function buildWhatsAppMessage(name, phone, address) {
    const lines = cart.map((entry, i) => {
        const p = PRODUCTS.find(pr => pr.id === entry.id);
        if (!p) return '';
        return `${i + 1}. ${p.name} - Qty: ${entry.qty} - ₹${p.price * entry.qty}`;
    }).filter(Boolean).join('\n');

    return (
        `🛒 New Order - AK FishFarms\n\n` +
        `Customer Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Address: ${address}\n\n` +
        `Order Details:\n${lines}\n\n` +
        `Total Amount: ₹${cartTotal()}\n\n` +
        `Thank you for shopping in AK FishFarms 🐟`
    );
}

function initiateDelivery() {
    /* 1. Validate cart */
    if (cart.length === 0) {
        showToast('🛒 Add items to your cart first!', 'error');
        return;
    }

    /* 2. Validate form fields */
    const nameOk = validateField('cust-name', 'err-name', v => v.length >= 2);
    const phoneOk = validateField('cust-phone', 'err-phone', v => /^[6-9]\d{9}$/.test(v));
    const addrOk = validateField('cust-address', 'err-address', v => v.length >= 10);

    if (!nameOk || !phoneOk || !addrOk) {
        showToast('Please fill all required fields correctly.', 'error');
        return;
    }

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    /* 3. Show loading state */
    const btn = document.getElementById('initiate-delivery-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Processing…`;

    /* 4. Simulate brief processing then open WhatsApp */
    setTimeout(() => {
        const message = buildWhatsAppMessage(name, phone, address);
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        /* 5. Show success popup */
        showSuccessModal();

        /* 6. Clear cart & reset form */
        cart = [];
        saveCart();
        updateCartUI();
        resetCheckoutForm();
        closeCart();

        /* 7. Restore button */
        btn.disabled = false;
        btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      Initiate Delivery via WhatsApp
    `;
    }, 1500);
}

function resetCheckoutForm() {
    ['cust-name', 'cust-phone', 'cust-address'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('error'); }
    });
    ['err-name', 'err-phone', 'err-address'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
    const form = document.getElementById('checkout-form-section');
    if (form) form.classList.remove('visible');
}

/* ═══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
   ═══════════════════════════════════════════════════════════ */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('leaving');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

/* ═══════════════════════════════════════════════════════════
   SUCCESS MODAL
   ═══════════════════════════════════════════════════════════ */
function showSuccessModal() {
    const overlay = document.getElementById('success-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('show');
}
function hideSuccessModal() {
    const overlay = document.getElementById('success-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
}

/* ═══════════════════════════════════════════════════════════
   CATEGORY TABS
   ═══════════════════════════════════════════════════════════ */
function initCategoryTabs() {
    const tabsContainer = document.getElementById('category-tabs');
    if (!tabsContainer) return;

    const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];
    tabsContainer.innerHTML = categories.map(cat => `
    <button class="tab-btn ${cat === 'All' ? 'active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');

    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.cat;
            renderProducts(activeCategory);
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
function initNavbar() {
    /* Scroll effect */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    /* Hamburger */
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        menu.classList.toggle('open');
    });

    /* Close mobile menu on link click */
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            ham.classList.remove('open');
            menu.classList.remove('open');
        });
    });

    /* Cart nav button */
    document.getElementById('cart-nav-btn').addEventListener('click', openCart);
}

/* ═══════════════════════════════════════════════════════════
   SCROLL SPY (active nav link)
   ═══════════════════════════════════════════════════════════ */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === entry.target.id);
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(sec => observer.observe(sec));
}

/* ═══════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (fade-in-up observer)
   ═══════════════════════════════════════════════════════════ */
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up:not(.product-card)').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   HERO BUTTON — SCROLL TO PRODUCTS
   ═══════════════════════════════════════════════════════════ */
function initHeroCTA() {
    const shopNow = document.getElementById('hero-shop-btn');
    if (shopNow) {
        shopNow.addEventListener('click', () => {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/* ═══════════════════════════════════════════════════════════
   CART DRAWER EVENT BINDINGS
   ═══════════════════════════════════════════════════════════ */
function initCartDrawerEvents() {
    /* Close drawer */
    document.getElementById('cart-close-btn').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);

    /* Keyboard close */
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCart();
    });

    /* Expand checkout form button */
    document.getElementById('checkout-expand-btn').addEventListener('click', showCheckoutForm);

    /* Initiate Delivery button */
    document.getElementById('initiate-delivery-btn').addEventListener('click', initiateDelivery);

    /* Real-time field validation */
    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    const addrInput = document.getElementById('cust-address');

    if (nameInput) {
        nameInput.addEventListener('input', () =>
            validateField('cust-name', 'err-name', v => v.length >= 2));
    }
    if (phoneInput) {
        phoneInput.addEventListener('input', () =>
            validateField('cust-phone', 'err-phone', v => /^[6-9]\d{9}$/.test(v)));
    }
    if (addrInput) {
        addrInput.addEventListener('input', () =>
            validateField('cust-address', 'err-address', v => v.length >= 10));
    }
}

/* ═══════════════════════════════════════════════════════════
   SUCCESS MODAL EVENT
   ═══════════════════════════════════════════════════════════ */
function initSuccessModal() {
    document.getElementById('modal-close-btn').addEventListener('click', hideSuccessModal);
    document.getElementById('success-modal-overlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) hideSuccessModal();
    });
}

/* ═══════════════════════════════════════════════════════════
   WHATSAPP CONTACT BUTTON
   ═══════════════════════════════════════════════════════════ */
function initWhatsAppContact() {
    const btn = document.getElementById('whatsapp-contact-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I have a query about AK FishFarms 🐟')}`, '_blank');
        });
    }
}

/* ═══════════════════════════════════════════════════════════
   RIPPLE EFFECT (UX polish)
   ═══════════════════════════════════════════════════════════ */
function addRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.left = `${e.clientX - rect.left - 40}px`;
    ripple.style.top = `${e.clientY - rect.top - 40}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

function initRippleEffects() {
    ['checkout-expand-btn', 'initiate-delivery-btn', 'modal-close-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', addRipple);
    });
}

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initNavbar();
    initCategoryTabs();
    renderProducts('All');
    updateCartUI();
    initCartDrawerEvents();
    initSuccessModal();
    initScrollSpy();
    initScrollAnimations();
    initHeroCTA();
    initWhatsAppContact();
    initRippleEffects();

    console.log('%cAK FishFarms 🐟', 'color:#FF6B00;font-size:20px;font-weight:900;');
    console.log('%cStore loaded — LocalStorage backend active.', 'color:#FFD84D;font-size:13px;');
});
