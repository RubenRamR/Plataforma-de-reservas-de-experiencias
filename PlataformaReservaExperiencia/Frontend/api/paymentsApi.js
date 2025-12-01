// Frontend/api/paymentsApi.js

const API_BASE_URL = "http://localhost:3000/api/v1";

export async function payReservation(token, reservationId) {
  const res = await fetch(`${API_BASE_URL}/payments/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reservationId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al realizar el pago");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data; // { message, reservation }
}
