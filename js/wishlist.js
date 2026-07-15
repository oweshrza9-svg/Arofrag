/**
 * AROFRAG - Wishlist Controller
 * Manages adding, viewing, removing, and transferring items to the shopping cart.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Render the list as soon as the page finishes loading
    renderWishlist();
});

/**
 * Grabs favorites from storage and displays them nicely on the page
 */
function renderWishlist() {
    // 1. Find the wishlist grid on the HTML page
    const container = document.getElementById('wishlistContainer');
    if (!container) return; // If we aren't on wishlist.html, stop running

    // 2. Load the items from local storage
    const wishlist = JSON.parse(localStorage.getItem(window.WISHLIST_KEY)) || [];

    // 3. If there are no items, show a friendly empty message
    if (wishlist.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <i class="fa-regular fa-heart" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <h3 style="font-family: 'Cinzel', serif; margin-bottom: 10px;">Your Wishlist is Empty</h3>
                <p style="color: #666; margin-bottom: 20px;">Save your favorite fragrances here to keep track of them.</p>
                <a href="shop.html" style="display: inline-block; padding: 12px 30px; background: #111; color: #fff; text-decoration: none; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">Go to Shop</a>
            </div>
        `;
        return;
    }

    // 4. Build and insert the HTML for every favorited item in the list
    let htmlContent = '';

    for (let i = 0; i < wishlist.length; i++) {
        const item = wishlist[i];
        
        // Ensure clean numbers and proper currency formats using our util.js helpers
        const displayPrice = window.formatCurrency(item.price);
        const itemImg = item.image || 'assets/arologopng.png'; // fallback image

        htmlContent += `
            <div class="wishlist-card" style="border: 1px solid #eee; padding: 20px; background: #fff; display: flex; flex-direction: column; justify-content: space-between; text-align: center; transition: box-shadow 0.3s;">
                <div style="position: relative; margin-bottom: 15px;">
                    <img src="${itemImg}" alt="${item.name}" style="width: 100%; max-height: 200px; object-fit: contain; margin-bottom: 15px;">
                    <button onclick="removeFromWishlist(${i})" style="position: absolute; top: 0; right: 0; background: #fff; border: 1px solid #eee; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #e11d48; box-shadow: 0 2px 5px rgba(0,0,0,0.05);" title="Remove">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div>
                    <h3 style="font-family: 'Cinzel', serif; font-size: 1.1rem; margin-bottom: 8px; color: #111;">${item.name}</h3>
                    <p style="color: #888; font-size: 0.85rem; margin-bottom: 10px;">Size: ${item.size || '6ml'}</p>
                    <p style="font-weight: 600; font-size: 1rem; color: #111; margin-bottom: 15px;">${displayPrice}</p>
                </div>
                <button onclick="moveItemToCart(${i})" style="width: 100%; padding: 12px; background: #111; color: #fff; border: none; font-size: 0.85rem; font-weight: 500; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                </button>
            </div>
        `;
    }

    container.innerHTML = htmlContent;
}

/**
 * Removes a single item from the user's wishlist
 */
window.removeFromWishlist = function(index) {
    // 1. Fetch current list
    let wishlist = JSON.parse(localStorage.getItem(window.WISHLIST_KEY)) || [];
    
    // 2. Grab item name before we delete it (for toast notification)
    const itemName = wishlist[index] ? wishlist[index].name : 'Item';

    // 3. Delete the item at the clicked index position
    wishlist.splice(index, 1);
    
    // 4. Save the updated list back to browser memory
    localStorage.setItem(window.WISHLIST_KEY, JSON.stringify(wishlist));
    
    // 5. Fire a custom event to update navbar heart counters instantly
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    
    // 6. Notify user and re-render the page view
    window.showToast(`${itemName} removed from wishlist.`);
    renderWishlist();
};

/**
 * Transfers a saved item directly into the shopping cart
 */
window.moveItemToCart = function(index) {
    // 1. Fetch current lists
    let wishlist = JSON.parse(localStorage.getItem(window.WISHLIST_KEY)) || [];
    let cart = JSON.parse(localStorage.getItem(window.CART_KEY)) || [];

    const selectedItem = wishlist[index];
    if (!selectedItem) return;

    // 2. Check if this product already exists in the cart (by name and bottle size)
    let foundInCartIndex = -1;
    for (let c = 0; c < cart.length; c++) {
        if (cart[c].name === selectedItem.name && cart[c].size === selectedItem.size) {
            foundInCartIndex = c;
            break;
        }
    }

    // 3. If it is already in the cart, simply increase its quantity by 1
    if (foundInCartIndex !== -1) {
        cart[foundInCartIndex].quantity = (parseInt(cart[foundInCartIndex].quantity) || 1) + 1;
    } else {
        // Otherwise, insert it as a brand-new item
        cart.push({
            name: selectedItem.name,
            price: selectedItem.price,
            image: selectedItem.image,
            size: selectedItem.size || '6ml',
            quantity: 1
        });
    }

    // 4. Remove the item from the wishlist
    wishlist.splice(index, 1);

    // 5. Save updated lists to local storage
    localStorage.setItem(window.CART_KEY, JSON.stringify(cart));
    localStorage.setItem(window.WISHLIST_KEY, JSON.stringify(wishlist));

    // 6. Fire live events to refresh both navbar counters instantly
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));

    // 7. Notify the user and update the page
    window.showToast(`${selectedItem.name} moved to shopping cart!`);
    renderWishlist();
};