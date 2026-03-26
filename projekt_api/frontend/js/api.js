function buildUrl(path, params = null) {
  const url = new URL(`${window.API_BASE.replace(/\/$/, '')}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({ message: 'Nieprawidłowa odpowiedź API.' }));
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Wystąpił błąd.');
  }
  return data;
}

export async function apiGet(path, params = null) {
  const response = await fetch(buildUrl(path, params));
  return parseResponse(response);
}

export async function apiPost(path, payload) {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export async function apiUpload(path, formData) {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    body: formData,
  });

  return parseResponse(response);
}
