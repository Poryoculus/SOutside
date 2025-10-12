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

  console.log("All products fetched:", allProducts);

  const results = allProducts.filter(product =>
    (product.Name?.toLowerCase().includes(query)) ||
    (product.NameWithoutBrand?.toLowerCase().includes(query))
  );

  console.log("Filtered search results:", results);

  resultsContainer.innerHTML = "";
  if (!results.length) {
    resultsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  productLists[0].listElement = resultsContainer;
  productLists[0].renderList(results);
  productLists[0].listElement = null;
}

if (searchQuery) {
  runSearch(searchQuery);
}

const form = qs("#search-form");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const query = qs("#search-input")?.value.trim().toLowerCase();
    if (query) runSearch(query);
  });
}