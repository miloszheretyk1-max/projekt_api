import { apiGet } from './api.js';
import { addToCart, escapeHtml, formatMoney, getQueryParam, initCommonUi, loadCategories, setMessage } from './common.js';

const productBox = document.querySelector('#product-box');
const quantityInput = document.querySelector('#number');
const addButton = document.querySelector('#add-to-cart');
const messageBox = document.querySelector('#page-message');
const typeSelect = document.querySelector('#type-filter');
const loadingBox = document.querySelector('#loading');

let currentProduct = null;

function renderProduct(product) {
  currentProduct = product;
  document.title = product.name;
  productBox.innerHTML = `
    <article>
      <section>
        <h1>${escapeHtml(product.name)}</h1>
        <h4>${escapeHtml(product.description)}</h4>
        <h4>Price: $${formatMoney(product.price)}</h4>
        <h4>Available: ${Number(product.quantity)}</h4>
        <div class="product-actions">
          <label for="number">Number:</label>
          <input type="number" name="number" id="number" required min="1" max="${Number(product.quantity)}" value="1">
          <button type="button" class="primary" id="add-to-cart">Add to cart</button>
        </div>
      </section>
      <aside>
        <img src="${escapeHtml(product.image_url || 'img/logo-black.png')}" alt="${escapeHtml(product.name)}">
      </aside>
    </article>
  `;

  document.querySelector('#add-to-cart').addEventListener('click', () => {
    const numberField = document.querySelector('#number');
    const qty = Number(numberField.value || 1);
    const result = addToCart(product.id, qty, Number(product.quantity));
    if (!result.ok) {
      setMessage(messageBox, result.message, 'error');
      return;
    }
    setMessage(messageBox, 'Produkt dodany do koszyka.', 'success');
  });
}

async function init() {
  initCommonUi();
  await loadCategories([typeSelect]);

  const id = Number(getQueryParam('id'));
  if (!id) {
    window.location.href = 'index.php';
    return;
  }

  loadingBox.classList.remove('hidden');

  try {
    const data = await apiGet('/product.php', { id });
    renderProduct(data.product);
  } catch (error) {
    setMessage(messageBox, error.message, 'error');
    productBox.innerHTML = '<div class="empty-state"><h2>Nie znaleziono produktu.</h2></div>';
  } finally {
    loadingBox.classList.add('hidden');
  }
}

init();
