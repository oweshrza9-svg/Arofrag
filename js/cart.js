const CART_KEY = 'arofrag_cart';

// We match the threshold in your index/shop announcement bar (₹999)
const FREE_SHIPPING_THRESHOLD = 999; 
const SHIPPING_CHARGE = 150;

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
    // Listen for storage updates from other tabs/pages
    window.addEventListener('storage', (e) => {
        if (e.key === CART_KEY) {
            renderCart();
        }
    });
});

/**
 * Robust helper to safely extract numeric values from prices (handles "₹999", "1,200", etc.)
 */
function cleanPrice(price) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const cleaned = String(price).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
}

/**
 * Main render function
 */
function renderCart() {
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const container = document.querySelector('#cart-items-container');
    const summarySubtotal = document.querySelector('#cart-subtotal');
    const summaryShipping = document.querySelector('#cart-shipping');
    const summaryTotal = document.querySelector('#cart-total');
    const badgeElements = document.querySelectorAll('.cart-badge'); // Match all badges (desktop & mobile mobile menus)

    // 1. Update Badge Counts on all matching elements across the page
    const totalItems = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
    const countElements = document.querySelectorAll('.cart-count');
    badgeElements.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    countElements.forEach(countEl => {
        countEl.textContent = totalItems;
        countEl.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    });

    // Dispatch a custom event in case navbar elements need to listen to cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart, totalItems } }));

    if (!container) return;

    // 2. Handle Empty Cart
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 60px 20px; max-width: 400px; margin: 0 auto;">
                <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <h3 style="font-family: 'Cinzel', serif; margin-bottom: 10px;">Your Cart is Empty</h3>
                <p style="color: #666; font-size: 0.95rem; margin-bottom: 20px;">Discover handcrafted luxury attars inspired by centuries of Indian perfumery.</p>
                <a href="shop.html" class="shop-now-btn" style="display: inline-block; padding: 12px 30px; background: #111; color: #fff; text-decoration: none; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; border-radius: 0; transition: background 0.3s;">Shop Fragrances</a>
            </div>
        `;
        if (summarySubtotal) summarySubtotal.textContent = '₹0';
        if (summaryShipping) summaryShipping.textContent = '₹0';
        if (summaryTotal) summaryTotal.textContent = '₹0';
        return;
    }

    // 3. Render Cart List Items (Safeguarded and clean)
    container.innerHTML = cart.map((item, index) => {
        const itemPrice = cleanPrice(item.price);
        const itemQty = parseInt(item.quantity) || 1;
        const lineTotal = itemPrice * itemQty;
        const itemImg = item.image || 'assets/arologopng.png'; // Fallback to logo if image is missing

        return `
            <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid #f3f3f3; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
                    <img src="${itemImg}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border: 1px solid #eee; background: #fafafa;">
                    <div>
                        <h4 style="margin: 0 0 5px 0; font-family: 'Cinzel', serif; font-size: 1.05rem; letter-spacing: 0.5px;">${item.name}</h4>
                        <p style="margin: 0 0 8px 0; color: #888; font-size: 0.85rem;">Size: <span style="color: #333; font-weight: 500;">${item.size || '6ml'}</span></p>
                        <p style="margin: 0; font-weight: 600; color: #111; font-size: 0.95rem;">₹${itemPrice.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 12px; min-width: 110px;">
                    <div style="display: flex; align-items: center; border: 1px solid #ddd; background: #fff;">
                        <button onclick="changeQty(${index}, -1)" style="border: none; background: none; padding: 6px 12px; cursor: pointer; font-size: 0.9rem; font-weight: bold; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">-</button>
                        <span style="padding: 0 6px; font-weight: 500; font-size: 0.9rem; min-width: 20px; text-align: center;">${itemQty}</span>
                        <button onclick="changeQty(${index}, 1)" style="border: none; background: none; padding: 6px 12px; cursor: pointer; font-size: 0.9rem; font-weight: bold; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">+</button>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-weight: 600; margin: 0; color: #111; font-size: 1rem;">₹${lineTotal.toLocaleString('en-IN')}</p>
                        <button onclick="removeItem(${index})" style="background: none; border: none; color: #e11d48; cursor: pointer; font-size: 0.8rem; margin-top: 5px; padding: 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; transition: color 0.2s;" onmouseover="this.style.color='#9f1239'" onmouseout="this.style.color='#e11d48'">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 4. Correct Dynamic Price Calculation matching shipping parameters
    const subtotal = cart.reduce((sum, item) => sum + (cleanPrice(item.price) * (parseInt(item.quantity) || 1)), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const total = subtotal + shipping;

    if (summarySubtotal) summarySubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (summaryShipping) {
        summaryShipping.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`;
        if (shipping === 0) {
            summaryShipping.style.color = '#16a34a'; // Turn "FREE" green to make it look premium
            summaryShipping.style.fontWeight = '600';
        } else {
            summaryShipping.style.color = '';
            summaryShipping.style.fontWeight = '';
        }
    }
    if (summaryTotal) summaryTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

/**
 * Handle Quantity Alterations
 */
window.changeQty = function(index, amount) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    if (cart[index]) {
        let currentQty = parseInt(cart[index].quantity) || 1;
        currentQty += amount;
        
        if (currentQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = currentQty;
        }
        
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderCart();
    }
};

/**
 * Handle Removing Single Items
 */
window.removeItem = function(index) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
};