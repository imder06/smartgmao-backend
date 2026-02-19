// ========================================
// MODÈLE TICKET (Ticket.js)
// ========================================
// Ce fichier définit la STRUCTURE d'un ticket de maintenance
// Un ticket = demande d'intervention sur un équipement

// ========================================
// IMPORT
// ========================================

const mongoose = require('mongoose');

// ========================================
// DÉFINITION DU SCHÉMA TICKET
// ========================================

const ticketSchema = new mongoose.Schema(
  {
    // ========================================
    // CHAMP : TITRE DU TICKET
    // ========================================
    titre: {
      type: String,
      required: [true, 'Le titre du ticket est obligatoire'],
      trim: true,
      // Exemple : "Réparation compresseur", "Maintenance serveur", "Panne électrique"
    },

    // ========================================
    // CHAMP : DESCRIPTION
    // ========================================
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
      // Description détaillée du problème ou de l'intervention à effectuer
      // Exemple : "Le compresseur fait un bruit anormal et perd de la pression"
    },

    // ========================================
    // CHAMP : ÉQUIPEMENT CONCERNÉ (référence)
    // ========================================
    equipment: {
      // ObjectId : référence vers un document Equipment
      type: mongoose.Schema.Types.ObjectId,
      
      // ref : pointe vers le modèle Equipment
      // Permet de faire un .populate() pour récupérer toutes les infos de l'équipement
      ref: 'Equipment',
      
      required: [true, 'L\'équipement est obligatoire'],
      // Stocke l'ID de l'équipement concerné par ce ticket
    },

    // ========================================
    // CHAMP : TYPE DE MAINTENANCE
    // ========================================
    type: {
      type: String,
      required: [true, 'Le type de maintenance est obligatoire'],
      
      // enum : types de maintenance possibles
      enum: [
        'Préventive',   // Maintenance planifiée à l'avance pour éviter les pannes
        'Curative',     // Réparation d'une panne existante
        'Corrective',   // Correction d'un défaut sans panne
        'Amélioration'  // Modification/amélioration de l'équipement
      ],
      
      // Par défaut : curative (la plus courante)
      default: 'Curative',
    },

    // ========================================
    // CHAMP : PRIORITÉ
    // ========================================
    priorite: {
      type: String,
      
      // enum : niveaux de priorité
      enum: [
        'Faible',    // Peut attendre
        'Moyenne',   // À traiter normalement
        'Haute',     // À traiter rapidement
        'Urgente'    // À traiter immédiatement (arrêt production, danger, etc.)
      ],
      
      default: 'Moyenne',
    },

    // ========================================
    // CHAMP : STATUT DU TICKET
    // ========================================
    statut: {
      type: String,
      
      // enum : cycle de vie d'un ticket
      enum: [
        'En attente',   // Ticket créé, pas encore pris en charge
        'En cours',     // Intervention en cours par un technicien
        'Terminé',      // Intervention terminée et validée
        'Annulé',       // Ticket annulé (erreur, doublon, etc.)
        'En pause'      // Intervention suspendue (attente pièce, validation, etc.)
      ],
      
      // Statut par défaut à la création
      default: 'En attente',
    },

    // ========================================
    // CHAMP : CRÉÉ PAR (référence utilisateur)
    // ========================================
    creePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // ID de l'utilisateur qui a créé le ticket
      // Peut être un opérateur, un responsable, etc.
    },

    // ========================================
    // CHAMP : ASSIGNÉ À (référence technicien)
    // ========================================
    assigneA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,  // Peut ne pas être assigné au début
      // ID du technicien assigné au ticket
    },

    // ========================================
    // CHAMP : DATE DE DÉBUT
    // ========================================
    dateDebut: {
      type: Date,
      default: null,
      // Date à laquelle le technicien commence l'intervention
    },

    // ========================================
    // CHAMP : DATE DE FIN
    // ========================================
    dateFin: {
      type: Date,
      default: null,
      // Date à laquelle l'intervention est terminée
    },

    // ========================================
    // CHAMP : DATE D'ÉCHÉANCE (deadline)
    // ========================================
    dateEcheance: {
      type: Date,
      default: null,
      // Date limite pour résoudre le ticket
      // Utile pour les SLA (Service Level Agreement)
    },

    // ========================================
    // CHAMP : TEMPS ESTIMÉ
    // ========================================
    tempsEstime: {
      type: Number,  // En heures
      min: 0,
      default: null,
      // Estimation du temps nécessaire pour l'intervention
      // Exemple : 2 (2 heures), 0.5 (30 minutes)
    },

    // ========================================
    // CHAMP : TEMPS RÉEL
    // ========================================
    tempsReel: {
      type: Number,  // En heures
      min: 0,
      default: null,
      // Temps réellement passé sur l'intervention
      // Permet de comparer avec l'estimation
    },

    // ========================================
    // CHAMP : COÛT ESTIMÉ
    // ========================================
    coutEstime: {
      type: Number,  // En euros
      min: 0,
      default: null,
      // Coût prévu (pièces + main d'œuvre)
    },

    // ========================================
    // CHAMP : COÛT RÉEL
    // ========================================
    coutReel: {
      type: Number,  // En euros
      min: 0,
      default: null,
      // Coût réel de l'intervention
    },

    // ========================================
    // CHAMP : PIÈCES UTILISÉES (tableau d'objets)
    // ========================================
    piecesUtilisees: [
      {
        // Chaque pièce est un objet avec :
        
        // Nom de la pièce
        nom: String,
        // Exemple : "Filtre à huile", "Roulement", "Disque dur"
        
        // Quantité utilisée
        quantite: Number,
        // Exemple : 2 (deux filtres)
        
        // Coût unitaire
        coutUnitaire: Number,
        // Exemple : 15.50 (15,50€ par pièce)
      }
    ],

    // ========================================
    // CHAMP : COMMENTAIRES (tableau d'objets)
    // ========================================
    commentaires: [
      {
        // Auteur du commentaire (référence utilisateur)
        auteur: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        
        // Contenu du commentaire
        contenu: String,
        // Exemple : "Pièce commandée, arrivée prévue demain"
        
        // Date du commentaire
        date: {
          type: Date,
          default: Date.now,  // Date actuelle par défaut
        },
      }
    ],

    // ========================================
    // CHAMP : SOLUTION APPORTÉE
    // ========================================
    solution: {
      type: String,
      default: '',
      // Description de la solution / résolution du problème
      // Exemple : "Remplacement du roulement défectueux, test OK"
    },

    // ========================================
    // CHAMP : PHOTOS (tableau d'objets)
    // ========================================
    photos: [
      {
        // URL de la photo
        url: String,
        // Exemple : "ticket-123-photo1.jpg"
        
        // Description de la photo
        description: String,
        // Exemple : "Vue de la panne avant réparation"
        
        // Date d'ajout
        dateAjout: {
          type: Date,
          default: Date.now,
        },
      }
    ],

    // ========================================
    // CHAMP : EST PROGRAMMÉ ?
    // ========================================
    estProgramme: {
      type: Boolean,
      default: false,
      // true = maintenance préventive programmée
      // false = intervention suite à une demande/panne
    },

    // ========================================
    // CHAMP : DATE PROGRAMMÉE
    // ========================================
    dateProgrammee: {
      type: Date,
      default: null,
      // Si maintenance préventive, date à laquelle elle était prévue
    },
  },
  {
    // ========================================
    // OPTIONS DU SCHÉMA
    // ========================================
    
    timestamps: true,  // Ajoute createdAt et updatedAt
  }
);

// ========================================
// INDEXES POUR OPTIMISER LES RECHERCHES
// ========================================

// Index sur l'équipement (voir tous les tickets d'un équipement)
ticketSchema.index({ equipment: 1 });

// Index sur le statut (filtrer par statut)
ticketSchema.index({ statut: 1 });

// Index sur la priorité
ticketSchema.index({ priorite: 1 });

// Index sur le technicien assigné
ticketSchema.index({ assigneA: 1 });

// Index sur le créateur
ticketSchema.index({ creePar: 1 });

// ========================================
// PROPRIÉTÉ VIRTUELLE : DURÉE
// ========================================
// Calcule la durée entre création et fin du ticket

ticketSchema.virtual('duree').get(function () {
  
  // Si pas de date de fin, retourner null
  if (!this.dateFin) return null;
  
  // Calculer la différence en millisecondes
  const diff = this.dateFin - this.createdAt;
  
  // Convertir en heures et arrondir
  // 1000 ms = 1 seconde
  // 60 secondes = 1 minute
  // 60 minutes = 1 heure
  return Math.round(diff / (1000 * 60 * 60));
});

// ========================================
// PROPRIÉTÉ VIRTUELLE : EN RETARD ?
// ========================================
// Vérifie si le ticket a dépassé sa date d'échéance

ticketSchema.virtual('enRetard').get(function () {
  
  // Si pas de date d'échéance ou déjà terminé, pas en retard
  if (!this.dateEcheance || this.statut === 'Terminé') return false;
  
  // Compare avec la date actuelle
  return new Date() > this.dateEcheance;
});

// ========================================
// MÉTHODE : AJOUTER UN COMMENTAIRE
// ========================================

ticketSchema.methods.ajouterCommentaire = function (auteurId, contenu) {
  
  // Ajouter un nouveau commentaire au tableau
  this.commentaires.push({
    auteur: auteurId,
    contenu: contenu,
    date: new Date(),
  });
  
  // Sauvegarder et retourner le ticket mis à jour
  return this.save();
};

// ========================================
// MÉTHODE : DÉMARRER L'INTERVENTION
// ========================================

ticketSchema.methods.demarrerIntervention = function () {
  
  // Changer le statut
  this.statut = 'En cours';
  
  // Enregistrer la date de début
  this.dateDebut = new Date();
  
  // Sauvegarder
  return this.save();
};

// ========================================
// MÉTHODE : TERMINER L'INTERVENTION
// ========================================

ticketSchema.methods.terminerIntervention = function (solution, tempsReel, coutReel) {
  
  // Changer le statut
  this.statut = 'Terminé';
  
  // Enregistrer la date de fin
  this.dateFin = new Date();
  
  // Ajouter la solution si fournie
  if (solution) this.solution = solution;
  
  // Ajouter le temps réel si fourni
  if (tempsReel) this.tempsReel = tempsReel;
  
  // Ajouter le coût réel si fourni
  if (coutReel) this.coutReel = coutReel;
  
  // Sauvegarder
  return this.save();
};

// ========================================
// MÉTHODE STATIQUE : STATISTIQUES
// ========================================
// Obtenir les statistiques des tickets (pour le dashboard)

// .statics : méthode appelée sur le modèle (pas sur un document)
// Exemple : Ticket.getStatistiques()
ticketSchema.statics.getStatistiques = async function () {
  
  // aggregate() : pipeline d'agrégation MongoDB
  // Permet de faire des calculs complexes
  const stats = await this.aggregate([
    {
      // $group : grouper les documents
      $group: {
        _id: '$statut',      // Grouper par statut
        count: { $sum: 1 },  // Compter le nombre de tickets
      },
    },
  ]);

  // Retourne un tableau avec le nombre de tickets par statut
  // Exemple : [{_id: 'En cours', count: 5}, {_id: 'Terminé', count: 12}]
  return stats;
};

// ========================================
// MIDDLEWARE PRE-SAVE
// ========================================
// S'exécute avant de sauvegarder le ticket

ticketSchema.pre('save', function (next) {
  
  // Si le statut devient "Terminé" et qu'il n'y a pas de date de fin
  if (this.statut === 'Terminé' && !this.dateFin) {
    this.dateFin = new Date();
  }
  
  // Si le statut devient "En cours" et qu'il n'y a pas de date de début
  if (this.statut === 'En cours' && !this.dateDebut) {
    this.dateDebut = new Date();
  }
  
  // Continuer
  next();
});

// ========================================
// EXPORT DU MODÈLE
// ========================================

// Créer et exporter le modèle Ticket
// MongoDB créera automatiquement une collection 'tickets'
module.exports = mongoose.model('Ticket', ticketSchema);