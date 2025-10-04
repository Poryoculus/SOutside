import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []; // always array
  const productList = document.querySelector(".product-list");
  const footer = document.querySelector(".cart-footer");
  const totalElement = document.querySelector("#cart-total-amount");
  const emptyMessage = document.querySelector(".cart-empty-message");

  if (cartItems.length === 0) {
    // Show empty message, hide footer
    emptyMessage?.classList.remove("hide");
    footer?.classList.add("hide");
    productList.innerHTML = "";
    return;
  }

  // Hide empty message, show footer
  emptyMessage?.classList.add("hide");
  footer?.classList.remove("hide");

  // Render cart items
  const htmlItems = cartItems.map(cartItemTemplate);
  productList.innerHTML = htmlItems.join("");

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  totalElement.innerText = total.toFixed(2);
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}">
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

renderCartContents();