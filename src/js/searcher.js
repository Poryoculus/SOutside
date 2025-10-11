import ProductList from "../js/ProductList.mjs";
import ExternalServices from "../js/ExternalServices.mjs";
import { qs } from "../js/utils.mjs";

const form = qs("#search-form");
const resultsContainer = qs("#search-results");
const dataSource = new ExternalServices();

const categories = ["backpacks", "tents", "sleepingbags", "hammocks"];
const productLists = categories.map(cat => new ProductList(cat, dataSource, null));

form.addEventListener("submit", async e => {
  e.preventDefault();
  const query = qs("#search-input").value.trim().toLowerCase();
  if (!query) return;

  const allProductsArrays = await Promise.all(productLists.map(pl => pl.fetchData()));
  const allProducts = allProductsArrays.flat();

  const results = allProducts.filter(product =>
    (product.Name && product.Name.toLowerCase().includes(query)) ||
    (product.NameWithoutBrand && product.NameWithoutBrand.toLowerCase().includes(query))
  );

  resultsContainer.innerHTML = "";
  if (!results.length) {
    resultsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  results.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <img src="${product.Images?.PrimaryMedium || ''}" alt="${product.NameWithoutBrand || ''}" />
      <h3>${product.Name || product.NameWithoutBrand}</h3>
      <p>Price: $${product.FinalPrice || 'N/A'}</p>
      <a href="/product-details.html?id=${product.Id}">View Details</a>
    `;
    resultsContainer.appendChild(div);
  });
});