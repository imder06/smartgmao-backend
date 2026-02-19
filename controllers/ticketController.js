// ========================================
// CONTROLLER TICKETS (VERSION TEMPORAIRE)
// ========================================

let TICKETS_DATA = [
  {
    _id: 'TK-1024',
    titre: 'Surchauffe moteur principal',
    description: 'Vibrations détectées en zone B',
    equipmentData: { nom: 'Convoyeur A1' },
    type: 'Curative',
    priorite: 'Urgente',
    statut: 'En cours',
    assigneAData: { nom: 'Dupont', prenom: 'Jean' },
    dateEcheance: new Date('2023-10-12'),
    createdAt: new Date('2023-10-10'),
  },
  {
    _id: 'TK-1025',
    titre: 'Fuite d\'huile hydraulique',
    description: 'Joint d\'étanchéité défectueux',
    equipmentData: { nom: 'Presse Hydr. 3' },
    type: 'Curative',
    priorite: 'Haute',
    statut: 'En attente',
    assigneAData: { nom: 'Curie', prenom: 'Marie' },
    dateEcheance: new Date('2023-10-13'),
    createdAt: new Date('2023-10-11'),
  },
  {
    _id: 'TK-1026',
    titre: 'Calibration capteur optique',
    description: 'Maintenance préventive trimestrielle',
    equipmentData: { nom: 'Robot KUKA R20' },
    type: 'Préventive',
    priorite: 'Moyenne',
    statut: 'Terminé',
    assigneAData: { nom: 'Bloch', prenom: 'Marc' },
    dateEcheance: new Date('2023-10-10'),
    createdAt: new Date('2023-10-08'),
  },
  {
    _id: 'TK-1027',
    titre: 'Bruit anormal ventilateur',
    description: 'Zone de refroidissement Nord',
    equipmentData: { nom: 'Ventilateur Nord 02' },
    type: 'Curative',
    priorite: 'Faible',
    statut: 'En cours',
    assigneAData: { nom: 'Martin', prenom: 'Alice' },
    dateEcheance: new Date('2023-10-15'),
    createdAt: new Date('2023-10-12'),
  },
];

exports.getAllTickets = async (req, res) => {
  try {
    let filtered = [...TICKETS_DATA];
    if (req.query.statut) filtered = filtered.filter(t => t.statut === req.query.statut);
    if (req.query.priorite) filtered = filtered.filter(t => t.priorite === req.query.priorite);
    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = TICKETS_DATA.find(t => t._id === req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const newTicket = {
      _id: `TK-${1024 + TICKETS_DATA.length + 1}`,
      ...req.body,
      creePar: req.user.id,
      statut: req.body.statut || 'En attente',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    TICKETS_DATA.push(newTicket);
    res.status(201).json({ success: true, message: 'Ticket créé avec succès', data: newTicket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const index = TICKETS_DATA.findIndex(t => t._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    TICKETS_DATA[index] = { ...TICKETS_DATA[index], ...req.body, updatedAt: new Date() };
    res.status(200).json({ success: true, message: 'Ticket mis à jour', data: TICKETS_DATA[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const index = TICKETS_DATA.findIndex(t => t._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    TICKETS_DATA.splice(index, 1);
    res.status(200).json({ success: true, message: 'Ticket supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicketStats = async (req, res) => {
  try {
    const stats = {
      total: TICKETS_DATA.length,
      enAttente: TICKETS_DATA.filter(t => t.statut === 'En attente').length,
      enCours: TICKETS_DATA.filter(t => t.statut === 'En cours').length,
      termine: TICKETS_DATA.filter(t => t.statut === 'Terminé').length,
      annule: TICKETS_DATA.filter(t => t.statut === 'Annulé').length,
      urgente: TICKETS_DATA.filter(t => t.priorite === 'Urgente').length,
      haute: TICKETS_DATA.filter(t => t.priorite === 'Haute').length,
      moyenne: TICKETS_DATA.filter(t => t.priorite === 'Moyenne').length,
      faible: TICKETS_DATA.filter(t => t.priorite === 'Faible').length,
    };
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};