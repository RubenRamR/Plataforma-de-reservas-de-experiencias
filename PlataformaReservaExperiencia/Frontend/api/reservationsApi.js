const API_BASE_URL = "http://localhost:3000/api/v1"; 
export async function createReservation(payload) {
  const token = localStorage.getItem('token'); 
  if (!token) {
    throw new Error("Debes iniciar sesión para reservar");
  }

  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al crear reserva");
    throw error;
  }

  return data;
}