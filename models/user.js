// ========================================
// MODÈLE UTILISATEUR (User.js)
// ========================================
// Ce fichier définit la STRUCTURE d'un utilisateur dans MongoDB
// Il contient aussi les méthodes pour gérer les mots de passe

// ========================================
// IMPORTS
// ========================================

// mongoose : pour créer le schéma et le modèle MongoDB
const mongoose = require('mongoose');

// bcrypt : pour hasher (crypter) les mots de passe de manière sécurisée
// On ne stocke JAMAIS les mots de passe en clair dans la base de données !
const bcrypt = require('bcryptjs');

// ========================================
// DÉFINITION DU SCHÉMA UTILISATEUR
// ========================================

// Un schéma = plan/structure des données (comme une table en SQL)
// mongoose.Schema() crée un nouveau schéma
const userSchema = new mongoose.Schema(
  {
    // ========================================
    // CHAMP : NOM
    // ========================================
    nom: {
      // type : type de données (String = texte)
      type: String,
      
      // required : champ obligatoire
      // [true, 'message'] : true + message d'erreur personnalisé
      required: [true, 'Le nom est obligatoire'],
      
      // trim : supprime les espaces avant et après le texte
      // Exemple : "  Dupont  " devient "Dupont"
      trim: true,
    },

    // ========================================
    // CHAMP : PRÉNOM
    // ========================================
    prenom: {
      type: String,
      required: [true, 'Le prénom est obligatoire'],
      trim: true,
    },

    // ========================================
    // CHAMP : EMAIL
    // ========================================
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      
      // unique : cet email doit être unique dans toute la collection
      // Impossible d'avoir deux utilisateurs avec le même email
      unique: true,
      
      // lowercase : convertit automatiquement en minuscules
      // "John@GMAIL.com" devient "john@gmail.com"
      lowercase: true,
      
      trim: true,
      
      // match : validation avec une expression régulière (regex)
      // Vérifie que l'email est au bon format (xxx@xxx.xxx)
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Format d\'email invalide'
      ],
    },

    // ========================================
    // CHAMP : MOT DE PASSE
    // ========================================
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      
      // minlength : longueur minimale du mot de passe
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      
      // select : false = ne pas retourner le mot de passe par défaut dans les requêtes
      // Pour des raisons de sécurité, on ne renvoie JAMAIS le mot de passe au client
      select: false,
    },

    // ========================================
    // CHAMP : RÔLE
    // ========================================
    role: {
      type: String,
      
      // enum : liste des valeurs autorisées
      // Seules ces 3 valeurs sont acceptées
      enum: ['admin', 'technicien', 'utilisateur'],
      
      // default : valeur par défaut si rien n'est spécifié
      // Tout nouvel utilisateur est "utilisateur" par défaut
      default: 'utilisateur',
    },

    // ========================================
    // CHAMP : TÉLÉPHONE (optionnel)
    // ========================================
    telephone: {
      type: String,
      
      // default : null = peut être vide
      default: null,
    },

    // ========================================
    // CHAMP : PHOTO DE PROFIL
    // ========================================
    photo: {
      type: String,
      
      // default : image par défaut si l'utilisateur n'en uploade pas
      default: 'default-avatar.png',
    },

    // ========================================
    // CHAMP : STATUT DU COMPTE
    // ========================================
    isActive: {
      // Boolean : true ou false
      type: Boolean,
      
      // Par défaut, le compte est actif
      default: true,
    },
  },
  {
    // ========================================
    // OPTIONS DU SCHÉMA
    // ========================================
    
    // timestamps : ajoute automatiquement deux champs :
    // - createdAt : date de création du document
    // - updatedAt : date de dernière modification
    timestamps: true,
  }
);

// ========================================
// MIDDLEWARE PRE-SAVE
// ========================================
// Ce middleware s'exécute AVANT de sauvegarder un utilisateur dans la base
// Il sert à crypter le mot de passe

// .pre('save') : avant la sauvegarde
// async function : fonction asynchrone car le hashage prend du temps
userSchema.pre('save', async function (next) {
  
  // this : représente le document utilisateur en cours de sauvegarde
  
  // isModified('password') : vérifie si le mot de passe a été modifié
  // Si le mot de passe n'a PAS changé, on passe au suivant (next)
  // Cela évite de re-hasher un mot de passe déjà hashé
  if (!this.isModified('password')) {
    return next();
  }

  // ========================================
  // HASHAGE DU MOT DE PASSE
  // ========================================
  
  // Générer un "salt" (grain de sel)
  // Le salt est une chaîne aléatoire ajoutée au mot de passe avant hashage
  // Cela rend le hash unique même si deux users ont le même mot de passe
  // 10 : niveau de complexité (rounds) - plus c'est élevé, plus c'est sécurisé mais lent
  const salt = await bcrypt.genSalt(10);

  // Hasher (crypter) le mot de passe avec le salt
  // bcrypt.hash() transforme "monMotDePasse123" en chaîne incompréhensible
  // Exemple : "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
  this.password = await bcrypt.hash(this.password, salt);

  // next() : continuer le processus de sauvegarde
  next();
});

// ========================================
// MÉTHODE : COMPARER LES MOTS DE PASSE
// ========================================
// Cette méthode sera utilisée lors de la connexion
// Elle compare le mot de passe entré avec celui stocké en base

// .methods : ajoute une méthode qui peut être appelée sur un document
// Exemple : user.comparePassword('monMotDePasse')
userSchema.methods.comparePassword = async function (enteredPassword) {
  
  // enteredPassword : mot de passe saisi par l'utilisateur lors du login
  // this.password : mot de passe hashé stocké en base de données
  
  // bcrypt.compare() compare les deux mots de passe
  // Retourne true si ils correspondent, false sinon
  // bcrypt sait comparer un mot de passe clair avec un mot de passe hashé
  return await bcrypt.compare(enteredPassword, this.password);
};

// ========================================
// MÉTHODE : OBTENIR LE PROFIL PUBLIC
// ========================================
// Retourne l'utilisateur SANS le mot de passe (pour les réponses API)

userSchema.methods.getPublicProfile = function () {
  // Retourne un objet avec toutes les infos SAUF le mot de passe
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
};

// ========================================
// EXPORT DU MODÈLE
// ========================================

// mongoose.model('User', userSchema) : crée le modèle User basé sur le schéma
// 'User' : nom du modèle (MongoDB créera une collection 'users' en minuscules + pluriel)
// module.exports : exporte le modèle pour l'utiliser dans d'autres fichiers
module.exports = mongoose.model('User', userSchema);