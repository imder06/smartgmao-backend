// ========================================
// ROUTES AUTHENTIFICATION
// ========================================
// Définit les routes pour l'authentification

// Imports
const express = require('express');
const router = express.Router();

// Import du controller
const { register, login, getMe } = require('../controllers/authController');

// Import du middleware
const { protect } = require('../middleware/auth');

// ========================================
// ROUTES PUBLIQUES (pas besoin d'être connecté)
// ========================================

// POST /api/auth/register : Inscription
router.post('/register', register);

// POST /api/auth/login : Connexion
router.post('/login', login);

// ========================================
// ROUTES PROTÉGÉES (besoin d'être connecté)
// ========================================

// GET /api/auth/me : Récupérer l'utilisateur connecté
// protect : middleware qui vérifie le token
router.get('/me', protect, getMe);

// ========================================
// EXPORT
// ========================================
module.exports = router;