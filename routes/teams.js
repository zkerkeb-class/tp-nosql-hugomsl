import express from 'express';
import auth from '../middleware/auth.js';
import Team from '../models/team.js';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

// POST /api/teams - Créer une équipe
router.post('/', auth, async (req, res) => {
  try {
    const { name, pokemons } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Le nom de l\'équipe est requis' });
    }

    if (pokemons && pokemons.length > 6) {
      return res.status(400).json({ error: 'Une équipe ne peut contenir que 6 Pokémon maximum' });
    }

    // Chercher les Pokémon par ID pour récupérer leurs ObjectId MongoDB
    let pokemonIds = [];
    if (pokemons && pokemons.length > 0) {
      const foundPokemons = await Pokemon.find({ id: { $in: pokemons } });
      if (foundPokemons.length !== pokemons.length) {
        return res.status(400).json({ error: 'Un ou plusieurs Pokémon n\'existent pas' });
      }
      pokemonIds = foundPokemons.map(p => p._id);
    }

    const team = await Team.create({
      user: req.user.id,
      name,
      pokemons: pokemonIds
    });

    // Populate pour afficher les données complètes
    const populatedTeam = await team.populate('pokemons');

    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/teams - Lister mes équipes
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find({ user: req.user.id }).populate('pokemons');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/teams/:id - Détail d'une équipe avec données complètes des Pokémon
router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('pokemons');

    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    // Vérifier que c'est mon équipe
    if (team.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Vous ne pouvez accéder qu\'à vos propres équipes' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/teams/:id - Modifier une équipe
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, pokemons } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    // Vérifier que c'est mon équipe
    if (team.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Vous ne pouvez modifier que vos propres équipes' });
    }

    // Mettre à jour le nom si fourni
    if (name) team.name = name;

    // Mettre à jour les Pokémon si fournis
    if (pokemons) {
      if (pokemons.length > 6) {
        return res.status(400).json({ error: 'Une équipe ne peut contenir que 6 Pokémon maximum' });
      }

      const foundPokemons = await Pokemon.find({ id: { $in: pokemons } });
      if (foundPokemons.length !== pokemons.length) {
        return res.status(400).json({ error: 'Un ou plusieurs Pokémon n\'existent pas' });
      }

      team.pokemons = foundPokemons.map(p => p._id);
    }

    await team.save();
    const populatedTeam = await team.populate('pokemons');

    res.json(populatedTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/teams/:id - Supprimer une équipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Équipe non trouvée' });
    }

    // Vérifier que c'est mon équipe
    if (team.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Vous ne pouvez supprimer que vos propres équipes' });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
