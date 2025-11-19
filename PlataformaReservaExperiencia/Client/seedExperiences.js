require('dotenv').config();
const mongoose = require('mongoose');
const Experience = require('./models/Experience');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado para seed'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

const experiences = [
  {
    name: "Clase de Cocina Mexicana",
    description: "Aprende a cocinar tacos y salsas auténticas",
    price: 500,
    date: new Date("2025-12-01"),
    capacity: 10,
    spotsAvailable: 10,
    provider: { id: new mongoose.Types.ObjectId(), name: "Juan Perez", status: "Aprobado" }
  },
  {
    name: "Tour Histórico de la Ciudad",
    description: "Recorre los lugares más emblemáticos",
    price: 300,
    date: new Date("2025-12-05"),
    capacity: 15,
    spotsAvailable: 15,
    provider: { id: new mongoose.Types.ObjectId(), name: "Maria Lopez", status: "Aprobado" }
  },
  {
    name: "Clase de Fotografía Nocturna",
    description: "Captura la ciudad de noche con técnicas profesionales",
    price: 700,
    date: new Date("2025-12-10"),
    capacity: 8,
    spotsAvailable: 8,
    provider: { id: new mongoose.Types.ObjectId(), name: "Carlos Rios", status: "Aprobado" }
  }
];

// Insertar datos
const seedDB = async () => {
  try {
    await Experience.deleteMany({}); // Borra datos antiguos
    await Experience.insertMany(experiences);
    console.log('Experiencias de prueba insertadas');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

seedDB();
