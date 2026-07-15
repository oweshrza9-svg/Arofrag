/*=========================================
WISHLIST
=========================================*/

const WISHLIST_KEY="arofrag_wishlist";

function getWishlist(){

    return JSON.parse(localStorage.getItem(WISHLIST_KEY))||[];

}

function saveWishlist(items){

    localStorage.setItem(WISHLIST_KEY,JSON.stringify(items));

}

function toggleWishlist(productId){

    let wishlist=getWishlist();

    if(wishlist.includes(productId)){

        wishlist=wishlist.filter(id=>id!==productId);

        showToast("Removed from wishlist.");

    }else{

        wishlist.push(productId);

        showToast("Added to wishlist.");

    }

    saveWishlist(wishlist);

}