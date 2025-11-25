// Frontend/components/adminVerificaciones.js
import { getPendingProviders, approveProvider } from "../api/adminApi.js";

const tableBody = document.querySelector("#providers-table-body");
const statusDiv = document.querySelector("#status");
const headerTitle = document.querySelector("#admin-header-title");

function setStatus(type, message) {
  statusDiv.textContent = message;
  statusDiv.className = "status";
  if (type === "error") statusDiv.classList.add("error");
  if (type === "success") statusDiv.classList.add("success");
}

function ensureAdmin() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) {
    setStatus("error", "No hay sesión iniciada. Inicia sesión como administrador.");
    throw new Error("No token");
  }

  if (role !== "Admin") {
    setStatus("error", "Acceso denegado. Esta sección es solo para administradores.");
    throw new Error("Not admin");
  }

  if (headerTitle) {
    headerTitle.textContent = "Panel de Aprobación de Proveedores";
  }

  return token;
}

function createRow(provider) {
  const tr = document.createElement("tr");
  tr.dataset.id = provider._id;

  const nameTd = document.createElement("td");
  nameTd.textContent = provider.name;

  const emailTd = document.createElement("td");
  emailTd.textContent = provider.email;

  const roleTd = document.createElement("td");
  roleTd.textContent = provider.role;

  const statusTd = document.createElement("td");
  statusTd.textContent = provider.status || "Pendiente";

  const actionTd = document.createElement("td");
  const approveBtn = document.createElement("button");
  approveBtn.textContent = "Aprobar";
  approveBtn.className = "btn btn-small approve-btn";
  approveBtn.dataset.id = provider._id;
  actionTd.appendChild(approveBtn);

  tr.appendChild(nameTd);
  tr.appendChild(emailTd);
  tr.appendChild(roleTd);
  tr.appendChild(statusTd);
  tr.appendChild(actionTd);

  return tr;
}

async function loadPendingProviders() {
  tableBody.innerHTML = "";
  setStatus("", "Cargando proveedores pendientes...");

  let token;
  try {
    token = ensureAdmin();
  } catch {
    return;
  }

  try {
    const providers = await getPendingProviders(token);

    if (!Array.isArray(providers) || providers.length === 0) {
      setStatus("success", "No hay proveedores pendientes por aprobar.");
      return;
    }

    providers.forEach((p) => {
      const row = createRow(p);
      tableBody.appendChild(row);
    });

    setStatus("", "");
  } catch (err) {
    console.error(err);
    if (err.status === 401 || err.status === 403) {
      setStatus(
        "error",
        err.data?.message ||
          "No tienes permiso para ver este panel. Asegúrate de iniciar sesión como Admin."
      );
    } else {
      setStatus("error", "Error al cargar proveedores pendientes.");
    }
  }
}

async function onApproveClick(e) {
  const btn = e.target.closest(".approve-btn");
  if (!btn) return;

  const userId = btn.dataset.id;
  if (!userId) return;

  const token = localStorage.getItem("token");
  if (!token) {
    setStatus("error", "Sesión no válida. Vuelve a iniciar sesión.");
    return;
  }

  const confirmed = window.confirm("¿Aprobar a este proveedor?");
  if (!confirmed) return;

  btn.disabled = true;
  btn.textContent = "Aprobando...";

  try {
    await approveProvider(token, userId);

    const row = tableBody.querySelector(`tr[data-id="${userId}"]`);
    if (row) row.remove();

    setStatus("success", "Proveedor aprobado correctamente.");

    if (tableBody.children.length === 0) {
      setStatus("success", "No quedan proveedores pendientes por aprobar.");
    }
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.textContent = "Aprobar";

    if (err.status === 401 || err.status === 403) {
      setStatus(
        "error",
        err.data?.message || "No tienes permiso para aprobar proveedores."
      );
    } else {
      setStatus("error", "Error al aprobar al proveedor.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPendingProviders();
  tableBody.addEventListener("click", onApproveClick);
});
