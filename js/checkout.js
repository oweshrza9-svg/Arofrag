// ==========================================
// AROFRAG Checkout
// ==========================================

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 150;

document.addEventListener("DOMContentLoaded", () => {
    renderCheckout();
    bindCheckoutEvents();

    window.addEventListener("storage", e => {
        if (e.key === window.CART_KEY) {
            renderCheckout();
        }
    });

    window.addEventListener("cartUpdated", () => {
        renderCheckout();
    });
});

function getCart() {
    return JSON.parse(localStorage.getItem(window.CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(window.CART_KEY, JSON.stringify(cart));

    window.dispatchEvent(
        new CustomEvent("cartUpdated", {
            detail: { cart }
        })
    );
}

function renderCheckout() {

    const container = document.getElementById("checkoutItems");

    const subtotalEl = document.getElementById("checkoutSubtotal");
    const totalEl = document.getElementById("checkoutTotal");

    if (!container) return;

    const cart = getCart();
    console.log("Checkout Cart:", cart);

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <h3>Your Cart is Empty</h3>
                <p>Add some premium fragrances first.</p>
                <a href="shop.html">Continue Shopping</a>
            </div>
        `;

        subtotalEl.textContent = "₹0";
        totalEl.textContent = "₹0";

        return;
    }

    container.innerHTML = cart.map((item,index)=>{

        const qty = parseInt(item.quantity) || 1;
        const price = window.cleanPrice(item.price);
        const lineTotal = price * qty;

        return `

        <div class="checkout-item">

            <img
                src="${item.image || 'assets/arologopng.png'}"
                alt="${item.name}"
            >

            <div class="checkout-item-details">

                <div class="checkout-item-title">
                    ${item.name}
                </div>

                <div class="checkout-item-size">
                    Size : ${item.size || "6ml"}
                </div>

                <div class="checkout-item-price">
                    ${window.formatCurrency(price)}
                </div>

                <div class="checkout-item-actions">

                    <div class="quantity-controls">

                        <button
                            onclick="changeCheckoutQty(${index},-1)">
                            −
                        </button>

                        <span>${qty}</span>

                        <button
                            onclick="changeCheckoutQty(${index},1)">
                            +
                        </button>

                    </div>

                    <strong>
                        ${window.formatCurrency(lineTotal)}
                    </strong>

                    <button
                        class="remove-item-btn"
                        onclick="removeCheckoutItem(${index})">

                        Remove

                    </button>

                </div>

            </div>

        </div>

        `;

    }).join("");

    updateCheckoutSummary(cart);

}
function updateCheckoutSummary(cart){

    const subtotal = calculateSubtotal(cart);

    const shipping = calculateShipping(cart);

    const total = calculateTotal(cart);

    document.getElementById("checkoutSubtotal").textContent =
        window.formatCurrency(subtotal);

    document.getElementById("checkoutShipping").textContent =
        shipping === 0
            ? "FREE"
            : window.formatCurrency(shipping);

    document.getElementById("checkoutTotal").textContent =
        window.formatCurrency(total);

}

window.changeCheckoutQty = function(index,amount){

    const cart = getCart();

    if(!cart[index]) return;

    let qty = parseInt(cart[index].quantity)||1;

    qty += amount;

    if(qty<=0){

        cart.splice(index,1);

    }else{

        cart[index].quantity = qty;

    }

    saveCart(cart);

    renderCheckout();

}

window.removeCheckoutItem = function(index){

    const cart = getCart();

    cart.splice(index,1);

    saveCart(cart);

    renderCheckout();

}

function bindCheckoutEvents(){

    const form =
        document.getElementById("checkoutForm");

    if(!form) return;

    form.addEventListener("submit",handleCheckoutSubmit);

}

// ==========================================
// AROFRAG Checkout
// Part 2 - Validation & Order Flow
// ==========================================

async function handleCheckoutSubmit(e){

    e.preventDefault();

    const cart = getCart();

    if(cart.length===0){

        window.showToast(
            "Your cart is empty.",
            "error"
        );

        return;

    }

    const customer={

        name:document.getElementById("name").value.trim(),

        email:document.getElementById("email").value.trim(),

        phone:document.getElementById("phone").value.trim(),

        address:document.getElementById("address").value.trim(),

        city:document.getElementById("city").value.trim(),

        pincode:document.getElementById("pincode").value.trim()

    };

    if(!validateOrder(customer)){

        return;

    }

    const orderData={

        customer,

        paymentMethod:

        document.querySelector(
            'input[name="payment"]:checked'
        ).value,

        items:cart,

        subtotal:calculateSubtotal(cart),

        shipping:calculateShipping(cart),

        total:calculateTotal(cart),

        orderedAt:new Date().toISOString()

    };

    const submitBtn=

        document.querySelector(
            ".place-order-btn"
        );

    const originalText=

        submitBtn.textContent;

    submitBtn.disabled=true;

    submitBtn.textContent=

        "Placing Order...";

    try{

        await placeOrder(orderData);

    }

    finally{

        submitBtn.disabled=false;

        submitBtn.textContent=

            originalText;

    }

}

function validateOrder(customer){

    if(customer.name.length<3){

        window.showToast(

            "Enter your full name.",

            "error"

        );

        return false;

    }

    const emailRegex=

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(customer.email)){

        window.showToast(

            "Invalid email address.",

            "error"

        );

        return false;

    }

    const phoneRegex=

    /^[6-9]\d{9}$/;

    if(!phoneRegex.test(customer.phone)){

        window.showToast(

            "Invalid phone number.",

            "error"

        );

        return false;

    }

    if(customer.address.length<10){

        window.showToast(

            "Enter complete address.",

            "error"

        );

        return false;

    }

    if(customer.city.length<2){

        window.showToast(

            "Enter your city.",

            "error"

        );

        return false;

    }

    if(!/^\d{6}$/.test(customer.pincode)){

        window.showToast(

            "Invalid pincode.",

            "error"

        );

        return false;

    }

    return true;

}

function calculateSubtotal(cart){

    return cart.reduce((sum,item)=>{

        return sum+

        (

            window.cleanPrice(item.price)

            *

            (parseInt(item.quantity)||1)

        );

    },0);

}

function calculateShipping(cart){

    const subtotal=

        calculateSubtotal(cart);

    return subtotal>=FREE_SHIPPING_THRESHOLD

        ?0
        :SHIPPING_CHARGE;

}

function calculateTotal(cart){

    return calculateSubtotal(cart)

    +

    calculateShipping(cart);

}
// ==========================================
// AROFRAG Checkout

// ==========================================

document.addEventListener("DOMContentLoaded",()=>{

    autoFillUser();

    toggleCheckoutState();

});

function autoFillUser(){

    const user=

        JSON.parse(

            localStorage.getItem("user")

        );

    if(!user) return;

    if(document.getElementById("name"))
        document.getElementById("name").value=
        user.fullName||"";

    if(document.getElementById("email"))
        document.getElementById("email").value=
        user.email||"";

    if(document.getElementById("phone"))
        document.getElementById("phone").value=
        user.phone||"";

    if(document.getElementById("address"))
        document.getElementById("address").value=
        user.address||"";

    if(document.getElementById("city"))
        document.getElementById("city").value=
        user.city||"";

    if(document.getElementById("pincode"))
        document.getElementById("pincode").value=
        user.pincode||"";

}

function toggleCheckoutState(){

    const cart=getCart();

    const button=

        document.querySelector(

            ".place-order-btn"

        );

    if(!button) return;

    if(cart.length===0){

        button.disabled=true;

        button.textContent=

        "Cart Empty";

    }else{

        button.disabled=false;

        button.textContent=

        "Place Order";

    }

}

window.addEventListener(

    "cartUpdated",

    ()=>{

        toggleCheckoutState();

    }

);

async function submitOrder(orderData){

    const token=

        localStorage.getItem("token");

    const headers={

        "Content-Type":"application/json"

    };

    if(token){

        headers.Authorization=

        `Bearer ${token}`;

    }

    const response=

    await fetch(

        "http://localhost:5000/api/orders",

        {

            method:"POST",

            headers,

            body:JSON.stringify(orderData)

        }

    );

    const data=

    await response.json();

    if(!response.ok){

        throw new Error(

            data.message||

            "Order Failed"

        );

    }

    return data;

}

async function placeOrder(orderData){

    try{

        const data=

        await submitOrder(orderData);

        localStorage.removeItem(

            window.CART_KEY

        );

        window.dispatchEvent(

            new CustomEvent(

                "cartUpdated"

            )

        );

        renderCheckout();

        window.showToast(

            "Order placed successfully."

        );

        setTimeout(()=>{

            if(

                data.order&&

                data.order._id

            ){

                window.location.href=

                `thankyou.html?id=${data.order._id}`;

            }else{

                window.location.href=

                "thankyou.html";

            }

        },1200);

    }

    catch(error){

        console.error(error);

        window.showToast(

            error.message,

            "error"

        );

    }

}

document.addEventListener(

    "change",

    e=>{

        if(

            e.target.name!=="payment"

        ) return;

        switch(e.target.value){

            case "cod":

                window.showToast(

                    "Cash on Delivery selected."

                );

            break;

            case "upi":

                window.showToast(

                    "UPI payment selected."

                );

            break;

            case "card":

                window.showToast(

                    "Card payment selected."

                );

            break;

        }

    }

);

window.addEventListener(

    "beforeunload",

    ()=>{

        const button=

        document.querySelector(

            ".place-order-btn"

        );

        if(button){

            button.disabled=false;

            button.textContent=

            "Place Order";

        }

    }

);

console.log(

    "%cAROFRAG Checkout Ready",

    "color:#b58e46;font-size:14px;font-weight:bold;"

);
function showOrderSuccess(){

    const popup=document.createElement("div");

    popup.innerHTML=`

    <div style="
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.6);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
    ">

        <div style="
            background:#fff;
            padding:40px;
            border-radius:18px;
            width:360px;
            text-align:center;
            box-shadow:0 20px 60px rgba(0,0,0,.25);
        ">

            <div style="font-size:70px;">✅</div>

            <h2 style="margin:15px 0;">
                Order Placed
            </h2>

            <p>
                Thank you for shopping with AROFRAG.
            </p>

            <button id="closeSuccessPopup"
            style="
                margin-top:20px;
                padding:12px 30px;
                border:none;
                background:#111;
                color:#fff;
                cursor:pointer;
                border-radius:8px;
            ">
                Continue
            </button>

        </div>

    </div>

    `;

    document.body.appendChild(popup);

    document
        .getElementById("closeSuccessPopup")
        .onclick=()=>{

            popup.remove();

            window.location.href="index.html";

        };

}