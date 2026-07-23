/**
 * AROFRAG - Global Application Controller
 * Handles global header updates, badge counts, and user authentication states.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize global UI updates
    updateGlobalBadges();
    initUserSessionUI();
    initResponsiveNavigation();

    // 2. Setup dynamic event listeners for cross-script communication
    window.addEventListener('cartUpdated', () => {
        updateGlobalBadges();
    });

    window.addEventListener('wishlistUpdated', () => {
        updateGlobalBadges();
    });

    // 3. Listen for local storage changes across browser tabs/windows
    window.addEventListener('storage', (e) => {
        if (e.key === window.CART_KEY || e.key === window.WISHLIST_KEY) {
            updateGlobalBadges();
        }
        if(e.key==="user"){
         initUserSessionUI();
        }

    });
});

function initResponsiveNavigation() {
    const header = document.querySelector('header');
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!header || !toggle || !menu) return;
    if (!menu.id) menu.id = 'primary-navigation';
    toggle.setAttribute('aria-controls', menu.id);
    if (!toggle.hasAttribute('aria-expanded')) toggle.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
    };

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeMenu(); });
    window.addEventListener('scroll', () => header.classList.toggle('sticky', window.scrollY > 16), { passive: true });
}

/**
 * Updates cart and wishlist counters dynamically across the entire document
 */
function updateGlobalBadges() {
    // A. Cart Counter Calculations
    const cart = JSON.parse(localStorage.getItem(window.CART_KEY)) || [];
    const totalCartItems = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);

    document.querySelectorAll('.cart-count').forEach(countEl => {
        countEl.textContent = totalCartItems;
        countEl.style.display = totalCartItems > 0 ? 'inline-flex' : 'none';
    });
    
    // Find shopping bags (using icon parents or classes)
    const cartIcons = document.querySelectorAll('a[href="cart.html"]');
    cartIcons.forEach(icon => {
        // Find existing badge, or create one
        let badge = icon.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: #111;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 600;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Poppins', sans-serif;
            `;
            // Ensure parent has relative positioning for badge placement
            if (window.getComputedStyle(icon).position === 'static') {
                icon.style.position = 'relative';
            }
            icon.appendChild(badge);
        }
        
        badge.textContent = totalCartItems;
        badge.style.display = totalCartItems > 0 ? 'flex' : 'none';
    });

    // B. Wishlist Counter Calculations
    const wishlist = JSON.parse(localStorage.getItem(window.WISHLIST_KEY)) || [];
    const totalWishlistItems = wishlist.length;

    // Find wishlist links (matches regular heart icons)
    const wishlistIcons = document.querySelectorAll('a[href*="wishlist.html"], a[title="wishlist"]');
    wishlistIcons.forEach(icon => {
        let badge = icon.querySelector('.wishlist-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'wishlist-badge';
            badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 600;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Poppins', sans-serif;
            `;
            if (window.getComputedStyle(icon).position === 'static') {
                icon.style.position = 'relative';
            }
            icon.appendChild(badge);
        }

        badge.textContent = totalWishlistItems;
        badge.style.display = totalWishlistItems > 0 ? 'flex' : 'none';
    });
}

/**
 * Initializes and dynamically displays user profile status in the header
 */
function initUserSessionUI() {
    const userElement = document.querySelector('a[href="login.html"]');
    if (!userElement) return;

const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser && loggedInUser.fullName) {
        // Create an elegant dropdown structure instead of a hardcoded login link
        const initials = loggedInUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        userElement.href = '#';
        userElement.innerHTML = `
            <div class="user-avatar-container" style="position: relative; display: inline-block; cursor: pointer;">
                <span class="user-avatar" style="
                    display: inline-flex; 
                    align-items: center; 
                    justify-content: center; 
                    width: 28px; 
                    height: 28px; 
                    background: #111; 
                    color: #fff; 
                    border-radius: 50%; 
                    font-size: 0.75rem; 
                    font-weight: 600; 
                    letter-spacing: 0.5px;
                ">${initials}</span>
                
                <div class="user-dropdown" style="
                    display: none;
                    position: absolute;
                    right: 0;
                    top: 130%;
                    background: #fff;
                    border: 1px solid #eee;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    min-width: 160px;
                    z-index: 999;
                    font-family: 'Poppins', sans-serif;
                    text-align: left;
                ">
                    <div style="padding: 10px 15px; border-bottom: 1px solid #f5f5f5; font-size: 0.8rem; color: #888;">
                        Hello, <strong style="color: #111; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${loggedInUser.fullName}</strong>
                    </div>
                    <a href="wishlist.html" style="display: block; padding: 10px 15px; color: #333; text-decoration: none; font-size: 0.85rem; border-bottom: 1px solid #f5f5f5;">My Wishlist</a>
                    <a href="#" id="btnLogout" style="display: block; padding: 10px 15px; color: #e11d48; text-decoration: none; font-size: 0.85rem; font-weight: 500;">Logout</a>
                </div>
            </div>
        `;

        // Toggle user menu dropdown
        const container = userElement.querySelector('.user-avatar-container');
        const dropdown = userElement.querySelector('.user-dropdown');
        
        container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });

        // Handle logout process
        const btnLogout = userElement.querySelector('#btnLogout');
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.showToast('Logged out successfully.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    } else {
        // Keep the original default state (User Icon) if guest
        userElement.href = 'login.html';
        userElement.innerHTML = `<i class="fa-regular fa-user"></i>`;
    }
}
