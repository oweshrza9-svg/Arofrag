/*=========================================
GLOBAL ELEMENTS
=========================================*/

const header=document.querySelector("header");
const menuToggle=document.querySelector(".menu-toggle");
const navMenu=document.querySelector(".nav-menu");
const navLinks=document.querySelectorAll(".nav-menu a");

const searchBtn=document.querySelector(".search-btn");
const searchModal=document.querySelector(".search-modal");
const closeSearch=document.querySelector(".close-search");
const searchInput=document.querySelector(".search-input");
const searchResults=document.querySelector(".search-results");
const wishlistBtn=document.querySelector(".wishlist-btn");
const cartBadge=document.querySelector(".cart span");

/*=========================================
INITIALIZE
=========================================*/

document.addEventListener("DOMContentLoaded",()=>{

    updateCartCount();
    initializeNavbar();
    initializeSearch();
    initializeWishlist();

});

/*=========================================
NAVBAR
=========================================*/

function initializeNavbar(){
    if(menuToggle){
        menuToggle.addEventListener("click",()=>{
            navMenu.classList.toggle("active");
        });

    }

    navLinks.forEach(link=>{

        link.addEventListener("click",()=>{

            navMenu.classList.remove("active");
        });
    });

}

/*=========================================
STICKY NAVBAR
=========================================*/

window.addEventListener("scroll",()=>{
    if(window.scrollY>80){
        header.classList.add("sticky");
    }else{
        header.classList.remove("sticky");
    }

});
/*=========================================
SEARCH MODAL
=========================================*/

function initializeSearch(){

    if(searchBtn&&searchModal){

        searchBtn.addEventListener("click",()=>{
            searchModal.classList.add("show");
            if(searchInput){
                searchInput.focus();

            }
        });
    }

    if(closeSearch){

        closeSearch.addEventListener("click",()=>{
            searchModal.classList.remove("show");
        });
    }

    if(searchModal){
        searchModal.addEventListener("click",(event)=>{
            if(event.target===searchModal){
                searchModal.classList.remove("show");
            }
        });
    }

}

/*=========================================
LIVE SEARCH
=========================================*/

if(searchInput){

    searchInput.addEventListener("input",async()=>{

        const keyword=searchInput.value.trim().toLowerCase();
        if(keyword===""){
            searchResults.innerHTML="";
            return;

        }

        const products=await getProducts();
        const filtered=products.filter(product=>
            product.name.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
        );
        renderSearchResults(filtered);

    });

}
/*=========================================
SEARCH RESULTS
=========================================*/

function renderSearchResults(products){

    if(!searchResults) return;
    searchResults.innerHTML="";
    if(products.length===0){
        searchResults.innerHTML="<p>No products found.</p>";
        return;
    }

    products.forEach(product=>{
        searchResults.innerHTML+=`

        <a href="product.html?id=${product.id}" class="search-item">
            <img src="${product.image}" alt="${product.name}">

            <div>
                <h4>${product.name}</h4>
                <p>${formatPrice(product.price)}</p>
            </div>
        </a>
        `;
    });

}
/*=========================================
WISHLIST
=========================================*/

function initializeWishlist(){

    if(!wishlistBtn) return;
    updateWishlistIcon();

    wishlistBtn.addEventListener("click",()=>{
        let wishlist=getWishlist();
        if(wishlist.includes("navbar")){
            wishlist=wishlist.filter(item=>item!=="navbar");
            showToast("Wishlist cleared.");

        }else{
            wishlist.push("navbar");
            showToast("Wishlist saved.");
        }
        saveWishlist(wishlist);
        updateWishlistIcon();
    });
}

/*=========================================
UPDATE WISHLIST ICON
=========================================*/
function updateWishlistIcon(){
    if(!wishlistBtn) return;
    const wishlist=getWishlist();
    if(wishlist.includes("navbar")){
        wishlistBtn.classList.add("active");
    }else{
        wishlistBtn.classList.remove("active");
    }
}
/*=========================================
ACTIVE NAVIGATION
=========================================*/

const currentPage=window.location.pathname.split("/").pop()||"index.html";
navLinks.forEach(link=>{
    const href=link.getAttribute("href");
    if(href===currentPage){
        link.classList.add("active");
    }else{
        link.classList.remove("active");
    }
});
/*=========================================
ESC KEY
=========================================*/
document.addEventListener("keydown",(event)=>{
    if(event.key==="Escape"){
        searchModal?.classList.remove("show");
    }

});