// ========================================
// MIDDLEWARE AUTHENTIFICATION
// ========================================
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Lire le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // OU depuis le cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Si pas de token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attacher l'utilisateur à la requête
    req.user = { id: decoded.id };

    next();

  } catch (error) {
    console.error('Erreur auth middleware:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }
    next();
  };
};