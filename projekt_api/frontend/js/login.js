import { apiPost } from './api.js';
import { initCommonUi, saveAuthUser, setMessage } from './common.js';

const form = document.querySelector('#login-form');
const messageBox = document.querySelector('#page-message');

initCommonUi();

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    login: form.login.value.trim(),
    password: form.password.value,
  };

  try {
    const data = await apiPost('/login.php', payload);
    saveAuthUser(data.user);
    setMessage(messageBox, 'Zalogowano poprawnie.', 'success');
    window.location.href = 'index.php';
  } catch (error) {
    setMessage(messageBox, error.message, 'error');
  }
});
