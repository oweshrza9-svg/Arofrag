(() => {
  const CART_KEY = window.CART_KEY || "arofrag_cart";
  const api = window.API_URL || "http://localhost:5000/api";
  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const money = value => window.formatCurrency(value);
  const totals = cart => { const subtotal = cart.reduce((sum, item) => sum + window.cleanPrice(item.price) * item.quantity, 0); const shipping = subtotal >= 999 ? 0 : 150; return { subtotal, shipping, total: subtotal + shipping }; };
  function render() {
    const cart = getCart(); const items = document.getElementById("checkoutItems"); if (!items) return;
    const summary = totals(cart);
    items.innerHTML = cart.length ? cart.map(item => `<article class="checkout-item"><img src="${item.image}" alt="${item.name}"><div class="checkout-item-info"><strong>${item.name}</strong><span>${item.size || "6ml"} · Qty ${item.quantity}</span><b>${money(window.cleanPrice(item.price) * item.quantity)}</b></div></article>`).join("") : "<p class='empty-state'>Your bag is empty. Add a fragrance to continue.</p>";
    document.getElementById("checkoutSubtotal").textContent = money(summary.subtotal); document.getElementById("checkoutShipping").textContent = summary.shipping ? money(summary.shipping) : "FREE"; document.getElementById("checkoutTotal").textContent = money(summary.total);
    document.querySelector(".place-order-btn").disabled = !cart.length;
  }
  document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
    if (!user) { window.requireAuthentication("checkout.html"); return; }
    [["name", user.fullName], ["email", user.email], ["phone", user.phone]].forEach(([id, value]) => { const input = document.getElementById(id); if (input && value) input.value = value; });
    render();
    document.getElementById("checkoutForm").addEventListener("submit", async event => {
      event.preventDefault(); const cart = getCart(); if (!cart.length) return;
      const customer = Object.fromEntries(["name", "email", "phone"].map(id => [id, document.getElementById(id).value.trim()]));
      const address = [document.getElementById("address").value.trim(), document.getElementById("city").value.trim(), document.getElementById("pincode").value.trim()].join(", ");
      if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email) || !/^[6-9]\d{9}$/.test(customer.phone) || address.length < 12) return window.showToast("Please enter a complete delivery address and valid contact details.", "error");
      const button = document.querySelector(".place-order-btn"); button.disabled = true; button.textContent = "Placing secure order…";
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(`${api}/orders`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ customer, shippingAddress: address, paymentMethod: document.querySelector("input[name=payment]:checked").value, products: cart }) });
        const data = await response.json(); if (!response.ok) throw new Error(data.message);
        localStorage.removeItem(CART_KEY); window.dispatchEvent(new Event("cartUpdated")); window.location.assign("success.html");
      } catch (error) { window.showToast(error.message || "Unable to place order.", "error"); button.disabled = false; button.textContent = "Place Order"; }
    });
  });
})();
