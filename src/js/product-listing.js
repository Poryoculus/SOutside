import { loadHeaderFooter, qs, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
const listing = new ProductList(category, dataSource, element);

document.addEventListener("DOMContentLoaded", () => {
  const titleEl = qs(".page-title");
  if (titleEl && category) {
    titleEl.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }
});
listing.init();