/**
 * AROFRAG - Shop Controller
 * Handles loading, rendering, searching, filtering, sorting, and paginating products.
 */

// --- Global Variables ---
let allProducts = [];       // Will store the master list of products
let filteredProducts = [];  // Will store products that pass active searches and filters
let currentPage = 1;        // Current page number
const itemsPerPage = 6;     // Show maximum 6 items per page for a clean layout


// --- Initialize Shop ---
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadProducts();
});

/**
 * Loads products from JSON, or uses our fallback list if offline or running locally
 */
async function loadProducts(){
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('API unavailable');
        const data = await response.json();
        allProducts = Array.isArray(data) ? data : (data.products || []);
    } catch (error) {
        try {
            const localResponse = await fetch('json/products.json');
            const localData = await localResponse.json();
            allProducts = Array.isArray(localData) ? localData : (localData.products || []);
        } catch (localError) {
            console.error(localError);
            allProducts = [];
        }
    } finally {
        initializeShopFlow();
    }
}
/**
 * Common startup procedures once products are ready
 */
function initializeShopFlow() {
    filteredProducts = [...allProducts];
    populateCategoryDropdown();
    applyFiltersAndRender();
}

/**
 * Sets up listening actions for Search, Category, and Sorting inputs
 */
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortProducts = document.getElementById('sortProducts');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1; // reset to page 1 on search
            applyFiltersAndRender();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            currentPage = 1; // reset to page 1 on filter
            applyFiltersAndRender();
        });
    }

    if (sortProducts) {
        sortProducts.addEventListener('change', () => {
            applyFiltersAndRender();
        });
    }
}

/**
 * Scans products and automatically builds category dropdown options
 */
function populateCategoryDropdown() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;

    // Use a temporary list to find all unique categories
    const categories = ['all'];
    for (let i = 0; i < allProducts.length; i++) {
        const cat = allProducts[i].category;
        if (categories.indexOf(cat) === -1) {
            categories.push(cat);
        }
    }

    // Clear existing (keep 'All Categories')
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add unique categories to dropdown
    for (let i = 1; i < categories.length; i++) {
        const catName = categories[i];
        categoryFilter.innerHTML += `<option value="${catName}">${catName}</option>`;
    }
}

/**
 * Combines Search, Filter, and Sorting logic then triggers rendering
 */
function applyFiltersAndRender() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortProducts = document.getElementById('sortProducts');

    let tempResults = [...allProducts];

    // 1. Filter by Search Query
    if (searchInput && searchInput.value.trim() !== '') {
        const query = searchInput.value.toLowerCase();
        tempResults = tempResults.filter(product => {
            const name = (product.name || '').toLowerCase();
            const description = (product.description || '').toLowerCase();
            const category = (product.category || '').toLowerCase();
            return name.includes(query) || description.includes(query) || category.includes(query);
        });
    }

    // 2. Filter by Category Selectors
    if (categoryFilter && categoryFilter.value !== 'all') {
        const selectedCategory = categoryFilter.value;
        tempResults = tempResults.filter(product => product.category === selectedCategory);
    }

    // 3. Sort Results
    if (sortProducts && sortProducts.value !== 'default') {
        const sortingType = sortProducts.value;
        if (sortingType === 'low-high') {
            tempResults.sort((a, b) => a.price - b.price);
        } else if (sortingType === 'high-low') {
            tempResults.sort((a, b) => b.price - a.price);
        } else if (sortingType === 'az') {
            tempResults.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    filteredProducts = tempResults;
    updateProductCountText();
    renderProductsGrid();
    renderPaginationControls();
}

/**
 * Updates the "Showing X of Y products" info text
 */
function updateProductCountText() {
    const productCountEl = document.getElementById('productCount');
    if (!productCountEl) return;

    if (filteredProducts.length === 0) {
        productCountEl.textContent = "No products found matching your search.";
    } else {
        productCountEl.textContent = `Showing ${filteredProducts.length} premium fragrance(s)`;
    }
}

/**
 * Slices the filtered array and renders cards onto the current page
 */
function renderProductsGrid() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    if (filteredProducts.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #666;">No products found.</div>';
        return;
    }

    // Calculate start and end positions for slicing
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredProducts.slice(startIndex, endIndex);

    let html = '';
    for (let i = 0; i < pageItems.length; i++) {
        const item = pageItems[i];
        const displayPrice = window.formatCurrency(item.price);
        const itemImg = item.image || 'assets/arologopng.png';

        html += `
            <div class="product-card" style="border: 1px solid #f1f1f1; padding: 20px; text-align: center; background: #fff; transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="cursor: pointer;" onclick="viewProductDetail(${item.id})">
                    <img src="${itemImg}" alt="${item.name}" style="width: 100%; max-height: 200px; object-fit: contain; margin-bottom: 15px;">
                    <span style="font-size: 0.75rem; text-transform: uppercase; color: #888; letter-spacing: 1px;">${item.category}</span>
                    <h3 style="font-family: 'Cinzel', serif; font-size: 1.1rem; margin: 5px 0 10px 0; color: #111;">${item.name}</h3>
                    <p class="price-stack" style="margin-bottom: 15px;"><span class="selling-price">${displayPrice}</span><span class="original-price">₹999</span><span class="discount-badge">60% OFF</span></p>
                </div>
                
                <div style="display: flex; gap: 8px; margin-top: auto;">
                    <button onclick="addToWishlistDirect(${item.id})" style="flex: 0 0 45px; height: 40px; background: #f9f9f9; border: 1px solid #e5e5e5; color: #333; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Add to Wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <button onclick="addToCartDirect(${item.id})" style="flex: 1; height: 40px; background: #111; color: #fff; border: none; font-size: 0.8rem; font-weight: 500; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s;">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Bag
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

/**
 * Renders simple 1, 2, 3... pagination buttons
 */
function renderPaginationControls() {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let buttonsHtml = '';
    for (let page = 1; page <= totalPages; page++) {
        const activeStyle = page === currentPage 
            ? 'background: #111; color: #fff; border-color: #111;' 
            : 'background: #fff; color: #333; border-color: #ddd;';

        buttonsHtml += `
            <button onclick="changePage(${page})" style="padding: 8px 16px; border: 1px solid; cursor: pointer; margin: 0 4px; font-family: 'Poppins', sans-serif; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; ${activeStyle}">
                ${page}
            </button>
        `;
    }

    paginationEl.innerHTML = buttonsHtml;
}

/**
 * Changes active page and scrolls back to product controls
 */
window.changePage = function(pageNumber) {
    currentPage = pageNumber;
    renderProductsGrid();
    renderPaginationControls();
    
    // Smoothly scroll back to the top of the products grid
    const controls = document.querySelector('.shop-controls');
    if (controls) {
        controls.scrollIntoView({ behavior: 'smooth' });
    }
};

/**
 * Action: Fast Add to Cart
 */
window.addToCartDirect = function(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem(window.CART_KEY)) || [];
    
    // Check if item is already in the cart
    const foundIndex = cart.findIndex(item => item.name === product.name && item.size === '6ml');

    if (foundIndex !== -1) {
        cart[foundIndex].quantity = (parseInt(cart[foundIndex].quantity) || 1) + 1;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            size: '6ml', // Default standard size
            quantity: 1
        });
    }

    localStorage.setItem(window.CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    window.showToast(`${product.name} added to cart!`);
};

/**
 * Action: Fast Add to Wishlist
 */
window.addToWishlistDirect = function(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    let wishlist = JSON.parse(localStorage.getItem(window.WISHLIST_KEY)) || [];
    
    // Check for duplicate in wishlist
    const exists = wishlist.some(item => item.name === product.name);

    if (exists) {
        window.showToast(`${product.name} is already in your wishlist!`, 'error');
        return;
    }

    wishlist.push({
        name: product.name,
        price: product.price,
        image: product.image,
        size: '6ml'
    });

    localStorage.setItem(window.WISHLIST_KEY, JSON.stringify(wishlist));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    window.showToast(`${product.name} saved to wishlist.`);
};

/**
 * Action: Redirects to product details view passing product ID in URL params
 */
window.viewProductDetail = function(id) {
    window.location.href = `product.html?id=${id}`;
};

