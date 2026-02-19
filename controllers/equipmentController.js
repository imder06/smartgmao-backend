// ========================================
// CONTROLLER ÉQUIPEMENTS
// ========================================
// Contient la logique métier pour les équipements

// Import du modèle (commenté pour l'instant car on n'a pas MongoDB)
// const Equipment = require('../models/Equipment');

// ========================================
// DONNÉES DE TEST TEMPORAIRES
// ========================================
let EQUIPMENTS_DATA = [
  {
    _id: '1',
    nom: 'Compresseur A',
    type: 'Machine industrielle',
    marque: 'Atlas Copco',
    modele: 'GA75',
    numeroSerie: 'AC-2023-001',
    description: 'Compresseur principal atelier A',
    localisation: 'Atelier A',
    dateAchat: new Date('2022-03-15'),
    statut: 'En service',
    priorite: 'Haute',
    creePar: '123456789',
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2023-01-10'),
  },
  {
    _id: '2',
    nom: 'Serveur Web 01',
    type: 'Équipement IT',
    marque: 'Dell',
    modele: 'PowerEdge R740',
    numeroSerie: 'DELL-2023-WEB01',
    description: 'Serveur web principal',
    localisation: 'Salle serveur',
    dateAchat: new Date('2023-01-10'),
    statut: 'En service',
    priorite: 'Critique',
    creePar: '123456789',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },
  {
    _id: '3',
    nom: 'Robot KUKA R20',
    type: 'Machine industrielle',
    marque: 'KUKA',
    modele: 'KR 20 R1810',
    numeroSerie: 'KUKA-2021-R20',
    description: 'Robot de soudure chaîne 2',
    localisation: 'Chaîne production 2',
    dateAchat: new Date('2021-06-20'),
    statut: 'En maintenance',
    priorite: 'Moyenne',
    creePar: '123456789',
    createdAt: new Date('2021-06-20'),
    updatedAt: new Date('2023-10-01'),
  },
  {
    _id: '4',
    nom: 'Camion Renault Master',
    type: 'Véhicule',
    marque: 'Renault',
    modele: 'Master Z.E.',
    numeroSerie: 'REN-2022-MAS01',
    description: 'Camion de livraison électrique',
    localisation: 'Parking',
    dateAchat: new Date('2022-09-01'),
    statut: 'En panne',
    priorite: 'Moyenne',
    creePar: '123456789',
    createdAt: new Date('2022-09-01'),
    updatedAt: new Date('2023-10-05'),
  },
];

// ========================================
// ROUTE : GET /api/equipments
// ========================================
// Récupérer tous les équipements
exports.getAllEquipments = async (req, res) => {
  try {
    // Version temporaire : retourner les données en dur
    res.status(200).json({
      success: true,
      count: EQUIPMENTS_DATA.length,
      data: EQUIPMENTS_DATA
    });

  } catch (error) {
    console.error('Erreur getAllEquipments:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des équipements',
      error: error.message
    });
  }
};

// ========================================
// ROUTE : GET /api/equipments/:id
// ========================================
// Récupérer un équipement par ID
exports.getEquipmentById = async (req, res) => {
  try {
    // Récupérer l'ID depuis les paramètres de l'URL
    const { id } = req.params;

    // Chercher l'équipement dans les données
    const equipment = EQUIPMENTS_DATA.find(eq => eq._id === id);

    // Si pas trouvé
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Équipement non trouvé'
      });
    }

    // Retourner l'équipement
    res.status(200).json({
      success: true,
      data: equipment
    });

  } catch (error) {
    console.error('Erreur getEquipmentById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'équipement',
      error: error.message
    });
  }
};

// ========================================
// ROUTE : POST /api/equipments
// ========================================
// Créer un nouvel équipement
exports.createEquipment = async (req, res) => {
  try {
    // Récupérer les données du body
    const equipmentData = req.body;

    // Créer un nouvel équipement avec un ID généré
    const newEquipment = {
      _id: String(EQUIPMENTS_DATA.length + 1),
      ...equipmentData,
      creePar: req.user.id, // ID de l'utilisateur connecté (depuis middleware auth)
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajouter aux données
    EQUIPMENTS_DATA.push(newEquipment);

    // Retourner le nouvel équipement
    res.status(201).json({
      success: true,
      message: 'Équipement créé avec succès',
      data: newEquipment
    });

  } catch (error) {
    console.error('Erreur createEquipment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'équipement',
      error: error.message
    });
  }
};

// ========================================
// ROUTE : PUT /api/equipments/:id
// ========================================
// Modifier un équipement
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Trouver l'index de l'équipement
    const index = EQUIPMENTS_DATA.findIndex(eq => eq._id === id);

    // Si pas trouvé
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Équipement non trouvé'
      });
    }

    // Mettre à jour l'équipement
    EQUIPMENTS_DATA[index] = {
      ...EQUIPMENTS_DATA[index],
      ...updateData,
      updatedAt: new Date(),
    };

    // Retourner l'équipement mis à jour
    res.status(200).json({
      success: true,
      message: 'Équipement mis à jour avec succès',
      data: EQUIPMENTS_DATA[index]
    });

  } catch (error) {
    console.error('Erreur updateEquipment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'équipement',
      error: error.message
    });
  }
};

// ========================================
// ROUTE : DELETE /api/equipments/:id
// ========================================
// Supprimer un équipement
exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    // Trouver l'index de l'équipement
    const index = EQUIPMENTS_DATA.findIndex(eq => eq._id === id);

    // Si pas trouvé
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Équipement non trouvé'
      });
    }

    // Supprimer l'équipement
    EQUIPMENTS_DATA.splice(index, 1);

    // Retourner la confirmation
    res.status(200).json({
      success: true,
      message: 'Équipement supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteEquipment:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'équipement',
      error: error.message
    });
  }
};