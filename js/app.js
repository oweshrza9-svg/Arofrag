/*=========================================
GLOBAL ELEMENTS
=========================================*/

const header = document.querySelector("header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links a");
const scrollTopBtn = document.querySelector(".scroll-top");
const searchBtn = document.querySelector(".search-btn");
const searchModal = document.querySelector(".search-modal");
const closeSearch = document.querySelector(".close-search");
const searchInput = document.querySelector(".search-input");
const searchResults = document.querySelector(".search-results");

/*=========================================
STICKY HEADER
=========================================*/

window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
});

/*=========================================
MOBILE MENU
=========================================*/

if (navToggle && navMenu) {

    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        navToggle.classList.toggle("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            navToggle.classList.remove("active");
        });
    });

}

/*=========================================
ACTIVE NAV LINK
=========================================*/

const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {

    const page = link.getAttribute("href");

    if (page === currentPage) {
        link.classList.add("active");
    }

});

/*=========================================
SMOOTH SCROLL
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});

/*=========================================
SCROLL TO TOP
=========================================*/

if (scrollTopBtn) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }

    });

    scrollTopBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

/*=========================================
REVEAL ANIMATION
=========================================*/

const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = () => {

    revealElements.forEach(element => {

        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 120;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add("active");
        }

    });

};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/*=========================================
NEWSLETTER FORM
=========================================*/

const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {

    newsletterForm.addEventListener("submit", e => {

        e.preventDefault();

        const email = newsletterForm.querySelector("input");

        if (!email.value.trim()) {
            showToast("Please enter your email.");
            return;
        }

        showToast("Thanks for subscribing!");

        newsletterForm.reset();

    });

}  
   /*=========================================
GLOBAL ELEMENTS
=========================================*/

const header = document.querySelector("header");
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

/*=========================================
STICKY NAVBAR
=========================================*/

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }

});

/*=========================================
MOBILE MENU
=========================================*/

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        menuToggle.classList.toggle("active");

    });

}

/*=========================================
CLOSE MENU AFTER CLICK
=========================================*/

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        menuToggle.classList.remove("active");

    });

});

/*=========================================
ACTIVE PAGE
=========================================*/

const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {

    const href = link.getAttribute("href");

    if (href === currentPage) {

        link.classList.add("active");

    }

});

/*=========================================
SMOOTH SCROLL
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});

/*=========================================
SEARCH MODAL
=========================================*/

if (searchBtn && searchModal) {

    searchBtn.addEventListener("click", () => {

        searchModal.classList.add("show");

        if (searchInput) {
            searchInput.focus();
        }

    });

}

if (closeSearch && searchModal) {

    closeSearch.addEventListener("click", () => {

        searchModal.classList.remove("show");

        if (searchInput) {
            searchInput.value = "";
        }

        if (searchResults) {
            searchResults.innerHTML = "";
        }

    });

}

window.addEventListener("click", (event) => {

    if (event.target === searchModal) {

        searchModal.classList.remove("show");

    }

});

window.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        searchModal.classList.remove("show");

    }

});

/*=========================================
LIVE SEARCH
=========================================*/

if (searchInput) {

    searchInput.addEventListener("input", async (e) => {

        const keyword = e.target.value.trim().toLowerCase();

        if (keyword === "") {

            searchResults.innerHTML = "";

            return;

        }

        const products = await getProducts();

        const filteredProducts = products.filter(product => {

            return (

                product.name.toLowerCase().includes(keyword) ||

                product.category.toLowerCase().includes(keyword)

            );

        });

        renderSearchResults(filteredProducts);

    });

}

/*=========================================
SEARCH RESULT CARDS
=========================================*/

function renderSearchResults(products) {

    if (!searchResults) return;

    if (products.length === 0) {

        searchResults.innerHTML = `
            <p class="empty-search">
                No fragrance found.
            </p>
        `;

        return;

    }

    let html = "";

    products.forEach(product => {

        html += `
            <a href="product.html?id=${product.id}" class="search-item">

                <img src="${product.image}" alt="${product.name}">

                <div>

                    <h4>${product.name}</h4>

                    <span>${formatPrice(product.price)}</span>

                </div>

            </a>
        `;

    });

    searchResults.innerHTML = html;

}
/*=========================================
SEARCH MODAL
=========================================*/

const searchBtn=document.querySelector(".search-btn");
const searchModal=document.querySelector(".search-modal");
const closeSearch=document.querySelector(".close-search");

if(searchBtn&&searchModal){

    searchBtn.addEventListener("click",()=>{

        searchModal.classList.add("show");

    });

}

if(closeSearch){

    closeSearch.addEventListener("click",()=>{

        searchModal.classList.remove("show");

    });

}

window.addEventListener("click",(event)=>{

    if(event.target===searchModal){

        searchModal.classList.remove("show");

    }

});
