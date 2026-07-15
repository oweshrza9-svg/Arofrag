/*=========================================
    FETCH PRODUCTS
=========================================*/

async function getProducts() {

    try {

        const response = await fetch("json/products.json");

        if (!response.ok) {
            throw new Error("Unable to fetch products.");
        }

        const products = await response.json();

        return products;

    } catch (error) {

        console.error(error);

        return [];

    }

}

/*=========================================
    FORMAT PRICE
=========================================*/

function formatPrice(price) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR",

        maximumFractionDigits: 0

    }).format(price);

}

/*=========================================
    STAR RATING
=========================================*/

function generateStars(rating) {

    let stars = "";

    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {

        stars += `<i class="fa-solid fa-star"></i>`;

    }

    if (rating % 1 !== 0) {

        stars += `<i class="fa-solid fa-star-half-stroke"></i>`;

    }

    return stars;

}

/*=========================================
    PRODUCT CARD
=========================================*/

function createProductCard(product) {

    return `

    <article
        class="product-card"
        data-id="${product.id}"
        data-category="${product.category}"
        data-price="${product.price}">

        <span class="product-badge">

            ${product.badge}

        </span>

        <div class="product-image">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy">

        </div>

        <div class="product-info">

            <span class="product-category">

                ${product.category}

            </span>

            <h3 class="product-title">

                ${product.name}

            </h3>

            <div class="product-rating">

                ${generateStars(product.rating)}

            </div>

            <div class="product-price">

                <span class="old-price">

                    ${formatPrice(product.oldPrice)}

                </span>

                ${formatPrice(product.price)}

            </div>

            <div class="product-actions">

                <button
                    class="view-btn"
                    data-id="${product.id}">

                    View Details

                </button>

                <button
                    class="cart-btn"
                    data-id="${product.id}">

                    Add To Cart

                </button>

            </div>

        </div>

    </article>

    `;

}

/*=========================================
    RENDER PRODUCTS
=========================================*/

function renderProducts(products, container) {

    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {

        container.innerHTML = `

            <div class="no-products">

                <h2>No Products Found</h2>

            </div>

        `;

        return;

    }

    products.forEach(product => {

        container.innerHTML += createProductCard(product);

    });

}/*=========================================
    PAGINATION
=========================================*/

function paginate(products, currentPage, itemsPerPage) {

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return products.slice(start, end);

}

function createPagination(totalItems, itemsPerPage, currentPage, container, callback) {

    if (!container) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        const button = document.createElement("button");

        button.textContent = i;

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            callback(i);
        });

        container.appendChild(button);

    }

}

/*=========================================
    LOADER
=========================================*/

function showLoader(container) {

    if (!container) return;

    container.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <p>Loading Products...</p>
        </div>
    `;

}

function hideLoader(container) {

    if (!container) return;

    const loader = container.querySelector(".loader");

    if (loader) {
        loader.remove();
    }

}

/*=========================================
    EMPTY STATE
=========================================*/

function showEmptyState(container, message = "No Products Found") {

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-box-open"></i>
            <h2>${message}</h2>
        </div>
    `;

}

/*=========================================
    TOAST
=========================================*/

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

/*=========================================
    LOCAL STORAGE
=========================================*/

function saveToStorage(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}

function getFromStorage(key) {

    return JSON.parse(localStorage.getItem(key)) || [];

}

/*=========================================
    DEBOUNCE
=========================================*/

function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/*=========================================
    SCROLL TO TOP
=========================================*/

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/*=========================================
    RANDOM PRODUCTS
=========================================*/

function getRandomProducts(products, count = 4) {

    return [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

}

/*=========================================
    FIND PRODUCT
=========================================*/

function getProductById(products, id) {

    return products.find(product => product.id == id);

}