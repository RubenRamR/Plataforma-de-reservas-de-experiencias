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
