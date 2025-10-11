import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
    document
      .getElementById("add-to-cart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);


    // Alert the user that the product has been added to the cart.
    alertMessage("Product added to cart", "success", ".product-details");
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  if (!product) {
    console.error("Product is undefined!");
    return;
  }

  // Category
  const category = product.Category ? product.Category.charAt(0).toUpperCase() + product.Category.slice(1) : "Unknown";
  document.querySelector("h2").textContent = category;

  // Brand
  const brandName = product.Brand?.Name || "Unknown";
  document.querySelector("#p-brand").textContent = brandName;

  // Name
  document.querySelector("#p-name").textContent = product.NameWithoutBrand || product.Name || "Unknown";

  // Image
  const productImage = document.querySelector("#p-image");
  productImage.src = product.Images?.PrimaryExtraLarge || "/path/to/default-image.jpg";
  productImage.alt = product.NameWithoutBrand || product.Name || "Product Image";

  // Price in EUR
  const euroPrice = product.FinalPrice
    ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(product.FinalPrice) * 0.85)
    : "N/A";
  document.querySelector("#p-price").textContent = euroPrice;

  // Color
  const colorName = product.Colors?.[0]?.ColorName || "N/A";
  document.querySelector("#p-color").textContent = colorName;

  // Description
  document.querySelector("#p-description").innerHTML = product.DescriptionHtmlSimple || "No description available.";

  // Add to cart
  document.querySelector("#add-to-cart").dataset.id = product.Id || "";
}
