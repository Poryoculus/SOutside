import ProductList from "../js/ProductList.mjs";
import ExternalServices from "../js/ExternalServices.mjs";
import { qs } from "../js/utils.mjs";

const resultsContainer = qs("#search-results");
const dataSource = new ExternalServices();

const categories = ["backpacks", "tents", "sleepingbags", "hammocks"];
const productLists = categories.map(cat => new ProductList(cat, dataSource, null));

const searchQuery = new URLSearchParams(window.location.search).get("search")?.trim().toLowerCase();

async function runSearch(query) {
  if (!query) return;

  const allProductsArrays = await Promise.all(productLists.map(pl => pl.fetchData()));
  const allProducts = allProductsArrays.flat();

  const results = allProducts.filter(product =>
    (product.Name?.toLowerCase().includes(query)) ||
    (product.NameWithoutBrand?.toLowerCase().includes(query))
  );

  resultsContainer.innerHTML = "";
  if (!results.length) {
    resultsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  // render results
  productLists[0].listElement = resultsContainer;
  productLists[0].renderList(results);
  productLists[0].listElement = null;
}

// Run search on page load if query exists
if (searchQuery) {
  runSearch(searchQuery);
}

// Optional: also handle form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const term = input.value.trim();
      if (term) {
        window.location.href = `/product-listing/index.html?search=${encodeURIComponent(term)}`;
      }
    });
  }
});
