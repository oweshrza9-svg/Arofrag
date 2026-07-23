(() => {
  const api = window.API_URL || "http://localhost:5000/api";
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    if (!/^\S+@\S+\.\S+$/.test(email) || !password) return window.showToast("Enter your email and password.", "error");
    try {
      const response = await fetch(`${api}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const storage = document.getElementById("rememberMe").checked ? localStorage : sessionStorage;
      storage.setItem("token", data.token); storage.setItem("user", JSON.stringify(data.user));
      window.showToast(`Welcome back, ${data.user.fullName}.`);
      setTimeout(() => window.location.assign("index.html"), 650);
    } catch (error) { window.showToast(error.message || "Unable to sign in.", "error"); }
  });
})();
