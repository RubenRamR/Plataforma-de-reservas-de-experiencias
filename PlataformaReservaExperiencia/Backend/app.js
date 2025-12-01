const express = require('express');
require('dotenv').config();
const connectDB = require('./api/db'); // tu conexión a MongoDB

const authRoutes = require('./api/auth'); // ← Asegúrate que exista este archivo
const experiencesRoutes = require('./api/experiences');
const adminRoutes = require('./api/admin');
const paymentsRoutes = require(".api/payments");


const app = express();
connectDB();
app.use(express.json());

// Montaje de rutas
app.use('/api/v1/auth', authRoutes);               
app.use('/api/v1/experiences', experiencesRoutes); 
app.use('/api/v1/public/experiences', experiencesRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use("/api/v1/payments", paymentsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
