import express from 'express';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/pokemons - Récupérer tous les Pokémon avec filtres, tri et pagination
router.get('/', async (req, res) => {
  try {
    let filter = {};

    // Filtre par type
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Recherche par nom (insensible à la casse)
    if (req.query.name) {
      filter['name.english'] = { $regex: req.query.name, $options: 'i' };
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 50);
    const skip = (page - 1) * limit;

    // Construire la requête
    let query = Pokemon.find(filter);

    // Tri
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    // Appliquer skip et limit
    query = query.skip(skip).limit(limit);

    // Exécuter la requête
    const pokemons = await query.exec();

    // Récupérer le nombre total pour les métadonnées
    const total = await Pokemon.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: pokemons,
      page,
      limit,
      total,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pokemons/:id - Récupérer un Pokémon par ID
router.get('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const pokemon = await Pokemon.findOne({ id });

    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pokemons - Créer un nouveau Pokémon (authentifié)
router.post('/', auth, async (req, res) => {
  try {
    const pokemon = await Pokemon.create(req.body);
    res.status(201).json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/pokemons/:id - Modifier un Pokémon (authentifié)
router.put('/:id', auth, async (req, res) => {
  try {
    const id = +req.params.id;
    const pokemon = await Pokemon.findOneAndUpdate(
      { id },
      req.body,
      { new: true }
    );

    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    res.json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/pokemons/:id - Supprimer un Pokémon (authentifié)
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = +req.params.id;
    const pokemon = await Pokemon.findOneAndDelete({ id });

    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
