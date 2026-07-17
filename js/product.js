/**
 * AROFRAG - Product Details Controller
 * Handles loading product parameters, interactive image galleries, 
 * bottle size changes, and the dynamic cart/wishlist engines.
 */

// --- Global Active Variables ---
let currentProduct = null;
let selectedSize = '6ml'; // default size
let selectedPrice = 0;

// Fallback Product list matching shop.js to prevent empty pages if JSON load fails
const fallbackProductsList = [
    {
        "id": 1,
        "name": "Gulab Attar",
        "category": "Floral",
        "price": 599,
        "image": "assets/images/products/gulab.jpg",
        "description": "Handcrafted pure Kannauj rose petals distilled gently to capture timeless luxury."
    },
    {
        "id": 2,
        "name": "Mitti Attar",
        "category": "Earthy",
        "price": 799,
        "image": "assets/images/products/mitti.jpg",
        "description": "The scent of first rain falling on baked soil, traditional and incredibly calming."
    },
    {
        "id": 3,
        "name": "White Oud",
        "category": "Woody",
        "price": 999,
        "image": "assets/images/products/white-oud.jpg",
        "description": "Rich resinous Agarwood balanced perfectly with soft vanilla and light spices."
    },
    {
        "id": 4,
        "name": "Mogra Attar",
        "category": "Floral",
        "price": 649,
        "image": "assets/images/products/mogra.jpg",
        "description": "Sweet, calming Jasmine Sambac blossoms extracted in a traditional sandalwood base."
    },
    {
        "id": 5,
        "name": "Kesar Chandan",
        "category": "Spicy",
        "price": 899,
        "image": "assets/images/products/kesar-chandan.jpg",
        "description": "Premium Kashmiri Saffron infused inside a creamy Mysore Sandalwood base."
    },
    {
        "id": 6,
        "name": "Royal Amber",
        "category": "Woody",
        "price": 1199,
        "image": "assets/images/products/amber.jpg",
        "description": "Deep balsamic warmth blended with golden resins for an imperial experience."
    }
];

// --- Initialize Page ---
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    setupTabControls();
});

/**
 * 1. Reads the "?id=X" from the URL and fetches corresponding details
 */
function loadProductDetails() {
    // Read parameters from URL (e.g. ?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    // If there is no ID parameter, redirect to the shop page
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    // Try fetching from the server, fall back to list if offline
   fetch("http://localhost:5000/api/products")
    .then(response=>{

        if(!response.ok) throw new Error();

        return response.json();

    })

    .then(data=>{

        initializeProductPage(data.products,productId);

    })

    .catch(()=>{

        initializeProductPage(fallbackProductsList,productId);

    });
}

/**
 * 2. Matches product details and renders them dynamically onto HTML IDs/Classes
 */
function initializeProductPage(productsArray, targetId) {
    // Find matching product - support both MongoDB _id and fallback id
const found = productsArray.find(item => String(item._id || item.id) === String(targetId));
 if (!found) {
        // Product doesn't exist, go back to shop
        window.location.href = 'shop.html';
        return;
    }

    currentProduct = found;
    selectedPrice = currentProduct.price; // Start with default 6ml base price

    // Render Basic Info
    const pName = document.querySelector('.product-title') || document.getElementById('productName');
    const pPrice = document.querySelector('.product-price') || document.getElementById('productPrice');
    const pDesc = document.querySelector('.product-description') || document.getElementById('productDescription');
    const pCategory = document.querySelector('.product-category') || document.getElementById('productCategory');
    const pMainImg = document.getElementById('mainProductImage') || document.getElementById('mainProductImg') || document.querySelector('.main-img');

    if (pName) pName.textContent = currentProduct.name;
    if (pDesc) pDesc.textContent = currentProduct.description;
    if (pCategory) pCategory.textContent = currentProduct.category;
    if (pPrice) pPrice.textContent = window.formatCurrency(selectedPrice);
    
    if (pMainImg) {
        pMainImg.src = currentProduct.image && !currentProduct.image.includes('ADD') 
       ? currentProduct.image 
       : 'assets/arologopng.png';
        pMainImg.alt = currentProduct.name;
    }

    // Set up interactive UI control listeners
    setupThumbnailGallery();
    setupSizeSelectors();
    setupQuantityCounters();
    setupSubmissionButtons();
}
 
/**
 * 3. Handles click actions on secondary thumbnail images
 */
function setupThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-img');
    const mainImg = document.getElementById('mainProductImg') || document.querySelector('.main-img');

    if (!thumbnails.length || !mainImg) return;

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active classes
            thumbnails.forEach(t => t.classList.remove('active'));
            // Set clicked thumbnail active
            thumb.classList.add('active');
            // Swap main display image
            mainImg.src = thumb.src;
        });
    });
}
 // mismatch
/**
 * 4. Manages Bottle Size selection and adjusts prices proportionally
 */
function setupSizeSelectors() {
    // Handle size buttons (.size-btn) with click events
    const sizeBtns = document.querySelectorAll('.size-btn');
    const pPrice = document.querySelector('.product-price') || document.getElementById('productPrice');

    if (!sizeBtns.length) return;

    // Set initial selectedSize from the active button
    const activeBtn = document.querySelector('.size-btn.active');
    if (activeBtn) selectedSize = activeBtn.textContent.trim();

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            selectedSize = btn.textContent.trim(); // e.g. "3ml", "6ml", "12ml"

            const basePrice = currentProduct.price;
            if (selectedSize === '3ml') {
                selectedPrice = Math.round((basePrice * 0.5) + 50);
            } else if (selectedSize === '12ml') {
                selectedPrice = Math.round(basePrice * 1.8);
            } else {
                selectedSize = '6ml';
                selectedPrice = basePrice;
            }

            // Update the display price
            if (pPrice) {
                pPrice.textContent = window.formatCurrency(selectedPrice);
            }
        });
    });
}

/**
 * 5. Limits quantity changes to valid boundaries (1 to 10)
 */
function setupQuantityCounters() {
    const btnMinus = document.querySelector('.qty-minus') || document.getElementById('qtyMinus');
    const btnPlus = document.querySelector('.qty-plus') || document.getElementById('qtyPlus');
    const inputQty = document.getElementById('quantity') || document.querySelector('.qty-input') || document.getElementById('qtyInput');

    if (!btnMinus || !btnPlus || !inputQty) return;

    btnMinus.addEventListener('click', () => {
        let currentVal = parseInt(inputQty.value) || 1;
        if (currentVal > 1) {
            inputQty.value = currentVal - 1;
        }
    });

    btnPlus.addEventListener('click', () => {
        let currentVal = parseInt(inputQty.value) || 1;
        if (currentVal < 10) { // Limit individual items to 10 max per purchase
            inputQty.value = currentVal + 1;
        } else {
            window.showToast("Maximum ordering quantity is 10 units.", "error");
        }
    });
}

/**
 * 6. Sets up listeners for add-to-cart and wishlist button configurations
 */
function setupSubmissionButtons() {
    const btnAddToCart = document.getElementById('addToCartBtn') || document.querySelector('.add-cart-btn');
    const btnAddToWishlist = document.getElementById('addToWishlistBtn') || document.querySelector('.wishlist-btn');
    const btnBuyNow = document.querySelector('.buy-now-btn');

    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            if (!currentProduct) return;

            const inputQty = document.querySelector('.qty-input') || document.getElementById('qtyInput');
            const qtyToAdd = inputQty ? parseInt(inputQty.value) || 1 : 1;

            let cart = JSON.parse(localStorage.getItem(window.CART_KEY)) || [];

            // Check if product already exists in cart with this exact size
            const existingIndex = cart.findIndex(item => item.name === currentProduct.name && item.size === selectedSize);

            if (existingIndex !== -1) {
                cart[existingIndex].quantity = (parseInt(cart[existingIndex].quantity) || 0) + qtyToAdd;
            } else {
                cart.push({
                    id: String(currentProduct._id || currentProduct.id),
                    name: currentProduct.name,
                    price: selectedPrice,
                    image: currentProduct.image,
                    size: selectedSize,
                    quantity: qtyToAdd
                });
            }

            localStorage.setItem(window.CART_KEY, JSON.stringify(cart));
            
            // Instantly update badge counters across navbar
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            window.showToast(`${qtyToAdd} x ${currentProduct.name} (${selectedSize}) added to cart.`);
        });
    }
    if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
        if (!currentProduct) return;

        const inputQty = document.querySelector('.qty-input') ||
                         document.getElementById('qtyInput') ||
                         document.getElementById('quantity');

        const qtyToAdd = inputQty ? parseInt(inputQty.value) || 1 : 1;

        let cart = JSON.parse(localStorage.getItem(window.CART_KEY)) || [];

        const existingIndex = cart.findIndex(
            item => item.name === currentProduct.name && item.size === selectedSize
        );

        if (existingIndex !== -1) {
            cart[existingIndex].quantity =
                (parseInt(cart[existingIndex].quantity) || 0) + qtyToAdd;
        } else {
            cart.push({
                id: String(currentProduct._id || currentProduct.id),
                name: currentProduct.name,
                price: selectedPrice,
                image: currentProduct.image,
                size: selectedSize,
                quantity: qtyToAdd
            });
        }

        localStorage.setItem(window.CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        window.location.href = 'checkout.html';
    });
}

    if (btnAddToWishlist) {
        btnAddToWishlist.addEventListener('click', () => {
            if (!currentProduct) return;

            let wishlist = JSON.parse(localStorage.getItem(window.WISHLIST_KEY)) || [];

            // Prevent duplicating identical name items
            const alreadySaved = wishlist.some(item => item.name === currentProduct.name);

            if (alreadySaved) {
                window.showToast(`${currentProduct.name} is already in your wishlist!`, 'error');
                return;
            }

            wishlist.push({
                name: currentProduct.name,
                price: selectedPrice,
                image: currentProduct.image,
                size: selectedSize
            });

            localStorage.setItem(window.WISHLIST_KEY, JSON.stringify(wishlist));
            
            // Update wishlist hearts
            window.dispatchEvent(new CustomEvent('wishlistUpdated'));
            window.showToast(`${currentProduct.name} saved to wishlist.`);
        });
    }
}

/**
 * 7. Tab toggles (Description, Fragrance Notes, and Reviews tabs)
 */
function setupTabControls() {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (!tabs.length || !tabPanels.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');

            // Set clicked tab active, clear out others
            tabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            
            const activePanel = document.getElementById(targetId);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
}

