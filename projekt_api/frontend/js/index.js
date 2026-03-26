import { apiGet } from './api.js';
import { escapeHtml, formatMoney, initCommonUi, loadCategories, setMessage, getQueryParam } from './common.js';

const form = document.querySelector('#filter-form');
const typeSelect = document.querySelector('#type-filter');
const searchInput = document.querySelector('#search-filter');
const productsBox = document.querySelector('#products');
const messageBox = document.querySelector('#page-message');
const loadingBox = document.querySelector('#loading');

function productCard(product) {
  const img = escapeHtml(product.image_url || 'img/logo-black.png');
  const name = escapeHtml(product.name);
  const price = formatMoney(product.price);
  const qty = Number(product.quantity || 0);

  return `
    <section class="product">
      <img src="${img}" alt="${name}">
      <a href="product.php?id=${Number(product.id)}"><h2>Price: $${price}</h2><br>Show product</a>
      <h1>${name}</h1>
      <p>Available: ${qty}</p>
    </section>
  `;
}

async function loadProducts() {
  loadingBox.classList.remove('hidden');
  const params = {};
  if (typeSelect.value && typeSelect.value !== 'all') params.type = typeSelect.value;
  if (searchInput.value.trim()) params.search = searchInput.value.trim();

  try {
    const data = await apiGet('/products.php', params);
    const products = data.products || [];
    if (!products.length) {
      productsBox.innerHTML = `<section class="product-card-empty"><h2>Brak produktów</h2></section>`;
    } else {
      productsBox.innerHTML = products.map(productCard).join('');
    }
  } catch (error) {
    setMessage(messageBox, error.message, 'error');
    productsBox.innerHTML = '';
  } finally {
    loadingBox.classList.add('hidden');
  }
}

async function init() {
  initCommonUi();

  const type = getQueryParam('type') || 'all';
  const search = getQueryParam('search') || '';
  await loadCategories([typeSelect], type);
  searchInput.value = search;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('type', typeSelect.value || 'all');
    if (searchInput.value.trim()) {
      url.searchParams.set('search', searchInput.value.trim());
    } else {
      url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url);
    await loadProducts();
  });

  await loadProducts();
}

init();
