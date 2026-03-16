import mongoose from 'mongoose';

const VALID_TYPES = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: [1, 'L\'ID doit être un entier positif']
  },
  name: {
    english: {
      type: String,
      required: [true, 'Le nom anglais est requis']
    },
    french: {
      type: String,
      required: [true, 'Le nom français est requis']
    },
    japanese: String,
    chinese: String
  },
  type: {
    type: [String],
    required: [true, 'Le type est requis'],
    validate: {
      validator: function(v) {
        return v.every(type => VALID_TYPES.includes(type));
      },
      message: `Les types autorisés sont : ${VALID_TYPES.join(', ')}`
    }
  },
  base: {
    HP: {
      type: Number,
      required: [true, 'Les HP sont requis'],
      min: [1, 'Les HP doivent être entre 1 et 255'],
      max: [255, 'Les HP doivent être entre 1 et 255']
    },
    Attack: {
      type: Number,
      required: [true, 'L\'attaque est requise'],
      min: [1, 'L\'attaque doit être entre 1 et 255'],
      max: [255, 'L\'attaque doit être entre 1 et 255']
    },
    Defense: {
      type: Number,
      required: [true, 'La défense est requise'],
      min: [1, 'La défense doit être entre 1 et 255'],
      max: [255, 'La défense doit être entre 1 et 255']
    },
    SpecialAttack: {
      type: Number,
      min: [1, 'L\'attaque spéciale doit être entre 1 et 255'],
      max: [255, 'L\'attaque spéciale doit être entre 1 et 255']
    },
    SpecialDefense: {
      type: Number,
      min: [1, 'La défense spéciale doit être entre 1 et 255'],
      max: [255, 'La défense spéciale doit être entre 1 et 255']
    },
    Speed: {
      type: Number,
      min: [1, 'La vitesse doit être entre 1 et 255'],
      max: [255, 'La vitesse doit être entre 1 et 255']
    }
  }
}, { timestamps: true });

export default mongoose.model('Pokemon', pokemonSchema);
