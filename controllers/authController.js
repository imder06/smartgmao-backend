// ========================================
// CONTROLLER AUTHENTIFICATION (VERSION TEMPORAIRE - SANS MONGODB)
// ========================================
// Contient la logique métier pour l'authentification

// Imports
const jwt = require('jsonwebtoken');

// ========================================
// UTILISATEUR DE TEST TEMPORAIRE
// ========================================
// Utilisateur en dur pour tester sans MongoDB
const TEMP_USER = {
  _id: '123456789',
  nom: 'Derradji',
  prenom: 'Imad',
  email: 'admin@smartgmao.com',
  password: 'admin123', // Mot de passe en clair (temporaire uniquement !)
  role: 'admin',
  telephone: null,
  photo: 'default-avatar.png',
  isActive: true,
  createdAt: new Date(),
  
  // Méthode pour retourner le profil sans le mot de passe
  getPublicProfile: function() {
    return {
      _id: this._id,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      role: this.role,
      telephone: this.telephone,
      photo: this.photo,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
};

// ========================================
// FONCTION : Générer un token JWT
// ========================================
// Crée un token JWT signé avec l'ID de l'utilisateur
const generateToken = (userId) => {
  // jwt.sign : crée un token
  // Paramètres : payload (données), secret, options
  return jwt.sign(
    { id: userId },                    // Payload : ID de l'utilisateur
    process.env.JWT_SECRET,            // Clé secrète depuis .env
    { expiresIn: process.env.JWT_EXPIRE || '30d' }  // Durée de validité
  );
};

// ========================================
// ROUTE : POST /api/auth/register (TEMPORAIRE - DÉSACTIVÉ)
// ========================================
// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  // Version temporaire : on n'accepte pas les inscriptions
  return res.status(503).json({
    success: false,
    message: 'Inscription temporairement désactivée (mode test sans base de données)'
  });
};

// ========================================
// ROUTE : POST /api/auth/login (VERSION TEMPORAIRE)
// ========================================
// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    // Récupérer email et password du body
    const { email, password } = req.body;

    // Vérifier que email et password sont fournis
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier avec l'utilisateur temporaire en dur
    if (email === TEMP_USER.email && password === TEMP_USER.password) {
  const token = generateToken(TEMP_USER._id);
  
  // NOUVEAU : Envoyer le token dans un cookie httpOnly
  res.cookie('token', token, {
    httpOnly: true,      // Pas accessible en JavaScript
    secure: false,       // false en dev (localhost = HTTP)
    sameSite: 'lax',     // Protection CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours en millisecondes
    path: '/'            // Valide pour toutes les routes
  });
  
  return res.status(200).json({
    success: true,
    message: 'Connexion réussie (mode test sans base de données)',
    token, // Garder aussi dans le JSON pour compatibilité
    user: TEMP_USER.getPublicProfile()
  });
}

    // Si les credentials ne correspondent pas
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect'
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// ========================================
// ROUTE : GET /api/auth/me (VERSION TEMPORAIRE)
// ========================================
// Récupérer l'utilisateur connecté (nécessite authentification)
exports.getMe = async (req, res) => {
  try {
    // req.user : ajouté par le middleware d'authentification
    // Dans la version temporaire, on retourne l'utilisateur de test
    
    // Vérifier si l'ID correspond à notre utilisateur de test
    if (req.user && req.user.id === TEMP_USER._id) {
      return res.status(200).json({
        success: true,
        user: TEMP_USER.getPublicProfile()
      });
    }

    // Si l'ID ne correspond pas
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });

  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};