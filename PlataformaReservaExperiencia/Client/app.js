require('dotenv').config();
const express = require('express');
const connectDB = require('./api/db');
const experiencesRoutes = require('./api/experiences');

const app = express();

// Conectar a MongoDB
connectDB();

app.use(express.json());
app.use('/api/v1/public/experiences', experiencesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
