import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Le nom de l\'équipe est requis']
  },
  pokemons: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Pokemon',
    validate: {
      validator: function(v) {
        return v.length <= 6;
      },
      message: 'Une équipe ne peut contenir que 6 Pokémon maximum'
    }
  }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
