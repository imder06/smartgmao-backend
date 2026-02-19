// ========================================
// MODÈLE ÉQUIPEMENT (Equipment.js)
// ========================================
// Ce fichier définit la STRUCTURE d'un équipement dans la GMAO
// Un équipement peut être : machine, véhicule, serveur, outil, etc.

// ========================================
// IMPORT
// ========================================

// Import de mongoose pour créer le schéma
const mongoose = require('mongoose');

// ========================================
// DÉFINITION DU SCHÉMA ÉQUIPEMENT
// ========================================

const equipmentSchema = new mongoose.Schema(
  {
    // ========================================
    // CHAMP : NOM DE L'ÉQUIPEMENT
    // ========================================
    nom: {
      type: String,
      required: [true, 'Le nom de l\'équipement est obligatoire'],
      trim: true,
      // Exemple : "Compresseur A", "Serveur Web 01", "Camion Renault"
    },

    // ========================================
    // CHAMP : TYPE/CATÉGORIE
    // ========================================
    type: {
      type: String,
      required: [true, 'Le type d\'équipement est obligatoire'],
      
      // enum : liste des catégories autorisées
      // Vous pouvez ajouter d'autres types selon vos besoins
      enum: [
        'Machine industrielle',    // Ex: compresseurs, tours, fraiseuses
        'Véhicule',                // Ex: camions, voitures de service
        'Équipement IT',           // Ex: serveurs, ordinateurs, imprimantes
        'Équipement médical',      // Ex: scanners, appareils de diagnostic
        'Équipement bureautique',  // Ex: photocopieuses, mobilier
        'Autre'                    // Catégorie générique
      ],
    },

    // ========================================
    // CHAMP : MARQUE
    // ========================================
    marque: {
      type: String,
      trim: true,
      default: null,  // Peut être vide
      // Exemple : "Siemens", "Dell", "Renault", "HP"
    },

    // ========================================
    // CHAMP : MODÈLE
    // ========================================
    modele: {
      type: String,
      trim: true,
      default: null,
      // Exemple : "X3000", "Latitude 5520", "Master Z.E."
    },

    // ========================================
    // CHAMP : NUMÉRO DE SÉRIE
    // ========================================
    numeroSerie: {
      type: String,
      
      // unique : chaque équipement a un numéro de série unique
      unique: true,
      
      // sparse : permet d'avoir plusieurs valeurs null
      // Sans sparse, unique + null créerait une erreur
      sparse: true,
      
      trim: true,
      // Exemple : "SN123456789", "ABC-2024-001"
    },

    // ========================================
    // CHAMP : DESCRIPTION
    // ========================================
    description: {
      type: String,
      trim: true,
      default: '',
      // Description détaillée de l'équipement, ses spécifications, etc.
    },

    // ========================================
    // CHAMP : LOCALISATION
    // ========================================
    localisation: {
      type: String,
      required: [true, 'La localisation est obligatoire'],
      trim: true,
      // Exemple : "Atelier A", "Bureau 202", "Entrepôt Nord", "Parking"
    },

    // ========================================
    // CHAMP : DATE D'ACHAT
    // ========================================
    dateAchat: {
      type: Date,  // Type Date pour stocker des dates
      default: null,
      // Exemple : 2023-05-15
    },

    // ========================================
    // CHAMP : DATE FIN DE GARANTIE
    // ========================================
    dateFinGarantie: {
      type: Date,
      default: null,
      // Permet de savoir si l'équipement est encore sous garantie
    },

    // ========================================
    // CHAMP : PRIX D'ACHAT
    // ========================================
    prixAchat: {
      type: Number,  // Type Number pour les nombres (entiers ou décimaux)
      
      // min : valeur minimale (pas de prix négatif)
      min: 0,
      
      default: null,
      // Exemple : 15000.50 (en euros)
    },

    // ========================================
    // CHAMP : STATUT ACTUEL
    // ========================================
    statut: {
      type: String,
      
      // enum : liste des statuts possibles
      enum: [
        'En service',      // Équipement opérationnel
        'En panne',        // Équipement défectueux
        'En maintenance',  // Intervention en cours
        'Hors service',    // Équipement définitivement arrêté
        'En attente'       // En attente de pièces, validation, etc.
      ],
      
      // Par défaut, un nouvel équipement est en service
      default: 'En service',
    },

    // ========================================
    // CHAMP : PRIORITÉ DE MAINTENANCE
    // ========================================
    priorite: {
      type: String,
      
      // enum : niveau d'importance de l'équipement
      enum: [
        'Faible',    // Équipement peu critique
        'Moyenne',   // Importance standard
        'Haute',     // Équipement important
        'Critique'   // Équipement vital pour la production
      ],
      
      default: 'Moyenne',
    },

    // ========================================
    // CHAMP : PHOTO
    // ========================================
    photo: {
      type: String,
      
      // URL ou nom du fichier image
      default: 'default-equipment.png',
      // Exemple : "compresseur-a.jpg", "https://example.com/image.png"
    },

    // ========================================
    // CHAMP : FRÉQUENCE MAINTENANCE PRÉVENTIVE
    // ========================================
    frequenceMaintenancePreventive: {
      type: Number,  // En jours
      
      // default : tous les 90 jours (3 mois) par défaut
      default: 90,
      
      // min : au minimum 1 jour
      min: 1,
      // Exemple : 30 (tous les mois), 180 (tous les 6 mois), 365 (tous les ans)
    },

    // ========================================
    // CHAMP : DATE DERNIÈRE MAINTENANCE
    // ========================================
    dateDerniereMaintenance: {
      type: Date,
      default: null,
      // Stocke la date de la dernière intervention effectuée
    },

    // ========================================
    // CHAMP : DATE PROCHAINE MAINTENANCE
    // ========================================
    dateProchaineMaintenance: {
      type: Date,
      default: null,
      // Calculée automatiquement : dateDerniereMaintenance + frequenceMaintenancePreventive
    },

    // ========================================
    // CHAMP : CRÉÉ PAR (référence utilisateur)
    // ========================================
    creePar: {
      // ObjectId : type spécial pour les références vers d'autres documents
      type: mongoose.Schema.Types.ObjectId,
      
      // ref : fait référence au modèle 'User'
      // Permet de "peupler" (populate) les infos de l'utilisateur
      ref: 'User',
      
      required: true,
      // Stocke l'ID de l'utilisateur qui a créé cet équipement
    },

    // ========================================
    // CHAMP : NOTES ADDITIONNELLES
    // ========================================
    notes: {
      type: String,
      default: '',
      // Informations complémentaires, remarques, etc.
    },

    // ========================================
    // CHAMP : ACTIF/ARCHIVÉ
    // ========================================
    isActive: {
      type: Boolean,
      default: true,
      // false = équipement archivé (ne s'affiche plus dans les listes principales)
    },
  },
  {
    // ========================================
    // OPTIONS DU SCHÉMA
    // ========================================
    
    // timestamps : ajoute createdAt et updatedAt automatiquement
    timestamps: true,
  }
);

// ========================================
// INDEXES POUR OPTIMISER LES RECHERCHES
// ========================================
// Les index accélèrent les requêtes sur ces champs

// Index sur le nom (recherche par nom plus rapide)
equipmentSchema.index({ nom: 1 });  // 1 = ordre croissant

// Index sur le type (filtrer par catégorie)
equipmentSchema.index({ type: 1 });

// Index sur le statut (voir tous les équipements en panne)
equipmentSchema.index({ statut: 1 });

// Index sur la localisation (voir tous les équipements d'un atelier)
equipmentSchema.index({ localisation: 1 });

// ========================================
// PROPRIÉTÉ VIRTUELLE : SOUS GARANTIE ?
// ========================================
// Une propriété virtuelle = calculée à la volée, pas stockée en base

// .virtual() crée une propriété calculée
equipmentSchema.virtual('sousGarantie').get(function () {
  
  // Si pas de date de fin de garantie définie
  if (!this.dateFinGarantie) return false;
  
  // Compare la date de fin de garantie avec aujourd'hui
  // Retourne true si la garantie n'est pas encore expirée
  return this.dateFinGarantie > new Date();
});

// ========================================
// MÉTHODE : CALCULER PROCHAINE MAINTENANCE
// ========================================
// Calcule et met à jour la date de la prochaine maintenance préventive

equipmentSchema.methods.calculerProchaineMaintenance = function () {
  
  // Si on a une dernière date de maintenance
  if (this.dateDerniereMaintenance) {
    
    // Créer une nouvelle date à partir de la dernière maintenance
    const prochaine = new Date(this.dateDerniereMaintenance);
    
    // Ajouter la fréquence (en jours) à cette date
    // .setDate() modifie le jour du mois
    // .getDate() récupère le jour actuel
    prochaine.setDate(prochaine.getDate() + this.frequenceMaintenancePreventive);
    
    // Mettre à jour la propriété
    this.dateProchaineMaintenance = prochaine;
    
  } else {
    // Si pas de dernière maintenance, calculer depuis aujourd'hui
    const prochaine = new Date();
    prochaine.setDate(prochaine.getDate() + this.frequenceMaintenancePreventive);
    this.dateProchaineMaintenance = prochaine;
  }
  
  // Retourner la date calculée
  return this.dateProchaineMaintenance;
};

// ========================================
// MÉTHODE : MAINTENANCE NÉCESSAIRE ?
// ========================================
// Vérifie si une maintenance préventive est nécessaire (date dépassée)

equipmentSchema.methods.maintenanceNecessaire = function () {
  
  // Si pas de date de prochaine maintenance définie
  if (!this.dateProchaineMaintenance) return false;
  
  // Compare avec la date actuelle
  // Retourne true si la date est dépassée (maintenance en retard)
  return this.dateProchaineMaintenance <= new Date();
};

// ========================================
// MIDDLEWARE PRE-SAVE
// ========================================
// S'exécute avant de sauvegarder l'équipement

equipmentSchema.pre('save', function (next) {
  
  // Si la date de prochaine maintenance n'est pas définie
  if (!this.dateProchaineMaintenance) {
    
    // La calculer automatiquement
    this.calculerProchaineMaintenance();
  }
  
  // Continuer la sauvegarde
  next();
});

// ========================================
// EXPORT DU MODÈLE
// ========================================

// Créer et exporter le modèle Equipment
// MongoDB créera automatiquement une collection 'equipments'
module.exports = mongoose.model('Equipment', equipmentSchema);