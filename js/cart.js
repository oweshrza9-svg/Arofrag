/*=========================================
CART STORAGE
=========================================*/

const CART_KEY="arofrag_cart";

/*=========================================
GET CART
=========================================*/

function getCart(){

    return JSON.parse(localStorage.getItem(CART_KEY))||[];

}

/*=========================================
SAVE CART
=========================================*/

function saveCart(cart){

    localStorage.setItem(CART_KEY,JSON.stringify(cart));

}

/*=========================================
ADD TO CART
=========================================*/

function addToCart(product,size,quantity){

    const cart=getCart();

    const existingProduct=cart.find(item=>
        item.id===product.id &&
        item.size===size
    );

    if(existingProduct){

        existingProduct.quantity+=quantity;

    }else{

        cart.push({
            id:product.id,
            name:product.name,
            price:product.price,
            image:product.image,
            size:size,
            quantity:quantity
        });

    }

    saveCart(cart);

    updateCartCount();

    showToast("Product added to cart.");

}

/*=========================================
CART COUNT
=========================================*/

function updateCartCount(){

    const cart=getCart();

    const total=cart.reduce((sum,item)=>sum+item.quantity,0);

    const badge=document.querySelector(".cart-count");

    if(badge){

        badge.textContent=total;

    }

}

document.addEventListener("DOMContentLoaded",updateCartCount);