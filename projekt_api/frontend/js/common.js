export const STORAGE_KEYS = {
  cart: 'jaguar_cart',
  auth: 'jaguar_auth',
};

export function getApiBase() {
  return (window.API_BASE || '').replace(/\/$/, '');
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function formatMoney(value) {
  const number = Number(value ?? 0);
  return number.toFixed(2);
}

export function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(item => item && Number(item.id) > 0 && Number(item.quantity) > 0) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  updateCartCount();
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count > 0 ? `🛒(${count})` : '🛒';
  });
}

export function addToCart(productId, quantity, maxQuantity = null) {
  const id = Number(productId);
  const qty = Number(quantity);
  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(qty) || qty <= 0) {
    return { ok: false, message: 'Nieprawidłowa ilość.' };
  }

  const cart = getCart();
  const existing = cart.find((item) => Number(item.id) === id);
  const currentQty = existing ? Number(existing.quantity) : 0;
  const nextQty = currentQty + qty;

  if (maxQuantity !== null && nextQty > Number(maxQuantity)) {
    return { ok: false, message: 'Nie można dodać więcej niż stan magazynowy.' };
  }

  if (existing) {
    existing.quantity = nextQty;
  } else {
    cart.push({ id, quantity: qty });
  }

  saveCart(cart);
  return { ok: true };
}

export function setItemQuantity(productId, quantity) {
  const id = Number(productId);
  const qty = Number(quantity);
  const cart = getCart();

  const next = cart
    .map((item) => Number(item.id) === id ? { ...item, quantity: qty } : item)
    .filter((item) => Number(item.quantity) > 0);

  saveCart(next);
}

export function removeFromCart(productId) {
  const id = Number(productId);
  const cart = getCart().filter((item) => Number(item.id) !== id);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.cart);
  updateCartCount();
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.auth);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthUser(user) {
  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(user));
  renderUserArea();
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.auth);
  renderUserArea();
}

export function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

export function setMessage(target, text, type = 'success') {
  if (!target) return;
  target.textContent = text || '';
  target.classList.remove('hidden', 'success', 'error');
  target.classList.add('message');
  target.classList.add(type === 'error' ? 'error' : 'success');
  if (!text) {
    target.classList.add('hidden');
  }
}

export function clearMessage(target) {
  if (!target) return;
  target.textContent = '';
  target.classList.add('hidden');
  target.classList.remove('success', 'error');
}

export function renderUserArea() {
  const user = getAuthUser();
  document.querySelectorAll('[data-user-area]').forEach((container) => {
    if (!container) return;

    if (user?.login) {
      container.innerHTML = `
        <span>Zalogowany: <strong>${escapeHtml(user.login)}</strong></span>
        <button type="button" data-logout-button>Wyloguj</button>
      `;
    } else {
      container.innerHTML = `<a href="login.php">Log in</a>`;
    }
  });

  document.querySelectorAll('[data-logout-button]').forEach((button) => {
    button.addEventListener('click', () => {
      logout();
      if (window.location.pathname.endsWith('/login.php') || window.location.pathname.endsWith('/register.php')) {
        window.location.href = 'index.php';
      }
    });
  });
}

export async function loadCategories(selects, selected = 'all') {
  const { apiGet } = await import('./api.js');
  const data = await apiGet('/categories.php');
  const options = ['<option value="all">All</option>']
    .concat(data.categories.map((item) => {
      const value = escapeHtml(item.type);
      const isSelected = selected === item.type ? ' selected' : '';
      return `<option value="${value}"${isSelected}>${value}</option>`;
    }))
    .join('');

  selects.forEach((select) => {
    if (!select) return;
    select.innerHTML = options;
  });

  return data.categories;
}

export function initCommonUi() {
  updateCartCount();
  renderUserArea();
}
