import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images?.PrimaryMedium || ''}" alt="${product.Name || ''}">
        <h3>${product.Brand?.Name || ''}</h3>
        <p>${product.NameWithoutBrand || ''}</p>
        <p class="product-card__price">$${product.FinalPrice || 'N/A'}</p>
      </a>
    </li>
  `;
}



export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  // For category pages: fetch and render automatically
  async init() {
  if (!this.listElement) throw new Error("No container element provided for rendering.");

  // Get URL params
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search"); // e.g., "Thule"

  let products;
  if (searchQuery) {
    // If a search query exists, use searchAllCategories
    products = await this.dataSource.searchAllCategories(searchQuery);
  } else {
    // Otherwise, fetch by category
    const category = urlParams.get("category") || this.category;
    products = await this.dataSource.getData(category);
  }

  console.log("Fetched products:", products); // optional debug
  this.renderList(products);

  // Update page title
  const titleEl = document.querySelector(".title");
  if (titleEl) {
    titleEl.textContent = searchQuery || urlParams.get("category") || this.category;
  }
}
  // Fetch products without rendering (for search)
  async fetchData() {
    return await this.dataSource.getData(this.category);
  }

  // Render a list of products in the provided container
  renderList(list) {
  if (!list || list.length === 0) {
    this.listElement.innerHTML = `<p>No products found.</p>`;
    return;
  }

  

  const htmlItems = list.map((product) => `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images?.PrimaryMedium || ''}" alt="${product.Name || ''}">
        <h3>${product.Name}</h3>
        <p>$${product.FinalPrice}</p>
      </a>
    </li>
  `);

  this.listElement.innerHTML = htmlItems.join("");
}
}