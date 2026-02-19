const mongoose = require('mongoose'); // librairie pour MongoDB

const connectDB = async () => { // fonction asynchrone de connexion à la base
  try { // début du bloc de tentative de connexion

    const conn = await mongoose.connect(process.env.MONGO_URI); // connexion à MongoDB avec l’URI du .env

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`); // affiche le serveur MongoDB
    console.log(`📊 Base de données : ${conn.connection.name}`); // affiche le nom de la base

  } catch (error) { // capture une erreur de connexion
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`); // affiche l’erreur de connexion

    process.exit(1); // stoppe l’application si la base ne répond pas

  } // fin du try / catch

}; // fin de la fonction connectDB

module.exports = connectDB; // exporte la fonction pour server.js
