import { apiGet, apiUpload } from './api.js';
import { escapeHtml, initCommonUi, loadCategories, setMessage } from './common.js';

const form = document.querySelector('#listing-form');
const messageBox = document.querySelector('#page-message');
const categorySelect = document.querySelector('#type');
const navCategorySelect = document.querySelector('#type-filter');

function renderListingCategories(categories) {
  if (!categories.length) {
    categorySelect.innerHTML = '<option value="">Brak kategorii</option>';
    return;
  }

  categorySelect.innerHTML = categories
    .map((category) => {
      const value = escapeHtml(category.type);
      return `<option value="${value}">${value}</option>`;
    })
    .join('');
}

async function refreshCategories() {
  const data = await apiGet('/categories.php');
  const categories = data.categories || [];
  renderListingCategories(categories);
  await loadCategories([navCategorySelect]);
}

async function init() {
  initCommonUi();
  await refreshCategories();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);

    try {
      await apiUpload('/create-product.php', data);
      setMessage(messageBox, 'Produkt dodany.', 'success');
      form.reset();
      await refreshCategories();
    } catch (error) {
      setMessage(messageBox, error.message, 'error');
    }
  });
}

init();
