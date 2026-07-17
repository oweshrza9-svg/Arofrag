
// --- SHARED UTILITIES (Self-Contained) ---
const CART_KEY = 'arofrag_cart';
const WISHLIST_KEY = 'arofrag_wishlist';

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }

    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

function showToast(message, type = 'success') {
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }

    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `background: ${type === 'success' ? '#10B981' : '#EF4444'}; color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif; transition: all 0.3s ease;`;
    toast.textContent = message;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function addToCart(product, size, quantity = 1) {
    const cartKey = window.CART_KEY || CART_KEY;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const productId = String(product._id || product.id);
    const existingIndex = cart.findIndex(item => String(item.id) === productId && item.size === size);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image || (product.images ? product.images[0] : 'assets/placeholder.png'),
            size: size,
            quantity: quantity
        });
    }
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartBadge();
    showToast(`${product.name} (${size}) added to cart!`);
}

// --- HOME PAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Smooth scroll for "Shop Now" hero button
    const shopNowBtn = document.querySelector('a[href="#signature-collection"]');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#signature-collection')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Dynamic Signature Collection Setup// Dynamic Signature Collection Setup - fallback to static JSON for production
fetch("json/products.json")
  .then(res => res.json())
  .then(data => {
    // Support both {products: [...]} API shape and direct array
    const products = Array.isArray(data) ? data : (data.products || data);
    renderSignatureCollection(products);
  })
  .catch(error => {
    console.error("Error loading homepage products:", error);
    // Silent fallback - container stays empty as before
  });
    });
function renderSignatureCollection(products) {
    const container = document.querySelector('#signature-collection-grid');
    if (!container) return;

    const featured = products.slice(0,4);
    container.innerHTML = featured.map(p => `
<div class="product-card" data-id="${p._id || p.id}">
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}" onclick="window.location.href='product.html?id=${p._id || p.id}'">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="price">₹${p.price}</p>
                <div class="sizes-container">
                    ${p.sizes.map((s, idx) => `
                        <span class="size-chip ${idx === 0 ? 'active' : ''}" 
                              onclick="selectHomeSize(this)">${s}</span>
                    `).join('')}
                </div>
                <div class="actions">
                    <a href="product.html?id=${p._id || p.id}" class="details-btn">View Details</a>
                    <button class="add-to-cart-btn" onclick="handleHomeAddToCart('${p._id || p.id}')">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ... keep existing selectHomeSize ...




// Handler for size chip selection
window.selectHomeSize = function(element) {
    const container = element.parentElement;
    container.querySelectorAll('.size-chip').forEach(c => c.style.borderColor = '#ccc');
    element.style.borderColor = '#000'; // Or whatever active color your theme uses
    container.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
};


// Handler for homepage Add to Cart
window.handleHomeAddToCart = function(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    const button = card ? card.querySelector('.add-to-cart-btn') : null;

    if (button && button.dataset.busy === 'true') return;
    if (button) {
        button.dataset.busy = 'true';
        button.disabled = true;
        button.textContent = 'Adding...';
    }

    function stopBusy() {
        if (button) {
            button.dataset.busy = 'false';
            button.disabled = false;
            button.textContent = 'Add to Cart';
        }
    }

    function doAddToCart(products) {
        const product = products.find(p => String(p._id || p.id) === String(productId));
        if (!product) return;
        const activeSizeChip = card ? card.querySelector('.size-chip.active') || card.querySelector('.size-chip') : null;
        const size = activeSizeChip ? activeSizeChip.textContent.trim() : (product.sizes ? product.sizes[0] : '6ml');
        addToCart(product, size, 1);
    }

    fetch("http://localhost:5000/api/products")
        .then(res => { if (!res.ok) throw new Error(); return res.json(); })
        .then(data => doAddToCart(data.products || data))
        .catch(() => {
            fetch("json/products.json")
                .then(res => res.json())
                .then(data => doAddToCart(Array.isArray(data) ? data : (data.products || data)))
                .catch(() => {});
        })
        .finally(stopBusy);
};

