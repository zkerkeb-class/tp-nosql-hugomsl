import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/user.js';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

// POST /api/favorites/:pokemonId - Ajouter un Pokémon en favori
router.post('/:pokemonId', auth, async (req, res) => {
  try {
    const pokemonId = +req.params.pokemonId;

    // Vérifier que le Pokémon existe
    const pokemon = await Pokemon.findOne({ id: pokemonId });
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    // Ajouter à la liste de favoris (sans doublon grâce à $addToSet)
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: pokemonId } },
      { new: true }
    );

    res.json({ message: 'Pokémon ajouté aux favoris', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/favorites/:pokemonId - Retirer un Pokémon des favoris
router.delete('/:pokemonId', auth, async (req, res) => {
  try {
    const pokemonId = +req.params.pokemonId;

    // Retirer de la liste de favoris
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: pokemonId } },
      { new: true }
    );

    res.json({ message: 'Pokémon retiré des favoris', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/favorites - Récupérer mes Pokémon favoris
router.get('/', auth, async (req, res) => {
  try {
    // Récupérer l'utilisateur et ses favoris
    const user = await User.findById(req.user.id);

    // Récupérer les Pokémon correspondants
    const favorites = await Pokemon.find({ id: { $in: user.favorites } });

    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
