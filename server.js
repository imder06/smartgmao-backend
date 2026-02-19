const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();

// connectDB(); // Commenté temporairement

const app = express();

// ========================================
// MIDDLEWARES (ORDRE TRÈS IMPORTANT !)
// ========================================

// 1. CORS (AVANT tout le reste)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// 2. Cookie Parser (AVANT express.json)
app.use(cookieParser());

// 3. Express JSON (AVANT les routes)
app.use(express.json());

// 4. Express URL Encoded (AVANT les routes)
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROUTES (APRÈS les middlewares)
// ========================================

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API SmartGMAO',
    version: '1.0.0',
    status: 'OK'
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipments', require('./routes/equipmentRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Gestion des erreurs (À LA FIN)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});