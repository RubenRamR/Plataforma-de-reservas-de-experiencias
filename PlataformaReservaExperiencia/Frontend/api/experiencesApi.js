// Frontend/api/experiencesApi.js

const API_BASE_URL = "http://localhost:3000/api/v1";

export async function createExperience(token, payload) {
  const res = await fetch(`${API_BASE_URL}/experiences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al crear la experiencia");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
