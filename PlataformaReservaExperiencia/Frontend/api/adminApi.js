// Frontend/api/adminApi.js

const API_BASE_URL = "http://localhost:3000/api/v1";

// Obtener lista de proveedores pendientes
export async function getPendingProviders(token) {
  const res = await fetch(`${API_BASE_URL}/admin/pending-providers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al obtener proveedores pendientes");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  // tu backend devuelve directamente un array de User
  return data;
}

// Aprobar un proveedor por ID
export async function approveProvider(token, userId) {
  const res = await fetch(`${API_BASE_URL}/admin/approve-provider/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al aprobar proveedor");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  // backend devuelve { message, provider }
  return data;
}
