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

/*=========================================
RENDER CART
=========================================*/

function renderCart(){

    const cartItems=document.getElementById("cartItems");

    if(!cartItems) return;

    const cart=getCart();

    if(cart.length===0){

        cartItems.innerHTML=`
            <div class="empty-cart">
                <h2>Your cart is empty.</h2>
                <a href="shop.html" class="continue-btn">
                    Continue Shopping
                </a>
            </div>
        `;

        document.getElementById("subtotal").textContent="₹0";
        document.getElementById("total").textContent="₹0";

        return;

    }

    let subtotal=0;

    cartItems.innerHTML="";

    cart.forEach(item=>{

        subtotal+=item.price*item.quantity;

        cartItems.innerHTML+=`
        <article class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p>Size : ${item.size}</p>

                <p>${formatPrice(item.price)}</p>

            </div>

            <div class="cart-quantity">

                <button class="decrease" data-id="${item.id}" data-size="${item.size}">
                    -
                </button>

                <span>${item.quantity}</span>

                <button class="increase" data-id="${item.id}" data-size="${item.size}">
                    +
                </button>

            </div>

            <button class="remove-item" data-id="${item.id}" data-size="${item.size}">

                <i class="fa-solid fa-trash"></i>

            </button>

        </article>
        `;

    });

    document.getElementById("subtotal").textContent=formatPrice(subtotal);
    document.getElementById("total").textContent=formatPrice(subtotal);

    attachCartEvents();

}