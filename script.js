// js/script.js
// DoorDrop - Global site JS
// This version uses in-memory storage instead of localStorage

// ==============================
//  Console logs (3 total)
// ==============================
console.log("DoorDrop site script loaded");
console.log("Interactive features: search, login, cart are available");
console.log("In-memory cart initialized");

// ==============================
//  Utility: Cart in memory (not localStorage)
// ==============================
let cartData = [];

function getCart() {
  return cartData;
}

function saveCart(cart) {
  cartData = cart;
}

function findCartItemIndex(cart, id) {
  return cart.findIndex(item => item.id === id);
}

// Generate a simple id for items
function genId(name) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_") +
    "_" +
    String(Math.floor(Math.random() * 100000))
  );
}

// ==============================
//  Alerts (3 required by spec)
// ==============================

// 1) search alert (demo)
function searchAlert() {
  alert("Search feature coming soon!");
}

// ==============================
//  Add to cart
// ==============================
function addToCart(productName, price = 0, qty = 1) {
  const cart = getCart();

  const id = genId(productName);
  const item = {
    id,
    name: productName,
    price: Number(price) || 0,
    qty: Number(qty) || 1
  };

  cart.push(item);
  saveCart(cart);

  console.log("Added to Cart:", item);
  alert(productName + " added to cart!");
  renderCart();
}

// ==============================
//  Remove item from cart
// ==============================
function removeItem(itemId) {
  let cart = getCart();
  const idx = findCartItemIndex(cart, itemId);
  if (idx === -1) {
    console.warn("Attempted to remove non-existing cart item:", itemId);
    return;
  }
  const removed = cart.splice(idx, 1)[0];
  saveCart(cart);

  console.log("Removed from Cart:", removed);
  alert(removed.name + " removed from cart!");
  renderCart();
}

// ==============================
//  Contact Form Submission
// ==============================
function submitContactForm() {
  const name = document.getElementById("cname")?.value.trim();
  const email = document.getElementById("cemail")?.value.trim();
  const message = document.getElementById("cmessage")?.value.trim();

  if (!name || !email || !message) {
    alert("Please fill out all fields before submitting.");
    return false;
  }

  console.log("Contact Form Submitted:", { name, email, message });
  alert("Message submitted successfully!");

  // Optionally clear the form fields:
  // document.getElementById("cname").value = "";
  // document.getElementById("cemail").value = "";
  // document.getElementById("cmessage").value = "";

  return false;
}

// ==============================
//  Checkout (simple demo)
// ==============================
function checkout() {
  const cart = getCart();
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  console.log("Checkout initiated. Items:", cart);
  alert("Proceeding to checkout...");

  // Clear cart
  cartData = [];
  renderCart();
}

// ==============================
//  Render cart to a container
// ==============================
function renderCart() {
  const containerById = document.getElementById("cart-items");
  const container = containerById || document.querySelector(".cart-container");

  if (!container) {
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  // Build HTML for each cart item
  container.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const row = document.createElement("div");
    row.className = "rendered-cart-item";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.justifyContent = "space-between";
    row.style.gap = "12px";
    row.style.marginBottom = "12px";
    row.style.padding = "12px";
    row.style.border = "1px solid #e0e0e0";
    row.style.borderRadius = "8px";

    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:64px;height:64px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;border:1px solid #ddd;">
          <span style="font-size:32px;">🛒</span>
        </div>
        <div>
          <div style="font-weight:600">${escapeHtml(item.name)}</div>
          <div style="font-size:13px;color:#666">${item.qty} × Rs. ${item.price}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="font-weight:700;color:#ff6600">Rs. ${item.price * item.qty}</div>
        <button class="rendered-remove-btn" data-id="${item.id}" style="background:#ff4444;color:white;border:none;cursor:pointer;font-size:14px;padding:6px 12px;border-radius:4px;">Remove</button>
      </div>
    `;
    container.appendChild(row);
  });

  // Attach remove event listeners (delegation fallback)
  container.querySelectorAll(".rendered-remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      removeItem(id);
    });
  });

  // Show cart summary
  const summaryWrap = document.createElement("div");
  summaryWrap.style.marginTop = "24px";
  summaryWrap.style.padding = "16px";
  summaryWrap.style.background = "#f5f5f5";
  summaryWrap.style.borderRadius = "8px";

  const deliveryCharges = 0;
  const total = subtotal + deliveryCharges;

  summaryWrap.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span>Subtotal:</span>
      <span style="font-weight:600">Rs. ${subtotal}</span>
    </div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
      <span>Delivery Charges:</span>
      <span style="font-weight:600">Rs. ${deliveryCharges}</span>
    </div>
    <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:2px solid #ddd;">
      <span style="font-size:18px;font-weight:700">Total:</span>
      <span style="font-size:18px;font-weight:700;color:#ff6600">Rs. ${total}</span>
    </div>
  `;
  container.appendChild(summaryWrap);

  // Checkout button
  const checkoutWrap = document.createElement("div");
  checkoutWrap.style.marginTop = "18px";
  checkoutWrap.style.textAlign = "center";
  checkoutWrap.innerHTML = `<button id="rendered-checkout-btn" style="padding:12px 32px;background:#ff6600;border:none;border-radius:6px;color:#fff;cursor:pointer;font-size:16px;font-weight:600;">Proceed to Checkout</button>`;
  container.appendChild(checkoutWrap);

  const rbtn = document.getElementById("rendered-checkout-btn");
  if (rbtn) rbtn.addEventListener("click", checkout);
}

// Helper to avoid HTML injection
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ==============================
//  Login function
// ==============================
function loginFunction() {
  const userInput = document.getElementById("username");
  const passInput = document.getElementById("password");

  const user = userInput ? userInput.value.trim() : "";
  const pass = passInput ? passInput.value.trim() : "";

  console.log("Login Attempt:", user);

  if (!user || !pass) {
    alert("Please enter both username and password.");
    return false;
  }

  // Demo: any username/password is accepted
  alert("Login Successful!");
  return false;
}

// ==============================
//  DOMContentLoaded bindings
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Wire the search button
  const searchBtn = document.querySelector(".search-bar button");
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      searchAlert();
    });
  }

  // Render cart automatically if cart container exists
  renderCart();

  // Attach add-to-cart buttons with data attributes
  document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-product-name") || "Product";
      const price = Number(btn.getAttribute("data-product-price") || 0);
      addToCart(name, price, 1);
    });
  });

  // Wire up login form if present
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loginFunction();
    });
  }

  // Wire up contact form if present
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      submitContactForm();
    });
  }
});

// Make functions globally accessible for inline onclick handlers
window.addToCart = addToCart;
window.removeItem = removeItem;
window.checkout = checkout;
window.loginFunction = loginFunction;
window.submitContactForm = submitContactForm;
window.searchAlert = searchAlert;
