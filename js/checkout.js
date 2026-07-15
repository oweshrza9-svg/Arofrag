/*=========================================
GLOBAL ELEMENTS
=========================================*/

const checkoutItems=document.getElementById("checkoutItems");
const checkoutSubtotal=document.getElementById("checkoutSubtotal");
const checkoutShipping=document.getElementById("checkoutShipping");
const checkoutDiscount=document.getElementById("checkoutDiscount");
const checkoutTotal=document.getElementById("checkoutTotal");

/*=========================================
INITIALIZE
=========================================*/

document.addEventListener("DOMContentLoaded",()=>{

    renderCheckout();

});/*=========================================
RENDER CHECKOUT
=========================================*/

function renderCheckout(){

    const cart=getCart();

    if(cart.length===0){

        checkoutItems.innerHTML=`
        <p>Your cart is empty.</p>
        `;

        return;

    }

    let subtotal=0;

    checkoutItems.innerHTML="";

    cart.forEach(item=>{

        subtotal+=item.price*item.quantity;

        checkoutItems.innerHTML+=`

        <div class="checkout-item">

            <img src="${item.image}" alt="${item.name}">

            <div>

                <h4>${item.name}</h4>

                <p>${item.size}</p>

                <p>Qty : ${item.quantity}</p>

            </div>

            <strong>${formatPrice(item.price*item.quantity)}</strong>

        </div>

        `;

    });

    checkoutSubtotal.textContent=formatPrice(subtotal);

    checkoutShipping.textContent="FREE";

    checkoutDiscount.textContent="₹0";

    checkoutTotal.textContent=formatPrice(subtotal);

}
/*=========================================
CHECKOUT FORM
=========================================*/

const checkoutForm=document.getElementById("checkoutForm");

if(checkoutForm){

    checkoutForm.addEventListener("submit",placeOrder);

}
/*=========================================
PLACE ORDER
=========================================*/

function placeOrder(event){

    event.preventDefault();

    const cart=getCart();

    if(cart.length===0){

        showToast("Your cart is empty.");

        return;

    }

    const payment=document.querySelector("input[name='payment']:checked").value;

    const order={

        customer:{
            name:document.getElementById("name").value.trim(),
            email:document.getElementById("email").value.trim(),
            phone:document.getElementById("phone").value.trim(),
            address:document.getElementById("address").value.trim(),
            city:document.getElementById("city").value.trim(),
            pincode:document.getElementById("pincode").value.trim()
        },

        payment,

        items:cart,

        date:new Date().toISOString()

    };

    localStorage.setItem("latestOrder",JSON.stringify(order));

    localStorage.removeItem("arofrag_cart");

    window.location.href="success.html";

}