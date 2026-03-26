import { apiGet, apiPost } from './api.js';
import {
  clearCart,
  formatMoney,
  getAuthUser,
  getCart,
  initCommonUi,
  loadCategories,
  removeFromCart,
  setItemQuantity,
  setMessage,
  escapeHtml,
} from './common.js';

const itemsBox = document.querySelector('#cart-items');
const totalBox = document.querySelector('#cart-total');
const messageBox = document.querySelector('#page-message');
const form = document.querySelector('#checkout-form');
const typeSelect = document.querySelector('#type-filter');

function renderCart(products) {
  const cart = getCart();
  const productMap = new Map(products.map((item) => [Number(item.id), item]));
  let total = 0;

  const html = cart.map((entry) => {
    const product = productMap.get(Number(entry.id));
    if (!product) {
      return '';
    }

    const quantity = Math.min(Number(entry.quantity), Number(product.quantity));
    if (quantity !== Number(entry.quantity)) {
      setItemQuantity(product.id, quantity);
    }

    const subtotal = quantity * Number(product.price);
    total += subtotal;

    return `
      <section class="product">
        <img src="${escapeHtml(product.image_url || 'img/logo-black.png')}" alt="${escapeHtml(product.name)}">
        <div class="cart-controls">
          <span>Number: ${quantity}</span>
          <button type="button" data-action="plus" data-id="${Number(product.id)}">add 1</button>
          <button type="button" data-action="minus" data-id="${Number(product.id)}">remove 1</button>
          <button type="button" data-action="delete" data-id="${Number(product.id)}">remove</button>
        </div>
        <h1>${escapeHtml(product.name)}</h1>
        <h3>Price: $${formatMoney(subtotal)}</h3>
      </section>
    `;
  }).join('');

  itemsBox.innerHTML = html || '<section class="product"><h1>Cart is empty</h1></section>';
  totalBox.textContent = `$${formatMoney(total)}`;

  itemsBox.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const action = button.dataset.action;
      const cartNow = getCart();
      const item = cartNow.find((row) => Number(row.id) === id);
      const product = productMap.get(id);
      if (!item || !product) return;

      if (action === 'plus') {
        const next = Math.min(Number(item.quantity) + 1, Number(product.quantity));
        setItemQuantity(id, next);
      } else if (action === 'minus') {
        setItemQuantity(id, Number(item.quantity) - 1);
      } else if (action === 'delete') {
        removeFromCart(id);
      }

      loadCart();
    });
  });
}

async function loadCart() {
  const cart = getCart();
  if (!cart.length) {
    itemsBox.innerHTML = '<section class="product"><h1>Cart is empty</h1></section>';
    totalBox.textContent = '$0.00';
    return;
  }

  const ids = cart.map((item) => item.id).join(',');
  try {
    const data = await apiGet('/products.php', { ids });
    renderCart(data.products || []);
  } catch (error) {
    setMessage(messageBox, error.message, 'error');
  }
}

async function init() {
  initCommonUi();
  await loadCategories([typeSelect]);
  await loadCart();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cart = getCart();
    if (!cart.length) {
      setMessage(messageBox, 'Koszyk jest pusty.', 'error');
      return;
    }

    const user = getAuthUser();
    const payload = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      postal_code: form.postal_code.value.trim(),
      user_id: user?.id || null,
      items: cart,
    };

    try {
      const data = await apiPost('/order.php', payload);
      clearCart();
      form.reset();
      await loadCart();
      setMessage(messageBox, `Zamówienie złożone. Numer: ${data.order_id}`, 'success');
    } catch (error) {
      setMessage(messageBox, error.message, 'error');
    }
  });
}

init();
