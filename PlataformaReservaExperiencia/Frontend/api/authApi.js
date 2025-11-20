// Frontend/api/authApi.js

const API_BASE_URL = "http://localhost:3000/api/v1";

export async function registerVisitor(payload) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // tu backend usa 400 cuando el email ya existe
    const error = new Error(data.message || "Error al registrar visitante");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  // { message: "...", user: {...} }
  return data;
}
// ... (Deja el código de tu compañero tal cual arriba) ...

// === LO TUYO (F-01) ===

// Función para Login (HU-03)
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al iniciar sesión");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  // Se espera { token, user: { role, status, name } }
  return data;
}

export async function registerProvider(payload) {
  const providerPayload = { ...payload, role: "Proveedor" };

  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(providerPayload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al registrar proveedor");
    error.status = res.status;
    throw error;
  }

  return data;
}