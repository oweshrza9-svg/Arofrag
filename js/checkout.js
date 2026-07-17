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

    const subtotal = cart.reduce((sum,item)=>{

        return sum +

        (
            window.cleanPrice(item.price) *
            (parseInt(item.quantity)||1)
        );

    },0);

    const shipping =
        subtotal >= FREE_SHIPPING_THRESHOLD
            ? 0
            : SHIPPING_CHARGE;

    const total = subtotal + shipping;

    document.getElementById("checkoutSubtotal").textContent =
        window.formatCurrency(subtotal);

    document.getElementById("checkoutTotal").textContent =
        window.formatCurrency(total);

    const shippingRow =
        document.querySelectorAll(".summary-row span")[3];

    if(shippingRow){

        shippingRow.textContent =
            shipping===0
            ? "FREE"
            : window.formatCurrency(shipping);

    }

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

    const orderData = {

        customer:{

            name:document.getElementById("name").value.trim(),

            email:document.getElementById("email").value.trim(),

            phone:document.getElementById("phone").value.trim(),

            address:document.getElementById("address").value.trim(),

            city:document.getElementById("city").value.trim(),

            pincode:document.getElementById("pincode").value.trim()

        },

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

    if(!validateOrder(orderData.customer)){

        return;

    }

    const submitBtn =
        document.querySelector(".place-order-btn");

    const originalText =
        submitBtn.textContent;

    submitBtn.disabled=true;

    submitBtn.textContent="Placing Order...";

    try{

        const response=await fetch(

            "http://localhost:5000/api/orders",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(orderData)

            }

        );

        if(!response.ok){

            throw new Error("Order failed");

        }

        const result=await response.json();

        localStorage.removeItem(window.CART_KEY);

        window.dispatchEvent(

            new CustomEvent("cartUpdated")

        );

        window.showToast(

            "Order placed successfully!"

        );

        setTimeout(()=>{

            window.location.href=

            "thankyou.html?id="+

            result.order._id;

        },1200);

    }

    catch(error){

        console.error(error);

        window.showToast(

            "Unable to place order.",

            "error"

        );

    }

    finally{

        submitBtn.disabled=false;

        submitBtn.textContent=originalText;

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

            "Invalid email.",

            "error"

        );

        return false;

    }

    const phoneRegex=/^[6-9]\d{9}$/;

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

            "Enter city.",

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