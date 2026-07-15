/*=========================================
GLOBAL
=========================================*/

const wishlistContainer=document.getElementById("wishlistContainer");

/*=========================================
INITIALIZE
=========================================*/

document.addEventListener("DOMContentLoaded",()=>{

renderWishlist();

});

/*=========================================
RENDER
=========================================*/

async function renderWishlist(){

if(!wishlistContainer) return;

const products=await getProducts();

const wishlist=getWishlist();

const items=products.filter(product=>wishlist.includes(product.id));

wishlistContainer.innerHTML="";

if(items.length===0){

wishlistContainer.innerHTML=`

<h2>Your wishlist is empty.</h2>

`;

return;

}

items.forEach(product=>{

wishlistContainer.innerHTML+=`

<div class="wishlist-card">

<img src="${product.image}" alt="${product.name}">

<div class="wishlist-info">

<h3>${product.name}</h3>

<p>${formatPrice(product.price)}</p>

<div class="wishlist-actions">

<a href="product.html?id=${product.id}">

View

</a>

<button class="remove-btn" data-id="${product.id}">

Remove

</button>

</div>

</div>

</div>

`;

});

attachWishlistEvents();

}

/*=========================================
EVENTS
=========================================*/

function attachWishlistEvents(){

document.querySelectorAll(".remove-btn").forEach(button=>{

button.addEventListener("click",()=>{

removeWishlist(button.dataset.id);

});

});

}

/*=========================================
REMOVE
=========================================*/

function removeWishlist(id){

let wishlist=getWishlist();

wishlist=wishlist.filter(item=>item!=id);

saveWishlist(wishlist);

renderWishlist();

showToast("Removed from wishlist.");

}