// Frontend/api/experiencesApi.js

const API_BASE_URL = "http://localhost:3000/api/v1";
const PUBLIC_EXPERIENCES = `${API_BASE_URL}/public/experiences`;

// ---------------------------------------------
// Crear experiencia (requiere token)
// ---------------------------------------------
export async function createExperience(token, payload) {
  const res = await fetch(`${API_BASE_URL}/experiences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // <-- ESTA ES LA CORRECCIÓN
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

// ---------------------------------------------
// Obtener la lista pública del catálogo
// ---------------------------------------------
export async function getExperiences(filters = {}) {
  const params = new URLSearchParams();

  if (filters.priceMin != null) params.append("priceMin", filters.priceMin);
  if (filters.priceMax != null) params.append("priceMax", filters.priceMax);
  if (filters.date) params.append("date", filters.date);

  const url = params.toString()
    ? `${PUBLIC_EXPERIENCES}?${params.toString()}`
    : PUBLIC_EXPERIENCES;

  const res = await fetch(url);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al obtener experiencias");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ---------------------------------------------
// Obtener una experiencia por ID (detalle)
// ---------------------------------------------
export async function getExperienceById(id) {
  if (!id) throw new Error("getExperienceById: se requiere id");

  const res = await fetch(`${PUBLIC_EXPERIENCES}/${id}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Error al obtener la experiencia");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
