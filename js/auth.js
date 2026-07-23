(() => {
  const api = window.API_URL || "http://localhost:5000/api";
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmation = document.getElementById("confirmPassword").value;
    if (!fullName || !/^\S+@\S+\.\S+$/.test(email) || !/^[6-9]\d{9}$/.test(phone) || password.length < 6) return window.showToast("Enter valid account details. Passwords need at least 6 characters.", "error");
    if (password !== confirmation) return window.showToast("Your passwords do not match.", "error");
    if (!document.getElementById("acceptTerms").checked) return window.showToast("Please accept the terms to continue.", "error");
    try {
      const response = await fetch(`${api}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, email, phone, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.showToast("Account created. Welcome to AROFRAG.");
      setTimeout(() => window.location.assign("index.html"), 650);
    } catch (error) { window.showToast(error.message || "We could not create your account.", "error"); }
  });
})();
