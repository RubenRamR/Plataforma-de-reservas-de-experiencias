import { getExperiences } from "../api/experiencesApi.js";

const container = document.getElementById("experiencesContainer");

async function loadCatalog() {
    try {
        const experiences = await getExperiences();

        if (experiences.length === 0) {
            container.innerHTML = "<p>No hay experiencias disponibles</p>";
            return;
        }

        experiences.forEach(exp => {
            const card = document.createElement("div");
            card.className = "card-experience";

            card.innerHTML = `
                <h3>${exp.name}</h3>
    <p>${exp.description.substring(0, 80)}...</p>
    <p><strong>Precio:</strong> $${exp.price}</p>
    <p><strong>Fecha:</strong> ${new Date(exp.date).toLocaleDateString()}</p>

    <button class="btn-detalle" data-id="${exp._id}">
        Ver detalle
    </button>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p>Error cargando catálogo</p>`;
    }
}

// 👉 Manejar clics en botones "Ver detalle"
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-detalle")) {
        const id = e.target.getAttribute("data-id");
        window.location.href = `detalle-experiencia.html?id=${id}`;
    }
});

loadCatalog();

function renderCards(data) {
    container.innerHTML = "";

    data.forEach(exp => {
        const card = document.createElement("div");
        card.classList.add("experience-card");

        card.innerHTML = `
            <img src="${exp.imageUrl || '../assets/no-image.jpg'}" alt="${exp.name}">
            <h3 class="experience-title">${exp.name}</h3>
            <p class="experience-desc">${exp.description.substring(0, 90)}...</p>

            <button class="experience-btn" data-id="${exp.id}">
                Ver más
            </button>
        `;

        // Evento del botón
        card.querySelector("button").addEventListener("click", () => {
            const id = exp.id;
            window.location.href = ??  // aquí necesito el nombre del HTML de detalle
        });

        container.appendChild(card);
    });
    
}