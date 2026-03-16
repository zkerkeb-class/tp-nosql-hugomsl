import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Pokemon from '../models/pokemon.js';

const seedDB = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB !');

    // Supprimer les anciens documents
    await Pokemon.deleteMany({});
    console.log('Collection vidée.');

    // Lire les données depuis pokemons.json
    const filePath = path.resolve('data/pokemons.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const pokemons = JSON.parse(data);

    // Insérer les Pokémon
    const result = await Pokemon.insertMany(pokemons);
    console.log(`${result.length} Pokémon insérés avec succès !`);

    // Fermer la connexion
    await mongoose.disconnect();
    console.log('Connexion fermée.');
  } catch (error) {
    console.error('Erreur lors du seed:', error.message);
    process.exit(1);
  }
};

seedDB();
