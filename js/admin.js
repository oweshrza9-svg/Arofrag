(() => {
    const api = window.API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user") || "null"
    );

    const request = (path, options = {}) =>
        fetch(`${api}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        }).then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            return data;
        });

    const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    if (!user || user.role !== "admin") {
        location.replace("login.html");
    }

    document.getElementById("adminLogout").onclick = () => {
        localStorage.clear();
        sessionStorage.clear();
        location.assign("index.html");
    };

    function editor(product = { price: 399, oldPrice: 999, stock: 0, isActive: true }) {
        const root = document.getElementById("productEditor");

        root.hidden = false;
        root.innerHTML = `
            <form class="editor">
                <input name="name" placeholder="Product name" value="${product.name || ""}" required>
                <input name="category" placeholder="Category" value="${product.category || ""}" required>
                <input name="slug" placeholder="Slug" value="${product.slug || ""}" required>
                <input name="image" placeholder="Image URL / asset path" value="${product.image || ""}" required>
                <input name="price" type="number" value="${product.price}">
                <input name="stock" type="number" value="${product.stock}">
                <select name="isActive">
                    <option value="true" ${product.isActive ? "selected" : ""}>Active</option>
                    <option value="false" ${!product.isActive ? "selected" : ""}>Inactive</option>
                </select>
                <textarea name="description" placeholder="Description" required>${product.description || ""}</textarea>
                <button>Save product</button>
            </form>
        `;

        root.querySelector("form").onsubmit = async (event) => {
            event.preventDefault();

            const data = Object.fromEntries(new FormData(event.target));
            data.price = Number(data.price);
            data.oldPrice = 999;
            data.stock = Number(data.stock);
            data.isActive = data.isActive === "true";
            data.sizes = ["3ml", "6ml", "12ml"];

            try {
                await request(`/products${product.id ? `/${product.id}` : ""}`, {
                    method: product.id ? "PUT" : "POST",
                    body: JSON.stringify(data),
                });

                root.hidden = true;
                load();
            } catch (error) {
                alert(error.message);
            }
        };
    }

    async function load() {
        try {
            const [dashboard, products, orders, users] = await Promise.all([
                request("/admin/dashboard"),
                request("/admin/products"),
                request("/admin/orders"),
                request("/admin/users"),
            ]);

            document.getElementById("statsGrid").innerHTML = Object.entries({
                "Total Products": dashboard.stats.totalProducts,
                "Total Orders": dashboard.stats.totalOrders,
                Revenue: money(dashboard.stats.revenue),
                "Registered Users": dashboard.stats.registeredUsers,
            })
                .map(([label, value]) => `
                    <article class="stat">
                        <span>${label}</span>
                        <strong>${value}</strong>
                    </article>
                `)
                .join("");

            document.getElementById("productsTable").innerHTML = products.products
                .map(
                    (product) => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${money(product.price)} <s class="muted">₹999</s></td>
                            <td>${product.stock}</td>
                            <td><span class="status">${product.isActive ? "Active" : "Inactive"}</span></td>
                            <td><button data-edit="${product.id}">Edit</button></td>
                        </tr>
                    `
                )
                .join("");

            document.querySelectorAll("[data-edit]").forEach((button) => {
                button.onclick = () =>
                    editor(products.products.find((product) => product.id === button.dataset.edit));
            });

            document.getElementById("ordersTable").innerHTML =
                orders.orders
                    .map(
                        (order) => `
                            <tr>
                                <td>#${order._id.slice(-7)}</td>
                                <td>
                                    ${order.customer.name}<br>
                                    <span class="muted">${order.customer.email}</span>
                                </td>
                                <td>${money(order.totalAmount)}</td>
                                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        `
                    )
                    .join("") || "<tr><td colspan=4>No orders yet.</td></tr>";

            document.getElementById("usersTable").innerHTML = users.users
                .map(
                    (user) => `
                        <tr>
                            <td>${user.fullName}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                        </tr>
                    `
                )
                .join("");
        } catch (error) {
            document.body.innerHTML = `
                <main class="admin-shell">
                    <h1>Admin access unavailable</h1>
                    <p>${error.message}</p>
                </main>
            `;
        }
    }

    document.getElementById("newProduct").onclick = () => editor();
    load();
})();
