/**
 * AROFRAG Shared Utilities & Helper Functions
 */

// Global Storage Keys
window.CART_KEY = 'arofrag_cart';
window.WISHLIST_KEY = 'arofrag_wishlist';
window.USER_KEY = 'arofrag_user';

/**
 * Safely parses and extracts clean numerical values from prices
 * Handles structures like: "₹999", "1,200", 999
 */
window.cleanPrice = function(price) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const cleaned = String(price).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
};

/**
 * Formats a raw number to the Indian Rupee system (e.g., 1200 -> ₹1,200)
 */
window.formatCurrency = function(amount) {
    const numericAmount = window.cleanPrice(amount);
    return `₹${numericAmount.toLocaleString('en-IN')}`;
};

/**
 * Shows a elegant, temporary toast notification on the screen
 * Prevents having to use ugly browser alert() popups
 */
window.showToast = function(message, type = 'success') {
    // Check if toast container exists, if not make one
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-family: 'Poppins', sans-serif;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        padding: 12px 24px;
        background: ${type === 'error' ? '#ef4444' : '#111827'};
        color: #fff;
        font-size: 0.9rem;
        font-weight: 500;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger Entrance animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 50);

    // Trigger Exit and Removal
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
};