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
    const products = await this.fetchData();
    this.renderList(products);
    const titleEl = document.querySelector(".title");
    if (titleEl) titleEl.textContent = this.category;
  }

  // Fetch products without rendering (for search)
  async fetchData() {
    return await this.dataSource.getData(this.category);
  }

  // Render a list of products in the provided container
  renderList(products) {
    if (!this.listElement) return;
    renderListWithTemplate(productCardTemplate, this.listElement, products);
  }
}