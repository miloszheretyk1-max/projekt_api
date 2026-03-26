import { apiPost } from './api.js';
import { initCommonUi, setMessage } from './common.js';

const form = document.querySelector('#register-form');
const messageBox = document.querySelector('#page-message');

initCommonUi();

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    login: form.login.value.trim(),
    password: form.password.value,
    confirmPassword: form.Cpassword.value,
  };

  try {
    await apiPost('/register.php', payload);
    setMessage(messageBox, 'Konto utworzone. Możesz się zalogować.', 'success');
    form.reset();
    setTimeout(() => {
      window.location.href = 'login.php';
    }, 600);
  } catch (error) {
    setMessage(messageBox, error.message, 'error');
  }
});
